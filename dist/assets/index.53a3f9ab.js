import{r as i,j as t,c as P,I as u,F as x}from"./index.bd1bbb16.js";import{c as l}from"./code-snippet.39c1ea2b.js";import"./Card.38321d90.js";import"./toConsumableArray.e5b41f38.js";const d=({totalPages:n,currentPage:e,handlePageChange:a,text:r,className:c="custom-class"})=>{const[s,h]=i.exports.useState([]);return i.exports.useEffect(()=>{let o=[];for(let g=1;g<=n;g++)o.push(g);h(o)},[n]),t("div",{className:c,children:P("ul",{className:"pagination",children:[t("li",{children:r?t("button",{className:" text-gray-600 dark:text-gray-300 prev-next-btn",onClick:()=>a(e-1),disabled:e===1,children:"Previous"}):t("button",{className:"text-xl leading-4 text-gray-900 dark:text-white h-6  w-6 flex  items-center justify-center flex-col prev-next-btn ",onClick:()=>a(e-1),disabled:e===1,children:t(u,{icon:"heroicons-outline:chevron-left"})})}),s.map(o=>t("li",{children:t("button",{className:`${o===e?"active":""} page-link`,onClick:()=>a(o),disabled:o===e,children:o})},o)),t("li",{children:r?t("button",{onClick:()=>a(e+1),disabled:e===n,className:" text-gray-600 dark:text-gray-300 prev-next-btn",children:"Next"}):t("button",{className:"text-xl leading-4 text-gray-900 dark:text-white  h-6  w-6 flex  items-center justify-center flex-col prev-next-btn",onClick:()=>a(e+1),disabled:e===n,children:t(u,{icon:"heroicons-outline:chevron-right"})})})]})})},p=()=>{const[n,e]=i.exports.useState(1),[a,r]=i.exports.useState(6);return t(x,{children:t(d,{totalPages:a,currentPage:n,handlePageChange:s=>{e(s)}})})},m=`
import Pagination from "@/components/ui/Pagination";
const BasicPagination = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(6);
  return (
    <>
       <Pagination totalPages={totalPages}  currentPage={currentPage} handlePageChange={handlePageChange} />
    </>
  )
}
export default BasicPagination
`,f=`
import Pagination from "@/components/ui/Pagination";
const PaginationWithBackground = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(6);
  return (
    <>
    <Pagination
    className="bg-gray-100 dark:bg-gray-500  w-fit py-2 px-3 rounded "
    totalPages={totalPages}
    currentPage={currentPage}
    handlePageChange={handlePageChange}
/>
    </>
  )
}
export default PaginationWithBackground
`,b=`
import Pagination from "@/components/ui/Pagination";
const PaginationWithBackground = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(6);
  return (
    <>
    
    <Pagination
    text
    totalPages={totalPages}
    currentPage={currentPage}
    handlePageChange={handlePageChange}
/>
    </>
  )
}
export default PaginationWithBackground
`,k=()=>{const[n,e]=i.exports.useState(1),[a,r]=i.exports.useState(6);return t(d,{className:"bg-gray-100 dark:bg-gray-500  w-fit py-2 px-3 rounded ",totalPages:a,currentPage:n,handlePageChange:s=>{e(s)}})},C=()=>{const[n,e]=i.exports.useState(1),[a,r]=i.exports.useState(6);return t(d,{text:!0,totalPages:a,currentPage:n,handlePageChange:s=>{e(s)}})},N=()=>P("div",{className:"space-y-5",children:[t(l,{title:"Basic Pagination",code:m,children:t(p,{})}),t(l,{title:"Pagination With Background",code:f,children:t(k,{})}),t("div",{children:t(l,{title:"Pagination With Text",code:b,children:t(C,{})})})]});export{N as default};
