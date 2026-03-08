import{j as e,c as p}from"./index.bd1bbb16.js";import{c as n}from"./code-snippet.39c1ea2b.js";import{T as t}from"./Textinput.c230d328.js";import"./Card.38321d90.js";import"./toConsumableArray.e5b41f38.js";import"./cleave-phone.us.8c58ac6b.js";const r=()=>e(t,{placeholder:"Username",id:"bs_01",type:"text"}),i=`
import Textinput from "@/components/ui/Textinput";
const BasicInput = () => {
    return (
        <Textinput placeholder="Username" id="bs_01" type="text" />
    );
};
export default BasicInput;
`,a=`
import Textinput from "@/components/ui/Textinput";
const InputWithLabel = () => {
    return (
        <Textinput
            label="Username"
            id="bs1"
            type="text"
            placeholder="Username"
        />
    );
};
export default InputWithLabel;
`,s=`
import Textinput from "@/components/ui/Textinput";
const InputWithHelperText = () => {
    return (
        <Textinput
        type="text"
        placeholder="Username"
        description="This is Description"
      />
    );
};
export default InputWithHelperText;
`,o=`
import Textinput from "@/components/ui/Textinput";
const RoundedInput = () => {
    return (
        <Textinput
            type="text"
            placeholder="Username"
            className="rounded-[999px] px-4"
        />
    );
};
export default RoundedInput;
`,l=`
import Textinput from "@/components/ui/Textinput";
const InputWithSize = () => {
    return (
        <div className="space-y-5">
        <Textinput
          type="text"
          className="h-[32px] text-sm"
          placeholder="Username"
        />
        <Textinput id="bs_s" type="text" placeholder="Username" />
        <Textinput type="text" className="h-[52px]" placeholder="Username" />
      </div>
    );
};
export default InputWithSize;
`,u=`
import React from 'react';
import Textinput from "@/components/ui/Textinput";
const DisabledTextInput = () => {
    return (
        <Textinput disabled type="text" placeholder="Username" />
    );
};
export default DisabledTextInput;
`,d=`
import Textinput from "@/components/ui/Textinput";
const ReadOnlyTextInput = () => {
    return (
        <Textinput readonly type="text" placeholder="Username" />
    );
};
export default ReadOnlyTextInput;
`,c=`
import Textinput from "@/components/ui/Textinput";
const InputValidation = () => {
    const errorMessage = {
        message: "Username invalid state",
    };
    return (
        <div className="space-y-5">
            <Textinput
                type="text"
                placeholder="Username"
                validate="Username is valid state."
            />
            <Textinput type="text" placeholder="Username" error={errorMessage} />
        </div>
    );
};

export default InputValidation;
`,x=()=>e(t,{label:"Username",id:"bs1",type:"text",placeholder:"Username"}),m=()=>e(t,{type:"text",placeholder:"Username",description:"This is Description"}),h=()=>e(t,{type:"text",placeholder:"Username",className:"rounded-[999px] px-4"}),T=()=>p("div",{className:"space-y-5",children:[e(t,{type:"text",className:"h-[32px] text-sm",placeholder:"Username"}),e(t,{id:"bs_s",type:"text",placeholder:"Username"}),e(t,{type:"text",className:"h-[52px]",placeholder:"Username"})]}),I=()=>e(t,{disabled:!0,type:"text",placeholder:"Username"}),y=()=>e(t,{readonly:!0,type:"text",placeholder:"Username"}),U=()=>p("div",{className:"space-y-5",children:[e(t,{type:"text",placeholder:"Username",validate:"Username is valid state."}),e(t,{type:"text",placeholder:"Username",error:{message:"Username invalid state"}})]}),D=()=>p("div",{className:" space-y-5",children:[e(n,{title:"Basic Input Text",code:i,children:e(r,{})}),e(n,{title:"Label Text",code:a,children:e(x,{})}),e(n,{title:"Helper Text",code:s,children:e(m,{})}),e(n,{title:"Rounded Input",code:o,children:e(h,{})}),e(n,{title:"Input Size",code:l,children:e(T,{})}),e(n,{title:"Disabled Text Input",code:u,children:e(I,{})}),e(n,{title:"Readonly Text Input",code:d,children:e(y,{})}),e(n,{title:"Input Validation",code:c,children:e(U,{})})]});export{D as default};
