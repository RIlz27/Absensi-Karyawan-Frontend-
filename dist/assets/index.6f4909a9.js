import{c as e,j as t,B as n}from"./index.bd1bbb16.js";import{c as a}from"./code-snippet.39c1ea2b.js";import"./Card.38321d90.js";import"./toConsumableArray.e5b41f38.js";const s=()=>e("div",{className:"space-xy",children:[t(n,{text:"primary",className:"btn-primary "}),t(n,{text:"secondary",className:"btn-secondary"}),t(n,{text:"success",className:"btn-success"}),t(n,{text:"info",className:"btn-info"}),t(n,{text:"warning",className:"btn-warning"}),t(n,{text:"error",className:"btn-danger"}),t(n,{text:"Dark",className:"btn-dark"}),t(n,{text:"Light",className:"btn-light"})]}),o=`
import Button from "@/components/ui/Button'
const BasicButton = () => {
  return (
    <>
      <Button text="primary" className="btn-primary " />
      <Button text="secondary" className="btn-secondary" />
      <Button text="success" className="btn-success" />
      <Button text="info" className="btn-info" />
      <Button text="warning" className="btn-warning" />
      <Button text="error" className="btn-danger" />
      <Button text="Dark" className="btn-dark" />
      <Button text="Light" className="btn-light" />
    </>
  )
}
export default BasicButton
`,r=`
import Button from "@/components/ui/Button'
const RoundedButton = () => {
  return (
      <>
        <Button text="primary" className="btn-primary rounded-[999px] " />
        <Button text="secondary" className="btn-secondary rounded-[999px]" />
        <Button text="success" className="btn-success rounded-[999px]" />
        <Button text="info" className="btn-info rounded-[999px]" />
        <Button text="warning" className="btn-warning rounded-[999px]" />
        <Button text="error" className="btn-danger rounded-[999px]" />
        <Button text="Dark" className="btn-dark rounded-[999px]" />
        <Button text="Light" className="btn-light rounded-[999px]" />
      </>
  );
};

export default RoundedButton;
`,c=`
import Button from "@/components/ui/Button'
const OutlinedButton = () => {
  return (
      <>
       <Button text="primary" className="btn-outline-primary" />
       <Button text="secondary" className="btn-outline-secondary" />
       <Button text="success" className="btn-outline-success" />
       <Button text="info" className="btn-outline-info" />
       <Button text="warning" className="btn-outline-warning" />
       <Button text="error" className="btn-outline-danger" />
       <Button text="dark" className="btn-outline-dark" />
       <Button text="light" className="btn-outline-light" />
      </>
  );
};

export default OutlinedButton;
`,i=`
import Button from "@/components/ui/Button'
const SoftColorButton = () => {
  return (
    <>
       <Button text="primary" className="btn-primary " />
       <Button text="secondary" className="btn-secondary" />
       <Button text="success" className="btn-success" />
       <Button text="info" className="btn-info" />
       <Button text="warning" className="btn-warning" />
       <Button text="error" className="btn-danger" />
       <Button text="Dark" className="btn-dark" />
       <Button text="Light" className="btn-light" />
    </>
  );
};
export default SoftColorButton;
`,l=`
import Button from "@/components/ui/Button'
const GlowButton = () => {
  return (
  <>
    <Button text="primary" className="btn-primary hover:shadow-lg hover:shadow-indigo-500/50" />
    <Button text="secondary" className=" btn-secondary hover:shadow-lg hover:shadow-fuchsia-500/50" />
    <Button text="success" className=" btn-success hover:shadow-lg hover:shadow-green-500/50" />
    <Button text="info" className=" btn-info hover:shadow-lg hover:shadow-cyan-500/50" />
    <Button text="warning" className=" btn-warning hover:shadow-lg hover:shadow-yellow-500/50" />
    <Button text="error" className=" btn-danger hover:shadow-lg hover:shadow-red-500/50" />
    <Button text="Dark" className=" btn-dark hover:shadow-lg hover:shadow-gray-800/20" />
    <Button text="Light" className=" btn-light hover:shadow-lg hover:shadow-gray-400/30" />  
  </>
  )
}
export default GlowButton
`,u=`
import Button from "@/components/ui/Button'
const ButtonWithIcon = () => {
  return (
    <>
      <Button icon="ph:heart" text="Love" className="btn-primary" />
      <Button icon="ph:pentagram" text="Right Icon" className="btn-secondary" />
      <Button icon="ph:cloud-arrow-down" text="download" className="btn-info" iconPosition="right" />
      <Button icon="ph:trend-up" text="Right Icon" className="btn-warning" iconPosition="right" />
      <Button icon="ph:trash" className="btn-danger" text="Delate" iconPosition="right" />
    </>
  )
}
export default ButtonWithIcon
`,d=`
import Button from "@/components/ui/Button'
const IconButton = () => {
  return (
    <>
      <Button icon="ph:heart" className="btn-primary h-9 w-9 rounded-full p-0" />
      <Button icon="ph:pentagram" className="btn-secondary h-9 w-9 rounded-full p-0" />
      <Button icon="ph:cloud-arrow-down" className="btn-info h-9 w-9 p-0 " />
      <Button icon="ph:trend-up" className="btn-warning h-9 w-9  p-0" />
      <Button icon="ph:trash" className="btn-danger h-9 w-9  p-0" />
    </>
  )
}
export default IconButton
`,m=`
import Button from "@/components/ui/Button'
const ButtonSizes = () => {
  return (
    <> 
      <Button text="Button" className="btn-primary px-3 h-6 text-xs " />
      <Button text="Button" className="btn-primary h-8 px-4 text-[13px]" />
      <Button text="Button" className="btn-primary " />
      <Button text="Button" className="btn-primary  h-11  text-base" />
      <Button text="Button" className="btn-primary  h-12  text-base" />
    </>
  )
}
export default ButtonSizes
`,x=`
import Button from "@/components/ui/Button'
const ButtonDisabled = () => {
  return (
    <>  
     <Button text="primary" className="btn-primary " disabled />
     <Button text="secondary" className=" btn-secondary" disabled />
     <Button text="success" className=" btn-success" disabled />
     <Button text="info" className=" btn-info" disabled />
     <Button text="warning" className=" btn-warning" disabled />
     <Button text="error" className=" btn-danger" disabled />
     <Button text="Dark" className=" btn-dark" disabled />
     <Button text="Light" className=" btn-light" disabled /> 
    </>
  )
}
export default ButtonDisabled
`,h=`
import Button from "@/components/ui/Button'
const ButtonLoading = () => {
  return (
    <>
     <Button text="primary" className="btn-primary " isLoading />
     <Button text="secondary" className=" btn-secondary" isLoading />
     <Button text="success" className=" btn-success" isLoading />
     <Button text="info" className=" btn-info" isLoading />
     <Button text="warning" className=" btn-warning" isLoading />
     <Button text="error" className=" btn-danger" isLoading />
     <Button text="Dark" className=" btn-dark" isLoading />
     <Button text="Light" className=" btn-light" isLoading />
    </>
  )
}
export default ButtonLoading
`,b=()=>e("div",{className:"space-xy",children:[t(n,{text:"primary",className:"btn-primary rounded-[999px] "}),t(n,{text:"secondary",className:"btn-secondary rounded-[999px]"}),t(n,{text:"success",className:"btn-success rounded-[999px]"}),t(n,{text:"info",className:"btn-info rounded-[999px]"}),t(n,{text:"warning",className:"btn-warning rounded-[999px]"}),t(n,{text:"error",className:"btn-danger rounded-[999px]"}),t(n,{text:"Dark",className:"btn-dark rounded-[999px]"}),t(n,{text:"Light",className:"btn-light rounded-[999px]"})]}),N=()=>e("div",{className:"space-xy",children:[t(n,{text:"primary",className:"btn-outline-primary"}),t(n,{text:"secondary",className:"btn-outline-secondary"}),t(n,{text:"success",className:"btn-outline-success"}),t(n,{text:"info",className:"btn-outline-info"}),t(n,{text:"warning",className:"btn-outline-warning"}),t(n,{text:"error",className:"btn-outline-danger"}),t(n,{text:"dark",className:"btn-outline-dark"}),t(n,{text:"light",className:"btn-outline-light"})]}),p=()=>e("div",{className:"space-xy",children:[t(n,{text:"primary",className:"btn-primary "}),t(n,{text:"secondary",className:"btn-secondary"}),t(n,{text:"success",className:"btn-success"}),t(n,{text:"info",className:"btn-info"}),t(n,{text:"warning",className:"btn-warning"}),t(n,{text:"error",className:"btn-danger"}),t(n,{text:"Dark",className:"btn-dark"}),t(n,{text:"Light",className:"btn-light"})]}),B=()=>e("div",{className:"space-xy",children:[t(n,{text:"primary",className:"btn-primary hover:shadow-lg hover:shadow-indigo-500/50"}),t(n,{text:"secondary",className:" btn-secondary hover:shadow-lg hover:shadow-fuchsia-500/50"}),t(n,{text:"success",className:" btn-success hover:shadow-lg hover:shadow-green-500/50"}),t(n,{text:"info",className:" btn-info hover:shadow-lg hover:shadow-cyan-500/50"}),t(n,{text:"warning",className:" btn-warning hover:shadow-lg hover:shadow-yellow-500/50"}),t(n,{text:"error",className:" btn-danger hover:shadow-lg hover:shadow-red-500/50"}),t(n,{text:"Dark",className:" btn-dark hover:shadow-lg hover:shadow-gray-800/20"}),t(n,{text:"Light",className:" btn-light hover:shadow-lg hover:shadow-gray-400/30"})]}),g=()=>e("div",{className:"space-xy flex items-center",children:[t(n,{icon:"ph:heart",text:"Love",className:"btn-primary"}),t(n,{icon:"ph:pentagram",text:"Right Icon",className:"btn-secondary"}),t(n,{icon:"ph:cloud-arrow-down",text:"download",className:"btn-info",iconPosition:"right"}),t(n,{icon:"ph:trend-up",text:"Right Icon",className:"btn-warning",iconPosition:"right"}),t(n,{icon:"ph:trash",className:"btn-danger",text:"Delate",iconPosition:"right"})]}),y=()=>e("div",{className:"space-xy flex items-center",children:[t(n,{icon:"ph:heart",className:"btn-primary h-9 w-9 rounded-full p-0"}),t(n,{icon:"ph:pentagram",className:"btn-secondary h-9 w-9 rounded-full p-0"}),t(n,{icon:"ph:cloud-arrow-down",className:"btn-info h-9 w-9 p-0 "}),t(n,{icon:"ph:trend-up",className:"btn-warning h-9 w-9  p-0"}),t(n,{icon:"ph:trash",className:"btn-danger h-9 w-9  p-0"})]}),w=()=>e("div",{className:"space-xy",children:[t(n,{text:"Button",className:"btn-primary px-3 h-6 text-xs "}),t(n,{text:"Button",className:"btn-primary h-8 px-4 text-[13px]"}),t(n,{text:"Button",className:"btn-primary "}),t(n,{text:"Button",className:"btn-primary  h-11  text-base"}),t(n,{text:"Button",className:"btn-primary  h-12  text-base"})]}),f=()=>e("div",{className:"space-xy",children:[t(n,{text:"primary",className:"btn-primary ",disabled:!0}),t(n,{text:"secondary",className:" btn-secondary",disabled:!0}),t(n,{text:"success",className:" btn-success",disabled:!0}),t(n,{text:"info",className:" btn-info",disabled:!0}),t(n,{text:"warning",className:" btn-warning",disabled:!0}),t(n,{text:"error",className:" btn-danger",disabled:!0}),t(n,{text:"Dark",className:" btn-dark",disabled:!0}),t(n,{text:"Light",className:" btn-light",disabled:!0})]}),v=()=>e("div",{className:"space-xy",children:[t(n,{text:"primary",className:"btn-primary ",isLoading:!0}),t(n,{text:"secondary",className:" btn-secondary",isLoading:!0}),t(n,{text:"success",className:" btn-success",isLoading:!0}),t(n,{text:"info",className:" btn-info",isLoading:!0}),t(n,{text:"warning",className:" btn-warning",isLoading:!0}),t(n,{text:"error",className:" btn-danger",isLoading:!0}),t(n,{text:"Dark",className:" btn-dark",isLoading:!0}),t(n,{text:"Light",className:" btn-light",isLoading:!0})]}),S=()=>e("div",{className:"space-y-5",children:[t(a,{title:"Button",code:o,children:t(s,{})}),t(a,{title:"Rounded Button",code:r,children:t(b,{})}),t(a,{title:"Outlined Button",code:c,children:t(N,{})}),t(a,{title:"Outlined Button",code:i,children:t(p,{})}),t(a,{title:"Glow buttons",code:l,children:t(B,{})}),t(a,{title:"Button With Icon",code:u,children:t(g,{})}),t(a,{title:"Button Only Icon",code:d,children:t(y,{})}),t(a,{title:"Button Size",code:m,children:t(w,{})}),t(a,{title:"Disabled",code:x,children:t(f,{})}),t(a,{title:"Loading",code:h,children:t(v,{})})]});export{S as default};
