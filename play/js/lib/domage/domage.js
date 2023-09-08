/**
 * Old-school JS. No dependencies.
 * Just a JS file with an IIFE to include via <script> tag.
 */

(function(window){

  // DO NOT DEFINE
  let undef;

  const isArray = Array.isArray;

  // constants
  const ___HTML___ = '___HTML___';
  const propPrefix = /^_+/;
  const attrPrefix = /^\$+/;
  const evtPrefix = /^on/i;
  const htmlPrefix = new RegExp(`^\s*${___HTML___}`);

  // Constants to be 'exported'
  const constants = {
    ___HTML: ___HTML___,
    ___HTML___,
    propPrefix,
    attrPrefix,
    evtPrefix,
    htmlPrefix
  };

  const propMethods = [
    'attr',
    'prop',
    'style',
    'css',
    'data',
    'className',
    'addClass',
    'classes',
    'removeClass',
    'on',
    ___HTML___
  ];

  // DO NOT allow these as 'props'
  const bannedProps = ['get', 'append', 'render'];

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
      // Calling `new Elem()` with no arguments
      // just sets up an instance to init later.
      if (tag == null && !props && !children) {
        return this;
      }

      this.init(tag, props, children);

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
        this.createFragment();
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

      return this;
    }

    init(tag, props, children) {
      this.tag = tag;
      this.props = props;
      this.children = children || props;

      try {
        this.#setupFromObject() ||
        this.#setupFromArray() ||
        this.#setupFromArgs() ||
        this.#setupEmpty();
      }
      catch (e) {
        console.error('Could not initialize.', this, e);
      }
    }

    #hasEmptyProps() {
      return this.props == null || !Object.keys(this.props).length;
    }

    #setupFromObject() {
      if (isPlainObject(this.tag) && this.#hasEmptyProps() && !this.children) {
        const {
          type,
          tag = type,
          // Use `attr` to explicitly call .setAttribute()
          attr = {},
          // Use `prop` to expicitly set a propety value
          prop = {},
          // Use `style` to set style
          style = {},
          // Use `data` to add [data-*] attributes
          data = {},
          // Use `on` to add event listeners
          on = [],
          // WHAT IS THIS MADNESS???
          // This allows use of different property names,
          // in order of preference (bottom to top):
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
          children = contents,
          // Catch leftover properties
          ...other
        } = this.tag;

        this.tag = tag;

        this.props = props ? getObject(props) : {};
        this.props.attr = {...this.props.attr, ...attr};
        this.props.prop = {...this.props.prop, ...prop};
        this.props.style = {...this.props.style, ...style};
        this.props.data = {...this.props.data, ...data};
        this.props.on = [].concat(this.props.on || [], on);

        // Special handling of $attr and _prop properties
        for (const [name, value] of Object.entries(other)) {
          if (name.startsWith('$')) {
            this.props.attr[name.slice(1)] = value;
            continue;
          }
          if (name.startsWith('_')) {
            this.props.prop[name.slice(1)] = value;
          }
        }

        this.children = children || this.props.children || [];

        return true;
      }
    }

    #resolveChildren() {
      this.props = this.props || {};
      this.children = this.children || this.props.children || this.props || null;

      if (isArray(this.props) && this.props === this.children) {
        this.children = this.props;
        this.props = {};
      }

      if (this.props.children != null) {
        delete this.props.children;
      }

      return this;
    }

    #setupFromArray() {
      if (isArray(this.tag) && !this.props && !this.children) {
        [this.tag, this.props, this.children] = this.tag;
        this.#resolveChildren();
        return true;
      }
    }

    #setupFromArgs() {
      this.#resolveChildren();
      return true;
    }

    #setupEmpty() {
      this.tag = '';
      this.props = {};
      this.children = null;
    }

    static isInstance(it){
      return isElemInstance(it);
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

    static createFragment() {
      return document.createDocumentFragment();
    }

    createFragment(){
      this.fragment = Elem.createFragment();
      this.element = this.fragment;
      this.isFragment = true;
      return true;
    }

    getTagName(){
      return this.element && this.element.tagName ?
        (this.element.tagName || '') :
        this.tag || '';
    }

    // prepend `~` to a property name that should be thrown away
    #ignoreProp(prop){
      return prop.startsWith('~');
    }

    #skipBannedProps(prop){
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
      if (this.#hasMethod(this, method)) {
        this[method](value);
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
        if (p === 'innerHTML') {
          console.warn('Do not use .innerHTML!');
          continue;
        }

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
    static style(elem, obj = {}){
      for (const [p, v] of Object.entries(obj)) {
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
    static css = Elem.style;
    css = this.style;

    static data(elem, obj) {
      try {
        for (const [name, value] of Object.entries(obj)) {
          elem.dataset[name] = value;
        }
      } catch (e) {
        console.warn('Could not set [data-*] attribute.', e);
      }
    }

    data(obj) {
      Elem.data(this.element, obj);
      return this;
    }

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

    removeClass(classNames){
      for (const className of this.#classNameArray(classNames)) {
        this.element.classList.remove(className);
      }
      return this;
    }

    // TODO: write `off` method
    off(...args) {
      console.log(`.off()`, args);
      return this;
    }

    static on(elem, events){
      const listeners = {};
      for (let event of [].concat(events)) {
        for (let [type, fn, ...other] of event) {
          type = type.toLowerCase();
          if (`on${type}` in elem) {
            elem.addEventListener(type, fn, ...other);
            // add event listeners to array to remove when
            // calling returned removal function
            listeners[type] = [].concat(
              listeners[type] || [],
              fn
            );
          }
        }
      }
      return {
        // TODO: write `off` method
        // off(eventsOrCallback, callback) {
        //   if (isFunction(eventsOrCallback)) {
        //     return elem.removeEventListener
        //   } else if (isArray(eventsOrCallback)) {
        //     try {
        //       [].concat(eventTypes).forEach((evtType) => {
        //         elem.removeEventListener(evtType, listeners[evtType])
        //       })
        //     } catch (e) {
        //       console.error(e);
        //     }
        //   }
        // }
      };
    }
    // ...
    on(elem, events = []){
      Elem.on(elem, events);
      return this;
    }

    // Limit the available 'prop' methods
    #hasMethod(E, method) {
      return typeof {
        attr: E.attr,
        prop: E.prop,
        style: E.style,
        css: E.style,
        data: E.data,
        className: E.className,
        addClass: E.addClass,
        classes: E.classes,
        removeClass: E.removeClass,
        on: E.on,
        [___HTML___]: E[___HTML___]
      }[method] === 'function'
    }

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
        this.element.appendChild(child.get());
        return true;
      }
    }

    #appendHTML(html){
      if (isString(html)) {
        if (htmlPrefix.test(html)) {
          this.element.insertAdjacentHTML('beforeend', html.replace(htmlPrefix, ''));
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
      // this.element.empty();
      // this.element.insertAdjacentHTML('beforeend', html);
      this.element.innerHTML = html;
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
          this.#appendChildElement(child) ||
          this.#appendHTML(child) ||
          this.#appendText(child) ||
          this.#appendObject(child) ||
          this.#appendInstance(child) ||
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
      this.parent.appendChild(this.get());
      return (
        isFunction(callback) ?
          callback(this.get(), this) :
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

  // Main function to expose via `window.d$`
  function d$(tag, props, children) {
    return new Elem(tag, props, children);
  }

  // Should this be exposed on the window.d$ object?
  d$.Elem = Elem;


  // Create an ELEMENT!!!
  function createElement(tag, props, children){
    return new Elem(tag, props, children);
  }
  d$.createElement = createElement;
  d$.element = createElement;
  d$.elem = createElement;

  d$.elem.div = (props, children) => createElement('div', props, children);

  // Create 'shortcut' static methods for standard elements
  ['div', 'p', 'a', 'b', 'i', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(tag => {
    d$.elem[tag] = (props, children) => {
      if (isPlainObject(props)) {
        return createElement(tag, props, children);
      }
      else {
        return createElement(tag, {}, children);
      }
    };
  });

  function tree(tag, props) {
    const elem = d$.createElement(tag, props);
    function createTree (tag, props) {
      return tree
    }
    createTree.get = () => elem.get();

    return createTree;
  }
  d$.tree = tree;

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

  /**
   * Create element tree defined in `children` array
   * and render into `parent`, replacing its contents
   * @param {string} parent - CSS selector for parent element
   * @param {Array} children - array of element definitions
   *
   * @example
   * d$.renderTree('#foo', [
   *   ['div.inner',
   *     ['p', {}, "This is your life and it's ending one minute at a time."],
   *   ]
   * ]);
   */
  function renderTree(parent, children = []) {

  }
  d$.renderTree = renderTree;

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

  // 'export' some constants
  d$.constants = constants;

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

  function isPlainObject(it){
    return Object.prototype.toString.call(it) === '[object Object]';
  }
  d$.isPlainObject = isPlainObject;

  function isFunction(it){
    return typeof it === 'function';
  }

  function getObject(it){
    if (isPlainObject(it) || isFunction(it)) {
      return it;
    }
    else {
      console.warn('Not a plain object or function.', it);
      return {};
    }
  }

  function isString(it){
    return typeof it === 'string';
  }

  function isElement(it){
    return (
      it.nodeType && it.nodeType === Node.ELEMENT_NODE
      || it instanceof Element
    );
  }

  function isFragment(it){
    return (
      it.nodeType && it.nodeType === Node.DOCUMENT_FRAGMENT_NODE
      || it instanceof DocumentFragment
    );
  }

  function isElemInstance(it){
    return it instanceof Elem;
  }

  // expose globally
  window.d$ = d$;
  window.domage = d$;

})(this);
