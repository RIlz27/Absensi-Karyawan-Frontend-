import{a_ as N,a$ as M,b0 as $e,b1 as Ke,w as f,r as p,j as l,c as T,B as S,F as vt}from"./index.27cd9fa4.js";import{c as H}from"./code-snippet.8e057535.js";import"./Card.e7cd9ee8.js";import"./toConsumableArray.e5b41f38.js";var ht=new Map([["aac","audio/aac"],["abw","application/x-abiword"],["arc","application/x-freearc"],["avif","image/avif"],["avi","video/x-msvideo"],["azw","application/vnd.amazon.ebook"],["bin","application/octet-stream"],["bmp","image/bmp"],["bz","application/x-bzip"],["bz2","application/x-bzip2"],["cda","application/x-cdf"],["csh","application/x-csh"],["css","text/css"],["csv","text/csv"],["doc","application/msword"],["docx","application/vnd.openxmlformats-officedocument.wordprocessingml.document"],["eot","application/vnd.ms-fontobject"],["epub","application/epub+zip"],["gz","application/gzip"],["gif","image/gif"],["heic","image/heic"],["heif","image/heif"],["htm","text/html"],["html","text/html"],["ico","image/vnd.microsoft.icon"],["ics","text/calendar"],["jar","application/java-archive"],["jpeg","image/jpeg"],["jpg","image/jpeg"],["js","text/javascript"],["json","application/json"],["jsonld","application/ld+json"],["mid","audio/midi"],["midi","audio/midi"],["mjs","text/javascript"],["mp3","audio/mpeg"],["mp4","video/mp4"],["mpeg","video/mpeg"],["mpkg","application/vnd.apple.installer+xml"],["odp","application/vnd.oasis.opendocument.presentation"],["ods","application/vnd.oasis.opendocument.spreadsheet"],["odt","application/vnd.oasis.opendocument.text"],["oga","audio/ogg"],["ogv","video/ogg"],["ogx","application/ogg"],["opus","audio/opus"],["otf","font/otf"],["png","image/png"],["pdf","application/pdf"],["php","application/x-httpd-php"],["ppt","application/vnd.ms-powerpoint"],["pptx","application/vnd.openxmlformats-officedocument.presentationml.presentation"],["rar","application/vnd.rar"],["rtf","application/rtf"],["sh","application/x-sh"],["svg","image/svg+xml"],["swf","application/x-shockwave-flash"],["tar","application/x-tar"],["tif","image/tiff"],["tiff","image/tiff"],["ts","video/mp2t"],["ttf","font/ttf"],["txt","text/plain"],["vsd","application/vnd.visio"],["wav","audio/wav"],["weba","audio/webm"],["webm","video/webm"],["webp","image/webp"],["woff","font/woff"],["woff2","font/woff2"],["xhtml","application/xhtml+xml"],["xls","application/vnd.ms-excel"],["xlsx","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],["xml","application/xml"],["xul","application/vnd.mozilla.xul+xml"],["zip","application/zip"],["7z","application/x-7z-compressed"],["mkv","video/x-matroska"],["mov","video/quicktime"],["msg","application/vnd.ms-outlook"]]);function Y(e,t){var r=yt(e);if(typeof r.path!="string"){var n=e.webkitRelativePath;Object.defineProperty(r,"path",{value:typeof t=="string"?t:typeof n=="string"&&n.length>0?n:e.name,writable:!1,configurable:!1,enumerable:!0})}return r}function yt(e){var t=e.name,r=t&&t.lastIndexOf(".")!==-1;if(r&&!e.type){var n=t.split(".").pop().toLowerCase(),o=ht.get(n);o&&Object.defineProperty(e,"type",{value:o,writable:!1,configurable:!1,enumerable:!0})}return e}var bt=[".DS_Store","Thumbs.db"];function xt(e){return N(this,void 0,void 0,function(){return M(this,function(t){return te(e)&&Ft(e.dataTransfer)?[2,At(e.dataTransfer,e.type)]:Dt(e)?[2,wt(e)]:Array.isArray(e)&&e.every(function(r){return"getFile"in r&&typeof r.getFile=="function"})?[2,Ct(e)]:[2,[]]})})}function Ft(e){return te(e)}function Dt(e){return te(e)&&te(e.target)}function te(e){return typeof e=="object"&&e!==null}function wt(e){return be(e.target.files).map(function(t){return Y(t)})}function Ct(e){return N(this,void 0,void 0,function(){var t;return M(this,function(r){switch(r.label){case 0:return[4,Promise.all(e.map(function(n){return n.getFile()}))];case 1:return t=r.sent(),[2,t.map(function(n){return Y(n)})]}})})}function At(e,t){return N(this,void 0,void 0,function(){var r,n;return M(this,function(o){switch(o.label){case 0:return e.items?(r=be(e.items).filter(function(a){return a.kind==="file"}),t!=="drop"?[2,r]:[4,Promise.all(r.map(Ot))]):[3,2];case 1:return n=o.sent(),[2,Ue(Xe(n))];case 2:return[2,Ue(be(e.files).map(function(a){return Y(a)}))]}})})}function Ue(e){return e.filter(function(t){return bt.indexOf(t.name)===-1})}function be(e){if(e===null)return[];for(var t=[],r=0;r<e.length;r++){var n=e[r];t.push(n)}return t}function Ot(e){if(typeof e.webkitGetAsEntry!="function")return He(e);var t=e.webkitGetAsEntry();return t&&t.isDirectory?et(t):He(e)}function Xe(e){return e.reduce(function(t,r){return $e($e([],Ke(t),!1),Ke(Array.isArray(r)?Xe(r):[r]),!1)},[])}function He(e){var t=e.getAsFile();if(!t)return Promise.reject("".concat(e," is not a File"));var r=Y(t);return Promise.resolve(r)}function Et(e){return N(this,void 0,void 0,function(){return M(this,function(t){return[2,e.isDirectory?et(e):jt(e)]})})}function et(e){var t=e.createReader();return new Promise(function(r,n){var o=[];function a(){var c=this;t.readEntries(function(u){return N(c,void 0,void 0,function(){var v,D,w;return M(this,function(g){switch(g.label){case 0:if(u.length)return[3,5];g.label=1;case 1:return g.trys.push([1,3,,4]),[4,Promise.all(o)];case 2:return v=g.sent(),r(v),[3,4];case 3:return D=g.sent(),n(D),[3,4];case 4:return[3,6];case 5:w=Promise.all(u.map(Et)),o.push(w),a(),g.label=6;case 6:return[2]}})})},function(u){n(u)})}a()})}function jt(e){return N(this,void 0,void 0,function(){return M(this,function(t){return[2,new Promise(function(r,n){e.file(function(o){var a=Y(o,e.fullPath);r(a)},function(o){n(o)})})]})})}var St=function(e,t){if(e&&t){var r=Array.isArray(t)?t:t.split(","),n=e.name||"",o=(e.type||"").toLowerCase(),a=o.replace(/\/.*$/,"");return r.some(function(c){var u=c.trim().toLowerCase();return u.charAt(0)==="."?n.toLowerCase().endsWith(u):u.endsWith("/*")?a===u.replace(/\/.*$/,""):o===u})}return!0};function We(e){return kt(e)||Pt(e)||rt(e)||_t()}function _t(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Pt(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function kt(e){if(Array.isArray(e))return xe(e)}function Ye(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(o){return Object.getOwnPropertyDescriptor(e,o).enumerable})),r.push.apply(r,n)}return r}function Ge(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]!=null?arguments[t]:{};t%2?Ye(Object(r),!0).forEach(function(n){tt(e,n,r[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Ye(Object(r)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))})}return e}function tt(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function W(e,t){return Tt(e)||Rt(e,t)||rt(e,t)||It()}function It(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function rt(e,t){if(!!e){if(typeof e=="string")return xe(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);if(r==="Object"&&e.constructor&&(r=e.constructor.name),r==="Map"||r==="Set")return Array.from(e);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return xe(e,t)}}function xe(e,t){(t==null||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function Rt(e,t){var r=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(r!=null){var n=[],o=!0,a=!1,c,u;try{for(r=r.call(e);!(o=(c=r.next()).done)&&(n.push(c.value),!(t&&n.length===t));o=!0);}catch(v){a=!0,u=v}finally{try{!o&&r.return!=null&&r.return()}finally{if(a)throw u}}return n}}function Tt(e){if(Array.isArray(e))return e}var Nt="file-invalid-type",Mt="file-too-large",Lt="file-too-small",zt="too-many-files",Bt=function(t){t=Array.isArray(t)&&t.length===1?t[0]:t;var r=Array.isArray(t)?"one of ".concat(t.join(", ")):t;return{code:Nt,message:"File type must be ".concat(r)}},Ze=function(t){return{code:Mt,message:"File is larger than ".concat(t," ").concat(t===1?"byte":"bytes")}},qe=function(t){return{code:Lt,message:"File is smaller than ".concat(t," ").concat(t===1?"byte":"bytes")}},$t={code:zt,message:"Too many files"};function nt(e,t){var r=e.type==="application/x-moz-file"||St(e,t);return[r,r?null:Bt(t)]}function ot(e,t,r){if(j(e.size))if(j(t)&&j(r)){if(e.size>r)return[!1,Ze(r)];if(e.size<t)return[!1,qe(t)]}else{if(j(t)&&e.size<t)return[!1,qe(t)];if(j(r)&&e.size>r)return[!1,Ze(r)]}return[!0,null]}function j(e){return e!=null}function Kt(e){var t=e.files,r=e.accept,n=e.minSize,o=e.maxSize,a=e.multiple,c=e.maxFiles,u=e.validator;return!a&&t.length>1||a&&c>=1&&t.length>c?!1:t.every(function(v){var D=nt(v,r),w=W(D,1),g=w[0],A=ot(v,n,o),L=W(A,1),z=L[0],B=u?u(v):null;return g&&z&&!B})}function re(e){return typeof e.isPropagationStopped=="function"?e.isPropagationStopped():typeof e.cancelBubble<"u"?e.cancelBubble:!1}function ee(e){return e.dataTransfer?Array.prototype.some.call(e.dataTransfer.types,function(t){return t==="Files"||t==="application/x-moz-file"}):!!e.target&&!!e.target.files}function Je(e){e.preventDefault()}function Ut(e){return e.indexOf("MSIE")!==-1||e.indexOf("Trident/")!==-1}function Ht(e){return e.indexOf("Edge/")!==-1}function Wt(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:window.navigator.userAgent;return Ut(e)||Ht(e)}function C(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];return function(n){for(var o=arguments.length,a=new Array(o>1?o-1:0),c=1;c<o;c++)a[c-1]=arguments[c];return t.some(function(u){return!re(n)&&u&&u.apply(void 0,[n].concat(a)),re(n)})}}function Yt(){return"showOpenFilePicker"in window}function Gt(e){if(j(e)){var t=Object.entries(e).filter(function(r){var n=W(r,2),o=n[0],a=n[1],c=!0;return it(o)||(console.warn('Skipped "'.concat(o,'" because it is not a valid MIME type. Check https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types for a list of valid MIME types.')),c=!1),(!Array.isArray(a)||!a.every(at))&&(console.warn('Skipped "'.concat(o,'" because an invalid file extension was provided.')),c=!1),c}).reduce(function(r,n){var o=W(n,2),a=o[0],c=o[1];return Ge(Ge({},r),{},tt({},a,c))},{});return[{description:"Files",accept:t}]}return e}function Zt(e){if(j(e))return Object.entries(e).reduce(function(t,r){var n=W(r,2),o=n[0],a=n[1];return[].concat(We(t),[o],We(a))},[]).filter(function(t){return it(t)||at(t)}).join(",")}function qt(e){return e instanceof DOMException&&(e.name==="AbortError"||e.code===e.ABORT_ERR)}function Jt(e){return e instanceof DOMException&&(e.name==="SecurityError"||e.code===e.SECURITY_ERR)}function it(e){return e==="audio/*"||e==="video/*"||e==="image/*"||e==="text/*"||/\w+\/[-+.\w]+/g.test(e)}function at(e){return/^.*\.[\w]+$/.test(e)}var Vt=["children"],Qt=["open"],Xt=["refKey","role","onKeyDown","onFocus","onBlur","onClick","onDragEnter","onDragOver","onDragLeave","onDrop"],er=["refKey","onChange","onClick"];function tr(e){return or(e)||nr(e)||st(e)||rr()}function rr(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function nr(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function or(e){if(Array.isArray(e))return Fe(e)}function ye(e,t){return sr(e)||ar(e,t)||st(e,t)||ir()}function ir(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function st(e,t){if(!!e){if(typeof e=="string")return Fe(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);if(r==="Object"&&e.constructor&&(r=e.constructor.name),r==="Map"||r==="Set")return Array.from(e);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return Fe(e,t)}}function Fe(e,t){(t==null||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function ar(e,t){var r=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(r!=null){var n=[],o=!0,a=!1,c,u;try{for(r=r.call(e);!(o=(c=r.next()).done)&&(n.push(c.value),!(t&&n.length===t));o=!0);}catch(v){a=!0,u=v}finally{try{!o&&r.return!=null&&r.return()}finally{if(a)throw u}}return n}}function sr(e){if(Array.isArray(e))return e}function Ve(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(o){return Object.getOwnPropertyDescriptor(e,o).enumerable})),r.push.apply(r,n)}return r}function d(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]!=null?arguments[t]:{};t%2?Ve(Object(r),!0).forEach(function(n){De(e,n,r[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Ve(Object(r)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))})}return e}function De(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function ne(e,t){if(e==null)return{};var r=lr(e,t),n,o;if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],!(t.indexOf(n)>=0)&&(!Object.prototype.propertyIsEnumerable.call(e,n)||(r[n]=e[n]))}return r}function lr(e,t){if(e==null)return{};var r={},n=Object.keys(e),o,a;for(a=0;a<n.length;a++)o=n[a],!(t.indexOf(o)>=0)&&(r[o]=e[o]);return r}var Ce=p.exports.forwardRef(function(e,t){var r=e.children,n=ne(e,Vt),o=ct(n),a=o.open,c=ne(o,Qt);return p.exports.useImperativeHandle(t,function(){return{open:a}},[a]),l(p.exports.Fragment,{children:r(d(d({},c),{},{open:a}))})});Ce.displayName="Dropzone";var lt={disabled:!1,getFilesFromEvent:xt,maxSize:1/0,minSize:0,multiple:!0,maxFiles:0,preventDropOnDocument:!0,noClick:!1,noKeyboard:!1,noDrag:!1,noDragEventsBubbling:!1,validator:null,useFsAccessApi:!0,autoFocus:!1};Ce.defaultProps=lt;Ce.propTypes={children:f.exports.func,accept:f.exports.objectOf(f.exports.arrayOf(f.exports.string)),multiple:f.exports.bool,preventDropOnDocument:f.exports.bool,noClick:f.exports.bool,noKeyboard:f.exports.bool,noDrag:f.exports.bool,noDragEventsBubbling:f.exports.bool,minSize:f.exports.number,maxSize:f.exports.number,maxFiles:f.exports.number,disabled:f.exports.bool,getFilesFromEvent:f.exports.func,onFileDialogCancel:f.exports.func,onFileDialogOpen:f.exports.func,useFsAccessApi:f.exports.bool,autoFocus:f.exports.bool,onDragEnter:f.exports.func,onDragLeave:f.exports.func,onDragOver:f.exports.func,onDrop:f.exports.func,onDropAccepted:f.exports.func,onDropRejected:f.exports.func,onError:f.exports.func,validator:f.exports.func};var we={isFocused:!1,isFileDialogActive:!1,isDragActive:!1,isDragAccept:!1,isDragReject:!1,acceptedFiles:[],fileRejections:[]};function ct(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=d(d({},lt),e),r=t.accept,n=t.disabled,o=t.getFilesFromEvent,a=t.maxSize,c=t.minSize,u=t.multiple,v=t.maxFiles,D=t.onDragEnter,w=t.onDragLeave,g=t.onDragOver,A=t.onDrop,L=t.onDropAccepted,z=t.onDropRejected,B=t.onFileDialogCancel,oe=t.onFileDialogOpen,Ae=t.useFsAccessApi,Oe=t.autoFocus,ie=t.preventDropOnDocument,Ee=t.noClick,ae=t.noKeyboard,je=t.noDrag,O=t.noDragEventsBubbling,se=t.onError,$=t.validator,K=p.exports.useMemo(function(){return Zt(r)},[r]),Se=p.exports.useMemo(function(){return Gt(r)},[r]),le=p.exports.useMemo(function(){return typeof oe=="function"?oe:Qe},[oe]),G=p.exports.useMemo(function(){return typeof B=="function"?B:Qe},[B]),y=p.exports.useRef(null),F=p.exports.useRef(null),ut=p.exports.useReducer(cr,we),_e=ye(ut,2),ce=_e[0],b=_e[1],pt=ce.isFocused,Pe=ce.isFileDialogActive,Z=p.exports.useRef(typeof window<"u"&&window.isSecureContext&&Ae&&Yt()),ke=function(){!Z.current&&Pe&&setTimeout(function(){if(F.current){var s=F.current.files;s.length||(b({type:"closeDialog"}),G())}},300)};p.exports.useEffect(function(){return window.addEventListener("focus",ke,!1),function(){window.removeEventListener("focus",ke,!1)}},[F,Pe,G,Z]);var P=p.exports.useRef([]),Ie=function(s){y.current&&y.current.contains(s.target)||(s.preventDefault(),P.current=[])};p.exports.useEffect(function(){return ie&&(document.addEventListener("dragover",Je,!1),document.addEventListener("drop",Ie,!1)),function(){ie&&(document.removeEventListener("dragover",Je),document.removeEventListener("drop",Ie))}},[y,ie]),p.exports.useEffect(function(){return!n&&Oe&&y.current&&y.current.focus(),function(){}},[y,Oe,n]);var E=p.exports.useCallback(function(i){se?se(i):console.error(i)},[se]),Re=p.exports.useCallback(function(i){i.preventDefault(),i.persist(),Q(i),P.current=[].concat(tr(P.current),[i.target]),ee(i)&&Promise.resolve(o(i)).then(function(s){if(!(re(i)&&!O)){var m=s.length,h=m>0&&Kt({files:s,accept:K,minSize:c,maxSize:a,multiple:u,maxFiles:v,validator:$}),x=m>0&&!h;b({isDragAccept:h,isDragReject:x,isDragActive:!0,type:"setDraggedFiles"}),D&&D(i)}}).catch(function(s){return E(s)})},[o,D,E,O,K,c,a,u,v,$]),Te=p.exports.useCallback(function(i){i.preventDefault(),i.persist(),Q(i);var s=ee(i);if(s&&i.dataTransfer)try{i.dataTransfer.dropEffect="copy"}catch{}return s&&g&&g(i),!1},[g,O]),Ne=p.exports.useCallback(function(i){i.preventDefault(),i.persist(),Q(i);var s=P.current.filter(function(h){return y.current&&y.current.contains(h)}),m=s.indexOf(i.target);m!==-1&&s.splice(m,1),P.current=s,!(s.length>0)&&(b({type:"setDraggedFiles",isDragActive:!1,isDragAccept:!1,isDragReject:!1}),ee(i)&&w&&w(i))},[y,w,O]),q=p.exports.useCallback(function(i,s){var m=[],h=[];i.forEach(function(x){var U=nt(x,K),R=ye(U,2),pe=R[0],fe=R[1],de=ot(x,c,a),X=ye(de,2),me=X[0],ge=X[1],ve=$?$(x):null;if(pe&&me&&!ve)m.push(x);else{var he=[fe,ge];ve&&(he=he.concat(ve)),h.push({file:x,errors:he.filter(function(gt){return gt})})}}),(!u&&m.length>1||u&&v>=1&&m.length>v)&&(m.forEach(function(x){h.push({file:x,errors:[$t]})}),m.splice(0)),b({acceptedFiles:m,fileRejections:h,type:"setFiles"}),A&&A(m,h,s),h.length>0&&z&&z(h,s),m.length>0&&L&&L(m,s)},[b,u,K,c,a,v,A,L,z,$]),J=p.exports.useCallback(function(i){i.preventDefault(),i.persist(),Q(i),P.current=[],ee(i)&&Promise.resolve(o(i)).then(function(s){re(i)&&!O||q(s,i)}).catch(function(s){return E(s)}),b({type:"reset"})},[o,q,E,O]),k=p.exports.useCallback(function(){if(Z.current){b({type:"openDialog"}),le();var i={multiple:u,types:Se};window.showOpenFilePicker(i).then(function(s){return o(s)}).then(function(s){q(s,null),b({type:"closeDialog"})}).catch(function(s){qt(s)?(G(s),b({type:"closeDialog"})):Jt(s)?(Z.current=!1,F.current?(F.current.value=null,F.current.click()):E(new Error("Cannot open the file picker because the https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API is not supported and no <input> was provided."))):E(s)});return}F.current&&(b({type:"openDialog"}),le(),F.current.value=null,F.current.click())},[b,le,G,Ae,q,E,Se,u]),Me=p.exports.useCallback(function(i){!y.current||!y.current.isEqualNode(i.target)||(i.key===" "||i.key==="Enter"||i.keyCode===32||i.keyCode===13)&&(i.preventDefault(),k())},[y,k]),Le=p.exports.useCallback(function(){b({type:"focus"})},[]),ze=p.exports.useCallback(function(){b({type:"blur"})},[]),Be=p.exports.useCallback(function(){Ee||(Wt()?setTimeout(k,0):k())},[Ee,k]),I=function(s){return n?null:s},ue=function(s){return ae?null:I(s)},V=function(s){return je?null:I(s)},Q=function(s){O&&s.stopPropagation()},ft=p.exports.useMemo(function(){return function(){var i=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},s=i.refKey,m=s===void 0?"ref":s,h=i.role,x=i.onKeyDown,U=i.onFocus,R=i.onBlur,pe=i.onClick,fe=i.onDragEnter,de=i.onDragOver,X=i.onDragLeave,me=i.onDrop,ge=ne(i,Xt);return d(d(De({onKeyDown:ue(C(x,Me)),onFocus:ue(C(U,Le)),onBlur:ue(C(R,ze)),onClick:I(C(pe,Be)),onDragEnter:V(C(fe,Re)),onDragOver:V(C(de,Te)),onDragLeave:V(C(X,Ne)),onDrop:V(C(me,J)),role:typeof h=="string"&&h!==""?h:"presentation"},m,y),!n&&!ae?{tabIndex:0}:{}),ge)}},[y,Me,Le,ze,Be,Re,Te,Ne,J,ae,je,n]),dt=p.exports.useCallback(function(i){i.stopPropagation()},[]),mt=p.exports.useMemo(function(){return function(){var i=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},s=i.refKey,m=s===void 0?"ref":s,h=i.onChange,x=i.onClick,U=ne(i,er),R=De({accept:K,multiple:u,type:"file",style:{display:"none"},onChange:I(C(h,J)),onClick:I(C(x,dt)),tabIndex:-1},m,F);return d(d({},R),U)}},[F,r,u,J,n]);return d(d({},ce),{},{isFocused:pt&&!n,getRootProps:ft,getInputProps:mt,rootRef:y,inputRef:F,open:I(k)})}function cr(e,t){switch(t.type){case"focus":return d(d({},e),{},{isFocused:!0});case"blur":return d(d({},e),{},{isFocused:!1});case"openDialog":return d(d({},we),{},{isFileDialogActive:!0});case"closeDialog":return d(d({},e),{},{isFileDialogActive:!1});case"setDraggedFiles":return d(d({},e),{},{isDragActive:t.isDragActive,isDragAccept:t.isDragAccept,isDragReject:t.isDragReject});case"setFiles":return d(d({},e),{},{acceptedFiles:t.acceptedFiles,fileRejections:t.fileRejections});case"reset":return d({},we);default:return e}}function Qe(){}const ur="/assets/upload.504e0aae.svg",pr=()=>{const[e,t]=p.exports.useState([]),{getRootProps:r,getInputProps:n,isDragAccept:o}=ct({accept:{"image/*":[]},onDrop:a=>{t(a.map(c=>Object.assign(c,{preview:URL.createObjectURL(c)})))}});return l("div",{children:T("div",{className:"w-full text-center border-dashed border border-gray-400 rounded-lg py-[52px] flex flex-col justify-center items-center",children:[e.length===0&&T("div",{...r({className:"dropzone"}),children:[l("input",{className:"hidden",...n()}),l("img",{src:ur,alt:"",className:"mx-auto mb-4"}),o?l("p",{className:"text-sm text-gray-500 dark:text-gray-300 ",children:"Drop the files here ..."}):l("p",{className:"text-sm text-gray-500 dark:text-gray-300 f",children:"Drop files here or click to upload."})]}),l("div",{className:"flex space-x-4",children:e.map((a,c)=>l("div",{className:"mb-4 flex-none",children:l("div",{className:"h-[300px] w-[300px] mx-auto mt-6 rounded-lg",children:l("img",{src:a.preview,className:" object-contain h-full w-full block rounded-lg",onLoad:()=>{URL.revokeObjectURL(a.preview)}})})},c))})]})})},_=({label:e,onChange:t,placeholder:r="Choose a file or drop it here...",multiple:n,preview:o,className:a,id:c,selectedFile:u,badge:v,selectedFiles:D,children:w})=>l("div",{children:T("div",{className:"file-group",children:[T("label",{className:a,children:[l("input",{type:"file",onChange:t,className:" w-full hidden",id:c,multiple:n,placeholder:r}),e||w]}),!n&&o&&u&&l("div",{className:"w-[200px] h-[200px] mx-auto mt-6  ",children:l("img",{src:u?URL.createObjectURL(u):"",className:"w-full  h-full block rounded object-contain border p-2  border-gray-200",alt:u==null?void 0:u.name})}),n&&o&&D.length>0&&l("div",{className:"flex flex-wrap space-x-5 rtl:space-x-reverse",children:D.map((g,A)=>l("div",{className:"xl:w-1/5 md:w-1/3 w-1/2 rounded mt-6 border p-2  border-gray-200",children:l("img",{src:g?URL.createObjectURL(g):"",className:"object-cover w-full h-full rounded",alt:g==null?void 0:g.name})},A))})]})}),fr=()=>{const[e,t]=p.exports.useState(null),r=n=>{t(n.target.files[0])};return T("div",{className:"flex space-x-3",children:[l(_,{selectedFile:e,onChange:r,children:l(S,{div:!0,icon:"ph:upload",text:"Choose File",iconClass:"text-2xl",className:"bg-gray-100 dark:bg-gray-700 dark:text-gray-300  text-gray-600 btn-sm"})}),l(_,{selectedFile:e,onChange:r,children:l(S,{div:!0,icon:"ph:upload",text:"Choose File",iconClass:"text-2xl",className:"bg-indigo-500  text-white btn-sm"})}),l(_,{selectedFile:e,onChange:r,children:l(S,{div:!0,icon:"ph:upload",text:"Choose File",iconClass:"text-2xl",className:"btn-outline-primary btn-sm"})}),l(_,{selectedFile:e,onChange:r,children:l(S,{icon:"ph:upload",className:"btn-info h-10 w-10  rounded-full items-center justify-center p-0"})})]})},dr=`
import React, { useState } from 'react';
import Fileinput from "@/components/ui/Fileinput";
import Button from "@/components/ui/Button";
const BasicInputFile = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };
  return (
    <>
    <Fileinput selectedFile={selectedFile} onChange={handleFileChange}>
    <Button
        div
        icon="ph:upload"
        text="Choose File"
        iconClass="text-2xl"
        className="bg-gray-100 dark:bg-gray-700 dark:text-gray-300  text-gray-600 btn-sm"
    />
</Fileinput>
<Fileinput selectedFile={selectedFile} onChange={handleFileChange}>
    <Button
        div
        icon="ph:upload"
        text="Choose File"
        iconClass="text-2xl"
        className="bg-indigo-500  text-white btn-sm"
    />
</Fileinput>
<Fileinput selectedFile={selectedFile} onChange={handleFileChange}>
    <Button
        div
        icon="ph:upload"
        text="Choose File"
        iconClass="text-2xl"
        className="btn-outline-primary btn-sm"
    />
</Fileinput>
<Fileinput selectedFile={selectedFile} onChange={handleFileChange}>
    <Button
        icon="ph:upload"
        className="btn-info h-10 w-10  rounded-full items-center justify-center p-0"
    />
</Fileinput>
    </>
  )
}
export default BasicInputFile
`,mr=`
import Fileinput from "@/components/ui/Fileinput";
import Button from "@/components/ui/Button";
const MultipleSelectFiles = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const handleFileChangeMultiple = (e) => {
        const files = e.target.files;
        const filesArray = Array.from(files).map((file) => file);
        setSelectedFiles(filesArray);
    };
  return (
    <>
    <Fileinput
       multiple
       selectedFiles={selectedFiles}
       onChange={handleFileChangeMultiple}>
    <Button
        div
        icon="ph:upload"
        text="Choose File"
        iconClass="text-2xl"
        className="bg-gray-100  text-gray-600 dark:bg-gray-700 dark:text-gray-300 btn-sm"/>
    </Fileinput>
    </>
  )
}
export default MultipleSelectFiles
`,gr=`
import React, { useState } from 'react';
import Button from "@/components/ui/Button";
import Fileinput from "@/components/ui/Fileinput";
const BasicInputPreview = () => {
    const [selectedFile2, setSelectedFile2] = useState(null);
    const handleFileChange2 = (e) => {
        setSelectedFile2(e.target.files[0]);
    };
  return (
    <>
    <Fileinput
    name="basic"
    selectedFile={selectedFile2}
    onChange={handleFileChange2}
    preview
>
    <Button
        div
        icon="ph:upload"
        text="Choose File"
        iconClass="text-2xl"
        className="bg-gray-100  dark:bg-gray-700 dark:text-gray-300 text-gray-600 btn-sm"
    />
</Fileinput>
    </>
  )
}
export default BasicInputPreview
`,vr=`
import React, { useState } from 'react';
import Fileinput from "@/components/ui/Fileinput";
import Button from "@/components/ui/Button";
const MultipleFilePreview = () => {
    const [selectedFiles2, setSelectedFiles2] = useState([]);
    const handleFileChangeMultiple2 = (e) => {
        const files = e.target.files;
        const filesArray = Array.from(files).map((file) => file);
        setSelectedFiles2(filesArray);
    };
  return (
    <>
    <Fileinput
    selectedFiles={selectedFiles2}
    onChange={handleFileChangeMultiple2}
    multiple
    preview
>
    <Button
        div
        icon="ph:upload"
        text="Choose File"
        iconClass="text-2xl"
        className="bg-gray-100 dark:bg-gray-700 dark:text-gray-300 text-gray-600 btn-sm"
    />
</Fileinput>
    </>
  )
}
export default MultipleFilePreview
`,hr=`
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import uploadSvgImage from "@/assets/images/svg/upload.svg";
const DropZone = () => {
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });
  return (
    <div>
      <div className="w-full text-center border-dashed border border-gray-400 rounded-lg py-[52px] flex flex-col justify-center items-center">
        {files.length === 0 && (
          <div {...getRootProps({ className: "dropzone" })}>
            <input className="hidden" {...getInputProps()} />
            <img src={uploadSvgImage} alt="" className="mx-auto mb-4" />
            {isDragAccept ? (
              <p className="text-sm text-gray-500 dark:text-gray-300 ">
                Drop the files here ...
              </p>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-300 f">
                Drop files here or click to upload.
              </p>
            )}
          </div>
        )}
        <div className="flex space-x-4">
          {files.map((file, i) => (
            <div key={i} className="mb-4 flex-none">
              <div className="h-[300px] w-[300px] mx-auto mt-6 rounded-lg">
                <img
                  src={file.preview}
                  className=" object-contain h-full w-full block rounded-lg"
                  onLoad={() => {
                    URL.revokeObjectURL(file.preview);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default DropZone;
`,yr=()=>{const[e,t]=p.exports.useState([]);return l(vt,{children:l(_,{multiple:!0,selectedFiles:e,onChange:n=>{const o=n.target.files,a=Array.from(o).map(c=>c);t(a)},children:l(S,{div:!0,icon:"ph:upload",text:"Choose File",iconClass:"text-2xl",className:"bg-gray-100  text-gray-600 dark:bg-gray-700 dark:text-gray-300 btn-sm"})})})},br=()=>{const[e,t]=p.exports.useState(null);return l(_,{name:"basic",selectedFile:e,onChange:n=>{t(n.target.files[0])},preview:!0,children:l(S,{div:!0,icon:"ph:upload",text:"Choose File",iconClass:"text-2xl",className:"bg-gray-100  dark:bg-gray-700 dark:text-gray-300 text-gray-600 btn-sm"})})},xr=()=>{const[e,t]=p.exports.useState([]);return l(_,{selectedFiles:e,onChange:n=>{const o=n.target.files,a=Array.from(o).map(c=>c);t(a)},multiple:!0,preview:!0,children:l(S,{div:!0,icon:"ph:upload",text:"Choose File",iconClass:"text-2xl",className:"bg-gray-100 dark:bg-gray-700 dark:text-gray-300 text-gray-600 btn-sm"})})},Ar=()=>T("div",{className:" space-y-5",children:[l(H,{title:"Basic Input File",code:dr,children:l(fr,{})}),l(H,{title:"Multiple Select",code:mr,children:l(yr,{})}),l(H,{title:"Basic input with preview",code:gr,children:l(br,{})}),l(H,{title:"multiple file with preview",code:vr,children:l(xr,{})}),l("div",{className:"xl:col-span-2 col-span-1",children:l(H,{title:"File upload",code:hr,children:l(pr,{})})})]});export{Ar as default};
