import{i as c}from"./du-web-nav-FdHFP31x.js";import"./oneapp-poc-button-CQjouF-z.js";const b={info:"info-circle",success:"check-circle",warning:"warning-triangle",error:"warning-circle"};class m extends HTMLElement{static observedAttributes=["type","heading","supporting"];connectedCallback(){this.render()}attributeChangedCallback(){this.isConnected&&this.render()}render(){const e=this.getAttribute("type")??"info",t=this.getAttribute("heading")??"",i=this.getAttribute("supporting")??this.textContent?.trim()??"",a=e==="error"||e==="warning";this.innerHTML=`
      <div class="alert" role="${a?"alert":"status"}">
        <span class="icon">${c(b[e]??"info-circle",24)}</span>
        <div class="body">
          ${t?`<p class="heading">${t}</p>`:""}
          ${i?`<p class="supporting">${i}</p>`:""}
        </div>
      </div>`}}customElements.define("oneapp-poc-alert",m);class y extends HTMLElement{static observedAttributes=["glyph","size"];connectedCallback(){this.render()}attributeChangedCallback(){this.isConnected&&this.render()}render(){const e=this.getAttribute("glyph")??"upload",t=this.getAttribute("size")??"small",i=t==="large"?32:t==="medium"?24:20;this.innerHTML=`<span class="tile">${c(e,i)}</span>`}}customElements.define("du-decorative-icon",y);const w="(min-width: 840px)",p=window.matchMedia(w);function x(){return p.matches}function $(n){const e=()=>n();return p.addEventListener("change",e),()=>p.removeEventListener("change",e)}class k extends HTMLElement{static observedAttributes=["accept","hint","headline","compact","multiple"];input;offBreakpoint;connectedCallback(){this.render(),this.offBreakpoint=$(()=>this.render())}disconnectedCallback(){this.offBreakpoint?.()}attributeChangedCallback(){this.isConnected&&this.render()}get multiple(){return this.hasAttribute("multiple")}render(){const e=this.getAttribute("accept")??".pdf,.jpg,.jpeg,.png",t=this.getAttribute("hint")??"PDF, JPG, or PNG · up to 10 MB",i=this.getAttribute("headline"),a=this.multiple?" multiple":"",l=x();if(this.hasAttribute("compact")){this.innerHTML=`
        <button type="button" class="add-row">
          <span class="ar-plus" aria-hidden="true">${c("plus",20)}</span>
          <span class="ar-label">${i??"Add another file"}</span>
          <span class="ar-optional">Optional</span>
          <input type="file" accept="${e}"${a} tabindex="-1" aria-hidden="true" />
        </button>`;const s=this.querySelector(".add-row");this.wireInput(),s.addEventListener("click",r=>{r.target.tagName!=="INPUT"&&this.input.click()}),this.wireDrop(s);return}if(l?this.innerHTML=`
        <div class="zone">
          <du-decorative-icon glyph="upload" size="large"></du-decorative-icon>
          <div class="instructions">
            <p class="headline">${i??(this.multiple?"Drag and drop your files here":"Drag and drop your file here")}</p>
            <p class="hint">${t}</p>
          </div>
          <oneapp-poc-button hierarchy="secondary" size="small" label="${this.multiple?"Choose files":"Choose file"}"></oneapp-poc-button>
          <input type="file" accept="${e}"${a} tabindex="-1" aria-hidden="true" />
        </div>`:this.innerHTML=`
        <button type="button" class="zone zone--tap">
          <du-decorative-icon glyph="upload" size="large"></du-decorative-icon>
          <div class="instructions">
            <p class="headline">${i??(this.multiple?"Tap to choose files":"Tap to choose a file")}</p>
            <p class="hint">${t}</p>
          </div>
        </button>
        <input type="file" accept="${e}"${a} tabindex="-1" aria-hidden="true" />`,this.wireInput(),l){const s=this.querySelector(".zone");this.querySelector("oneapp-poc-button").addEventListener("click",()=>this.input.click()),this.wireDrop(s)}else this.querySelector(".zone--tap").addEventListener("click",()=>this.input.click())}wireInput(){this.input=this.querySelector('input[type="file"]'),this.input.addEventListener("change",()=>{this.emit([...this.input.files??[]]),this.input.value=""})}wireDrop(e){e.addEventListener("dragover",t=>{[...t.dataTransfer?.types??[]].includes("Files")&&(t.preventDefault(),e.classList.add("is-dragover"))}),e.addEventListener("dragleave",()=>e.classList.remove("is-dragover")),e.addEventListener("drop",t=>{t.dataTransfer?.files.length&&(t.preventDefault(),e.classList.remove("is-dragover"),this.emit([...t.dataTransfer.files]))})}emit(e){e.length!==0&&(this.multiple?this.dispatchEvent(new CustomEvent("files-chosen",{detail:e,bubbles:!0})):this.dispatchEvent(new CustomEvent("file-chosen",{detail:e[0],bubbles:!0})))}}customElements.define("du-drop-zone",k);class E extends HTMLElement{static observedAttributes=["name","meta","actions","variant"];connectedCallback(){this.render()}attributeChangedCallback(){this.isConnected&&this.render()}render(){const e=this.getAttribute("name")??"",t=this.getAttribute("meta")??"",a=(this.getAttribute("actions")??"").split(",").map(s=>s.trim()).filter(Boolean).map(s=>s==="remove"?`<button type="button" class="remove" data-action="remove" aria-label="Remove ${e}">${c("trash",20)}</button>`:`<oneapp-poc-button hierarchy="tertiary" size="small" label="${s==="preview"?"Preview":s==="replace"?"Replace":s}" data-action="${s}"></oneapp-poc-button>`).join(""),l=this.getAttribute("variant")==="filled"?"filled":"bordered";this.innerHTML=`
      <div class="row" data-variant="${l}">
        <span class="icon-wrap" aria-hidden="true">${c("page-flip",20)}</span>
        <div class="text">
          <p class="name">${e}</p>
          <p class="meta">${t}</p>
        </div>
        ${a?`<div class="actions">${a}</div>`:""}
      </div>`,this.querySelectorAll("[data-action]").forEach(s=>{s.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("file-action",{detail:s.dataset.action,bubbles:!0}))})})}}customElements.define("du-file-row",E);let L=0;class C extends HTMLElement{static observedAttributes=["label","placeholder","value","helper","error","invalid"];input;fieldId=`note-${L++}`;connectedCallback(){this.input||this.render(),this.sync()}attributeChangedCallback(){this.input&&this.sync()}render(){const e=`${this.fieldId}-msg`;this.innerHTML=`
      <div class="field-wrap">
        <label for="${this.fieldId}"></label>
        <input id="${this.fieldId}" type="text" autocomplete="off" aria-describedby="${e}" />
        <p class="message" id="${e}"></p>
      </div>`,this.input=this.querySelector("input"),this.input.addEventListener("input",()=>{this.setAttribute("value",this.input.value),this.dispatchEvent(new CustomEvent("note-change",{detail:this.input.value,bubbles:!0}))})}sync(){if(!this.input)return;const e=this.getAttribute("label")??"",t=this.hasAttribute("invalid"),i=(t?this.getAttribute("error"):this.getAttribute("helper"))??"";this.querySelector("label").textContent=e,this.input.placeholder=this.getAttribute("placeholder")??"";const a=this.getAttribute("value")??"";this.input.value!==a&&(this.input.value=a),this.input.setAttribute("aria-invalid",t?"true":"false");const l=this.querySelector(".message");l.textContent=i,l.style.display=i?"":"none"}}customElements.define("oneapp-poc-note-input",C);class T extends HTMLElement{dialog;connectedCallback(){this.dialog||this.render()}render(){this.innerHTML=`
      <dialog class="preview" aria-label="Document preview">
        <div class="preview-grab" aria-hidden="true"></div>
        <div class="preview-head">
          <p class="preview-name"></p>
          <button type="button" class="preview-close" aria-label="Close preview">${c("close",24)}</button>
        </div>
        <div class="preview-body"></div>
      </dialog>`,this.dialog=this.querySelector("dialog"),this.querySelector(".preview-close").addEventListener("click",()=>this.close()),this.dialog.addEventListener("click",e=>{e.target===this.dialog&&this.close()}),this.dialog.addEventListener("close",()=>{const e=this.querySelector(".preview-body");e&&(e.innerHTML="")})}open(e){this.dialog||this.render(),this.querySelector(".preview-name").textContent=e.name;const t=this.querySelector(".preview-body"),i=/^(jpe?g|png|gif|webp)$/i.test(e.type);e.url?i?t.innerHTML=`<img class="preview-image" src="${e.url}" alt="${e.name}" />`:t.innerHTML=`<iframe class="preview-frame" src="${e.url}" title="${e.name}"></iframe>`:t.innerHTML=`<p class="preview-fallback">Preview isn't available for this file.</p>`,this.dialog.open||this.dialog.showModal()}close(){this.dialog?.open&&this.dialog.close()}}customElements.define("du-file-preview",T);const g=72,A=550;class S extends HTMLElement{_items=[];_active="";open=!1;dockHidden=!1;holdTimer;holdOrigin;set items(e){this._items=e,this.render()}set active(e){this._active=e,this.syncActive()}connectedCallback(){this.render(),document.addEventListener("keydown",this.onKey),document.addEventListener("touchstart",this.onTouchStart,{passive:!0}),document.addEventListener("touchmove",this.onTouchMove,{passive:!0}),document.addEventListener("touchend",this.cancelHold,{passive:!0}),document.addEventListener("touchcancel",this.cancelHold,{passive:!0})}disconnectedCallback(){document.removeEventListener("keydown",this.onKey),document.removeEventListener("touchstart",this.onTouchStart),document.removeEventListener("touchmove",this.onTouchMove),document.removeEventListener("touchend",this.cancelHold),document.removeEventListener("touchcancel",this.cancelHold),this.cancelHold()}onKey=e=>{/^(INPUT|TEXTAREA|SELECT)$/.test(e.target?.tagName??"")||e.metaKey||e.ctrlKey||e.altKey||(e.key===">"?(e.preventDefault(),this.dockHidden?this.show():this.hide()):e.key==="."?(e.preventDefault(),this.dockHidden?this.show():this.toggle()):e.key==="Escape"&&this.open&&!this.dockHidden&&this.toggle(!1))};onTouchStart=e=>{if(!this.dockHidden)return;const t=e.touches[0];t&&t.clientX<=g&&t.clientY>=window.innerHeight-g&&(this.holdOrigin={x:t.clientX,y:t.clientY},this.holdTimer=setTimeout(()=>this.show(),A))};onTouchMove=e=>{if(this.holdTimer==null||!this.holdOrigin)return;const t=e.touches[0];t&&Math.hypot(t.clientX-this.holdOrigin.x,t.clientY-this.holdOrigin.y)>12&&this.cancelHold()};cancelHold=()=>{this.holdTimer&&(clearTimeout(this.holdTimer),this.holdTimer=void 0),this.holdOrigin=void 0};toggle(e){if(this.dockHidden)return this.show();this.open=e??!this.open,this.sync()}hide(){this.dockHidden=!0,this.open=!1,this.sync()}show(){this.dockHidden=!1,this.open=!0,this.sync()}sync(){const e=this.querySelector(".dock");e?.setAttribute("data-open",String(this.open)),e?.setAttribute("data-hidden",String(this.dockHidden)),this.open&&!this.dockHidden&&this.querySelector(".dock-list button")?.focus()}syncActive(){this.querySelectorAll(".dock-list button").forEach(e=>{e.toggleAttribute("data-active",e.dataset.id===this._active)})}render(){const e=new Map;for(const i of this._items){const a=i.group??"";e.has(a)||e.set(a,[]),e.get(a).push(i)}const t=[...e.entries()].map(([i,a])=>{const l=i?`<li class="dock-group">${i}</li>`:"",s=a.map(r=>`<li><button type="button" data-id="${r.id}"${r.id===this._active?" data-active":""}>${r.label}</button></li>`).join("");return l+s}).join("");this.innerHTML=`
      <div class="dock" data-open="${this.open}" data-hidden="${this.dockHidden}">
        <div class="dock-panel" role="dialog" aria-label="Scenario explorer">
          <div class="dock-head">
            <span class="dock-title">${c("beaker",18)} Scenario explorer</span>
            <div class="dock-head-actions">
              <button type="button" class="dock-hide" aria-label="Hide scenario explorer">${c("eye-off",20)}</button>
              <button type="button" class="dock-x" aria-label="Collapse scenario explorer">${c("close",20)}</button>
            </div>
          </div>
          <ul class="dock-list">${t}</ul>
          <p class="dock-hint"><kbd>.</kbd> toggle · <kbd>⇧.</kbd> hide</p>
        </div>
        <button type="button" class="dock-toggle" aria-label="Open scenario explorer">
          ${c("beaker",20)}<span>Scenarios</span>
        </button>
      </div>`,this.querySelector(".dock-toggle").addEventListener("click",()=>this.toggle()),this.querySelector(".dock-x").addEventListener("click",()=>this.toggle(!1)),this.querySelector(".dock-hide").addEventListener("click",()=>this.hide()),this.querySelectorAll(".dock-list button").forEach(i=>{i.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("scenario-pick",{detail:i.dataset.id})),this.toggle(!1)})})}}customElements.define("du-scenario-dock",S);const o="font-family='Helvetica, Arial, sans-serif'",d=n=>n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),h=n=>`data:image/svg+xml,${encodeURIComponent(n)}`;function u(n,e,t,i){const a=t.map((s,r)=>{const f=r%2===0?40:320,v=280+Math.floor(r/2)*64;return`<text x='${f}' y='${v}' fill='#8a94a6' ${o} font-size='11' letter-spacing='0.6'>${d(s.label.toUpperCase())}</text><text x='${f}' y='${v+24}' fill='#051958' ${o} font-size='15' font-weight='600'>${d(s.value)}</text>`}).join(""),l=i.map((s,r)=>`<text x='40' y='${466+r*24}' fill='#4b576c' ${o} font-size='13'>${d(s)}</text>`).join("");return`<svg xmlns='http://www.w3.org/2000/svg' width='620' height='800' viewBox='0 0 620 800'>
    <rect width='620' height='800' fill='#ffffff'/>
    <rect width='620' height='84' fill='#002169'/>
    <rect y='84' width='620' height='4' fill='#ff6b17'/>
    <text x='40' y='42' fill='#ffffff' ${o} font-size='22' font-weight='700'>OneMain Financial</text>
    <text x='40' y='64' fill='#c9d4ef' ${o} font-size='11'>601 NW Second Street, Evansville, IN 47708</text>
    <text x='580' y='50' fill='#c9d4ef' ${o} font-size='11' text-anchor='end'>Member Services 1-800-742-5465</text>
    <text x='40' y='150' fill='#051958' ${o} font-size='26' font-weight='700'>${d(n)}</text>
    <text x='40' y='176' fill='#62738c' ${o} font-size='14'>${d(e)}</text>
    <rect x='40' y='200' width='540' height='1' fill='#e8eaec'/>
    <text x='40' y='244' fill='#051958' ${o} font-size='15' font-weight='700'>Details</text>
    ${a}
    <rect x='40' y='408' width='540' height='1' fill='#e8eaec'/>
    <text x='40' y='440' fill='#051958' ${o} font-size='15' font-weight='700'>Summary</text>
    ${l}
    <rect x='40' y='662' width='260' height='1' fill='#cbd5e1'/>
    <text x='40' y='686' fill='#62738c' ${o} font-size='12'>Authorized signature</text>
    <text x='320' y='686' fill='#62738c' ${o} font-size='12'>Date</text>
    <rect x='320' y='662' width='180' height='1' fill='#cbd5e1'/>
    <text x='40' y='784' fill='#98a2b3' ${o} font-size='10'>Sample document generated for a design prototype. Not a real record.</text>
  </svg>`}function H(){return`<svg xmlns='http://www.w3.org/2000/svg' width='620' height='800' viewBox='0 0 620 800'>
    <defs><linearGradient id='sky' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0' stop-color='#cfe0f4'/><stop offset='1' stop-color='#edf3fb'/></linearGradient></defs>
    <rect width='620' height='800' fill='#eaeef3'/>
    <rect x='40' y='150' width='540' height='420' rx='10' fill='url(#sky)'/>
    <rect x='40' y='430' width='540' height='140' fill='#cdd6e0'/>
    <rect x='40' y='430' width='540' height='3' fill='#b7c2cf'/>
    <ellipse cx='318' cy='500' rx='185' ry='18' fill='#9aa6b4' opacity='0.5'/>
    <rect x='158' y='412' width='330' height='58' rx='18' fill='#2f5bd0'/>
    <path d='M240 412 L276 366 Q284 358 300 358 L396 358 Q414 358 426 372 L452 412 Z' fill='#3f68d8'/>
    <path d='M286 372 L344 372 L344 404 L264 404 Z' fill='#dbe6f7'/>
    <path d='M354 372 L396 372 Q408 372 417 382 L434 404 L354 404 Z' fill='#dbe6f7'/>
    <rect x='348' y='398' width='2' height='60' fill='#254aa8'/>
    <rect x='478' y='424' width='12' height='12' rx='3' fill='#ffe08a'/>
    <circle cx='232' cy='470' r='38' fill='#20262f'/><circle cx='232' cy='470' r='16' fill='#9aa4b2'/>
    <circle cx='420' cy='470' r='38' fill='#20262f'/><circle cx='420' cy='470' r='16' fill='#9aa4b2'/>
    <text x='310' y='612' fill='#62738c' ${o} font-size='13' text-anchor='middle'>Vehicle photo — sample image for a design prototype</text>
  </svg>`}const M=h(u("Automobile Insurance Policy","Personal Auto — Declarations Page",[{label:"Policy number",value:"OMF-AUTO-4821"},{label:"Policy period",value:"06/12/2026 – 12/12/2026"},{label:"Named insured",value:"Jordan A. Rivera"},{label:"Insured vehicle",value:"2021 Honda Civic LX"}],["This declarations page summarizes the coverage in force for the vehicle","described above. Bodily injury liability is $100,000 per person and","$300,000 per accident. Property damage liability is $50,000. Comprehensive","and collision coverage each apply with a $500 deductible. Refer to the full","policy for complete terms, conditions, and exclusions."])),D=h(u("Motor Vehicle Bill of Sale","Transfer of ownership",[{label:"Seller",value:"Bay City Motors"},{label:"Buyer",value:"Jordan A. Rivera"},{label:"Sale date",value:"June 10, 2026"},{label:"VIN",value:"2HGFE2F5XMH••••12"}],["The seller named above transfers ownership of the following vehicle to the","buyer for the agreed sale price. Vehicle: 2021 Honda Civic LX, odometer","24,180 miles. Sale price: $18,750.00, paid in full. The vehicle is sold","as-is. Both parties affirm the information above is accurate as of the","sale date shown."])),I=h(u("Auto Loan Payoff Statement","Amount required to pay this loan in full",[{label:"Account number",value:"••••4821"},{label:"Payoff amount",value:"$12,430.55"},{label:"Good through",value:"July 15, 2026"},{label:"Per diem interest",value:"$2.14 / day"}],["The amount shown above is the total required to pay this loan in full through","the good-through date. Interest accrues daily at the per-diem shown, so a","payment received after that date may leave a small remaining balance.","Please contact Member Services to confirm the current payoff figure before","remitting funds."])),O=h(u("Supporting Document","Uploaded for your loan request",[{label:"Reference",value:"DOC-4821"},{label:"Date",value:"June 2026"},{label:"Prepared for",value:"Jordan A. Rivera"},{label:"Pages",value:"1"}],["This is a sample supporting document included so the preview has realistic","content to display. The text here is placeholder copy and does not represent","a real record. In the live experience this preview shows the actual file the","customer uploaded."])),P=h(H());function q(n,e){const t=n.toLowerCase();return(/jpe?g|png|gif|webp/i.test(e)||/\.(jpe?g|png|gif|webp)$/i.test(t))&&/(vehicle|car|front|back|photo)/.test(t)?P:t.includes("insurance")?M:t.includes("bill")?D:t.includes("payoff")?I:O}function z(n){const e=/^([\d.]+)\s*(B|KB|MB)$/i.exec(n.trim());if(!e)return 0;const t=parseFloat(e[1]),i=e[2].toUpperCase();return Math.round(i==="MB"?t*1024*1024:i==="KB"?t*1024:t)}function _(n,e,t,i=z(t)){return{name:n,typeLabel:e,sizeLabel:t,bytes:i,url:q(n,e)}}export{x as i,$ as o,_ as s};
