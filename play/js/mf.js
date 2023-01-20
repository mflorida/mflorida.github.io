/**
 * Some old-school JS, no libraries or whatever.
 * Just a JS file with an IIFE included via <script> tag.
 */

(function(window) {

  const j$ = { ...window.j$ };
  const jsyaml = window.jsyaml;

  const ___HTML___ = j$.constants.___HTML___;

  const mf = { ...j$.getObject(window.mf) };

  let fontSize = 16;

  function bumpFontSize() {
    return `${fontSize += 4}px`;
  }

  function BigB(props, children) {
    const {
      style = {},
      ...other
    } = props || {};
    return j$.createElement('b', {
      ...other,
      style: {
        ...style,
        fontSize: bumpFontSize()
      }
    }, children);
  }

  class HT {
    tag = '';
    elem = null;
    element = this.elem;
    frag;
    fragment = this.frag;
    constructor(options = {}) {
      Object.assign(this, { ...options });
      if (this.tag === '') {
        this.frag = document.createDocumentFragment();
      }
    }
  }

  function ht(tag = '', props = {}, children = []) {
    return new HT({
      tag,
      ...props,
      children: [...children]
    });
  }

  const P = ht('p')

  ht.p = (props, children) => {
    if (children == null) {
      if (props && !j$.isPlainObject(props)) {
        children = props;
        props = null;
      }
    }
    return j$.createElement('p', props, children);
  };

  function htmlP(html) {
    return ht.p({ [___HTML___]: html });
  }

  function htmlDiv(html) {
    return j$.createElement('div', {
      [___HTML___]: html
    });
  }

  const container = j$.getElement('#things');

  // const Things = j$.createElement('div', {
  //   attr: { id: 'bogus' },
  //   prop: { title: 'Bogus' },
  //   style: { color: 'red' },
  //   className: 'totally-bogus'
  // }, [
  //   BigB({
  //     [___HTML___]: `This is <i>probably</i> bogus.`
  //   }),
  //   ['br'],
  //   ['i', {}, 'TOTALLY BOGUS!'],
  //   ['br'],
  //   BigB({
  //     classes: ['i-agree', 'totally'],
  //     style: { color: 'blue' },
  //     [___HTML___]: 'I agree. '
  //   }).append('For sure!'),
  //   htmlDiv('' +
  //     '<br>' +
  //     '<p>Getting dangerous &amp; stuff!!!</p>' +
  //     ''),
  //   P('Whatever, loser.'),
  //   htmlP('No, <i>YOU</i> are the loser!!!'),
  //   []
  // ]);
  //
  // Things.appendTo(container, (elem) => {
  //   console.log(elem);
  // });

  // Fetch the YAML then parse it? IDK WTF to do.
  (async function() {
    const response = await fetch('./content.yaml');
    const yaml = await response.text();
    const yamlDoc = jsyaml.load(yaml);

    console.log('yamlDoc', yamlDoc);

    const x_id = '~id';

    yamlDoc.content.body.forEach(elem => {
      if (j$.isPlainObject(elem) && elem[x_id]) {
        if (elem.props) {
          elem.props.title = elem[x_id].toUpperCase();
          delete elem[x_id];
        }
      }
    });

    // empty #things when rendering
    // container.innerHTML = '';
    j$.renderElement(container, {
      type: 'div',
      props: {
        // _prop is set directly as an element *property* (fastest)
        _title: `It's from YAML!`,
        // $attr is set as an element *attribute*
        $class: 'from-yaml', // `$class` will work, but `_class` will not
        // `style` gets special handling
        style: { fontFamily: 'serif' },
        // ...so does `attr`
        attr: { 'data-foo': 'bar' },
        // ...so does `prop`
        prop: { id: 'some-id' },
        // ...so does `className`
        className: 'whatevs' // this would override `$class` above
      },
      children: [
        { ___HTML___: '<b><i>The parsed YAML lies below...</i></b><br>' },
        ...yamlDoc.content.body
      ]
    }, (elem) => {
      elem.addEventListener('click', () => console.log('YOU CLICKED IT!'));
    });

  })();

  window.mf = mf;

})(this);
