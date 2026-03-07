import{c as l}from"./code-snippet.7410407c.js";import{r as c,c as o,j as e,F as r}from"./index.61864e9c.js";import{S as a}from"./Select.13aec37e.js";import"./Card.bdfefdbc.js";import"./toConsumableArray.e5b41f38.js";const u=[{value:"option1",label:"Option 1"},{value:"option2",label:"Option 2"},{value:"option3",label:"Option 3"}],d=()=>{const[t,n]=c.exports.useState("");return o("div",{className:"space-y-3",children:[e(a,{options:u,onChange:s=>{n(s.target.value)},value:t}),o("div",{className:"text-base",children:[e("span",{className:"text-gray-500 dark:text-gray-300 inline-block mr-3",children:"Selected value:"}),e("span",{className:"text-gray-900 dark:text-gray-300 font-medium",children:t})]})]})},m=`
import React, { useState } from 'react';
import Select from "@/components/ui/Select";
const options = [
    {
      value: "option1",
      label: "Option 1",
    },
    {
      value: "option2",
      label: "Option 2",
    },
    {
      value: "option3",
      label: "Option 3",
    },
  ];
const BasicSelect = () => {
    const [value, setValue] = useState("");
    const handleChange = (e) => {
        setValue(e.target.value);
      };
    return (
        <>
          <Select options={options} onChange={handleChange} value={value} />
          <div className="text-base">
            <span className="text-gray-500 dark:text-gray-300 inline-block mr-3">
              Selected value:
            </span>
            <span className="text-gray-900 dark:text-gray-300 font-medium">
              {value}
            </span>
          </div>
        </>
    );
};

export default BasicSelect;
`,v=`
 import React, { useState } from 'react';
 import Select from "@/components/ui/Select";
const SizeSelect = () => {
    const options = [
        {
            value: "option1",
            label: "Option 1",
        },
        {
            value: "option2",
            label: "Option 2",
        },
        {
            value: "option3",
            label: "Option 3",
        },
    ];
    const [value2, setValue2] = useState("");
    const handleChange2 = (e) => {
        setValue2(e.target.value);
    };
    return (
        <>
        <div className="space-y-3">
        <Select
            options={options}
            onChange={handleChange2}
            value={value2}
            size={5}
        />
        <div className="text-base">
            <span className="text-gray-500 dark:text-gray-300 inline-block mr-3">
                Selected value:
            </span>
            <span className="text-gray-900 dark:text-gray-300 font-medium">
                {value2}
            </span>
        </div>
    </div>
        </>
    );
};

export default SizeSelect;
`,S=`
import Select from "@/components/ui/Select";
const MultipleSelect = () => {
    const options = [
        {
          value: "option1",
          label: "Option 1",
        },
        {
          value: "option2",
          label: "Option 2",
        },
        {
          value: "option3",
          label: "Option 3",
        },
      ];
    return (
        <>
            <Select options={options} size={5} multiple />
        </>
    );
};

export default MultipleSelect;
`,b=`
import Select from "@/components/ui/Select";
const RoundedSelect = () => {
    const options = [
        {
          value: "option1",
          label: "Option 1",
        },
        {
          value: "option2",
          label: "Option 2",
        },
        {
          value: "option3",
          label: "Option 3",
        },
      ];
    return (
        <>
           <Select options={options} className=" rounded-[99px]" />
        </>
    );
};

export default RoundedSelect;
`,h=`
import Select from "@/components/ui/Select";
const DisabledSelect = () => {
    const options = [
        {
            value: "option1",
            label: "Option 1",
        },
        {
            value: "option2",
            label: "Option 2",
        },
        {
            value: "option3",
            label: "Option 3",
        },
    ];
    return (
        <Select options={options} disabled />
    );
};

export default DisabledSelect;
`,g=()=>{const t=[{value:"option1",label:"Option 1"},{value:"option2",label:"Option 2"},{value:"option3",label:"Option 3"}],[n,i]=c.exports.useState("");return o("div",{className:"space-y-3",children:[e(a,{options:t,onChange:p=>{i(p.target.value)},value:n,size:5}),o("div",{className:"text-base",children:[e("span",{className:"text-gray-500 dark:text-gray-300 inline-block mr-3",children:"Selected value:"}),e("span",{className:"text-gray-900 dark:text-gray-300 font-medium",children:n})]})]})},x=()=>e(r,{children:e(a,{options:[{value:"option1",label:"Option 1"},{value:"option2",label:"Option 2"},{value:"option3",label:"Option 3"}],size:5,multiple:!0})}),O=()=>e(a,{options:[{value:"option1",label:"Option 1"},{value:"option2",label:"Option 2"},{value:"option3",label:"Option 3"}],className:" rounded-[99px]"}),f=()=>e(a,{options:[{value:"option1",label:"Option 1"},{value:"option2",label:"Option 2"},{value:"option3",label:"Option 3"}],disabled:!0}),R=()=>o("div",{className:" space-y-5",children:[e(l,{title:"Basic Select",code:m,children:e(d,{})}),e(l,{title:"Size Select",code:v,children:e(g,{})}),e(l,{title:"Multipie Select",code:S,children:e(x,{})}),e(l,{title:"Rounded  Select",code:b,children:e(O,{})}),e(l,{title:"disabled  Select",code:h,children:e(f,{})})]});export{R as default};
