!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){"use strict";r.r(t);const n={text(e,t,r,n){this.bind(e,t,r,"text")},bind(e,t,r,n){let i=this.getVMData(t,r);o[n](e,r,i)},getVMData(e,t){let r=t.split("."),n=e;return r.forEach(e=>{n=n[e]}),n}},o={text(e,t,r){e.textContent=r}};var i=class{constructor(e,t){this.el=document.querySelector(e),this.vm=t,this.fragment=this.nodeToFragment(this.el),this.compileElement(this.fragment),this.el.appendChild(this.fragment)}nodeToFragment(e){let t=document.createDocumentFragment(),r=e.childNodes;return Array.from(r).forEach(e=>{t.appendChild(e)}),t}compileElement(e){let t=e.childNodes;Array.from(t).forEach(e=>{1===e.nodeType?this.compileNodeElement(e):3===e.nodeType&&this.compileTextNode(e)})}compileTextNode(e){let t=this.compilerText(e.textContent),r=document.createDocumentFragment(),o=e.parentNode;t.forEach(e=>{let t;e.tag?(t=document.createTextNode(""),n.text(t,this.vm,e.value,"text")):t=document.createTextNode(e.value),r.appendChild(t)}),o.replaceChild(r,e)}compilerText(e){let t,r,n=/\{\{(.*?)\}\}/g,o=0,i=[];for(;t=n.exec(e);)t.index>o&&i.push({value:e.slice(o,t.index)}),r=t[1],i.push({value:r,tag:!0}),o=t.index+t[0].length;return o<e.length&&i.push({value:e.slice(o)}),i}};new class{constructor(e){this.el=e.el,this.data=e.data,Object.keys(this.data).forEach(e=>{this.setProxy(e)}),new i(this.el,this)}setProxy(e){Object.defineProperty(this,e,{get(){return this.data[e]},set(t){this.data[e]=t}})}}({el:"#app",data:{msg:"123",message:{name:"456"}}})}]);