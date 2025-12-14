import{flushSync as n}from"react-dom";const c=[];function i(o){c.push(o),c.length===1&&queueMicrotask(()=>{n(()=>{c.splice(0).forEach(u=>u())})})}export{i as flushMicrotask};
//# sourceMappingURL=flushMicrotask.js.map
