"use strict";exports.id=107,exports.ids=[107],exports.modules={1107:function(e,t,n){n.r(t),n.d(t,{default:function(){return d}});var r=n(636),l=n.n(r),a=n(9633),o=n(2632),i=e=>l().createElement("div",{style:{padding:"1rem",borderRadius:"0.25rem",border:"4px dashed #228b22"},"data-e2e":"APP_2_CONTENT_BLOCK"},l().createElement("h2",null,"App 2: Content"),l().createElement("p",null,"This is the content from app2."),l().createElement("p",null,"Custom text: ",l().createElement("strong",null,e.content))),c=()=>{const[e,t]=l().useState("");return l().createElement("div",{style:{padding:"1rem",borderRadius:"0.25rem",border:"4px dashed #fc451e"}},l().createElement(a.m,null,l().createElement("title",null,"SSR MF Example")),l().createElement("div",{style:{padding:"1rem"}},l().createElement("h1",null,"Module Federation Example: Server Side Rendering"),l().createElement("h2",null,"This is the App 2 application."),l().createElement("p",null,"You can try to disable JavaScript and reload the page.")),l().createElement("div",{style:{padding:"1rem"}},l().createElement("h3",null,"Type something into this input"),l().createElement("input",{type:"text",value:e,onChange:e=>t(e.target.value),placeholder:"Luke, I am your father..."})),l().createElement(i,{content:e}))},d=async(e,t,n)=>{const r=a.m.renderStatic();let i=!1;const d=(0,o.eU)(l().createElement(c,null),{onAllReady(){t.statusCode=i?500:200,t.setHeader("Content-type","text/html"),t.write("<!DOCTYPE html"),t.write("<html ".concat(r.htmlAttributes.toString(),">\n      <head>\n        ").concat(r.title.toString(),"\n        ").concat(r.meta.toString(),"\n        ").concat(r.link.toString(),"\n      </head>\n      <body>")),t.write('<div id="root">'),d.pipe(t),t.write("</div>"),t.write('<script async data-chunk="main" src="http://localhost:3001/static/main.js"><\/script>'),t.write("</body></html>")},onShellError(){t.statusCode=500,t.send("<h1>An error occurred</h1>")},onError(e){i=!0,console.error(e)}})}}};