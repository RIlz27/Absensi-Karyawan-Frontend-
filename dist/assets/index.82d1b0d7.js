import{aP as O,r as a,aT as T,aW as ue,aQ as j,aZ as le,aS as E,aU as x,aR as K,aV as de,j as s,ab as q,c as w,I as be}from"./index.1873308f.js";import{c as A}from"./code-snippet.32d5dd98.js";import{$ as fe,a as z}from"./index.b5449989.js";import"./Card.4b3fb845.js";import"./toConsumableArray.e5b41f38.js";const P="rovingFocusGroup.onEntryFocus",me={bubbles:!1,cancelable:!0},B="RovingFocusGroup",[M,W,pe]=fe(B),[ve,Y]=O(B,[pe]),[ge,$e]=ve(B),xe=a.exports.forwardRef((e,t)=>a.exports.createElement(M.Provider,{scope:e.__scopeRovingFocusGroup},a.exports.createElement(M.Slot,{scope:e.__scopeRovingFocusGroup},a.exports.createElement(Te,T({},e,{ref:t}))))),Te=a.exports.forwardRef((e,t)=>{const{__scopeRovingFocusGroup:o,orientation:n,loop:u=!1,dir:d,currentTabStopId:r,defaultCurrentTabStopId:f,onCurrentTabStopIdChange:m,onEntryFocus:i,...l}=e,c=a.exports.useRef(null),v=ue(t,c),y=z(d),[p=null,h]=j({prop:r,defaultProp:f,onChange:m}),[_,g]=a.exports.useState(!1),$=le(i),oe=W(o),N=a.exports.useRef(!1),[ne,V]=a.exports.useState(0);return a.exports.useEffect(()=>{const b=c.current;if(b)return b.addEventListener(P,$),()=>b.removeEventListener(P,$)},[$]),a.exports.createElement(ge,{scope:o,orientation:n,dir:y,loop:u,currentTabStopId:p,onItemFocus:a.exports.useCallback(b=>h(b),[h]),onItemShiftTab:a.exports.useCallback(()=>g(!0),[]),onFocusableItemAdd:a.exports.useCallback(()=>V(b=>b+1),[]),onFocusableItemRemove:a.exports.useCallback(()=>V(b=>b-1),[])},a.exports.createElement(E.div,T({tabIndex:_||ne===0?-1:0,"data-orientation":n},l,{ref:v,style:{outline:"none",...e.style},onMouseDown:x(e.onMouseDown,()=>{N.current=!0}),onFocus:x(e.onFocus,b=>{const se=!N.current;if(b.target===b.currentTarget&&se&&!_){const k=new CustomEvent(P,me);if(b.currentTarget.dispatchEvent(k),!k.defaultPrevented){const S=oe().filter(I=>I.focusable),re=S.find(I=>I.active),ie=S.find(I=>I.id===p),ce=[re,ie,...S].filter(Boolean).map(I=>I.ref.current);H(ce)}}N.current=!1}),onBlur:x(e.onBlur,()=>g(!1))})))}),he="RovingFocusGroupItem",Ie=a.exports.forwardRef((e,t)=>{const{__scopeRovingFocusGroup:o,focusable:n=!0,active:u=!1,tabStopId:d,...r}=e,f=K(),m=d||f,i=$e(he,o),l=i.currentTabStopId===m,c=W(o),{onFocusableItemAdd:v,onFocusableItemRemove:y}=i;return a.exports.useEffect(()=>{if(n)return v(),()=>y()},[n,v,y]),a.exports.createElement(M.ItemSlot,{scope:o,id:m,focusable:n,active:u},a.exports.createElement(E.span,T({tabIndex:l?0:-1,"data-orientation":i.orientation},r,{ref:t,onMouseDown:x(e.onMouseDown,p=>{n?i.onItemFocus(m):p.preventDefault()}),onFocus:x(e.onFocus,()=>i.onItemFocus(m)),onKeyDown:x(e.onKeyDown,p=>{if(p.key==="Tab"&&p.shiftKey){i.onItemShiftTab();return}if(p.target!==p.currentTarget)return;const h=Ce(p,i.orientation,i.dir);if(h!==void 0){p.preventDefault();let g=c().filter($=>$.focusable).map($=>$.ref.current);if(h==="last")g.reverse();else if(h==="prev"||h==="next"){h==="prev"&&g.reverse();const $=g.indexOf(p.currentTarget);g=i.loop?Fe(g,$+1):g.slice($+1)}setTimeout(()=>H(g))}})})))}),we={ArrowLeft:"prev",ArrowUp:"prev",ArrowRight:"next",ArrowDown:"next",PageUp:"first",Home:"first",PageDown:"last",End:"last"};function Ee(e,t){return t!=="rtl"?e:e==="ArrowLeft"?"ArrowRight":e==="ArrowRight"?"ArrowLeft":e}function Ce(e,t,o){const n=Ee(e.key,o);if(!(t==="vertical"&&["ArrowLeft","ArrowRight"].includes(n))&&!(t==="horizontal"&&["ArrowUp","ArrowDown"].includes(n)))return we[n]}function H(e){const t=document.activeElement;for(const o of e)if(o===t||(o.focus(),document.activeElement!==t))return}function Fe(e,t){return e.map((o,n)=>e[(t+n)%e.length])}const ye=xe,Re=Ie,Q="Tabs",[_e,Ze]=O(Q,[Y]),Z=Y(),[Ne,L]=_e(Q),Se=a.exports.forwardRef((e,t)=>{const{__scopeTabs:o,value:n,onValueChange:u,defaultValue:d,orientation:r="horizontal",dir:f,activationMode:m="automatic",...i}=e,l=z(f),[c,v]=j({prop:n,onChange:u,defaultProp:d});return a.exports.createElement(Ne,{scope:o,baseId:K(),value:c,onValueChange:v,orientation:r,dir:l,activationMode:m},a.exports.createElement(E.div,T({dir:l,"data-orientation":r},i,{ref:t})))}),Ae="TabsList",Pe=a.exports.forwardRef((e,t)=>{const{__scopeTabs:o,loop:n=!0,...u}=e,d=L(Ae,o),r=Z(o);return a.exports.createElement(ye,T({asChild:!0},r,{orientation:d.orientation,dir:d.dir,loop:n}),a.exports.createElement(E.div,T({role:"tablist","aria-orientation":d.orientation},u,{ref:t})))}),Me="TabsTrigger",qe=a.exports.forwardRef((e,t)=>{const{__scopeTabs:o,value:n,disabled:u=!1,...d}=e,r=L(Me,o),f=Z(o),m=J(r.baseId,n),i=X(r.baseId,n),l=n===r.value;return a.exports.createElement(Re,T({asChild:!0},f,{focusable:!u,active:l}),a.exports.createElement(E.button,T({type:"button",role:"tab","aria-selected":l,"aria-controls":i,"data-state":l?"active":"inactive","data-disabled":u?"":void 0,disabled:u,id:m},d,{ref:t,onMouseDown:x(e.onMouseDown,c=>{!u&&c.button===0&&c.ctrlKey===!1?r.onValueChange(n):c.preventDefault()}),onKeyDown:x(e.onKeyDown,c=>{[" ","Enter"].includes(c.key)&&r.onValueChange(n)}),onFocus:x(e.onFocus,()=>{const c=r.activationMode!=="manual";!l&&!u&&c&&r.onValueChange(n)})})))}),Be="TabsContent",Le=a.exports.forwardRef((e,t)=>{const{__scopeTabs:o,value:n,forceMount:u,children:d,...r}=e,f=L(Be,o),m=J(f.baseId,n),i=X(f.baseId,n),l=n===f.value,c=a.exports.useRef(l);return a.exports.useEffect(()=>{const v=requestAnimationFrame(()=>c.current=!1);return()=>cancelAnimationFrame(v)},[]),a.exports.createElement(de,{present:u||l},({present:v})=>a.exports.createElement(E.div,T({"data-state":l?"active":"inactive","data-orientation":f.orientation,role:"tabpanel","aria-labelledby":m,hidden:!v,id:i,tabIndex:0},r,{ref:t,style:{...e.style,animationDuration:c.current?"0s":void 0}}),v&&d))});function J(e,t){return`${e}-trigger-${t}`}function X(e,t){return`${e}-content-${t}`}const De=Se,ee=Pe,te=qe,ae=Le,D=De,R=a.exports.forwardRef(({className:e,...t},o)=>s(ee,{ref:o,className:q("inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-600 dark:bg-gray-800 dark:text-gray-300",e),...t}));R.displayName=ee.displayName;const C=a.exports.forwardRef(({className:e,...t},o)=>s(te,{ref:o,className:q("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-sm dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 dark:data-[state=active]:bg-indigo-500 dark:data-[state=active]:text-gray-50",e),...t}));C.displayName=te.displayName;const F=a.exports.forwardRef(({className:e,...t},o)=>s(ae,{ref:o,className:q("mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300",e),...t}));F.displayName=ae.displayName;const Ve=()=>s("div",{className:"lg:w-7/12",children:w(D,{defaultValue:"account",children:[w(R,{children:[s(C,{value:"account",children:"Account"}),s(C,{value:"password",children:"Password"})]}),s(F,{value:"account",children:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent elementum finibus arcu vitae scelerisque. Etiam rutrum blandit condimentum. Maecenas condimentum massa vitae quam interdum, et lacinia urna tempor",'}),s(F,{value:"password",children:"Etiam nec ante eget lacus vulputate egestas non iaculis tellus. Suspendisse tempus ex in tortor venenatis malesuada. Aenean consequat dui vitae nibh lobortis condimentum. Duis vel risus est"})]})}),ke=`import React, { Fragment, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BasicTabs = () => {
  return (
    <div className="lg:w-7/12">
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
          elementum finibus arcu vitae scelerisque. Etiam rutrum blandit
          condimentum. Maecenas condimentum massa vitae quam interdum, et
          lacinia urna tempor",
        </TabsContent>
        <TabsContent value="password">
          Etiam nec ante eget lacus vulputate egestas non iaculis tellus.
          Suspendisse tempus ex in tortor venenatis malesuada. Aenean consequat
          dui vitae nibh lobortis condimentum. Duis vel risus est
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BasicTabs;
`,Ge=`import React, { Fragment } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const buttons = [
  {
    title: "home",
    icon: "ph:house-line",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent elementum finibus arcu vitae scelerisque. Etiam rutrum blandit condimentum. Maecenas condimentum massa vitae quam interdum, et lacinia urna tempor",
  },
  {
    title: "profile",
    icon: "ph:user",
    content:
      "Pellentesque pulvinar, sapien eget fermentum sodales, felis lacus viverra magna, id pulvinar odio metus non enim. Ut id augue interdum, ultrices felis eu, tincidunt libero.",
  },
  {
    title: "messages",
    icon: "ph:chat-dots",
    content:
      "Cras iaculis ipsum quis lectus faucibus, in mattis nulla molestie. Vestibulum vel tristique libero. Morbi vulputate odio at viverra sodales. Curabitur accumsan justo eu libero porta ultrices vitae eu leo.",
  },
  {
    title: "settings",
    icon: "ph:gear-six",
    content:
      "Etiam nec ante eget lacus vulputate egestas non iaculis tellus. Suspendisse tempus ex in tortor venenatis malesuada. Aenean consequat dui vitae nibh lobortis condimentum. Duis vel risus est",
  },
];

const BorderBottomTab = () => {
  return (
    <div className="lg:w-7/12">
      <Tabs defaultValue="home">
        <TabsList className=" bg-transparent p-0 border-b-2 border-gray-200 rounded-none">
          {buttons.map((item, i) => (
            <>
              <TabsTrigger
                className="capitalize   data-[state=active]:bg-transparent data-[state=active]:text-indigo-500 transition duration-150 before:transition-all before:duration-150 relative before:absolute
         before:left-1/2 before:-bottom-[5px] before:h-[2px]
           before:-translate-x-1/2 before:w-0 data-[state=active]:before:bg-indigo-500 data-[state=active]:before:w-full"
                value={item.title}
              >
                {item.title}
              </TabsTrigger>
            </>
          ))}
        </TabsList>
        {buttons.map((item, i) => (
          <>
            <TabsContent value={item.title}>{item.content}</TabsContent>
          </>
        ))}
      </Tabs>
    </div>
  );
};

export default BorderBottomTab;`,Ue=`import React, { Fragment } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/Icon";
const buttons = [
  {
    title: "home",
    icon: "ph:house-line",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent elementum finibus arcu vitae scelerisque. Etiam rutrum blandit condimentum. Maecenas condimentum massa vitae quam interdum, et lacinia urna tempor",
  },
  {
    title: "profile",
    icon: "ph:user",
    content:
      "Pellentesque pulvinar, sapien eget fermentum sodales, felis lacus viverra magna, id pulvinar odio metus non enim. Ut id augue interdum, ultrices felis eu, tincidunt libero.",
  },
  {
    title: "messages",
    icon: "ph:chat-dots",
    content:
      "Cras iaculis ipsum quis lectus faucibus, in mattis nulla molestie. Vestibulum vel tristique libero. Morbi vulputate odio at viverra sodales. Curabitur accumsan justo eu libero porta ultrices vitae eu leo.",
  },
  {
    title: "settings",
    icon: "ph:gear-six",
    content:
      "Etiam nec ante eget lacus vulputate egestas non iaculis tellus. Suspendisse tempus ex in tortor venenatis malesuada. Aenean consequat dui vitae nibh lobortis condimentum. Duis vel risus est",
  },
];

const BorderBottomWithIcon = () => {
  return (
    <div className="lg:w-7/12">
      <Tabs defaultValue="home">
        <TabsList className=" bg-transparent p-0 border-b-2 border-gray-200 rounded-none">
          {buttons.map((item, i) => (
            <>
              <TabsTrigger
                className="capitalize   data-[state=active]:bg-transparent data-[state=active]:text-indigo-500 transition duration-150 before:transition-all before:duration-150 relative before:absolute
         before:left-1/2 before:-bottom-[5px] before:h-[2px]
           before:-translate-x-1/2 before:w-0 data-[state=active]:before:bg-indigo-500 data-[state=active]:before:w-full"
                value={item.title}
              >
                <Icon
                  icon={item.icon}
                  className="h-5 w-5 top-[1px] ltr:mr-[6px] rtl:ml-[6px] relative"
                />
                {item.title}
              </TabsTrigger>
            </>
          ))}
        </TabsList>
        {buttons.map((item, i) => (
          <>
            <TabsContent value={item.title}>{item.content}</TabsContent>
          </>
        ))}
      </Tabs>
    </div>
  );
};

export default BorderBottomWithIcon;`,G=[{title:"home",icon:"ph:house-line",content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent elementum finibus arcu vitae scelerisque. Etiam rutrum blandit condimentum. Maecenas condimentum massa vitae quam interdum, et lacinia urna tempor"},{title:"profile",icon:"ph:user",content:"Pellentesque pulvinar, sapien eget fermentum sodales, felis lacus viverra magna, id pulvinar odio metus non enim. Ut id augue interdum, ultrices felis eu, tincidunt libero."},{title:"messages",icon:"ph:chat-dots",content:"Cras iaculis ipsum quis lectus faucibus, in mattis nulla molestie. Vestibulum vel tristique libero. Morbi vulputate odio at viverra sodales. Curabitur accumsan justo eu libero porta ultrices vitae eu leo."},{title:"settings",icon:"ph:gear-six",content:"Etiam nec ante eget lacus vulputate egestas non iaculis tellus. Suspendisse tempus ex in tortor venenatis malesuada. Aenean consequat dui vitae nibh lobortis condimentum. Duis vel risus est"}],Oe=()=>s("div",{className:"lg:w-7/12",children:w(D,{defaultValue:"home",children:[s(R,{className:" bg-transparent p-0 border-b-2 border-gray-200 rounded-none",children:G.map((e,t)=>s(a.exports.Fragment,{children:s(C,{className:"capitalize   data-[state=active]:bg-transparent data-[state=active]:text-indigo-500 transition duration-150 before:transition-all before:duration-150 relative before:absolute before:left-1/2 before:-bottom-[5px] before:h-[2px] before:-translate-x-1/2 before:w-0 data-[state=active]:before:bg-indigo-500 data-[state=active]:before:w-full",value:e.title,children:e.title})},t))}),G.map((e,t)=>s(a.exports.Fragment,{children:s(F,{value:e.title,children:e.content})},t*32))]})}),U=[{title:"home",icon:"ph:house-line",content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent elementum finibus arcu vitae scelerisque. Etiam rutrum blandit condimentum. Maecenas condimentum massa vitae quam interdum, et lacinia urna tempor"},{title:"profile",icon:"ph:user",content:"Pellentesque pulvinar, sapien eget fermentum sodales, felis lacus viverra magna, id pulvinar odio metus non enim. Ut id augue interdum, ultrices felis eu, tincidunt libero."},{title:"messages",icon:"ph:chat-dots",content:"Cras iaculis ipsum quis lectus faucibus, in mattis nulla molestie. Vestibulum vel tristique libero. Morbi vulputate odio at viverra sodales. Curabitur accumsan justo eu libero porta ultrices vitae eu leo."},{title:"settings",icon:"ph:gear-six",content:"Etiam nec ante eget lacus vulputate egestas non iaculis tellus. Suspendisse tempus ex in tortor venenatis malesuada. Aenean consequat dui vitae nibh lobortis condimentum. Duis vel risus est"}],je=()=>s("div",{className:"lg:w-7/12",children:w(D,{defaultValue:"home",children:[s(R,{className:" bg-transparent p-0 border-b-2 border-gray-200 rounded-none",children:U.map((e,t)=>s(a.exports.Fragment,{children:w(C,{className:"capitalize   data-[state=active]:bg-transparent data-[state=active]:text-indigo-500 transition duration-150 before:transition-all before:duration-150 relative before:absolute before:left-1/2 before:-bottom-[5px] before:h-[2px] before:-translate-x-1/2 before:w-0 data-[state=active]:before:bg-indigo-500 data-[state=active]:before:w-full",value:e.title,children:[s(be,{icon:e.icon,className:"h-5 w-5 top-[1px] ltr:mr-[6px] rtl:ml-[6px] relative"}),e.title]})},t))}),U.map((e,t)=>s(a.exports.Fragment,{children:s(F,{value:e.title,children:e.content})},t*25))]})}),Je=()=>w("div",{className:" space-y-5",children:[s(A,{title:"Basic Tabs",code:ke,children:s(Ve,{})}),s(A,{title:"Border Bottom",code:Ge,children:s(Oe,{})}),s(A,{title:"Border Bottom with Icon",code:Ue,children:s(je,{})})]});export{Je as default};
