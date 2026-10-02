import{i as r}from"./du-web-nav-C_BPDic8.js";import"./oneapp-poc-button-DhAI0vn-.js";const h={info:"info-circle",success:"check-circle",warning:"warning-triangle",error:"warning-circle"};class u extends HTMLElement{static observedAttributes=["type","heading","supporting"];connectedCallback(){this.render()}attributeChangedCallback(){this.isConnected&&this.render()}render(){const e=this.getAttribute("type")??"info",t=this.getAttribute("heading")??"",i=this.getAttribute("supporting")??this.textContent?.trim()??"",s=e==="error"||e==="warning";this.innerHTML=`
      <div class="alert" role="${s?"alert":"status"}">
        <span class="icon">${r(h[e]??"info-circle",24)}</span>
        <div class="body">
          ${t?`<p class="heading">${t}</p>`:""}
          ${i?`<p class="supporting">${i}</p>`:""}
        </div>
      </div>`}}customElements.define("oneapp-poc-alert",u);class p extends HTMLElement{static observedAttributes=["glyph","size"];connectedCallback(){this.render()}attributeChangedCallback(){this.isConnected&&this.render()}render(){const e=this.getAttribute("glyph")??"upload",t=this.getAttribute("size")??"small",i=t==="large"?32:t==="medium"?24:20;this.innerHTML=`<span class="tile">${r(e,i)}</span>`}}customElements.define("du-decorative-icon",p);const v="(min-width: 840px)",l=window.matchMedia(v);function g(){return l.matches}function f(o){const e=()=>o();return l.addEventListener("change",e),()=>l.removeEventListener("change",e)}class b extends HTMLElement{static observedAttributes=["accept","hint"];input;offBreakpoint;connectedCallback(){this.render(),this.offBreakpoint=f(()=>this.render())}disconnectedCallback(){this.offBreakpoint?.()}attributeChangedCallback(){this.isConnected&&this.render()}render(){const e=this.getAttribute("accept")??".pdf,.jpg,.jpeg,.png",t=this.getAttribute("hint")??"PDF, JPG, or PNG · up to 10 MB",i=g();if(i?this.innerHTML=`
        <div class="zone">
          <du-decorative-icon glyph="upload" size="large"></du-decorative-icon>
          <div class="instructions">
            <p class="headline">Drag and drop your file here</p>
            <p class="hint">${t}</p>
          </div>
          <oneapp-poc-button hierarchy="secondary" size="small" label="Choose file"></oneapp-poc-button>
          <input type="file" accept="${e}" tabindex="-1" aria-hidden="true" />
        </div>`:this.innerHTML=`
        <button type="button" class="zone zone--tap">
          <du-decorative-icon glyph="upload" size="large"></du-decorative-icon>
          <div class="instructions">
            <p class="headline">Tap to choose a file</p>
            <p class="hint">${t}</p>
          </div>
        </button>
        <input type="file" accept="${e}" tabindex="-1" aria-hidden="true" />`,this.input=this.querySelector('input[type="file"]'),this.input.addEventListener("change",()=>{const s=this.input.files?.[0];s&&this.emit(s),this.input.value=""}),i){const s=this.querySelector(".zone");this.querySelector("oneapp-poc-button").addEventListener("click",()=>this.input.click()),s.addEventListener("dragover",a=>{a.preventDefault(),s.classList.add("is-dragover")}),s.addEventListener("dragleave",()=>s.classList.remove("is-dragover")),s.addEventListener("drop",a=>{a.preventDefault(),s.classList.remove("is-dragover");const n=a.dataTransfer?.files?.[0];n&&this.emit(n)})}else this.querySelector(".zone--tap").addEventListener("click",()=>this.input.click())}emit(e){this.dispatchEvent(new CustomEvent("file-chosen",{detail:e,bubbles:!0}))}}customElements.define("du-drop-zone",b);class m extends HTMLElement{static observedAttributes=["name","meta","actions","variant"];connectedCallback(){this.render()}attributeChangedCallback(){this.isConnected&&this.render()}render(){const e=this.getAttribute("name")??"",t=this.getAttribute("meta")??"",s=(this.getAttribute("actions")??"").split(",").map(n=>n.trim()).filter(Boolean).map(n=>n==="remove"?`<button type="button" class="remove" data-action="remove" aria-label="Remove ${e}">${r("trash",20)}</button>`:`<oneapp-poc-button hierarchy="tertiary" size="small" label="${n==="preview"?"Preview":n==="replace"?"Replace":n}" data-action="${n}"></oneapp-poc-button>`).join(""),a=this.getAttribute("variant")==="filled"?"filled":"bordered";this.innerHTML=`
      <div class="row" data-variant="${a}">
        <span class="icon-wrap" aria-hidden="true">${r("page-flip",20)}</span>
        <div class="text">
          <p class="name">${e}</p>
          <p class="meta">${t}</p>
        </div>
        ${s?`<div class="actions">${s}</div>`:""}
      </div>`,this.querySelectorAll("[data-action]").forEach(n=>{n.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("file-action",{detail:n.dataset.action,bubbles:!0}))})})}}customElements.define("du-file-row",m);let y=0;class k extends HTMLElement{static observedAttributes=["label","placeholder","value","helper","error","invalid"];input;fieldId=`note-${y++}`;connectedCallback(){this.input||this.render(),this.sync()}attributeChangedCallback(){this.input&&this.sync()}render(){const e=`${this.fieldId}-msg`;this.innerHTML=`
      <div class="field-wrap">
        <label for="${this.fieldId}"></label>
        <input id="${this.fieldId}" type="text" autocomplete="off" aria-describedby="${e}" />
        <p class="message" id="${e}"></p>
      </div>`,this.input=this.querySelector("input"),this.input.addEventListener("input",()=>{this.setAttribute("value",this.input.value),this.dispatchEvent(new CustomEvent("note-change",{detail:this.input.value,bubbles:!0}))})}sync(){if(!this.input)return;const e=this.getAttribute("label")??"",t=this.hasAttribute("invalid"),i=(t?this.getAttribute("error"):this.getAttribute("helper"))??"";this.querySelector("label").textContent=e,this.input.placeholder=this.getAttribute("placeholder")??"";const s=this.getAttribute("value")??"";this.input.value!==s&&(this.input.value=s),this.input.setAttribute("aria-invalid",t?"true":"false");const a=this.querySelector(".message");a.textContent=i,a.style.display=i?"":"none"}}customElements.define("oneapp-poc-note-input",k);class w extends HTMLElement{dialog;connectedCallback(){this.dialog||this.render()}render(){this.innerHTML=`
      <dialog class="preview" aria-label="Document preview">
        <div class="preview-grab" aria-hidden="true"></div>
        <div class="preview-head">
          <p class="preview-name"></p>
          <button type="button" class="preview-close" aria-label="Close preview">${r("close",24)}</button>
        </div>
        <div class="preview-body"></div>
      </dialog>`,this.dialog=this.querySelector("dialog"),this.querySelector(".preview-close").addEventListener("click",()=>this.close()),this.dialog.addEventListener("click",e=>{e.target===this.dialog&&this.close()}),this.dialog.addEventListener("close",()=>{const e=this.querySelector(".preview-body");e&&(e.innerHTML="")})}open(e){this.dialog||this.render(),this.querySelector(".preview-name").textContent=e.name;const t=this.querySelector(".preview-body"),i=/^(jpe?g|png|gif|webp)$/i.test(e.type);e.url?i?t.innerHTML=`<img class="preview-image" src="${e.url}" alt="${e.name}" />`:t.innerHTML=`<iframe class="preview-frame" src="${e.url}" title="${e.name}"></iframe>`:t.innerHTML=`<p class="preview-fallback">Preview isn't available for this file.</p>`,this.dialog.open||this.dialog.showModal()}close(){this.dialog?.open&&this.dialog.close()}}customElements.define("du-file-preview",w);const d=72,E=550;class $ extends HTMLElement{_items=[];_active="";open=!1;dockHidden=!1;holdTimer;holdOrigin;set items(e){this._items=e,this.render()}set active(e){this._active=e,this.syncActive()}connectedCallback(){this.render(),document.addEventListener("keydown",this.onKey),document.addEventListener("touchstart",this.onTouchStart,{passive:!0}),document.addEventListener("touchmove",this.onTouchMove,{passive:!0}),document.addEventListener("touchend",this.cancelHold,{passive:!0}),document.addEventListener("touchcancel",this.cancelHold,{passive:!0})}disconnectedCallback(){document.removeEventListener("keydown",this.onKey),document.removeEventListener("touchstart",this.onTouchStart),document.removeEventListener("touchmove",this.onTouchMove),document.removeEventListener("touchend",this.cancelHold),document.removeEventListener("touchcancel",this.cancelHold),this.cancelHold()}onKey=e=>{/^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName??"")||e.metaKey||e.ctrlKey||e.altKey||(e.key===">"?(e.preventDefault(),this.dockHidden?this.show():this.hide()):e.key==="."?(e.preventDefault(),this.dockHidden?this.show():this.toggle()):e.key==="Escape"&&this.open&&!this.dockHidden&&this.toggle(!1))};onTouchStart=e=>{if(!this.dockHidden)return;const t=e.touches[0];t&&t.clientX<=d&&t.clientY>=window.innerHeight-d&&(this.holdOrigin={x:t.clientX,y:t.clientY},this.holdTimer=setTimeout(()=>this.show(),E))};onTouchMove=e=>{if(this.holdTimer==null||!this.holdOrigin)return;const t=e.touches[0];t&&Math.hypot(t.clientX-this.holdOrigin.x,t.clientY-this.holdOrigin.y)>12&&this.cancelHold()};cancelHold=()=>{this.holdTimer&&(clearTimeout(this.holdTimer),this.holdTimer=void 0),this.holdOrigin=void 0};toggle(e){if(this.dockHidden)return this.show();this.open=e??!this.open,this.sync()}hide(){this.dockHidden=!0,this.open=!1,this.sync()}show(){this.dockHidden=!1,this.open=!0,this.sync()}sync(){const e=this.querySelector(".dock");e?.setAttribute("data-open",String(this.open)),e?.setAttribute("data-hidden",String(this.dockHidden)),this.open&&!this.dockHidden&&this.querySelector(".dock-list button")?.focus()}syncActive(){this.querySelectorAll(".dock-list button").forEach(e=>{e.toggleAttribute("data-active",e.dataset.id===this._active)})}render(){const e=new Map;for(const i of this._items){const s=i.group??"";e.has(s)||e.set(s,[]),e.get(s).push(i)}const t=[...e.entries()].map(([i,s])=>{const a=i?`<li class="dock-group">${i}</li>`:"",n=s.map(c=>`<li><button type="button" data-id="${c.id}"${c.id===this._active?" data-active":""}>${c.label}</button></li>`).join("");return a+n}).join("");this.innerHTML=`
      <div class="dock" data-open="${this.open}" data-hidden="${this.dockHidden}">
        <div class="dock-panel" role="dialog" aria-label="Scenario explorer">
          <div class="dock-head">
            <span class="dock-title">${r("beaker",18)} Scenario explorer</span>
            <div class="dock-head-actions">
              <button type="button" class="dock-hide" aria-label="Hide scenario explorer">${r("eye-off",20)}</button>
              <button type="button" class="dock-x" aria-label="Collapse scenario explorer">${r("close",20)}</button>
            </div>
          </div>
          <ul class="dock-list">${t}</ul>
          <p class="dock-hint"><kbd>.</kbd> toggle · <kbd>⇧.</kbd> hide</p>
        </div>
        <button type="button" class="dock-toggle" aria-label="Open scenario explorer">
          ${r("beaker",20)}<span>Scenarios</span>
        </button>
      </div>`,this.querySelector(".dock-toggle").addEventListener("click",()=>this.toggle()),this.querySelector(".dock-x").addEventListener("click",()=>this.toggle(!1)),this.querySelector(".dock-hide").addEventListener("click",()=>this.hide()),this.querySelectorAll(".dock-list button").forEach(i=>{i.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("scenario-pick",{detail:i.dataset.id})),this.toggle(!1)})})}}customElements.define("du-scenario-dock",$);function L(){const o=(i,s,a="#e8eaec")=>`<rect x="40" y="${i}" width="${s}" height="10" rx="5" fill="${a}"/>`,e=[220,246,272,298].map(i=>o(i,520-(i-220)/26*40)).join(""),t=[360,392,424,456,488].map(i=>`${o(i,220)}<rect x="440" y="${i}" width="120" height="10" rx="5" fill="#e8eaec"/>`).join("");return`<svg xmlns="http://www.w3.org/2000/svg" width="620" height="800" viewBox="0 0 620 800">
    <rect width="620" height="800" fill="#ffffff"/>
    <rect x="0" y="0" width="620" height="96" fill="#002169"/>
    <text x="40" y="58" fill="#ffffff" font-family="Arial, sans-serif" font-size="26" font-weight="700">OneMain Financial</text>
    <text x="40" y="164" fill="#051958" font-family="Arial, sans-serif" font-size="22" font-weight="700">Document preview</text>
    ${e}
    <rect x="40" y="330" width="540" height="1" fill="#cbd5e1"/>
    ${t}
    <rect x="40" y="540" width="540" height="1" fill="#cbd5e1"/>
    <rect x="40" y="700" width="200" height="12" rx="6" fill="#0e45e3"/>
  </svg>`}const x=`data:image/svg+xml,${encodeURIComponent(L())}`;function H(o,e,t){return{name:o,typeLabel:e,sizeLabel:t,url:x}}export{g as i,f as o,H as s};
