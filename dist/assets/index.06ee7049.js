import{c as g}from"./code-snippet.32d5dd98.js";import{r as c,c as b,j as e,F as v}from"./index.1873308f.js";import{C as a}from"./Checkbox.465c1648.js";import"./Card.4b3fb845.js";import"./toConsumableArray.e5b41f38.js";const x=()=>{const[s,t]=c.exports.useState(!0),[l,o]=c.exports.useState(!1),[r,u]=c.exports.useState(!1),[d,k]=c.exports.useState(!1),[h,C]=c.exports.useState(!1),[n,i]=c.exports.useState(!1);return b("div",{className:"flex flex-wrap space-xy-6",children:[e(a,{label:"Default & Primary",value:s,onChange:()=>t(!s)}),e(a,{label:"Secondary",value:l,activeClass:"border-fuchsia-500 bg-fuchsia-500",className:" group-hover:border-fuchsia-500",onChange:()=>o(!l)}),e(a,{label:"Success",value:r,activeClass:"border-green-500 bg-green-500",className:" group-hover:border-green-500",onChange:()=>u(!r)}),e(a,{label:"Danger",value:d,activeClass:"border-red-500 bg-red-500",className:" group-hover:border-red-500",onChange:()=>k(!d)}),e(a,{label:"Warning",value:h,activeClass:"border-yellow-500 bg-yellow-500",className:" group-hover:border-yellow-500",onChange:()=>C(!h)}),e(a,{label:"Info",value:n,activeClass:"border-cyan-500 bg-cyan-500",className:" group-hover:border-cyan-500",onChange:()=>i(!n)})]})},p=()=>{const[s,t]=c.exports.useState(!0);c.exports.useState(!1);const[l,o]=c.exports.useState(!1),[r,u]=c.exports.useState(!1),[d,k]=c.exports.useState(!1),[h,C]=c.exports.useState(!1),[n,i]=c.exports.useState(!1);return b("div",{className:"flex flex-wrap space-xy-6",children:[e(a,{label:"Default & Primary",value:s,className:"!rounded-full group-hover:border-indigo-500",onChange:()=>t(!s)}),e(a,{label:"Secondary",value:l,className:"!rounded-full group-hover:border-fuchsia-500",activeClass:"border-fuchsia-500 bg-fuchsia-500",onChange:()=>o(!l)}),e(a,{label:"Success",value:r,className:"!rounded-full group-hover:border-green-500",activeClass:"border-green-500 bg-green-500",onChange:()=>u(!r)}),e(a,{label:"Danger",value:d,className:"!rounded-full group-hover:border-red-500",activeClass:"border-red-500 bg-red-500",onChange:()=>k(!d)}),e(a,{label:"Warning",value:h,className:"!rounded-full group-hover:border-yellow-500",activeClass:"border-yellow-500 bg-yellow-500",onChange:()=>C(!h)}),e(a,{label:"Info",value:n,className:"!rounded-full group-hover:border-cyan-500",activeClass:"border-cyan-500 bg-cyan-500",onChange:()=>i(!n)})]})},f=()=>{const[s,t]=c.exports.useState(!0),[l,o]=c.exports.useState(!1),[r,u]=c.exports.useState(!1),[d,k]=c.exports.useState(!1),[h,C]=c.exports.useState(!1),[n,i]=c.exports.useState(!1);return b("div",{className:"flex flex-wrap space-xy-6",children:[e(a,{label:"Primary",value:s,activeClass:"border-indigo-500 !text-indigo-500",className:" group-hover:border-indigo-500",onChange:()=>t(!s)}),e(a,{label:"Secondary",value:l,activeClass:"border-fuchsia-500 !text-fuchsia-500",className:" group-hover:border-fuchsia-500",onChange:()=>o(!l)}),e(a,{label:"Success",value:r,activeClass:"border-green-500 !text-green-500",className:" group-hover:border-green-500",onChange:()=>u(!r)}),e(a,{label:"Danger",value:d,activeClass:"border-red-500 !text-red-500",className:" group-hover:border-red-500",onChange:()=>k(!d)}),e(a,{label:"Warning",value:h,activeClass:"border-yellow-500 !text-yellow-500",className:" group-hover:border-yellow-500",onChange:()=>C(!h)}),e(a,{label:"Info",value:n,activeClass:"border-cyan-500 !text-cyan-500",className:" group-hover:border-cyan-500",onChange:()=>i(!n)})]})},m=`
import Checkbox from "@/components/ui/Checkbox"
const BasicCheckbox = () => {
    const [checked, setChecked] = useState(true);
    const [checked5, setChecked5] = useState(false);
    const [checked6, setChecked6] = useState(false);
    const [checked7, setChecked7] = useState(false);
    const [checked8, setChecked8] = useState(false);
    const [checked9, setChecked9] = useState(false);
    const [checked10, setChecked10] = useState(false);
    return (
      <>
        <Checkbox
          label="Default & Primary"
          value={checked}
          onChange={() => setChecked(!checked)}
        />
  
        <Checkbox
          label="Secondary"
          value={checked6}
          activeClass="border-fuchsia-500 bg-fuchsia-500"
          className=" group-hover:border-fuchsia-500"
          onChange={() => setChecked6(!checked6)}
        />
        <Checkbox
          label="Success"
          value={checked7}
          activeClass="border-green-500 bg-green-500"
          className=" group-hover:border-green-500"
          onChange={() => setChecked7(!checked7)}
        />
        <Checkbox
          label="Danger"
          value={checked8}
          activeClass="border-red-500 bg-red-500"
          className=" group-hover:border-red-500"
          onChange={() => setChecked8(!checked8)}
        />
        <Checkbox
          label="Warning"
          value={checked9}
          activeClass="border-yellow-500 bg-yellow-500"
          className=" group-hover:border-yellow-500"
          onChange={() => setChecked9(!checked9)}
        />
        <Checkbox
          label="Info"
          value={checked10}
          activeClass="border-cyan-500 bg-cyan-500"
          className=" group-hover:border-cyan-500"
          onChange={() => setChecked10(!checked10)}
        />
      </>
    );
  };
  
export default BasicCheckbox
`,S=`
import Checkbox from "@/components/ui/Checkbox"
const CircleCheckbox = () => {
    const [checked, setChecked] = useState(true);
    const [checked5, setChecked5] = useState(false);
    const [checked6, setChecked6] = useState(false);
    const [checked7, setChecked7] = useState(false);
    const [checked8, setChecked8] = useState(false);
    const [checked9, setChecked9] = useState(false);
    const [checked10, setChecked10] = useState(false);
    return (
      <>
    <Checkbox
      label="Default & Primary"
      value={checked}
      className="!rounded-full group-hover:border-indigo-500"
      onChange={() => setChecked(!checked)}
    />
    <Checkbox
      label="Secondary"
      value={checked6}
      className="!rounded-full group-hover:border-fuchsia-500"
      activeClass="border-fuchsia-500 bg-fuchsia-500"
      onChange={() => setChecked6(!checked6)}
    />
    <Checkbox
      label="Success"
      value={checked7}
      className="!rounded-full group-hover:border-green-500"
      activeClass="border-green-500 bg-green-500"
      onChange={() => setChecked7(!checked7)}
    />
    <Checkbox
      label="Danger"
      value={checked8}
      className="!rounded-full group-hover:border-red-500"
      activeClass="border-red-500 bg-red-500"
      onChange={() => setChecked8(!checked8)}
    />
    <Checkbox
      label="Warning"
      value={checked9}
      className="!rounded-full group-hover:border-yellow-500"
      activeClass="border-yellow-500 bg-yellow-500"
      onChange={() => setChecked9(!checked9)}
    />
    <Checkbox
      label="Info"
      value={checked10}
      className="!rounded-full group-hover:border-cyan-500"
      activeClass="border-cyan-500 bg-cyan-500"
      onChange={() => setChecked10(!checked10)}
    />
      </>
    );
  };
export default CircleCheckbox
`,y=`
import Checkbox from "@/components/ui/Checkbox"
const OutlineCheckbox = () => {
    const [checked, setChecked] = useState(true);
    const [checked5, setChecked5] = useState(true);
    const [checked6, setChecked6] = useState(false);
    const [checked7, setChecked7] = useState(false);
    const [checked8, setChecked8] = useState(false);
    const [checked9, setChecked9] = useState(false);
    const [checked10, setChecked10] = useState(false);
    return (
     <>
      <Checkbox
       label="Primary"
       value={checked5}
       activeClass="border-indigo-500 !text-indigo-500"
       className=" group-hover:border-indigo-500"
       onChange={() => setChecked5(!checked5)}
    />
    <Checkbox
      label="Secondary"
      value={checked6}
      activeClass="border-fuchsia-500 !text-fuchsia-500"
      className=" group-hover:border-fuchsia-500"
      onChange={() => setChecked6(!checked6)}
    />
    <Checkbox
      label="Success"
      value={checked7}
      activeClass="border-green-500 !text-green-500"
      className=" group-hover:border-green-500"
      onChange={() => setChecked7(!checked7)}
    />
    <Checkbox
      label="Danger"
      value={checked8}
      activeClass="border-red-500 !text-red-500"
      className=" group-hover:border-red-500"
      onChange={() => setChecked8(!checked8)}
    />
    <Checkbox
      label="Warning"
      value={checked9}
      activeClass="border-yellow-500 !text-yellow-500"
      className=" group-hover:border-yellow-500"
      onChange={() => setChecked9(!checked9)}
    />
    <Checkbox
      label="Info"
      value={checked10}
      activeClass="border-cyan-500 !text-cyan-500"
      className="group-hover:border-cyan-500"
      onChange={() => setChecked10(!checked10)}
    />
      </>
    );
  };
export default OutlineCheckbox
`,N=`
import Checkbox from "@/components/ui/Checkbox"
const DisabledCheckbox = () => {
    const [checked, setChecked] = useState(false);
    const [checked2, setChecked2] = useState(true);
    return (
      <>
      <Checkbox
                label="UnChecked disabled"
                disabled
                value={checked}
                onChange={() => setChecked(!checked)}
            />
            <Checkbox
                label="Checked disabled"
                disabled
                value={checked2}
                onChange={() => setChecked2(!checked2)}
                activeClass="border-indigo-500 bg-indigo-500"
            />
      </>
    );
  };
  
export default DisabledCheckbox
`,w=`import Checkbox from "@/components/ui/Checkbox"
const CheckboxModal = () => {
    const [selected, setSelected] = useState([]);
    const options = [
      {
        value: "Apple",
        label: "apple",
      },
      {
        value: "PineApple",
        label: "pineapple",
      },
      {
        value: "Strawberry",
        label: "strawberry",
      },
    ];
    return (
      <>
      <div className="flex flex-wrap space-xy-6  items-center">
      {options.map((option, i) => (
          <Checkbox
              key={i}
              name="jorina"
              label={option.label}
              value={selected.includes(option.value)}
              onChange={() => {
                  if (selected.includes(option.value)) {
                      setSelected(selected.filter((item) => item !== option.value));
                  } else {
                      setSelected([...selected, option.value]);
                  }
              }}
          />
      ))}
  </div>
  {
     selected.length > 0 && (
          <div className="text-gray-900 dark:text-white mt-6 ">
              Selected: [{selected.join(", ")}]
          </div>
      )
  }
      </>
    );
  };
  
export default CheckboxModal
`,D=()=>{const[s,t]=c.exports.useState(!1),[l,o]=c.exports.useState(!0);return b("div",{className:"flex flex-wrap space-xy-6",children:[e(a,{label:"UnChecked disabled",disabled:!0,value:s,onChange:()=>t(!s)}),e(a,{label:"Checked disabled",disabled:!0,value:l,onChange:()=>o(!l),activeClass:"border-indigo-500 bg-indigo-500"})]})},P=()=>{const[s,t]=c.exports.useState([]);return b(v,{children:[e("div",{className:"flex flex-wrap space-xy-6  items-center",children:[{value:"Apple",label:"apple"},{value:"PineApple",label:"pineapple"},{value:"Strawberry",label:"strawberry"}].map((o,r)=>e(a,{name:"jorina",label:o.label,value:s.includes(o.value),onChange:()=>{s.includes(o.value)?t(s.filter(u=>u!==o.value)):t([...s,o.value])}},r))}),s.length>0&&b("div",{className:"text-gray-900 dark:text-white mt-6 ",children:["Selected: [",s.join(", "),"]"]})]})},B=()=>b("div",{className:" space-y-5",children:[e(g,{title:"Basic Checkbox",code:m,children:e(x,{})}),e(g,{title:"Circle Checkbox",code:S,children:e(p,{})}),e(g,{title:"Outline Checkbox",code:y,children:e(f,{})}),e(g,{title:"Disabled Checkbox",code:N,children:e(D,{})}),e(g,{title:"Checkbox Model",code:w,children:e(P,{})})]});export{B as default};
