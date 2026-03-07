import{c as n,j as t,U as a}from"./index.27cd9fa4.js";import{c as o}from"./code-snippet.8e057535.js";import{T as e}from"./Tooltip.b92d0029.js";import"./Card.e7cd9ee8.js";import"./toConsumableArray.e5b41f38.js";const r=()=>n("div",{className:"space-xy flex flex-wrap",children:[t(e,{title:"primary",content:"primary style",placement:"top",className:"btn btn-primary ",arrow:!0,theme:"primary"}),t(e,{title:"secondary",content:"secondary style",placement:"top",className:"btn btn-secondary ",arrow:!0,theme:"secondary"}),t(e,{title:"success",content:"success style",placement:"top",className:"btn btn-success",arrow:!0,theme:"success"}),t(e,{title:"info",content:"info style",placement:"top",className:"btn btn-info ",arrow:!0,theme:"info"}),t(e,{title:"warning",content:"warning style",placement:"top",className:"btn btn-warning ",arrow:!0,theme:"warning"}),t(e,{title:"danger",content:"danger style",placement:"top",className:"btn btn-danger ",arrow:!0,theme:"danger"}),t(e,{title:"dark",content:"Dark style",placement:"top",className:"btn btn-dark ",arrow:!0,theme:"dark"}),t(e,{title:"light",content:"Light style",placement:"top",className:"btn btn-light ",arrow:!0,theme:"light"})]}),l=`
import Tooltip from "@/components/ui/Tooltip"
const BasicTooltip = () => {
  return (
    <>
     <Tooltip title="primary"
      content="primary style"
       placement="top"
       className="btn btn-primary "
      arrow theme="primary"/>
     <Tooltip title="secondary"
      content="secondary style"
      placement="top" 
    className="btn btn-secondary "
       arrow theme="secondary"/>
     <Tooltip title="success" content="success style" placement="top" className="btn btn-success" arrow theme="success"/>
     <Tooltip title="info" content="info style" placement="top" className="btn btn-info " arrow theme="info"/>
     <Tooltip title="warning" content="warning style" placement="top" className="btn btn-warning " arrow theme="warning"/>
     <Tooltip title="danger" content="danger style" placement="top" className="btn btn-danger " arrow theme="danger"/>
     <Tooltip title="dark" content="Dark style" placement="top" className="btn btn-dark " arrow theme="dark"/>
     <Tooltip title="light" content="Light style" placement="top" className="btn btn-light " arrow theme="light"/>
  </>
  )
}
export default BasicTooltip
`,i=`
import Tooltip from "@/components/ui/Tooltip"
const PositionsTooltip = () => {
  return (
    <>
    <Tooltip title="top" content="Top" placement="top" className="btn btn-primary light" theme="primary" arrow/>
    <Tooltip title="Top Start" content="Top Start" placement="top-start" arrow className="btn btn-secondary light" theme="secondary"/>
    <Tooltip title="Top End" content="Top End" placement="top-end" arrow className="btn btn-success light" theme="success"/>
    <Tooltip title="Right" content="Right" placement="right" arrow className="btn btn-info light" theme="info"/>
    <Tooltip title="Right Start" content="Right Start" placement="right-start" arrow className="btn btn-warning light" theme="warning"/>
    <Tooltip title="Right End" content="Right End" placement="right-end" arrow className="btn btn-danger light" theme="danger"/>
    <Tooltip title="Left" content="Left" placement="left" arrow className="btn btn-primary light" theme="primary"/>
    <Tooltip title="Left Start" content="Left Start" placement="left-start" arrow className="btn btn-secondary light" theme="secondary"/>
    <Tooltip title="Left End" content="Left End" placement="left-end" arrow className="btn btn-success light" theme="success"/>
    <Tooltip title="Bottom" content="Bottom" placement="bottom" arrow className="btn btn-info light" theme="info"/>
    <Tooltip title="Bottom Start" content="Bottom Start" placement="bottom-start" arrow className="btn btn-warning light" theme="warning"/>
    <Tooltip title="Bottom End" content="Bottom End" placement="bottom-end" arrow className="btn btn-danger light" theme="danger"/>
    </>
  )
}
export default PositionsTooltip
`,c=`
import Tooltip from "@/components/ui/Tooltip"
const AnimatedTooltip = () => {
  return (
    <>
    <Tooltip title="Shift-away" content="Shift-away" placement="top" arrow animation="shift-away" className="btn btn-outline-primary" theme="primary"/>
    <Tooltip title="Shift-toward" content="Shift-toward" placement="top" arrow animation="shift-toward" className="btn btn-outline-secondary" theme="secondary"/>
    <Tooltip title="Scale" content="Scale" placement="top" arrow animation="scale" className="btn btn-outline-success" theme="success"/>
    <Tooltip title="Fade" content="Fade" placement="top" arrow animation="fade" className="btn btn-outline-info" theme="info"/>
    <Tooltip title="Perspective" content="Perspective" placement="top" arrow animation="Perspective" className="btn btn-outline-warning" theme="warning"/>
    </>
  )
}
export default AnimatedTooltip
`,s=`
import Tooltip from "@/components/ui/Tooltip"
const TriggerTooltip = () => {
  return (
    <>
       <Tooltip title="Mouseenter" content="Mouseenter" placement="top" arrow trigger="mouseenter" className="btn btn-outline-primary" theme="primary"/>
        <Tooltip title="Click" content="Click" placement="top" arrow trigger="click" className="btn btn-outline-secondary" theme="secondary"/>
    </>
  )
}
export default TriggerTooltip
`,m=`
import Tooltip from "@/components/ui/Tooltip"
const InteractiveTooltip = () => {
  return (
    <>
      <Tooltip title="Interactive" content="Interactive tooltip" placement="top" arrow interactive className="btn btn-outline-primary" theme="primary"/>
    </>
  )
}
export default InteractiveTooltip
`,p=`
import Tooltip from "@/components/ui/Tooltip"
const HTMLContentTooltip = () => {
  return (
    <>
    <Tooltip
        title="Html Content"
        placement="top"
        arrow
        allowHTML
        interactive
        theme="dark"
        maxWidth="320px"
        content={
                <div className="flex items-center -[-9px] text-gray-100">
                    <div className="flex-none ltr:mr-[10px] rtl:ml-[10px]">
                        <div className="h-[46px] w-[46px] rounded-full">
                             <img src={UserAvatar} alt="" className="block w-full h-full object-cover rounded-full"/>
                         </div>
                        </div>
                        <div className="flex-1  text-sm font-semibold  ">
                            <span className=" truncate w-full block">Faruk Ahamed</span>
                            <span className="block font-light text-xs   capitalize">
                                supper admin
                            </span>
                        </div>
                    </div>
                }
                className="btn btn-light">
        </Tooltip>
    </>
  )
}
export default HTMLContentTooltip
`,d=()=>n("div",{className:"space-xy flex flex-wrap ",children:[t(e,{title:"top",content:"Top",placement:"top",className:"btn btn-primary light",theme:"primary",arrow:!0}),t(e,{title:"Top Start",content:"Top Start",placement:"top-start",arrow:!0,className:"btn btn-secondary light",theme:"secondary"}),t(e,{title:"Top End",content:"Top End",placement:"top-end",arrow:!0,className:"btn btn-success light",theme:"success"}),t(e,{title:"Right",content:"Right",placement:"right",arrow:!0,className:"btn btn-info light",theme:"info"}),t(e,{title:"Right Start",content:"Right Start",placement:"right-start",arrow:!0,className:"btn btn-warning light",theme:"warning"}),t(e,{title:"Right End",content:"Right End",placement:"right-end",arrow:!0,className:"btn btn-danger light",theme:"danger"}),t(e,{title:"Left",content:"Left",placement:"left",arrow:!0,className:"btn btn-primary light",theme:"primary"}),t(e,{title:"Left Start",content:"Left Start",placement:"left-start",arrow:!0,className:"btn btn-secondary light",theme:"secondary"}),t(e,{title:"Left End",content:"Left End",placement:"left-end",arrow:!0,className:"btn btn-success light",theme:"success"}),t(e,{title:"Bottom",content:"Bottom",placement:"bottom",arrow:!0,className:"btn btn-info light",theme:"info"}),t(e,{title:"Bottom Start",content:"Bottom Start",placement:"bottom-start",arrow:!0,className:"btn btn-warning light",theme:"warning"}),t(e,{title:"Bottom End",content:"Bottom End",placement:"bottom-end",arrow:!0,className:"btn btn-danger light",theme:"danger"})]}),h=()=>n("div",{className:"space-xy flex flex-wrap",children:[t(e,{title:"Shift-away",content:"Shift-away",placement:"top",arrow:!0,animation:"shift-away",className:"btn btn-outline-primary",theme:"primary"}),t(e,{title:"Shift-toward",content:"Shift-toward",placement:"top",arrow:!0,animation:"shift-toward",className:"btn btn-outline-secondary",theme:"secondary"}),t(e,{title:"Scale",content:"Scale",placement:"top",arrow:!0,animation:"scale",className:"btn btn-outline-success",theme:"success"}),t(e,{title:"Fade",content:"Fade",placement:"top",arrow:!0,animation:"fade",className:"btn btn-outline-info",theme:"info"}),t(e,{title:"Perspective",content:"Perspective",placement:"top",arrow:!0,animation:"Perspective",className:"btn btn-outline-warning",theme:"warning"})]}),b=()=>n("div",{className:"space-xy flex flex-wrap",children:[t(e,{title:"Mouseenter",content:"Mouseenter",placement:"top",arrow:!0,trigger:"mouseenter",className:"btn btn-outline-primary",theme:"primary"}),t(e,{title:"Click",content:"Click",placement:"top",arrow:!0,trigger:"click",className:"btn btn-outline-secondary",theme:"secondary"})]}),u=()=>t("div",{className:"space-xy flex flex-wrap",children:t(e,{title:"Interactive",content:"Interactive tooltip",placement:"top",arrow:!0,interactive:!0,className:"btn btn-outline-primary",theme:"primary"})}),g=()=>t("div",{className:"space-xy flex flex-wrap",children:t(e,{title:"Html Content",placement:"top",arrow:!0,allowHTML:!0,interactive:!0,theme:"dark",maxWidth:"320px",content:n("div",{className:"flex items-center -[-9px] text-gray-100",children:[t("div",{className:"flex-none ltr:mr-[10px] rtl:ml-[10px]",children:t("div",{className:"h-[46px] w-[46px] rounded-full",children:t("img",{src:a,alt:"",className:"block w-full h-full object-cover rounded-full"})})}),n("div",{className:"flex-1  text-sm font-semibold  ",children:[t("span",{className:" truncate w-full block",children:"Faruk Ahamed"}),t("span",{className:"block font-light text-xs   capitalize",children:"supper admin"})]})]}),className:"btn btn-light"})}),x=()=>n("div",{className:" space-y-5",children:[t(o,{title:"Basic Tooltip",code:l,children:t(r,{})}),t(o,{title:"Tooltip Position",code:i,children:t(d,{})}),t(o,{title:"Animations",code:c,children:t(h,{})}),t(o,{title:"Triggers",code:s,children:t(b,{})}),t(o,{title:"Interactive",code:m,children:t(u,{})}),t(o,{title:"HTML Content",code:p,children:t(g,{})})]});export{x as default};
