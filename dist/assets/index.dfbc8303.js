import{r as t,c as b,j as e,a3 as a}from"./index.1873308f.js";import{c as p}from"./code-snippet.32d5dd98.js";import"./Card.4b3fb845.js";import"./toConsumableArray.e5b41f38.js";const f=()=>{const[i,x]=t.exports.useState(!0),[d,S]=t.exports.useState(!0),[n,C]=t.exports.useState(!0),[r,v]=t.exports.useState(!0),[c,u]=t.exports.useState(!0),[s,g]=t.exports.useState(!0);return b("div",{className:"flex flex-wrap space-xy",children:[e(a,{label:"Default & Primary",value:i,onChange:()=>x(!i)}),e(a,{label:"secondary",activeClass:"bg-fuchsia-500",value:d,onChange:()=>S(!d)}),e(a,{label:"success",activeClass:"bg-green-500",value:n,onChange:()=>C(!n)}),e(a,{label:"danger",activeClass:"bg-red-500",value:r,onChange:()=>v(!r)}),e(a,{label:"warning",activeClass:"bg-yellow-500",value:c,onChange:()=>u(!c)}),e(a,{label:"info",activeClass:"bg-cyan-500",value:s,onChange:()=>g(!s)})]})},y=`
import React, { useState } from 'react';
import Switch from "@/components/ui/Switch";
const BasicSwitch = () => {
    const [checked, setChecked] = useState(true);
    const [checked6, setChecked6] = useState(true);
    const [checked7, setChecked7] = useState(true);
    const [checked8, setChecked8] = useState(true);
    const [checked9, setChecked9] = useState(true);
    const [checked10, setChecked10] = useState(true);
    return (
        <div className="flex flex-wrap space-xy">
            <Switch
                label="Default & Primary"
                value={checked}
                onChange={() => setChecked(!checked)}
            />

            <Switch
                label="secondary"
                activeClass="bg-fuchsia-500"
                value={checked6}
                onChange={() => setChecked6(!checked6)}
            />
            <Switch
                label="success"
                activeClass="bg-green-500"
                value={checked7}
                onChange={() => setChecked7(!checked7)}
            />
            <Switch
                label="danger"
                activeClass="bg-red-500"
                value={checked8}
                onChange={() => setChecked8(!checked8)}
            />
            <Switch
                label="warning"
                activeClass="bg-yellow-500"
                value={checked9}
                onChange={() => setChecked9(!checked9)}
            />
            <Switch
                label="info"
                activeClass="bg-cyan-500"
                value={checked10}
                onChange={() => setChecked10(!checked10)}
            />
        </div>
    );
};
export default BasicSwitch;
`,P=()=>{const[i,x]=t.exports.useState(!0),[d,S]=t.exports.useState(!1),[n,C]=t.exports.useState(!0),[r,v]=t.exports.useState(!0),[c,u]=t.exports.useState(!0),[s,g]=t.exports.useState(!0),[h,w]=t.exports.useState(!0),[l,k]=t.exports.useState(!0),[o,m]=t.exports.useState(!0);return b("div",{className:"space-y-5",children:[e(p,{title:"Basic Switch",code:y,children:e(f,{})}),e(p,{title:"Outline Switch",children:b("div",{className:"flex flex-wrap space-xy",children:[e(a,{label:"Default & primary",outline:!0,activeClass:"border-gray-500",value:i,onChange:()=>x(!i)}),e(a,{label:"secondary",outline:!0,activeClass:"border-fuchsia-500",activeThumb:"bg-fuchsia-500",value:c,onChange:()=>u(!c)}),e(a,{label:"success",outline:!0,activeClass:"border-green-500",activeThumb:"bg-green-500",value:s,onChange:()=>g(!s)}),e(a,{label:"danger",outline:!0,activeClass:"border-red-500",activeThumb:"bg-red-500",value:h,onChange:()=>w(!h)}),e(a,{label:"warning",outline:!0,activeClass:"border-yellow-500",activeThumb:"bg-yellow-500",value:l,onChange:()=>k(!l)}),e(a,{label:"info",outline:!0,activeClass:"border-cyan-500",activeThumb:"bg-cyan-500",value:o,onChange:()=>m(!o)})]})}),e(p,{title:"Switch With Text & Icon  ",children:b("div",{className:"flex flex-wrap space-xy",children:[e(a,{label:"primary",activeClass:"bg-indigo-500",value:r,onChange:()=>v(!r),badge:!0}),e(a,{label:"secondary",activeClass:"bg-fuchsia-500",value:c,onChange:()=>u(!c),badge:!0}),e(a,{label:"success",activeClass:"bg-green-500",value:s,onChange:()=>g(!s),badge:!0}),e(a,{label:"danger",activeClass:"bg-red-500",value:h,onChange:()=>w(!h),badge:!0}),e(a,{label:"warning",activeClass:"bg-yellow-500",value:l,onChange:()=>k(!l),badge:!0}),e(a,{label:"info",activeClass:"bg-cyan-500",value:o,onChange:()=>m(!o),badge:!0}),e(a,{label:"primary",activeClass:"bg-indigo-500",value:r,onChange:()=>v(!r),badge:!0,prevIcon:"ph:speaker-high",nextIcon:"ph:speaker-slash"}),e(a,{label:"secondary",activeClass:"bg-fuchsia-500",value:c,onChange:()=>u(!c),badge:!0,prevIcon:"ph:check",nextIcon:"ph:x"}),e(a,{label:"success",activeClass:"bg-green-500",value:s,onChange:()=>g(!s),badge:!0,prevIcon:"ph:sun-horizon",nextIcon:"ph:moon-stars"}),e(a,{label:"danger",activeClass:"bg-red-500",value:h,onChange:()=>w(!h),badge:!0,prevIcon:"ph:lock-simple",nextIcon:"ph:lock-simple-open"}),e(a,{label:"warning",activeClass:"bg-yellow-500",value:l,onChange:()=>k(!l),badge:!0,prevIcon:"ph:shield-check",nextIcon:"ph:bandaids"}),e(a,{label:"info",activeClass:"bg-cyan-500",value:o,onChange:()=>m(!o),badge:!0,prevIcon:"ph:bandaids",nextIcon:"ph:phone-slash"})]})}),e(p,{title:"Disabled Switch ",children:b("div",{className:"flex space-x-4 rtl:space-x-reverse",children:[e(a,{label:"Default",disabled:!0,value:d,onChange:()=>S(!d)}),e(a,{label:"Primary",disabled:!0,value:n,activeClass:"bg-indigo-500",onChange:()=>C(!n)}),e(a,{label:"Primary Outline",outline:!0,disabled:!0,value:n,activeClass:"border-indigo-500",activeThumb:"bg-indigo-500",onChange:()=>C(!n)}),e(a,{label:"warning",activeClass:"bg-yellow-400",value:l,onChange:()=>k(!l),badge:!0,disabled:!0,prevIcon:"ph:shield-check",nextIcon:"ph:bandaids"})]})})]})};export{P as default};
