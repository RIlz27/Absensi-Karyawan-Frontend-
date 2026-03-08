import{r as q,c as p,j as e,I as m}from"./index.bd1bbb16.js";import{C as b}from"./cleave-phone.us.8c58ac6b.js";const F=({type:s,label:N,placeholder:i,classLabel:k="form-label",className:a="",classGroup:A="",register:v,name:t,readonly:o,value:B,error:l,icon:C,disabled:u,id:c,horizontal:d,validate:n,isMask:x,description:w,hasicon:I,onChange:f,merged:j,append:h,prepend:$,options:g,onFocus:y,...O})=>{const[r,G]=q.exports.useState(!1),S=()=>{G(!r)};return p("div",{className:`  ${d?"flex":""} 
      ${j?"merged":""}  `,children:[N&&e("label",{htmlFor:c,className:`block capitalize ${k}  ${d?"flex-0 mr-6 md:w-[100px] w-[60px] break-words":""}`,children:N}),p("div",{className:`flex items-stretch inputGroup 
      
        
    ${h?"has-append":""}
    ${$?"has-prepend":""}

    ${l?"is-invalid":""}  ${n?"is-valid":""}
    
   
    ${d?"flex-1":""}
      `,children:[$&&e("span",{className:"flex-none input-group-addon",children:e("div",{className:"input-group-text  h-full prepend-slot",children:$})}),e("div",{className:"flex-1",children:p("div",{className:`relative textfiled-wrapper2
          ${l?"is-error":""} 
           ${n?"is-valid":""}
          `,children:[t&&!x&&e("input",{type:s==="password"&&r===!0?"text":s,...v(t),...O,className:`${l?" is-error":" "} input-group-control block w-full focus:outline-none py-[10px] ${a}  `,placeholder:i,readOnly:o,disabled:u,id:c,onChange:f}),!t&&!x&&e("input",{type:s==="password"&&r===!0?"text":s,className:`input-group-control block w-full focus:outline-none py-[10px] ${a}`,placeholder:i,readOnly:o,disabled:u,onChange:f,id:c}),t&&x&&e(b,{...v(t),...O,placeholder:i,options:g,className:`${l?" is-error":" "} input-group-control w-full py-[10px] ${a}  `,onFocus:y,id:c,readOnly:o,disabled:u,onChange:f}),!t&&x&&e(b,{placeholder:i,options:g,className:`${l?" is-error":" "} input-group-control w-full py-[10px] ${a}  `,onFocus:y,id:c,readOnly:o,disabled:u,onChange:f}),p("div",{className:"flex text-xl absolute ltr:right-[14px] rtl:left-[14px] top-1/2 -translate-y-1/2  space-x-1 rtl:space-x-reverse",children:[I&&p("span",{className:"cursor-pointer text-gray-400",onClick:S,children:[r&&s==="password"&&e(m,{icon:"heroicons-outline:eye"}),!r&&s==="password"&&e(m,{icon:"heroicons-outline:eye-off"})]}),l&&e("span",{className:"text-red-500",children:e(m,{icon:"ph:info-fill"})}),n&&e("span",{className:"text-green-500",children:e(m,{icon:"ph:check-circle-fill"})})]})]})}),h&&e("span",{className:"flex-none input-group-addon right",children:e("div",{className:"input-group-text  h-full append-slot",children:h})})]}),l&&e("div",{className:"mt-2 text-red-500 block text-sm",children:l.message}),n&&e("div",{className:"mt-2 text-green-500 block text-sm",children:n}),w&&e("span",{className:"input-help",children:w})]})};export{F as I};
