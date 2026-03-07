import{c as t,j as e}from"./index.1873308f.js";import{C as r}from"./Card.4b3fb845.js";import{c as l}from"./code-snippet.32d5dd98.js";import"./toConsumableArray.e5b41f38.js";const i="/assets/card-1.90b03983.png",c="/assets/card-2.4929770c.png",s="/assets/card-3.19b8dac0.png",o=`
import Card from "@/components/ui/code-snippet";
import cardImage1 from "@/assets/images/all-img/card-1.png";
import cardImage2 from "@/assets/images/all-img/card-2.png";
import cardImage3 from "@/assets/images/all-img/card-3.png";
const ExampleCard = () => {
  return (
    <>
    <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 card-height-auto">
    <Card bodyClass="p-0">
        <div className="h-[180px] w-full">
            <img
                src={cardImage1}
                alt=""
                className="block w-full h-full object-cover rounded-t-md"
            />
        </div>
        <div className="px-6 py-4 space-y-4">
            <header>
                <div className="card-title">Card title</div>
            </header>
            <div className="text-sm">
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
            </div>
            <button className="btn btn-primary text-center">
                Go somewhere
            </button>
        </div>
    </Card>
    <Card bodyClass="p-0">
        <div className="h-[180px] w-full">
            <img
                src={cardImage2}
                alt=""
                className="block w-full h-full object-cover rounded-t-md"
            />
        </div>
        <div className="px-6 py-4 space-y-4">
            <header>
                <div className="card-title">Card title</div>
            </header>
            <div className="text-sm">
                Some quick example text to build on the card title and make up the
                bulk of the card's content. Some quick example text to build on
                the card title and make up the bulk of the card's content. Some
                quick example text to build on the card title and make up the bulk
            </div>
        </div>
    </Card>
    <Card bodyClass="p-0">
        <div className="h-[180px] w-full">
            <img
                src={cardImage3}
                alt=""
                className="block w-full h-full object-cover rounded-t-md"
            />
        </div>
        <div className="px-6 py-4 space-y-4">
            <header>
                <div className="card-title">Card title</div>
            </header>
            <div className="text-sm">
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
            </div>
            <hr className="border-t border-b-0 -mx-5 border-gray-10" />
            <div className=" flex space-x-4 rtl:space-x-reverse text-sm  ">
                <a href="#" className=" text-indigo-500 underline">
                    Custom Links1
                </a>
                <a href="#" className=" text-indigo-500 underline">
                    Custom Links2
                </a>
            </div>
        </div>
    </Card>
</div>
    </>
  )
}
export default ExampleCard
`,n=`
import Card from "@/components/ui/code-snippet";
const ExampleCard1 = () => {
    const exampleCard1 = [
        {
            title: "Primary Card",
            bg: "bg-indigo-500",
            color: "text-indigo-500",
        },
        {
            title: "Secondary Card ",
            bg: "bg-fuchsia-500",
            color: "text-fuchsia-500",
        },
        {
            title: "Success Card",
            bg: "bg-green-500",
            color: "text-green-500",
        },
        {
            title: "Danger Card",
            bg: "bg-red-500",
            color: "text-red-500",
        },
        {
            title: "Warning Card",
            bg: "bg-yellow-500",
            color: "text-yellow-500",
        },
        {
            title: "Info Card",
            bg: "bg-cyan-500",
            color: "text-cyan-500",
        },
    ];
  return (
    <>
    {exampleCard1.map((item, i) => (
        <Card
            title={item.title}
            className={"!$ {item.bg} dark:$ {item.bg}"}
            titleClass="text-white"
            noborder
            key={i}
        >
            <div className="text-white text-sm">
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
            </div>
        </Card>
    ))}
    </>
  )
}
export default ExampleCard1
`,m=`
import Card from "@/components/ui/code-snippet";
const ExampleCard2 = () => {
    const exampleCard2 = [
        {
            title: "Primary Card",
            ring: "ring-fuchsia-500",
        },
        {
            title: "Secondary Card ",
            ring: "ring-gray-500",
        },
        {
            title: "Success Card",
            ring: "ring-green-500",
        },
        {
            title: "Danger Card",
            ring: "ring-red-500",
        },
        {
            title: "Warning Card",
            ring: "ring-yellow-500",
        },
        {
            title: "Info Card",
            ring: "ring-cyan-500",
        },
    ];
  return (
    <>
    {
        exampleCard2.map((item, i) => (
            <Card
                noborder
                title={item.title}
                className={"ring-1 $ {item.ring}"}
                key={i}>
                <div className="text-sm">
                    Some quick example text to build on the card title and make up the
                    bulk of the card's content.
                </div>
            </Card>
        ))
    }
    </>
  )
}
export default ExampleCard2
`,g=[{title:"Primary Card",bg:"bg-indigo-500",color:"text-indigo-500"},{title:"Secondary Card ",bg:"bg-fuchsia-500",color:"text-fuchsia-500"},{title:"Success Card",bg:"bg-green-500",color:"text-green-500"},{title:"Danger Card",bg:"bg-red-500",color:"text-red-500"},{title:"Warning Card",bg:"bg-yellow-500",color:"text-yellow-500"},{title:"Info Card",bg:"bg-cyan-500",color:"text-cyan-500"}],p=[{title:"Primary Card",ring:"ring-fuchsia-500"},{title:"Secondary Card ",ring:"ring-gray-500"},{title:"Success Card",ring:"ring-green-500"},{title:"Danger Card",ring:"ring-red-500"},{title:"Warning Card",ring:"ring-yellow-500"},{title:"Info Card",ring:"ring-cyan-500"}],C=()=>t("div",{className:" space-y-5",children:[e(l,{title:"Basic Cards",code:o,children:t("div",{className:"grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 card-height-auto",children:[t(r,{bodyClass:"p-0",children:[e("div",{className:"h-[180px] w-full",children:e("img",{src:i,alt:"",className:"block w-full h-full object-cover rounded-t-md"})}),t("div",{className:"px-6 py-4 space-y-4",children:[e("header",{children:e("div",{className:"card-title",children:"Card title"})}),e("div",{className:"text-sm",children:"Some quick example text to build on the card title and make up the bulk of the card's content."}),e("button",{className:"btn btn-primary text-center",children:"Go somewhere"})]})]}),t(r,{bodyClass:"p-0",children:[e("div",{className:"h-[180px] w-full",children:e("img",{src:c,alt:"",className:"block w-full h-full object-cover rounded-t-md"})}),t("div",{className:"px-6 py-4 space-y-4",children:[e("header",{children:e("div",{className:"card-title",children:"Card title"})}),e("div",{className:"text-sm",children:"Some quick example text to build on the card title and make up the bulk of the card's content. Some quick example text to build on the card title and make up the bulk of the card's content. Some quick example text to build on the card title and"})]})]}),t(r,{bodyClass:"p-0",children:[e("div",{className:"h-[180px] w-full",children:e("img",{src:s,alt:"",className:"block w-full h-full object-cover rounded-t-md"})}),t("div",{className:"px-6 py-4 space-y-4",children:[e("header",{children:e("div",{className:"card-title",children:"Card title"})}),e("div",{className:"text-sm",children:"Some quick example text to build on the card title and make up the bulk of the card's content."}),e("hr",{className:"border-t border-b-0 -mx-5 border-gray-10"}),t("div",{className:" flex space-x-4 rtl:space-x-reverse text-sm  ",children:[e("a",{href:"#",className:" text-indigo-500 underline",children:"Custom Links1"}),e("a",{href:"#",className:" text-indigo-500 underline",children:"Custom Links2"})]})]})]})]})}),e(l,{title:"Color Cards",code:n,children:e("div",{className:"grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5",children:g.map((a,d)=>e(r,{title:a.title,className:`!${a.bg} dark:${a.bg}`,titleClass:"text-white",noborder:!0,children:e("div",{className:"text-white text-sm",children:"Some quick example text to build on the card title and make up the bulk of the card's content."})},d))})}),e(l,{title:"Border Cards",code:m,children:e("div",{className:"grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5",children:p.map((a,d)=>e(r,{noborder:!0,title:a.title,className:`ring-1 ${a.ring}`,children:e("div",{className:"text-sm",children:"Some quick example text to build on the card title and make up the bulk of the card's content."})},d))})})]});export{C as default};
