import{r as s,j as e,F as n}from"./index.27cd9fa4.js";import{c as a}from"./code-snippet.8e057535.js";import"./Card.e7cd9ee8.js";import"./toConsumableArray.e5b41f38.js";function c({url:t,className:o="w-full"}){const[r,i]=s.exports.useState(!1);return e("div",{className:"w-full relative",children:e("video",{src:t,onClick:()=>{i(!r)},controls:!0,className:o})})}const l=()=>e(n,{children:e(c,{url:"https://vjs.zencdn.net/v/oceans.mp4"})}),d=`import React from 'react';

import VideoPlayer from "@/components/ui/VideoPlayer";

const Video = () => {
    return (
    <>
        <VideoPlayer url="https://vjs.zencdn.net/v/oceans.mp4" />
    </>
    );
};

export default Video;
`,v=()=>e("div",{className:"div",children:e(a,{title:"Video",code:d,children:e(l,{})})});export{v as default};
