/**
 * Example usage and composition of domage.js functions.
 */

// Don't leak to global scope
(function(window, d$){
  // Hold references to components
  const ___ = {};
  const output = d$.getById('output');
  const hipster = d$.content.hipster;
  const ___HTML___ = d$.constants.___HTML___;

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
  // TODO: figure out why this doesn't work.
  // const p2 = d$.elem.p({ $title: 'Another Paragraph' });

  // p2.addClass('bogus');
  // p2.addClass('totally');

  const hipsterPs = hipster.map(para => p(para));

  // p2.element.insertAdjacentText('beforeend', 'Another paragraph. ')
  // p2.element.insertAdjacentHTML('beforeend', '<b>Bold text.</b>');

  hipsterPs.push(['p', { $title: 'Another Paragraph' }, 'Another paragraph']);
  hipsterPs.push(['p', [
    ['b', [
      'Bold text in yet another paragraph. ',
      ___HTML___ + `<i>Italic HTML text that's also bold.</i>`
    ]],
    // `${HTML} <b>Bold text in another paragraph</b>`
  ]]);

  // console.log('p2', p2);
  // Div.id = 'bogus';

  d$.renderElement(output, ___.frag(hipsterPs), (elem, parent) => {
    console.log('elem', elem);
    console.log('parent', parent);
  });

  return d$;

})(window, window.domage);
