import{c as i,j as e}from"./index.61864e9c.js";import{c as r}from"./code-snippet.7410407c.js";import{T as t}from"./Textinput.ad69a152.js";import{I as o}from"./InputGroup.138caa99.js";import"./Card.bdfefdbc.js";import"./toConsumableArray.e5b41f38.js";import"./cleave-phone.us.871c03a1.js";const l=()=>i("div",{className:" space-y-5",children:[e(t,{label:"prefix",id:"prefix",options:{prefix:"+88",blocks:[3,3,3,4],uppercase:!0},placeholder:"+88",isMask:!0}),e(t,{label:"Blocks",id:"block",options:{blocks:[4,3,3],uppercase:!0},placeholder:"Block[1,4,7]",isMask:!0}),e(t,{label:"Delimiters",id:"delimiters",options:{delimiter:"\xB7",blocks:[3,3,3],uppercase:!0},placeholder:"Delimiter: '.'",isMask:!0}),e(t,{label:"Custom Delimiters",id:"customDelimiter",options:{delimiters:[".",".","-"],blocks:[3,3,3,2],uppercase:!0},placeholder:"Delimiter: ['.', '.', '-']",isMask:!0}),e(t,{label:"Credit Card",isMask:!0,options:{creditCard:!0},placeholder:"0000 0000 0000 0000"}),e(o,{label:"Phone Number",prepend:"(+6)",placeholder:"Phone Number",id:"phoneNumber",options:{phone:!0,phoneRegionCode:"US"},isMask:!0}),e(t,{label:"Date",id:"date",options:{date:!0,datePattern:["Y","m","d"]},placeholder:"YYYY-MM-DD",isMask:!0}),e(t,{label:"Time",id:"time",options:{time:!0,timePattern:["h","m","s"]},placeholder:"HH:MM:SS",isMask:!0}),e(t,{label:"Numeral Formatting",id:"nu",options:{numeral:!0},placeholder:"10,000",isMask:!0})]}),s=`
import Textinput from "@/components/ui/Textinput";
import InputGroup from "@/components/ui/InputGroup";
const InputMask = () => {
    return (
        <>
            <Textinput
                label="prefix"
                id="prefix"
                options={{
                    prefix: "+88",
                    blocks: [3, 3, 3, 4],
                    uppercase: true,
                }}
                placeholder="+88"
                isMask
            />
            <Textinput
                label="Blocks"
                id="block"
                options={{ blocks: [4, 3, 3], uppercase: true }}
                placeholder="Block[1,4,7]"
                isMask
            />
            <Textinput
                label="Delimiters"
                id="delimiters"
                options={{ delimiter: "\xB7", blocks: [3, 3, 3], uppercase: true }}
                placeholder="Delimiter: '.'"
                isMask
            />
            <Textinput
                label="Custom Delimiters"
                id="customDelimiter"
                options={{
                    delimiters: [".", ".", "-"],
                    blocks: [3, 3, 3, 2],
                    uppercase: true,
                }}
                placeholder="Delimiter: ['.', '.', '-']"
                isMask
            />
            <Textinput
                label="Credit Card"
                isMask
                options={{ creditCard: true }}
                placeholder="0000 0000 0000 0000"
            />
            <InputGroup
                label="Phone Number"
                prepend="(+6)"
                placeholder="Phone Number"
                id="phoneNumber"
                options={{ phone: true, phoneRegionCode: "US" }}
                isMask
            />

            <Textinput
                label="Date"
                id="date"
                options={{ date: true, datePattern: ["Y", "m", "d"] }}
                placeholder="YYYY-MM-DD"
                isMask
            />
            <Textinput
                label="Time"
                id="time"
                options={{ time: true, timePattern: ["h", "m", "s"] }}
                placeholder="HH:MM:SS"
                isMask
            />
            <Textinput
                label="Numeral Formatting"
                id="nu"
                options={{ numeral: true }}
                placeholder="10,000"
                isMask
            />
        </>
    );
};

export default InputMask;
`,k=()=>e("div",{children:e(r,{title:"Input Mask",code:s,children:e(l,{})})});export{k as default};
