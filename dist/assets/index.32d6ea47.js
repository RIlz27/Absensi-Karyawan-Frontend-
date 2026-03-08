import{c as o,j as e}from"./index.bd1bbb16.js";import{c as r}from"./code-snippet.39c1ea2b.js";import{A as n,a as t,b as c,c as i}from"./accordion.d4e592ff.js";import"./Card.38321d90.js";import"./toConsumableArray.e5b41f38.js";import"./index.9a4d7a77.js";function s(){return o(n,{type:"single",collapsible:!0,className:"w-full",children:[o(t,{value:"item-1",children:[e(c,{children:"Is it accessible?"}),e(i,{children:"Yes. It adheres to the WAI-ARIA design pattern."})]}),o(t,{value:"item-2",children:[e(c,{children:"Is it styled?"}),e(i,{children:"Yes. It comes with default styles that matches the other components' aesthetic."})]}),o(t,{value:"item-3",children:[e(c,{children:"Is it animated?"}),e(i,{children:"Yes. It's animated by default, but you can disable it if you prefer."})]})]})}const d=`
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
