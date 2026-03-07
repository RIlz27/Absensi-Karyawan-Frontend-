import{c as o,j as e}from"./index.1873308f.js";import{c as r}from"./code-snippet.32d5dd98.js";import{A as n,a as t,b as c,c as i}from"./accordion.98f443c8.js";import"./Card.4b3fb845.js";import"./toConsumableArray.e5b41f38.js";import"./index.b5449989.js";function s(){return o(n,{type:"single",collapsible:!0,className:"w-full",children:[o(t,{value:"item-1",children:[e(c,{children:"Is it accessible?"}),e(i,{children:"Yes. It adheres to the WAI-ARIA design pattern."})]}),o(t,{value:"item-2",children:[e(c,{children:"Is it styled?"}),e(i,{children:"Yes. It comes with default styles that matches the other components' aesthetic."})]}),o(t,{value:"item-3",children:[e(c,{children:"Is it animated?"}),e(i,{children:"Yes. It's animated by default, but you can disable it if you prefer."})]})]})}const d=`
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function BasicExample() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other
          components&apos; aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It&apos;s animated by default, but you can disable it if you
          prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
`,u=()=>e("div",{className:"space-y-5",children:e(r,{title:"Accordions",code:d,children:e(s,{})})});export{u as default};
