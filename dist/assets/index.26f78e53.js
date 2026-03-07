import{c as s,j as l}from"./index.61864e9c.js";import{c as i}from"./code-snippet.7410407c.js";import{A as e}from"./Alert.33071d48.js";import"./Card.bdfefdbc.js";import"./toConsumableArray.e5b41f38.js";const a=()=>s("div",{className:"space-y-4",children:[l(e,{label:"This is simple alert",className:"alert-primary"}),l(e,{label:"This is simple alert",className:"alert-secondary"}),l(e,{label:"This is simple alert",className:"alert-success"}),l(e,{label:"This is simple alert",className:"alert-danger"}),l(e,{label:"This is simple alert",className:"alert-warning"}),l(e,{label:"This is simple alert",className:"alert-info"}),l(e,{label:"This is simple alert",className:"alert-light"}),l(e,{label:"This is simple alert",className:"alert-dark"})]}),t=`
import Alert from "@/components/ui/Alert"
const BasicAlert = () => {
  return (
    <>
    <Alert label="This is simple alert" className="alert-primary" />
    <Alert label="This is simple alert" className="alert-secondary" />
    <Alert label="This is simple alert" className="alert-success" />
    <Alert label="This is simple alert" className="alert-danger" />
    <Alert label="This is simple alert" className="alert-warning" />
    <Alert label="This is simple alert" className="alert-info" />
    <Alert label="This is simple alert" className="alert-light" />
    <Alert label="This is simple alert" className="alert-dark" />
    </>
  )
}
export default BasicAlert
`,r=`
import Alert from "@/components/ui/Alert"
const OutlineAlerts = () => {
  return (
    <>
    <Alert label="This is simple alert" className="alert-outline-primary" />
    <Alert label="This is simple alert" className="alert-outline-secondary" />
    <Alert label="This is simple alert" className="alert-outline-success" />
    <Alert label="This is simple alert" className="alert-outline-danger" />
    <Alert label="This is simple alert" className="alert-outline-warning" />
    <Alert label="This is simple alert" className="alert-outline-info" />
    <Alert label="This is simple alert" className="alert-outline-light" />
    <Alert label="This is simple alert" className="alert-outline-dark" />
    </>
  )
}
export default OutlineAlerts
`,m=`
import Alert from "@/components/ui/Alert"
const SoftAlerts = () => {
  return (
    <>
    <Alert label="This is simple alert" className="alert-primary light" />
    <Alert label="This is simple alert" className="alert-secondary light" />
    <Alert label="This is simple alert" className="alert-success light" />
    <Alert label="This is simple alert" className="alert-danger light" />
    <Alert label="This is simple alert" className="alert-warning light" />
    <Alert label="This is simple alert" className="alert-info light" />
    <Alert label="This is simple alert" className="alert-light light" />
    </>
  )
}
export default SoftAlerts
`,c=`
import Alert from "@/components/ui/Alert"
const DismissibleAlert = () => {
  return (
    <>
    <Alert dismissible icon="ph:info" label="This is simple alert"></Alert>
    <Alert dismissible icon="ph:info" className="alert-outline-secondary !text-fuchsia-500" label="This is simple alert"></Alert>
    <Alert dismissible icon="ph:shield-check" className="alert-success light" >This is simple alert </Alert>
    <Alert dismissible icon="ph:warning-diamond" className="alert-danger">This is simple alert </Alert>
    <Alert dismissible icon="ph:seal-warning" className="alert-warning">This is simple alert</Alert>
    <Alert dismissible icon="ph:infinity" className="alert-info"> This is simple alert </Alert>
    </>
  )
}
export default DismissibleAlert
`,n=()=>s("div",{className:" space-y-4",children:[l(e,{label:"This is simple alert",className:"alert-primary light"}),l(e,{label:"This is simple alert",className:"alert-secondary light"}),l(e,{label:"This is simple alert",className:"alert-success light"}),l(e,{label:"This is simple alert",className:"alert-danger light"}),l(e,{label:"This is simple alert",className:"alert-warning light"}),l(e,{label:"This is simple alert",className:"alert-info light"}),l(e,{label:"This is simple alert",className:"alert-light light"})]}),h=()=>s("div",{className:" space-y-4",children:[l(e,{label:"This is simple alert",className:"alert-outline-primary"}),l(e,{label:"This is simple alert",className:"alert-outline-secondary"}),l(e,{label:"This is simple alert",className:"alert-outline-success"}),l(e,{label:"This is simple alert",className:"alert-outline-danger"}),l(e,{label:"This is simple alert",className:"alert-outline-warning"}),l(e,{label:"This is simple alert",className:"alert-outline-info"}),l(e,{label:"This is simple alert",className:"alert-outline-light"}),l(e,{label:"This is simple alert",className:"alert-outline-dark"})]}),o=()=>s("div",{className:"space-y-4",children:[l(e,{dismissible:!0,icon:"ph:info",label:"This is simple alert"}),l(e,{dismissible:!0,icon:"ph:info",className:"alert-outline-secondary !text-fuchsia-500",label:"This is simple alert"}),l(e,{dismissible:!0,icon:"ph:shield-check",className:"alert-success light",children:"This is simple alert "}),l(e,{dismissible:!0,icon:"ph:warning-diamond",className:"alert-danger",children:"This is simple alert "}),l(e,{dismissible:!0,icon:"ph:seal-warning",className:"alert-warning",children:"This is simple alert"}),l(e,{dismissible:!0,icon:"ph:infinity",className:"alert-info",children:" This is simple alert "})]}),T=()=>s("div",{className:"grid xl:grid-cols-2 grid-cols-1 gap-5",children:[l(i,{title:"Basic Alert",code:t,children:l(a,{})}),l(i,{title:"Outline Alerts",code:r,children:l(h,{})}),l(i,{title:"Soft Alerts",code:m,children:l(n,{})}),l(i,{title:"Dismissible Alerts",code:c,children:l(o,{})})]});export{T as default};
