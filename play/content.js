/**
 * Content config as JavaScript functions
 */

(function(window){

  const d$ = window.d$;

  const createElement = d$.createElement;

  function content(children, parent) {
    return createElement(...children).render(parent);
  }

  function setup(...args){
    let [props, children] = args;
    if (d$.isPlainObject(props)) {
      // keep args as-is, otherwise swap them
    }
    else {
      children = props;
      props = {};
    }
    return [
      props || {},
      children || []
    ]
  }

  function div(...args){
    return createElement(['div', ...setup(args)]).get();
  }

  function p(...args){
    return createElement(['p', ...setup(args)]).get();
  }

  p.xbold = (...args) => {
    let [props, children] = setup(args);
    const { classes = [], ...other } = props;
    return p({
      ...other,
      classes: ['text-xbold', ...classes],
    }, children)
  }

  function ul(...args){
    return createElement(['ul', ...setup(args)]).get();
  }

  function li(...args){
    return createElement(['li', ...setup(args)]).get();
  }

  const exampleTree = div({}, [
    p.xbold([
      ul([
        li('Item one'),
        li('Item two'),
        li('Item three'),
        li('etc.')
      ])
    ])
  ])

})(window);
