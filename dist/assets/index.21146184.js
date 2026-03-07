import{r as c,j as a,ak as g,c as n}from"./index.27cd9fa4.js";import{c as t}from"./code-snippet.8e057535.js";import"./Card.e7cd9ee8.js";import"./toConsumableArray.e5b41f38.js";const d=()=>{const[r,o]=c.exports.useState("blue-500"),l=[{value:"blue-500",label:"Default & Primary",activeClass:"ring-offset-indigo-500 border-indigo-500",className:"group-hover:border-indigo-500"},{value:"gray-500",label:"Secondary",activeClass:"ring-offset-fuchsia-500 border-fuchsia-500",className:" group-hover:border-fuchsia-500"},{value:"green-500",label:"Success",activeClass:"ring-offset-green-500 border-green-500",className:" group-hover:border-green-500"},{value:"red-500",label:"Danger",activeClass:"ring-offset-red-500 border-red-500",className:" group-hover:border-red-500"},{value:"yellow-500",label:"Warning",activeClass:"ring-offset-yellow-500 border-yellow-500",className:" group-hover:border-yellow-500"},{value:"cyan-500",label:"Info",activeClass:"ring-offset-cyan-500 border-cyan-500",className:" group-hover:border-cyan-500"}],i=e=>{o(e.target.value)};return a("div",{className:"flex flex-wrap space-xy",children:l.map((e,s)=>a(g,{label:e.label,name:"color",value:e.value,checked:r===e.value,onChange:i,activeClass:e.activeClass,className:e.className},`${s}-fst`))})},f=`
import React, { useState } from 'react';
import Radio from "@/components/ui/Radio";
const BasicRadio = () => {
    const [selectColor, setSelectColor] = useState("blue-500");
    const colors = [
        {
            value: "blue-500",
            label: "Default & Primary",
            activeClass: "ring-offset-indigo-500 border-indigo-500",
            className: "group-hover:border-indigo-500",
        },
        {
            value: "gray-500",
            label: "Secondary",
            activeClass: "ring-offset-fuchsia-500 border-fuchsia-500",
            className: " group-hover:border-fuchsia-500",
        },
        {
            value: "green-500",
            label: "Success",
            activeClass: "ring-offset-green-500 border-green-500",
            className: " group-hover:border-green-500",
        },
        {
            value: "red-500",
            label: "Danger",
            activeClass: "ring-offset-red-500 border-red-500",
            className: " group-hover:border-red-500",
        },
        {
            value: "yellow-500",
            label: "Warning",
            activeClass: "ring-offset-yellow-500 border-yellow-500",
            className: " group-hover:border-yellow-500",
        },
        {
            value: "cyan-500",
            label: "Info",
            activeClass: "ring-offset-cyan-500 border-cyan-500",
            className: " group-hover:border-cyan-500",
        },
    ];
    const handleColor = (e) => {
        setSelectColor(e.target.value);
    };
    return (
        <>
            {colors.map((color, i) => (
                <Radio
                    key={\`\${ i }-fst\`}
                    label={color.label}
                    name="color"
                    value={color.value}
                    checked={selectColor === color.value}
                    onChange={handleColor}
                    activeClass={color.activeClass}
                    className={color.className}
                />
            ))}
        </>
    );
};

export default BasicRadio;
`,u=`
import React, { useState } from 'react';
import Radio from "@/components/ui/Radio";
const OutlineRadio = () => {
    const [selectColor2, setSelectColor2] = useState("blue-500");
    const handleColor2 = (e) => {
        setSelectColor2(e.target.value);
    };
    const colors2 = [
        {
            value: "blue-500",
            label: "Primary",
            activeClass:
                "ring-offset-0 border-indigo-500 ring-[5px]  !bg-indigo-500   dark:ring-offset-gray-800 dark:ring-offset-[5px]",
            className: " group-hover:border-indigo-500",
        },
        {
            value: "gray-500",
            label: "Secondary",
            activeClass:
                "ring-offset-0 border-fuchsia-500 ring-[5px]  !bg-fuchsia-500   dark:ring-offset-gray-800 dark:ring-offset-[5px]",
            className: " group-hover:border-fuchsia-500",
        },
        {
            value: "green-500",
            label: "Success",
            activeClass:
                "ring-offset-0 border-green-500 ring-[5px]  !bg-green-500   dark:ring-offset-gray-800 dark:ring-offset-[5px]",
            className: " group-hover:border-green-500",
        },
        {
            value: "red-500",
            label: "Danger",
            activeClass:
                "ring-offset-0 border-red-500 ring-[5px]  !bg-red-500   dark:ring-offset-gray-800 dark:ring-offset-[5px]",
            className: " group-hover:border-red-500",
        },
        {
            value: "yellow-500",
            label: "Warning",
            activeClass:
                "ring-offset-0 border-yellow-500 ring-[5px]  !bg-yellow-500   dark:ring-offset-gray-800 dark:ring-offset-[5px]",
            className: " group-hover:border-yellow-500",
        },
        {
            value: "cyan-500",
            label: "Info",
            activeClass:
                "ring-offset-0 border-cyan-500 ring-[5px]  !bg-cyan-500   dark:ring-offset-gray-800 dark:ring-offset-[5px]",
            className: " group-hover:border-cyan-500",
        },
    ];
    return (
        <div className="flex flex-wrap space-xy">
            {colors2.map((color, i) => (
                <Radio
                    key={\`\${i}-mst\`}
                    label={color.label}
                    name="color"
                    value={color.value}
                    checked={selectColor2 === color.value}
                    onChange={handleColor2}
                    activeClass={color.activeClass}
                    className={color.className}
                />
            ))}
        </div>
    );
};

export default OutlineRadio;
`,v=()=>{const[r,o]=c.exports.useState("blue-500"),l=e=>{o(e.target.value)};return a("div",{className:"flex flex-wrap space-xy",children:[{value:"blue-500",label:"Primary",activeClass:"ring-offset-0 border-indigo-500 ring-[5px]  !bg-indigo-500   dark:ring-offset-gray-800 dark:ring-offset-[5px]",className:" group-hover:border-indigo-500"},{value:"gray-500",label:"Secondary",activeClass:"ring-offset-0 border-fuchsia-500 ring-[5px]  !bg-fuchsia-500   dark:ring-offset-gray-800 dark:ring-offset-[5px]",className:" group-hover:border-fuchsia-500"},{value:"green-500",label:"Success",activeClass:"ring-offset-0 border-green-500 ring-[5px]  !bg-green-500   dark:ring-offset-gray-800 dark:ring-offset-[5px]",className:" group-hover:border-green-500"},{value:"red-500",label:"Danger",activeClass:"ring-offset-0 border-red-500 ring-[5px]  !bg-red-500   dark:ring-offset-gray-800 dark:ring-offset-[5px]",className:" group-hover:border-red-500"},{value:"yellow-500",label:"Warning",activeClass:"ring-offset-0 border-yellow-500 ring-[5px]  !bg-yellow-500   dark:ring-offset-gray-800 dark:ring-offset-[5px]",className:" group-hover:border-yellow-500"},{value:"cyan-500",label:"Info",activeClass:"ring-offset-0 border-cyan-500 ring-[5px]  !bg-cyan-500   dark:ring-offset-gray-800 dark:ring-offset-[5px]",className:" group-hover:border-cyan-500"}].map((e,s)=>a(g,{label:e.label,name:"color",value:e.value,checked:r===e.value,onChange:l,activeClass:e.activeClass,className:e.className},`${s}-mst`))})},h=()=>{const[r,o]=c.exports.useState("Orange"),l=e=>{o(e.target.value)};return n("div",{className:"space-y-5 ",children:[a(t,{title:"Basic Radio",code:f,children:a(d,{})}),a(t,{title:"Outline Radio",code:u,children:a(v,{})}),a(t,{title:"disabled Radio "}),n(t,{title:"Radio Model",children:[a("div",{className:"flex flex-wrap space-xy",children:[{value:"Orange",label:"Orange"},{value:"Apple",label:"Apple"},{value:"Banana",label:"Banana"}].map((e,s)=>a(g,{label:e.label,name:"option",value:e.value,checked:r===e.value,onChange:l},`${s}-lst`))}),r&&n("div",{className:"mt-3",children:[a("span",{className:"text-sm text-gray-400 ",children:"Selected Option: "}),a("span",{className:"text-sm text-gray-700 dark:text-gray-100",children:r})]})]})]})};export{h as default};
