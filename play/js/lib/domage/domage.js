/**
 * Old-school JS. No dependencies.
 * Just a JS file with an IIFE to include via <script> tag.
 */

(function(window){

  // Object to hold methods to expose via `window.d$`
  const d$ = {};

  // DO NOT DEFINE
  let undef;

  // constants
  const ___HTML___ = '___HTML___';
  const propPrefix = /^_+/;
  const attrPrefix = /^\$+/;
  const evtPrefix = /^on/i;
  const htmlTest = new RegExp(`\s*${___HTML___}`);

  // 'export' some constants
  d$.constants = {
    ___HTML___,
    propPrefix,
    attrPrefix,
    evtPrefix,
    htmlTest
  };

  // DO NOT allow these as 'props'
  const bannedProps = ['get', 'append'];

  /**
   * Create a DOM element...
   * const elem = new Elem('div', { attr: { id: 'foo' }, $name: 'bar' }, 'Foo div.');
   * // --> <div id="foo">Foo div.</div>
   */
  class Elem {

    /**
     * Parameter types:
     * @typedef Tag = Object|Array<string,Object,Array<Tag>>|string|Element|Elem
     * @typedef Props = Object|null|''
     * @typedef Children = Array<Tag>|string|Element|Elem|null
     *
     * @param {Tag} tag - Required tag string or function params as an Object or Array
     * @param {Props} [props] - Optional props config object
     * @param {Children} [children] - Optional child elements, strings, or Arrays
     */
    constructor(tag, props, children){

      this.tag = tag;
      this.props = props;
      this.children = children;

      try {
        this.#setupFromObject(props, children) ||
        this.#setupFromArray(props, children) ||
        this.#setupFromArgs(props, children);
      }
      catch (e) {
        console.error('Could not setup.', this, e);
      }

      // delete 'children' from 'props'
      if (this.props && this.props.children) {
        delete this.props.children;
      }

      try {
        this.#elementFromTag(this.tag) ||
        this.#elementFromElement(this.tag) ||
        this.#elementFromInstance(this.tag);
      }
      catch (e) {
        this.#createFragment();
        console.warn(`Could not create element. A fragment will be used instead`, this.tag, e);
      }

      // get the tagName from the created element
      this.tag = this.getTagName().toLowerCase();

      // alias 'tag' to 'type' to match pattern for React's element object
      this.type = this.tag;

      for (const [prop, value] of Object.entries(this.props)) {
        try {
          // call these in the order to be attempted
          // first to return true wins!
          this.#ignoreProp(prop) ||
          this.#skipBannedProps(prop) ||
          this.#setHtmlProp(prop, value) ||
          this.#setPropertyProp(prop, value) ||
          this.#setAttributeProp(prop, value) ||
          this.#callMethodProp(prop, value) ||
          this.#setElementProperty(prop, value) ||
          this.#noMethod(prop);
        }
        catch (e) {
          console.error(`Could not process ${prop}...`, value, e);
        }
      }

      this.append(this.children);

    }

    #setupFromObject(props, children){
      if (isPlainObject(this.tag) && !props && !children) {
        const {
          type,
          tag = type,
          // WHAT IS THIS MADNESS???
          // This allows use of different property names,
          // in order of preference:
          // 'props' | 'opts' | 'cfg'
          // (...maybe just use 'props')
          cfg = {},
          opts = cfg,
          props = opts,
          // Allow property names, in order of preference:
          // 'children' | 'contents' | 'content'
          // (...maybe just use 'children')
          content = null,
          contents = content,
          children = contents
        } = this.tag;

        this.tag = tag;
        this.props = getObject(props);
        this.children = children;
        return true;
      }
    }

    #setupFromArray(props, children){
      if (isArray(this.tag) && !props && !children) {
        [this.tag, this.props = {}, this.children = null] = this.tag;
        return true;
      }
    }

    #setupFromArgs(props, children){
      this.props = props || {};
      this.children = children || this.props.children || null;
      return true;
    }

    static isInstance(it){
      return isElemInstance(it) && isElement(it.element);
    }

    // create the element from the 'tag' string
    #elementFromTag(tag){
      if (isString(tag) && !!tag) {
        // this.tag = tag;
        this.element = document.createElement(tag);
        return true;
      }
    }

    #elementFromElement(elem){
      if (isElement(elem)) {
        // to clone or not to clone???
        this.element = elem.cloneNode();
        return true;
      }
    }

    #elementFromInstance(elem){
      if (Elem.isInstance(elem)) {
        this.element = elem.element.cloneNode();
        return true;
      }
    }

    #createFragment(){
      this.element = document.createDocumentFragment();
      this.isFragment = true;
      return true;
    }

    getTagName(){
      return this.element && this.element.tagName ?
        (this.element.tagName || '') :
        this.tag || '';
    }

    // prepend `~` to a property name that should be thrown away
    static #ignoreProp(prop){
      return prop.startsWith('~');
    }

    static #skipBannedProps(prop){
      if (bannedProps.includes(prop)) {
        console.warn(`Cannot use ${prop} as a config property.`);
        return true;
      }
    }

    // try to set these properties - return true if test is true
    #setHtmlProp(prop, value){
      if (prop === ___HTML___) {
        this.element.innerHTML = value;
        return true;
      }
    }

    #setPropertyProp(prop, value){
      if (propPrefix.test(prop)) {
        this.element[prop.replace(propPrefix, '')] = value;
        return true;
      }
    }

    #setAttributeProp(attr, value){
      if (attrPrefix.test(attr)) {
        this.element.setAttribute(attr.replace(attrPrefix, ''), value);
        return true;
      }
    }

    #callMethodProp(method, value){
      if (isFunction(this.propMethods[method])) {
        this.propMethods[method](value);
      }
      else {
        console.warn(`Method ${method} is not a function.`);
      }
      return true;
    }

    #setElementProperty(prop, value){
      if (prop in this.element) {
        this.element[prop] = value;
        return true;
      }
    }

    static #noMethod(prop){
      console.warn(`Method ${prop} does not exist.`);
      return true;
    }

    // Element attributes
    static attr(elem, attrs = {}){
      for (const [a, v] of Object.entries(attrs)) {
        try {
          elem.setAttribute(a, v);
        }
        catch (e) {
          console.error('Could not set attribute:', a, v, e);
        }
      }
      return elem;
    }
    // ...
    attr(attrs = {}){
      Elem.attr(this.element, attrs);
      return this;
    }

    // Element properties
    static prop(elem, props = {}){
      for (const [p, v] of Object.entries(props)) {

        // DO NOT USE innerHTML!!!
        if (p === 'innerHTML') continue;

        try {
          elem[p] = v;
        }
        catch (e) {
          console.error('Could not set property:', p, v, e);
        }
      }
      return elem;
    }
    // ...
    prop(props = {}){
      Elem.prop(this.element, props);
      return this;
    }

    // Element styles
    static style(elem, styles = {}){
      for (const [p, v] of Object.entries(styles)) {
        try {
          elem.style[p] = v;
        }
        catch (e) {
          console.error('Could not set style:', p, v, e);
        }
      }
      return elem;
    }

    // ...
    style(styles = {}){
      Elem.style(this.element, styles);
      return this;
    }
    // alias 'css' to 'style'
    css = this.style;

    // Use a string to set the full className
    className(cls){
      this.element.className = cls;
      return this;
    }

    // Return array of className strings
    static #classNameArray(classes){
      return [].concat(classes).join(' ').split(/\s+/);
    }

    // Pass a single or space-separated list of className strings to add
    addClass(cls){
      for (const className of this.#classNameArray(cls)) {
        this.element.classList.add(className);
      }
      return this;
    }
    classes = this.addClass;
    // Use an array or space-separated list of className strings to *add*

    removeClass(classNames){
      for (const className of this.#classNameArray(classNames)) {
        this.element.classList.remove(className);
      }
      return this;
    }

    static on(elem, events){
      for (let event of [].concat(events)) {
        for (let [type, fn] of Object.entries(event)) {
          type = type.toLowerCase();
          if (`on${type}` in elem) {
            elem.addEventListener(type, fn);
          }
        }
      }
      return elem;
    }
    // ...
    on(events = {}){
      Elem.on(this.element, events);
      return this;
    }

    propMethodList = [
      'attr',
      'prop',
      'style',
      'css',
      'className',
      'addClass',
      'classes',
      'removeClass',
      'on',
      ___HTML___
    ];

    // Limit the available 'prop' methods
    propMethods = {
      attr: this.attr,
      prop: this.prop,
      style: this.style,
      css: this.style,
      className: this.className,
      addClass: this.addClass,
      classes: this.classes,
      removeClass: this.removeClass,
      on: this.on,
      [___HTML___]: this[___HTML___]
    };

    // propMethodsX = this.propMethodList.reduce((obj, name) => {
    //   obj[name] = this[name];
    //   return obj;
    // }, {});

    #appendArray(child){
      // ===================================================
      // PASS AN ARRAY TO RECURSIVELY CREATE/APPEND CHILDREN
      // ===================================================
      if (isArray(child)) {
        // const [tag, props, chldren] = child;
        this.element.appendChild((new Elem(...child)).get());
        return true;
      }
    }

    #appendObject(child){
      if (isPlainObject(child)) {
        this.element.appendChild((new Elem(child)).get());
        return true;
      }
    }

    #appendInstance(child){
      if (isElemInstance(child)) {
        this.element.appendChild(child.element);
        return true;
      }
    }

    #appendHTML(html){
      if (isString(html)) {
        if (htmlTest.test(html)) {
          this.element.insertAdjacentHTML('beforeend', html.replace(htmlTest, ''));
          return true;
        }
      }
    }

    #appendText(txt){
      if (isString(txt)) {
        this.element.insertAdjacentText('beforeend', txt);
        return true;
      }
    }

    // using ___HTML___ string constant for prop name
    [___HTML___](html){
      this.element.empty();
      this.element.insertAdjacentHTML('beforeend', html);
      return this;
    }

    // #appendString(child){
    //   if (isString(child)) {
    //     const _child = child.trim();
    //     // DANGEROUSLY SET innerHTML if string starts with '___HTML___'
    //     if (_child.startsWith(___HTML___)) {
    //       this.element.innerHTML += _child.replace(___HTML___, '');
    //     }
    //     else {
    //       this.element.textContent += _child;
    //     }
    //     return true;
    //   }
    // }

    #appendChildElement(child){
      if (isElement(child) || isFragment(child)) {
        this.element.appendChild(child);
        return true;
      }
    }

    append(children){
      if (!children) return this;
      for (const child of [].concat(children)) {
        // console.log('child', child);
        try {

          this.#appendArray(child) ||
          this.#appendObject(child) ||
          this.#appendInstance(child) ||
          this.#appendHTML(child) ||
          this.#appendText(child) ||
          // this.#appendString(child) ||
          this.#appendChildElement(child) ||
          this.element.append(child);

          // if (isArray(child)) {
          //   // const [tag, props, chldren] = _child;
          //   this.element.appendChild((new Elem(...child)).get());
          // }
          // else if (isPlainObject(child)) {
          //   this.element.appendChild((new Elem(child)).get());
          // }
          // else if (isElemInstance(child)) {
          //   this.element.appendChild(child.element);
          // }
          // else if (isString(child)) {
          //   const _child = child.trim();
          //   // DANGEROUSLY SET innerHTML if string starts with '___HTML___'
          //   if (_child.startsWith(___HTML___)) {
          //     this.element.innerHTML += _child.replace(___HTML___, '');
          //   }
          //   else {
          //     this.element.textContent += _child;
          //   }
          // }
          // else {
          //   this.element.append(child);
          // }
        }
        catch (e) {
          console.error('Could not append:', child, e);
        }
      }
      return this;
    }


    // Append to specified element
    appendTo(parent, callback){
      this.parent = getElement(parent);
      this.parent.appendChild(this.element);
      return (
        isFunction(callback) ?
          callback(this.element, this) :
          this
      );
    }

    // Render into specified element and REPLACE all children
    render(parent, callback){
      this.parent = getElement(parent);
      this.parent.innerHTML = '';
      this.appendTo(this.parent, callback);
    }

    // Return the created element
    get(){
      return this.element;
    }

  }
  // Should this be exposed on the window.d$ object?
  d$.Elem = Elem;


  // Create an ELEMENT!!!
  function createElement(tag, props, children){
    return new Elem(tag, props, children);
  }
  d$.createElement = createElement;
  d$.element = createElement;


  // Render element into parent and run optional callback
  function renderElement(parent, element, callback){
    const container = getElement(parent);
    container.innerHTML = '';
    let elem = '';
    if (isElement(element) || isFragment(element)) {
      elem = element;
    }
    else if (isElemInstance(element)) {
      elem = element.get();
    }
    else if (isArray(element) || isPlainObject(element)) {
      elem = createElement(element).get();
    }
    container.appendChild(elem);
    return (
      isFunction(callback) ?
        callback(elem, container) :
        elem
    );
  }
  d$.renderElement = renderElement;


  function createFragment(children){
    const frag = document.createDocumentFragment();
    for (let child of [].concat(children)) {
      frag.appendChild(createElement(child).get());
    }
    return frag;
  }
  d$.createFragment = createFragment;
  d$.fragment = createFragment;


  function resolveContext(context){
    if (context === document || isElement(context)) {
      return context;
    }
    if (isString(context)) {
      return document.querySelector(context);
    }
    return document;
  }


  // Return a single element using CSS selector
  function getElement(selector, context = document){
    if (isElement(selector)) {
      return selector;
    }
    return resolveContext(context).querySelector(selector);
  }
  d$.getElement = getElement;

  // Return an array of elements using CSS selector
  function getElements(selector, context = document){
    return [...resolveContext(context).querySelectorAll(selector)];
  }
  d$.getElements = getElements;

  // Return a single element by id
  function getById(id){
    return document.getElementById(id);
  }
  d$.getById = getById;

  // Return an array of elements by className
  function getByClass(className, context = document){
    return [...resolveContext(context).getElementsByClassName(className)];
  }
  d$.getByClass = getByClass;

  // Return an array of elements by name attribute
  function getByName(name, context = document){
    return [...resolveContext(context).getElementsByName(name)];
  }
  d$.getByName = getByName;

  // Return an array of elements by tagName
  function getByTag(tag, context = document){
    return [...resolveContext(context).getElementsByTagName(tag)];
  }
  d$.getByTag = getByTag;


  // Helper utilities
  // ----------------

  // // Why do we need these...
  // function isDefined(it){
  //   return it !== undef;
  // }
  //
  // // ...To be 'declarative'?
  // function isUndefined(it){
  //   return it === undef;
  // }
  //
  // // Return the first defined argument, or undefined
  // function firstDefined(...args){
  //   for (const arg of args) {
  //     if (isDefined(arg)) {
  //       return arg;
  //     }
  //   }
  //   return undef;
  // }

  const isArray = Array.isArray;

  function isPlainObject(it){
    return Object.prototype.toString.call(it) === '[object Object]';
  }

  function isFunction(it){
    return typeof it === 'function';
  }

  function getObject(it){
    return isPlainObject(it) || isFunction(it) ? it : {};
  }

  function isString(it){
    return typeof it === 'string';
  }

  function isElement(it){
    return it instanceof Element;
  }

  function isFragment(it){
    return it instanceof DocumentFragment;
  }

  function isElemInstance(it){
    return it instanceof Elem && isElement(it.element);
  }


  // expose globally
  window.d$ = d$;
  window.domage = d$;


})(this);
