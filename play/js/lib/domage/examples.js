/**
 * Example usage and composition of domage.js functions.
 */

// Don't leak to global scope
(function(window, d$){

  const output = d$.getById('output');

  const hipster = d$.content.hipster;

  const Frag = (children) => d$.createFragment(children);

  const Div = (children) => d$.createElement('div', null, children);

  const Paragraph = (children) => d$.createElement({
    tag: 'p',
    children
  });

  const hipsterPs = hipster.map(para => Paragraph(para));

  // Div.id = 'bogus';

  d$.renderElement(output, Frag(hipsterPs), (elem, parent) => {
    console.log('elem', elem);
    console.log('parent', parent);
  });

  return d$;

})(window, window.domage);