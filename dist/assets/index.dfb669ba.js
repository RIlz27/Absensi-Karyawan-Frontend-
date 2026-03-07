import{c}from"./code-snippet.32d5dd98.js";import{r as i,j as e,c as s}from"./index.1873308f.js";import{F as o}from"./index.fe0e9b50.js";import"./Card.4b3fb845.js";import"./toConsumableArray.e5b41f38.js";const n=()=>{const[t,a]=i.exports.useState();return e(o,{className:"text-control py-2",value:t,placeholder:"Choose Date..",onChange:r=>a(r),id:"default-picker"})},l=`
import React, { useState } from 'react';
import Flatpickr from "react-flatpickr";
const BasicDatePicker = () => {
    const [picker, setPicker] = useState();
    return (
        <Flatpickr
        className="text-control py-2"
        value={picker}
        placeholder="Choose Date.."
        onChange={(date) => setPicker(date)}
        id="default-picker"
    />
    );
};
export default BasicDatePicker;
`,p=`
import React, { useState } from 'react';
import Flatpickr from "react-flatpickr";
const BasicDatePicker = () => {
    const [picker, setPicker] = useState();
    return (
        <Flatpickr
            className="text-control py-2"
            value={picker}
            placeholder="Choose Date.."
            onChange={(date) => setPicker(date)}
            id="default-picker"
        />
    );
};

export default BasicDatePicker;
`,d=`
import React, { useState } from 'react';
import Flatpickr from "react-flatpickr";
const RangePicker = () => {
    const [picker3, setPicker3] = useState();
    return (
        <>
        <Flatpickr
            value={picker3}
            id="range-picker"
            className="text-control py-2"
            placeholder="Choose Date.."
            onChange={(date) => setPicker3(date)}
            options={{
                mode: "range",
                defaultDate: ["2020-02-01", "2020-02-15"],
            }}
        />
        <>
    );
};

export default RangePicker;
`,k=`
import React, { useState } from 'react';
import Flatpickr from "react-flatpickr";

const DisabledRangePicker = () => {
    const [picker4, setPicker4] = useState(new Date());
    return (
        <>
        <Flatpickr
        value={picker4}
        id="disabled-picker"
        className="text-control py-2"
        placeholder="Choose Date.."
        onChange={(date) => setPicker4(date)}
        options={{
          dateFormat: "Y-m-d",
          disable: [
            {
              from: new Date(),
              // eslint-disable-next-line no-mixed-operators
              to: new Date(new Date().getTime() + 120 * 60 * 60 * 1000),
            },
          ],
        }}
      />
      <>
    );
};

export default DisabledRangePicker;
`,m=`
import React, { useState } from 'react';
import Flatpickr from "react-flatpickr";
const TimePicker = () => {
    const [basic, setBasic] = useState(new Date());
    return (
        <Flatpickr
            className="text-control py-2"
            value={basic}
            placeholder="Choose Time.."
            options={{
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                time_24hr: true,
            }}
            onChange={(date) => setBasic(date)}
        />
    );
};

export default TimePicker;
`,u=`
import React, { useState } from 'react';
import Flatpickr from "react-flatpickr";
const DateRangePicker = () => {
    const [picker, setPicker] = useState();
    return (
        <Flatpickr
            value={picker}
            id="multi-dates-picker"
            className="text-control py-2"
            placeholder="Choose Date.."
            options={{ mode: "multiple" }}
            onChange={(date) => setPicker(date)}
        />
    );
};

export default DateRangePicker;
`,h=()=>{const[t,a]=i.exports.useState();return e(o,{value:t,"data-enable-time":!0,id:"date-time-picker",placeholder:"Choose Date & Time..",className:"text-control py-2",onChange:r=>a(r)})},P=()=>{const[t,a]=i.exports.useState();return e(o,{value:t,id:"range-picker",className:"text-control py-2",placeholder:"Choose Date..",onChange:r=>a(r),options:{mode:"range",defaultDate:["2020-02-01","2020-02-15"]}})},D=()=>{const[t,a]=i.exports.useState(new Date);return e(o,{value:t,id:"disabled-picker",className:"text-control py-2",placeholder:"Choose Date..",onChange:r=>a(r),options:{dateFormat:"Y-m-d",disable:[{from:new Date,to:new Date(new Date().getTime()+120*60*60*1e3)}]}})},f=()=>{const[t,a]=i.exports.useState(new Date);return e(o,{className:"text-control py-2",value:t,placeholder:"Choose Time..",options:{enableTime:!0,noCalendar:!0,dateFormat:"H:i",time_24hr:!0},onChange:r=>a(r)})},g=()=>{const[t,a]=i.exports.useState();return e(o,{value:t,id:"multi-dates-picker",className:"text-control py-2",placeholder:"Choose Date..",options:{mode:"multiple"},onChange:r=>a(r)})},b=()=>s("div",{className:" space-y-5",children:[e(c,{title:"Basic Date Picker",code:l,children:e(n,{})}),e(c,{title:"Date & Time",code:p,children:e(h,{})}),e(c,{title:"range picker",code:d,children:e(P,{})}),e(c,{title:"Disabled Range",code:k,children:e(D,{})}),e(c,{title:"Time picker",code:m,children:e(f,{})}),e(c,{title:"Date Range Picker",code:u,children:e(g,{})})]});export{b as default};
