/**
 * J.U.U.L.
 * - JavaScript
 * - Useless
 * - Utility
 * - Library
 * ........................................................
 * Old-timey JS, with no dependencies.
 * Throw a reference to this file in a <script> and go.
 * ........................................................
 */

(function(window){

  // Object to hold methods to expose via `window.j$`
  const j$ = {};

  // DO NOT DEFINE
  let undef;

  // constants
  const ___HTML___ = '___HTML___';
  const DEVMODE = /devmode/i.test(window.location.hash);

  j$.devmode = DEVMODE;

  // 'export' some constants
  j$.constants = {
    ___HTML___
  };

  // Why do we need these...
  function isDefined(it){
    return it !== undef;
  }
  j$.isDefined = isDefined;


  // ...To be 'declarative'?
  function isUndefined(it){
    return it === undef;
  }
  j$.isUndefined = isUndefined;


  // Return the first defined argument, or undefined
  function firstDefined(...args){
    for (const arg of args) {
      if (isDefined(arg)) {
        return arg;
      }
    }
    return undef;
  }
  j$.firstDefined = firstDefined;


  // Are the true/false checks pointless???
  // Maybe, but it makes intent totally clear.
  function isTrue(it){
    return it === true;
  }
  j$.isTrue = isTrue;
  // ...
  function isFalse(it){
    return it === false;
  }
  j$.isFalse = isFalse;


  function isFalsey(it){
    return !it;
  }
  j$.isFalsey = isFalsey;


  const isArray = Array.isArray;
  j$.isArray = isArray;


  function isPlainObject(it){
    return Object.prototype.toString.call(it) === '[object Object]';
  }
  j$.isPlainObject = isPlainObject;


  function isFunction(it){
    return typeof it === 'function';
  }
  j$.isFunction = isFunction;


  function getObject(it){
    return isPlainObject(it) || isFunction(it) ? it : {};
  }
  j$.getObject = getObject;


  function isString(it){
    return typeof it === 'string';
  }
  j$.isString = isString;


  function isElement(it){
    return it instanceof Element;
  }
  j$.isElement = isElement;


  function isFragment(it){
    return it instanceof DocumentFragment;
  }
  j$.isFragment = isFragment;



  // Resolve context of parent for selecting element(s)
  function resolveContext(context){
    if (context === document || isElement(context)) {
      return context;
    }
    if (isString(context)) {
      return document.querySelector(context);
    }
    return document;
  }


  // Select an ELEMENT!!!
  function getElement(selector, context = document){
    if (isElement(selector)) {
      return selector;
    }
    return resolveContext(context).querySelector(selector);
  }
  j$.getElement = getElement;


  // Select a bunch of ELEMENTS!!! (returned as an array)
  function getElements(selector, context = document){
    return [...resolveContext(context).querySelectorAll(selector)];
  }
  j$.getElements = getElements;


  const attrPrefix = /^\$/;
  const propPrefix = /^_/;
  const evtPrefix = /^on/i;
  const htmlPrefix = new RegExp(`^\s*${___HTML___}`);


  const propMethods = {
    attr: (elem, attrs) => {
      for (const [attr, val] of Object.entries(attrs)) {
        elem.setAttribute(attr, val);
      }
      return elem;
    },
    prop: (elem, props) => {
      for (const [prop, val] of Object.entries(props)) {
        if (prop in elem) {
          elem[prop] = val;
        }
        else {
          console.warn(`Property '${prop}' is invalid.`);
        }
      }
      return elem;
    },
    style: (elem, styles) => {
      if (isString(styles)) {
        elem.setAttribute('style', styles);
      }
      else {
        for (const [prop, val] of Object.entries(styles)) {
          elem.style[prop] = val;
        }
      }
      return elem;
    },
    className: (elem, clss) => {
      for (const cls of [].concat(clss).join(' ').split(/\s+/)) {
        elem.classList.add(cls);
      }
    },
    on: (elem, events) => {
      for (let [type, fn] of Object.entries(events)) {
        type = type.toLowerCase();
        if (`on${type}` in elem) {
          elem.addEventListener(type, fn);
        }
      }
      return elem;
    },
    off: (elem, events) => {
      for (let [type, fn] of Object.entries(events)) {
        type = type.toLowerCase().replace(evtPrefix, '');
        try {
          elem.removeEventListener(type, fn);
        }
        catch (e) {
          console.warn(e);
        }
      }
      return elem;
    },
    ___HTML___: (elem, html) => {
      let tmpl = document.createElement('template');
      tmpl.insertAdjacentHTML('afterbegin', html);
      while (tmpl.firstChild) {
        elem.appendChild(tmpl.firstChild);
      }
      tmpl = null;
      return elem;
    }
  };


  // Create an ELEMENT!!!
  function createElement(tag, props, children){
    let e = { tag, props, children };

    if (isPlainObject(tag) && !props && !children) {
      e = { ...tag };
    }
    else if (isArray(tag) && !props && !children) {
      [e.tag, e.props, e.children] = tag;
    }

    // alias to 'type'
    e.type = e.tag || '#document-fragment';

    e.props = e.props || {};
    e.children = e.children || '';

    // nullify original arguments... just because
    tag = null;
    props = null;
    children = null;

    try {
      let elem;

      if (!e.tag || isPlainObject(e.tag)) {
        e.props = {};
        elem = document.createDocumentFragment();
      }
      else {
        elem = document.createElement(e.tag);
      }

      for (const [name, value] of Object.entries(e.props)) {
        // Use one of the `propMethods` functions:
        // attr, prop, style, className, on, off, ___HTML___
        if (propMethods.hasOwnProperty(name)) {
          propMethods[name](elem, value);
          continue;
        }
        // $title: 'foo' -- shorthand for {attr: {title: 'foo'}}
        if (attrPrefix.test(name)) {
          const attrName = name.replace(attrPrefix, '');
          propMethods.attr(elem, {
            [attrName]: value
          });
          continue;
        }
        // _name: 'bar' -- shorthand for {prop: {name: 'bar'}}
        if (propPrefix.test(name)) {
          const propName = name.replace(propPrefix, '');
          propMethods.prop(elem, {
            [propName]: value
          });
          continue;
        }
        // onclick: (e) => doSomething()
        if (evtPrefix.test(name)) {
          const evtType = name.replace(evtPrefix, '');
          propMethods.on(elem, {
            [evtType]: value
          });
          continue;
        }
        // lastly, try to directly set value for specified element property
        if (name in elem) {
          elem[name] = value;
          continue;
        }
        console.warn(`Can't do it.`, elem, name, value);
      }

      if (e.___HTML___) {
        propMethods.___HTML___(elem, e.___HTML___);
      }
      else {
        for (let child of [].concat(e.children)) {
          try {
            if (isArray(child) || isPlainObject(child)) {
              child = createElement(child);
            }
            else if (isString(child) && isFragment(elem)) {
              propMethods.___HTML___(elem, child);
            }
            else {
              child && elem.append(child);
            }
          }
          catch (e) {
            console.error(`Could not append.`, elem, child)
          }
        }
      }

      DEVMODE && console.log('elem', elem);

      return elem;

    }
    catch (e) {
      console.error('Could not create element.', tag, e);
    }
  }
  j$.createElement = createElement;


  // Render element into parent and run optional callback
  function renderElement(parent, element, callback){
    let elem;
    if (isElement(element)) {
      elem = element;
    }
    else if (isArray(element) || isPlainObject(element)) {
      elem = createElement(element);
    }
    getElement(parent).appendChild(elem);
    return (
      isFunction(callback) ?
        callback(elem) :
        elem
    );
  }
  j$.renderElement = renderElement;


  // expose globally
  window.j$ = j$;


})(this);
