import{j as e,B as n,c as a,I as p}from"./index.1873308f.js";import{c as u}from"./code-snippet.32d5dd98.js";import{C as h}from"./Card.4b3fb845.js";import{T as i}from"./Textinput.937203d3.js";import{u as f,b as x}from"./index.esm.487e7b38.js";import"./toConsumableArray.e5b41f38.js";import"./cleave-phone.us.3bd1f2ed.js";const g=()=>{const{register:r,control:s,handleSubmit:l}=f({defaultValues:{test:[{firstName:"Jone",lastName:"Due",phone:"352252525"}]}}),{fields:m,append:d,remove:c}=x({control:s,name:"test"});return e("div",{children:e(h,{title:"Repeating Forms",headerslot:e(n,{text:"Add new",icon:"heroicons-outline:plus",className:"btn-primary light",onClick:()=>d()}),children:a("form",{onSubmit:l(o=>console.log(o)),children:[m.map((o,t)=>a("div",{className:"lg:grid-cols-3 md:grid-cols-2 grid-cols-1 grid gap-5 mb-5 last:mb-0",children:[e(i,{label:"First Name",type:"text",id:`name${t}`,placeholder:"First Name",register:r,name:`test[${t}].firstName`}),e(i,{label:"last Name",type:"text",id:`name2${t}`,placeholder:"Last Name",register:r,name:`test[${t}].lastName`}),a("div",{className:"flex justify-between items-end space-x-5",children:[e("div",{className:"flex-1",children:e(i,{label:"Phone",type:"text",id:`name3${t}`,placeholder:"Phone",register:r,name:`test[${t}].phone`})}),e("div",{className:"flex-none relative",children:e("button",{onClick:()=>c(t),type:"button",className:"btn btn-danger light p-0 h-10 w-10  items-center justify-center inline-flex ",children:e(p,{icon:"heroicons-outline:trash"})})})]})]},t)),e("div",{className:"ltr:text-right rtl:text-left",children:e(n,{text:"Submit",className:"btn-primary"})})]})})})},b=`
import React from "react";
import Card from "@/components/ui/card";
import Textinput from "@/components/ui/Textinput";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { useForm, useFieldArray } from "react-hook-form";
const FormRepeater = () => {
  const { register, control, handleSubmit } = useForm(
    {
      defaultValues: {
        test: [{ firstName: "Jone", lastName: "Due", phone: "352252525" }],
      },
    }
  );
  const { fields, append, remove } = useFieldArray({
    control,
    name: "test",
  });
  return (
    <div>
      <Card
        title="Repeating Forms"
        headerslot={
          <Button
            text="Add new"
            icon="heroicons-outline:plus"
            className="btn-primary light"
            onClick={() => append()}
          />
        }
      >
        <form onSubmit={handleSubmit((data) => console.log(data))}>
          {fields.map((item, index) => (
            <div
              className="lg:grid-cols-3 md:grid-cols-2 grid-cols-1 grid gap-5 mb-5 last:mb-0"
              key={index}
            >
              <Textinput
                label="First Name"
                type="text"
                id={\`name\${index}\`}
                placeholder="First Name"
                register={register}
                name={\`test[\${index}].firstName\`}
              />

              <Textinput
                label="last Name"
                type="text"
                id={\`name2\${index}\`}
                placeholder="Last Name"
                register={register}
                name={\`test[\${index}].lastName\`}
              />

              <div className="flex justify-between items-end space-x-5">
                <div className="flex-1">
                  <Textinput
                    label="Phone"
                    type="text"
                    id={\`name3\${index}\`}
                    placeholder="Phone"
                    register={register}
                    name={\`test[\${index}].phone\`}
                  />
                </div>
                <div className="flex-none relative">
                  <button
                    onClick={() => remove(index)}
                    type="button"
                    className="btn btn-danger light p-0 h-10 w-10  items-center justify-center inline-flex "
                  >
                    <Icon icon="heroicons-outline:trash" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="ltr:text-right rtl:text-left">
            <Button text="Submit" className="btn-primary" />
          </div>
        </form>
      </Card>
    </div>
  );
};
export default FormRepeater;
`,S=()=>e("div",{children:e(u,{title:"form repeating",code:b,children:e(g,{})})});export{S as default};
