import{c as t,j as e}from"./index.1873308f.js";import{c as r}from"./code-snippet.32d5dd98.js";import{I as p}from"./InputGroup.70c472d8.js";import"./Card.4b3fb845.js";import"./toConsumableArray.e5b41f38.js";import"./cleave-phone.us.3bd1f2ed.js";const n=()=>t("div",{className:" space-y-4",children:[e(p,{type:"text",label:"Prepend Addon",placeholder:"Username",prepend:"@"}),e(p,{type:"text",placeholder:"Username",label:"Append Addon",append:"@facebook.com"}),e(p,{type:"text",placeholder:"Username",label:"Between input:",prepend:"$",append:"120"})]}),o=`
import InputGroup from "@/components/ui/InputGroup";
const BasicInputGroup = () => {
    return (
        <div className=" space-y-4">
            <InputGroup
                type="text"
                label="Prepend Addon"
                placeholder="Username"
                prepend="@"
            />
            <InputGroup
                type="text"
                placeholder="Username"
                label="Append Addon"
                append="@facebook.com"
            />
            <InputGroup
                type="text"
                placeholder="Username"
                label="Between input:"
                prepend="$"
                append="120"
            />
        </div>
    );
};
export default BasicInputGroup;
`,d=`
import InputGroup from "@/components/ui/InputGroup";
const BasicInputGroup = () => {
    return (
        <>
        <InputGroup
                type="text"
                label="Prepend Addon"
                placeholder="Username"
                prepend="@"
                merged
            />
            <InputGroup
                type="text"
                placeholder="Username"
                label="Append Addon"
                append="@facebook.com"
                merged
            />
            <InputGroup
                type="text"
                placeholder="Username"
                label="Between input:"
                prepend="$"
                append="120"
                merged
            />
        </>
    );
};
export default BasicInputGroup;
`,a=()=>t("div",{className:" space-y-4",children:[e(p,{type:"text",label:"Prepend Addon",placeholder:"Username",prepend:"@",merged:!0}),e(p,{type:"text",placeholder:"Username",label:"Append Addon",append:"@facebook.com",merged:!0}),e(p,{type:"text",placeholder:"Username",label:"Between input:",prepend:"$",append:"120",merged:!0})]}),I=()=>t("div",{className:" space-y-5",children:[e(r,{title:"Input Group",code:o,children:e(n,{})}),e(r,{title:"Merged Addon",code:d,children:e(a,{})})]});export{I as default};
