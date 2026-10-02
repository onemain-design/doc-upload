import{i as w}from"./du-web-nav-C_BPDic8.js";import"./sample-doc-BFhR22xi.js";import"./oneapp-poc-button-DhAI0vn-.js";const v={"not-started":{glyph:"dashed-circle",label:"Not started",tone:"neutral"},ready:{glyph:"check-dashed-circle",label:"Ready",tone:"info"},selected:{glyph:"check-dashed-circle",label:"Ready",tone:"info"},"validation-error":{glyph:"warning-circle",label:"Needs attention",tone:"caution"},"note-required":{glyph:"warning-circle",label:"Needs attention",tone:"caution"},submitting:{glyph:"upload",label:"Submitting",tone:"info"},uploading:{glyph:"upload",label:"Uploading",tone:"info"},submitted:{glyph:"check-circle",label:"Submitted",tone:"positive"},uploaded:{glyph:"check-circle",label:"Uploaded",tone:"positive"},failed:{glyph:"warning-triangle",label:"Failed",tone:"negative"}},A={neutral:"var(--omf-cx-core-color-body-moderate, #62738c)",info:"var(--omf-cx-core-color-body-info, #0e45e3)",caution:"var(--omf-cx-core-color-body-caution, #856b05)",positive:"var(--omf-cx-core-color-body-positive, #008353)",negative:"var(--omf-cx-core-color-body-negative, #d62940)"};class C extends HTMLElement{static observedAttributes=["status","label"];connectedCallback(){this.render()}attributeChangedCallback(){this.isConnected&&this.render()}render(){const t=this.getAttribute("status")??"not-started",a=v[t]??v["not-started"],o=this.getAttribute("label")??a.label;this.innerHTML=`
      <span class="pill" data-tone="${a.tone}">
        <span class="glyph" aria-hidden="true">${w(a.glyph,16)}</span>
        <span class="label">${o}</span>
      </span>`}}customElements.define("du-status-pill",C);class S extends HTMLElement{static observedAttributes=["doc-id","name","description","status","is-other","file-name","file-meta","note","message","progress","accept","hint","mode","sided","front-file-name","front-file-meta","front-message","back-file-name","back-file-meta","back-message","back-optional"];connectedCallback(){this.render()}attributeChangedCallback(){this.isConnected&&this.render()}get status(){return this.getAttribute("status")??"not-started"}bodyMarkup(){if(this.hasAttribute("sided"))return this.sidedBody();const t=this.status,a=this.getAttribute("file-name")??"",o=this.getAttribute("file-meta")??"",l=this.getAttribute("note")??"",d=this.getAttribute("message")??"",p=Number(this.getAttribute("progress")??"0"),e=this.getAttribute("accept")??".pdf,.jpg,.jpeg,.png",i=this.getAttribute("hint")??"PDF, JPG, or PNG · up to 10 MB",u=this.hasAttribute("is-other"),n=this.getAttribute("mode")==="instant",b=`<du-drop-zone accept="${e}" hint="${i}"></du-drop-zone>`,s=r=>`<du-file-row variant="filled" name="${a}" meta="${o}" actions="${r}"></du-file-row>`,c=r=>`
      <oneapp-poc-note-input
        label="What is this document?"
        placeholder="e.g. Bank statement"
        value="${l.replace(/"/g,"&quot;")}"
        helper="Tell us what it is so your loan team can route it correctly."
        ${r?'invalid error="Add a short note so we can route this document."':""}>
      </oneapp-poc-note-input>`,m=u&&!n?c(!1):"",$=`<oneapp-poc-alert type="error" heading="We couldn't add that file" supporting="${d}"></oneapp-poc-alert>`,h=r=>n?`<oneapp-poc-button class="upload-btn" hierarchy="primary" size="default" label="Upload document" data-action="upload"${r?" disabled":""}></oneapp-poc-button>`:"",g=r=>`<div class="submit-progress">
         <div class="track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p}" aria-label="${r} ${a}">
           <div class="fill" style="width:${p}%"></div>
         </div>
         <p class="pct">${r}… ${p}%</p>
       </div>`;switch(t){case"not-started":return m+b;case"validation-error":return m+$+b;case"note-required":return c(!0)+s("replace,remove")+h(!0);case"ready":return m+s("replace,remove");case"selected":return m+s("replace,remove")+h(!1);case"submitting":return s("")+g("Submitting");case"uploading":return s("")+g("Uploading");case"submitted":case"uploaded":return s("preview");case"failed":return m+`<oneapp-poc-alert type="error" heading="That didn't go through" supporting="${d}"></oneapp-poc-alert>`+s("")+`<div class="failed-actions">
             <oneapp-poc-button hierarchy="primary" size="small" label="Try again" data-action="retry"></oneapp-poc-button>
             <oneapp-poc-button hierarchy="tertiary" size="small" label="Choose a different file" data-action="replace"></oneapp-poc-button>
           </div>`;default:return b}}sidedBody(){const t=this.status,a=Number(this.getAttribute("progress")??"0"),o=this.getAttribute("accept")??".pdf,.jpg,.jpeg,.png",l=this.getAttribute("hint")??"PDF, JPG, or PNG · up to 10 MB",d=this.getAttribute("message")??"",p=this.getAttribute("name")??"document",e={name:this.getAttribute("front-file-name")??"",meta:this.getAttribute("front-file-meta")??"",message:this.getAttribute("front-message")??""},i={name:this.getAttribute("back-file-name")??"",meta:this.getAttribute("back-file-meta")??"",message:this.getAttribute("back-message")??""},u=this.hasAttribute("back-optional")?"Back (optional)":"Back",n=(r,y,k)=>`<div class="side" data-side="${r}"><p class="side-label">${y}</p>${k}</div>`,b=`<du-drop-zone accept="${o}" hint="${l}"></du-drop-zone>`,s=(r,y,k)=>`<du-file-row variant="filled" name="${r}" meta="${y}" actions="${k}"></du-file-row>`,c=r=>`<oneapp-poc-alert type="error" heading="We couldn't add that file" supporting="${r}"></oneapp-poc-alert>`,m=`
      <div class="submit-progress">
        <div class="track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${a}" aria-label="Uploading ${p}">
          <div class="fill" style="width:${a}%"></div>
        </div>
        <p class="pct">Uploading… ${a}%</p>
      </div>`;if(t==="uploading")return(e.name?n("front","Front",s(e.name,e.meta,"")):"")+(i.name?n("back",u,s(i.name,i.meta,"")):"")+m;if(t==="uploaded"||t==="submitted")return(e.name?n("front","Front",s(e.name,e.meta,"preview")):"")+(i.name?n("back",u,s(i.name,i.meta,"preview")):"");if(t==="failed")return`<oneapp-poc-alert type="error" heading="That didn't go through" supporting="${d}"></oneapp-poc-alert>`+(e.name?n("front","Front",s(e.name,e.meta,"replace,remove")):"")+(i.name?n("back",u,s(i.name,i.meta,"replace,remove")):"")+'<div class="failed-actions"><oneapp-poc-button hierarchy="primary" size="small" label="Try again" data-action="retry"></oneapp-poc-button></div>';const $=e.name?n("front","Front",s(e.name,e.meta,"replace,remove")):n("front","Front",(e.message?c(e.message):"")+b),h=e.name?i.name?n("back",u,s(i.name,i.meta,"replace,remove")):n("back",u,(i.message?c(i.message):"")+b):"",g=e.name?`<oneapp-poc-button class="upload-btn" hierarchy="primary" size="default" label="Upload document" data-action="upload"${t==="selected"?"":" disabled"}></oneapp-poc-button>`:"";return $+h+g}render(){const t=this.getAttribute("name")??"",a=this.getAttribute("description")??"",o=this.status,l=`card-h-${this.getAttribute("doc-id")??t.replace(/\s+/g,"-")}`;this.innerHTML=`
      <section class="card" data-status="${o}" aria-labelledby="${l}">
        <div class="header">
          <div class="title-row">
            <h2 class="title" id="${l}">${t}</h2>
            <du-status-pill status="${o}"></du-status-pill>
          </div>
          ${a?`<p class="desc">${a}</p>`:""}
        </div>
        <div class="body">${this.bodyMarkup()}</div>
      </section>`,this.querySelectorAll("[data-action]").forEach(d=>{d.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent("file-action",{detail:d.dataset.action,bubbles:!0}))})})}}customElements.define("du-checklist-card",S);class E extends HTMLElement{static observedAttributes=["submitted","total","compact","verb"];connectedCallback(){this.render()}attributeChangedCallback(){this.isConnected&&this.render()}render(){const t=Number(this.getAttribute("submitted")??"0"),a=Math.max(1,Number(this.getAttribute("total")??"4")),o=this.getAttribute("verb")??"submitted",l=Math.round(Math.min(t,a)/a*100);this.innerHTML=`
      <div class="wrap">
        <div class="labels">
          <p class="title">Session progress</p>
          <p class="count">${t} of ${a} ${o}</p>
        </div>
        <div class="track" role="progressbar" aria-valuemin="0" aria-valuemax="${a}"
             aria-valuenow="${t}" aria-label="Documents ${o}">
          <div class="fill" style="width:${l}%"></div>
        </div>
      </div>`}}customElements.define("du-session-progress",E);class M extends HTMLElement{_data=null;set data(t){this._data=t,this.render()}get data(){return this._data}connectedCallback(){this._data&&this.render()}render(){const t=this._data;if(!t)return;const a=t.docs.map(s=>{const c=v[s.status]??v["not-started"];return`
          <li class="row">
            <span class="row-icon" style="color:${A[c.tone]}" aria-hidden="true">${w(c.glyph,20)}</span>
            <span class="row-name">${s.name}</span>
            <span class="row-status" style="color:${A[c.tone]}">${c.label}</span>
          </li>`}).join(""),o=t.mode==="instant",l=t.verb??"submitted",d=o?t.allSubmitted:!0,p=t.allSubmitted?"Back to home page":"Submit documents",e=t.allSubmitted?"exit":"submit",i=!t.allSubmitted&&!t.canSubmit,u=t.allSubmitted?"":o?'<p class="helper">Each document uploads on its own as you add it.</p>':'<p class="helper">You can add, replace, or remove files until you submit.</p>',n=!o&&!t.allSubmitted&&t.blockReason?`<p class="block-reason" role="status">${t.blockReason}</p>`:"";this.innerHTML=`
      <aside class="rail" aria-label="Request summary">
        <du-session-progress submitted="${t.submittedCount}" total="${t.total}" verb="${l}"></du-session-progress>
        <ul class="checklist">${a}</ul>
        <div class="divider" role="presentation"></div>
        ${u}
        ${d?`<oneapp-poc-button
                 hierarchy="primary" size="default" full
                 label="${p}" data-action="${e}"
                 ${i?"disabled":""} ${t.submitting?"busy":""}></oneapp-poc-button>`:""}
        ${n}
      </aside>`,this.querySelector("[data-action]")?.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent(e,{bubbles:!0}))})}}customElements.define("du-request-rail",M);
