(this["webpackJsonpcustomer-rewards-example"]=this["webpackJsonpcustomer-rewards-example"]||[]).push([[0],{41:function(e,t,a){e.exports=a(69)},46:function(e,t,a){},48:function(e,t,a){},69:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),l=a(8),c=a.n(l),u=(a(46),a(47),a(48),a(75)),o=a(76),s=a(77),m=a(12),i=a(79),d=a(74),E=a(78),p=a(33),f=a.n(p);function h(e,t){var a=Object(n.useState)(null),r=Object(m.a)(a,2),l=r[0],c=r[1],u=Object(n.useState)(null),o=Object(m.a)(u,2),s=o[0],i=o[1];return Object(n.useEffect)((function(){!function(){if(e.url){var t=f()(e);i(t),t.then((function(e){return c(e),e}))}}()}),t?[].concat(t):[]),[l,s]}function g(e){return e.req&&e.req.status&&!/^2/.test(e.req.status)?r.a.createElement("div",{className:"card text-white bg-danger mb-3",style:{maxWidth:"24rem"}},r.a.createElement("div",{className:"card-header"},"An Error Occured"),r.a.createElement("div",{className:"card-body"},r.a.createElement("h5",{className:"card-title"},"Status ",e.req.status),r.a.createElement("p",{className:"card-text"},e.req.statusText))):r.a.createElement("div",{className:"spinner-boarder ".concat(e.type?e.type:"text-light"),role:"status"},r.a.createElement("span",{className:"sr-only"},e.text||"Loading..."))}function w(e){return e.reduce((function(e,t){return e+t}))}var v=0;function y(e){var t=e.amounts,a=new Array(t.spent.length).fill(""),n="pop"+(v+=1),l=r.a.createElement(i.a,{id:n},r.a.createElement(i.a.Content,{style:{padding:".5rem"}},r.a.createElement(d.a,{striped:!0,bordered:!0,hover:!0,size:"sm",style:{margin:0}},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,"Spent"),r.a.createElement("th",null,"Points"))),r.a.createElement("tbody",null,a.map((function(e,a){return r.a.createElement("tr",null,r.a.createElement("td",null,"$",t.spent[a]),r.a.createElement("td",null,t.rewards[a]))}))))));return r.a.createElement(E.a,{rootClose:!0,trigger:"click",placement:"right",overlay:l},r.a.createElement("a",{href:"#!"},e.children))}function b(e){return r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,"Customer Name"),new Array(e.count).fill("").map((function(e,t){return r.a.createElement("th",{colSpan:3},"Month ",t+1)})),r.a.createElement("th",null,"Total Spent"),r.a.createElement("th",null,"Total Points")))}function x(e){e.count;var t=e.customer,a=t.amounts,n={spent:a.map((function(e,t){return e.totals.spent})).reduce((function(e,t){return e+t})),rewards:a.map((function(e,t){return e.totals.rewards})).reduce((function(e,t){return e+t}))},l=a.map((function(e,t){return{spentx:e.spent.reduce((function(e,t){return e+t})),spent:w(e.spent),rewardsx:e.rewards.reduce((function(e,t){return e+t})),rewards:w(e.rewards)}}));return r.a.createElement("tr",null,r.a.createElement("td",{style:{textAlign:"left",paddingLeft:"10px"}},"".concat(t.firstName," ").concat(t.lastName)),l.map((function(e,t){return r.a.createElement(r.a.Fragment,null,r.a.createElement("td",null,"$",e.spent),r.a.createElement("td",null,e.rewards," pts"),r.a.createElement("td",null,r.a.createElement(y,{amounts:a[t]},"info")))})),r.a.createElement("td",null,"$",n.spent),r.a.createElement("td",null,n.rewards))}function N(e){var t=e.data[0].amounts.length;return r.a.createElement(d.a,{striped:!0,bordered:!0,hover:!0,size:"sm",variant:"dark"},r.a.createElement(b,{count:t}),r.a.createElement("tbody",null,e.data.map((function(e,a){return r.a.createElement(x,{key:a,count:t,customer:e})}))))}function j(){var e=h({url:"data/customerData.json",method:"GET"}),t=Object(m.a)(e,2),a=t[0];t[1];return r.a.createElement(r.a.Fragment,null,a&&a.data?r.a.createElement(N,{data:a.data}):r.a.createElement(g,null))}var k=function(){return r.a.createElement("div",{className:"App"},r.a.createElement(u.a,null,r.a.createElement(o.a,{style:{borderBottom:"1px solid #ccc"}},r.a.createElement("h2",{style:{margin:"20px auto"}},"Customer Rewards Data")),r.a.createElement(o.a,null),r.a.createElement(o.a,{style:{paddingTop:"20px"}},r.a.createElement(s.a,{style:{padding:0}},r.a.createElement(j,null)))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(k,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[41,1,2]]]);
//# sourceMappingURL=main.82d23af0.chunk.js.map