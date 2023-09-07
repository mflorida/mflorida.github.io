/**
 * Example usage and composition of domage.js functions.
 */

// Don't leak to global scope
(function(window, d$){
  // Hold references to components
  const ___ = {};
  const output = d$.getById('output');
  const hipster = d$.content.hipster;

  ___.frag = (children) => d$.createFragment(children);

  const Div = (children) => d$.createElement('div', null, children);

  // Uses the pattern: { tag: 'p', children: [['b', 'Bold text']] }
  const p = (props, children) => {
    if (d$.isPlainObject(props)) {
      return d$.elem.p(props, children);
    }
    else {
      return d$.elem.p({}, children || props);
    }
  }

  // Initialize a <p> element for later usage
  const p2 = d$.elem.p({ $title: 'Another Paragraph' });

  // p2.addClass('bogus');
  // p2.addClass('totally');

  const hipsterPs = hipster.map(para => p(para));

  hipsterPs.push(p2.append('Another paragraph.'));

  p2.append(' ');
  p2.append(['b', 'Bold text.']);

  console.log('p2', p2);
  // Div.id = 'bogus';

  d$.renderElement(output, ___.frag(hipsterPs), (elem, parent) => {
    console.log('elem', elem);
    console.log('parent', parent);
  });

  return d$;

})(window, window.domage);
