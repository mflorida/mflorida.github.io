(this["webpackJsonphacker-news"]=this["webpackJsonphacker-news"]||[]).push([[0],{37:function(e,t,c){},62:function(e,t,c){"use strict";c.r(t);var r=c(0),s=c.n(r),n=c(28),i=c.n(n),a=c(11),j=(c(37),c(32)),h=c(12),l=c(2),b=c(29),o=c.n(b),d=c(1);function u(e){var t=e.updateResults,c=Object(r.useState)(""),s=Object(h.a)(c,2),n=s[0],i=s[1],a=Object(r.useRef)();return Object(d.jsx)("div",{id:"search",children:Object(d.jsxs)("form",{onSubmit:function(e){return function(e){e.preventDefault(),console.log("searching...",n),t(n),i(""),a.current.focus()}(e)},children:[Object(d.jsx)("label",{htmlFor:"search-input",children:"Search:"}),Object(d.jsx)(d.Fragment,{children:"\xa0"}),Object(d.jsx)("input",{ref:a,id:"search-input",type:"text",value:n,onChange:function(e){return i(e.target.value)}}),Object(d.jsx)(d.Fragment,{children:"\xa0"}),Object(d.jsx)("button",{type:"submit",children:"Search"})]})})}function O(e){var t=e.setSearchHistory,c=e.searchHistory,r=void 0===c?[]:c;return Object(d.jsxs)("div",{id:"history",children:[Object(d.jsxs)("header",{children:[Object(d.jsx)("h3",{children:"Search History"}),Object(d.jsx)("button",{type:"button",disabled:!r.length,onClick:function(){return t([])},children:"Clear"})]}),!!r.length&&Object(d.jsx)("table",{style:{marginTop:20,width:"100%"},children:Object(d.jsx)("tbody",{children:r.map((function(e){var t=e.timestamp;return Object(d.jsxs)("tr",{children:[Object(d.jsx)("td",{className:"text-left",children:e.term}),Object(d.jsx)("td",{className:"text-center font-mono",children:new Date(t).toLocaleString()})]},t)}))})})]})}function x(e){var t=e.setSearchResults,c=e.searchResults,r=void 0===c?[]:c;return Object(d.jsxs)("div",{id:"display-search-results",children:[Object(d.jsxs)("header",{children:[Object(d.jsx)("h3",{children:"Search Results"}),Object(d.jsx)("button",{type:"button",disabled:!r.length,onClick:function(){return t([])},children:"Clear"})]}),Object(d.jsx)("ul",{children:r.map((function(e,t){return Object(d.jsx)("li",{"data-object-id":e.objectID,children:Object(d.jsx)("a",{href:e.url,target:"_blank",rel:"noreferrer",children:e.title})},e.objectID)}))})]})}var p=function(){var e=Object(r.useState)([]),t=Object(h.a)(e,2),c=t[0],s=t[1],n=Object(r.useState)([]),i=Object(h.a)(n,2),b=i[0],p=i[1];return Object(d.jsxs)("div",{id:"app",children:[Object(d.jsxs)("div",{id:"tabs",children:[Object(d.jsx)("h1",{children:Object(d.jsx)(a.b,{to:"/search",children:"New Search"})}),Object(d.jsx)("h1",{children:Object(d.jsx)(a.b,{to:"/history",children:"Search History"})})]}),Object(d.jsxs)(l.d,{children:[Object(d.jsxs)(l.b,{path:"/search",children:[Object(d.jsx)(u,{updateResults:function(e){o.a.get("https://hn.algolia.com/api/v1/search?query=".concat(e)).then((function(e){console.log(e),s(e.data.hits)})),p([].concat(Object(j.a)(b),[{term:e,timestamp:Date.now()}]))}}),Object(d.jsx)(x,{setSearchResults:s,searchResults:c})]}),Object(d.jsx)(l.b,{path:"/history",children:Object(d.jsx)(O,{setSearchHistory:p,searchHistory:b})}),Object(d.jsx)(l.b,{exact:!0,path:"/",children:Object(d.jsx)(l.a,{to:"/search"})})]})]})};i.a.render(Object(d.jsx)(s.a.StrictMode,{children:Object(d.jsx)(a.a,{children:Object(d.jsx)(p,{})})}),document.getElementById("root"))}},[[62,1,2]]]);
//# sourceMappingURL=main.cc64331c.chunk.js.map