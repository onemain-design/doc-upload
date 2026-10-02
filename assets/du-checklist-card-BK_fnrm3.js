import{i as A}from"./du-web-nav-CHnbwIhj.js";import"./sample-doc-DV3_Y5el.js";import"./oneapp-poc-button-DG8YUu64.js";const w={"not-started":{glyph:"dashed-circle",label:"Not started",tone:"neutral"},ready:{glyph:"check-dashed-circle",label:"Ready",tone:"info"},selected:{glyph:"check-dashed-circle",label:"Ready",tone:"info"},"validation-error":{glyph:"warning-triangle",label:"Needs attention",tone:"caution"},"note-required":{glyph:"warning-triangle",label:"Needs attention",tone:"caution"},submitting:{glyph:"upload",label:"Submitting",tone:"info"},uploading:{glyph:"upload",label:"Uploading",tone:"info"},submitted:{glyph:"check-circle",label:"Submitted",tone:"positive"},uploaded:{glyph:"check-circle",label:"Uploaded",tone:"positive"},failed:{glyph:"warning-circle",label:"Failed",tone:"negative"}},E={neutral:"var(--omf-cx-core-color-body-moderate, #62738c)",info:"var(--omf-cx-core-color-body-info, #0e45e3)",caution:"var(--omf-cx-core-color-body-caution, #856b05)",positive:"var(--omf-cx-core-color-body-positive, #008353)",negative:"var(--omf-cx-core-color-body-negative, #d62940)"};class T extends HTMLElement{static observedAttributes=["status","label","glyph","tone"];connectedCallback(){this.render()}attributeChangedCallback(){this.isConnected&&this.render()}render(){const e=this.getAttribute("status")??"not-started",t=w[e]??w["not-started"],l=this.getAttribute("label")??t.label,a=this.getAttribute("glyph")??t.glyph,s=this.getAttribute("tone")??t.tone;this.innerHTML=`
      <span class="pill" data-tone="${s}">
        <span class="glyph" aria-hidden="true">${A(a,16)}</span>
        <span class="label">${l}</span>
      </span>`}}customElements.define("du-status-pill",T);class C extends HTMLElement{static observedAttributes=["doc-id","name","description","status","is-other","file-name","file-meta","note","message","progress","accept","hint","mode","files","due","persistent"];connectedCallback(){this.render()}attributeChangedCallback(){this.isConnected&&this.render()}get status(){return this.getAttribute("status")??"not-started"}bodyMarkup(){if(this.getAttribute("mode")==="instant")return this.instantBody();const e=this.status,t=this.getAttribute("file-name")??"",l=this.getAttribute("file-meta")??"",a=this.getAttribute("note")??"",s=this.getAttribute("message")??"",u=Number(this.getAttribute("progress")??"0"),h=this.getAttribute("accept")??".pdf,.jpg,.jpeg,.png",o=this.getAttribute("hint")??"PDF, JPG, or PNG · up to 10 MB",y=this.hasAttribute("is-other"),g=this.getAttribute("mode")==="instant",d=`<du-drop-zone accept="${h}" hint="${o}"></du-drop-zone>`,c=r=>`<du-file-row variant="filled" name="${t}" meta="${l}" actions="${r}"></du-file-row>`,m=r=>`
      <oneapp-poc-note-input
        label="What is this document?"
        placeholder="e.g. Bank statement"
        value="${a.replace(/"/g,"&quot;")}"
        helper="Tell us what it is so your loan team can route it correctly."
        ${r?'invalid error="Add a short note so we can route this document."':""}>
      </oneapp-poc-note-input>`,n=y&&!g?m(!1):"",$=`<oneapp-poc-alert type="error" heading="We couldn't add that file" supporting="${s}"></oneapp-poc-alert>`,b=r=>g?`<oneapp-poc-button class="upload-btn" hierarchy="primary" size="default" label="Upload document" data-action="upload"${r?" disabled":""}></oneapp-poc-button>`:"",v=r=>`<div class="submit-progress">
         <div class="track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${u}" aria-label="${r} ${t}">
           <div class="fill" style="width:${u}%"></div>
         </div>
         <p class="pct">${r}… ${u}%</p>
       </div>`;switch(e){case"not-started":return n+d;case"validation-error":return n+$+d;case"note-required":return m(!0)+c("replace,remove")+b(!0);case"ready":return n+c("replace,remove");case"selected":return n+c("replace,remove")+b(!1);case"submitting":return c("")+v("Submitting");case"uploading":return c("")+v("Uploading");case"submitted":case"uploaded":return c("preview");case"failed":return n+`<oneapp-poc-alert type="error" heading="That didn't go through" supporting="${s}"></oneapp-poc-alert>`+c("")+`<div class="failed-actions">
             <oneapp-poc-button hierarchy="primary" size="small" label="Try again" data-action="retry"></oneapp-poc-button>
             <oneapp-poc-button hierarchy="tertiary" size="small" label="Choose a different file" data-action="replace"></oneapp-poc-button>
           </div>`;default:return d}}instantBody(){const e=this.status,t=Number(this.getAttribute("progress")??"0"),l=this.getAttribute("accept")??".pdf,.jpg,.jpeg,.png",a=this.getAttribute("hint")??"PDF, JPG, or PNG · 10 MB each",s=this.getAttribute("message")??"",u=this.getAttribute("name")??"document",h=this.getAttribute("files-summary")??"";let o=[];try{o=JSON.parse(this.getAttribute("files")??"[]")}catch{o=[]}const y=o.length,g=i=>/(jpe?g|png|gif|webp|image)/i.test(i??"")?"image":"page",d=`<div class="mf-subhead"><span class="mf-subhead-label">Files for this document</span><span class="mf-subhead-summary">${h}</span></div>`,c=i=>{const p=i.split(","),f=[];return p.includes("remove")&&f.push(`<button type="button" class="mf-remove" data-action="remove" aria-label="Remove file">${A("trash",20)}</button>`),f.length?`<div class="mf-actions">${f.join("")}</div>`:""},m=(i,p)=>`<div class="mf-row" data-file-id="${i.id}">
        <span class="mf-type" aria-hidden="true">${A(g(i.type),20)}</span>
        <div class="mf-text"><p class="mf-name">${i.name}</p><p class="mf-meta">${i.meta}</p></div>
        ${c(p)}
      </div>`,n=i=>`<div class="mf-list">${o.map(p=>m(p,i)).join("")}</div>`,$=`<du-drop-zone compact multiple accept="${l}"></du-drop-zone>`,b=`<oneapp-poc-alert type="error" heading="We couldn't add that file" supporting="${s}"></oneapp-poc-alert>`,v=`
      <div class="submit-progress">
        <div class="track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${t}" aria-label="Uploading ${u}">
          <div class="fill" style="width:${t}%"></div>
        </div>
        <p class="pct">Uploading… ${t}%</p>
      </div>`;if(e==="uploading")return d+n("")+v;if(e==="uploaded"||e==="submitted")return d+n("");if(e==="failed"){const p=this.hasAttribute("persistent")?"We couldn't upload this document":"That didn't go through";return d+`<oneapp-poc-alert type="error" heading="${p}" supporting="${s}"></oneapp-poc-alert>`+n("remove")+'<div class="failed-actions"><oneapp-poc-button hierarchy="primary" size="small" label="Try again" data-action="retry"></oneapp-poc-button></div>'}if(y===0)return`<du-drop-zone multiple accept="${l}" hint="${a}"></du-drop-zone>`+(s?b:"");const r=`<oneapp-poc-button class="upload-btn" hierarchy="primary" size="default" label="Upload document" data-action="upload"${e==="selected"?"":" disabled"}></oneapp-poc-button>`;return d+n("remove")+$+(s?b:"")+r}render(){const e=this.getAttribute("name")??"",t=this.getAttribute("description")??"",l=this.getAttribute("due")??"",a=this.status,s=`card-h-${this.getAttribute("doc-id")??e.replace(/\s+/g,"-")}`,h=!!l&&(a==="not-started"||a==="selected"||a==="validation-error")?`<du-status-pill status="${a}" glyph="clock" tone="caution" label="Due ${l}"></du-status-pill>`:`<du-status-pill status="${a}"></du-status-pill>`;this.innerHTML=`
      <section class="card" data-status="${a}" aria-labelledby="${s}">
        <div class="header">
          <div class="title-row">
            <h2 class="title" id="${s}">${e}</h2>
            ${h}
          </div>
          ${t?`<p class="desc">${t}</p>`:""}
        </div>
        <div class="body">${this.bodyMarkup()}</div>
      </section>`,this.querySelectorAll("[data-action]").forEach(o=>{o.addEventListener("click",()=>{o.dispatchEvent(new CustomEvent("file-action",{detail:o.dataset.action,bubbles:!0}))})})}}customElements.define("du-checklist-card",C);export{w as S,E as T};
