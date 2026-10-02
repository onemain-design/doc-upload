import{i as $}from"./du-web-nav-FdHFP31x.js";import"./sample-doc-Bg4l5PD5.js";import"./oneapp-poc-button-CQjouF-z.js";const A={"not-started":{glyph:"dashed-circle",label:"Not started",tone:"neutral"},ready:{glyph:"check-dashed-circle",label:"Ready",tone:"info"},selected:{glyph:"check-dashed-circle",label:"Ready",tone:"info"},"validation-error":{glyph:"warning-triangle",label:"Needs attention",tone:"caution"},"note-required":{glyph:"warning-triangle",label:"Needs attention",tone:"caution"},submitting:{glyph:"upload",label:"Submitting",tone:"info"},uploading:{glyph:"upload",label:"Uploading",tone:"info"},submitted:{glyph:"check-circle",label:"Submitted",tone:"positive"},uploaded:{glyph:"check-circle",label:"Uploaded",tone:"positive"},failed:{glyph:"warning-circle",label:"Failed",tone:"negative"}},C={neutral:"var(--omf-cx-core-color-body-moderate, #62738c)",info:"var(--omf-cx-core-color-body-info, #0e45e3)",caution:"var(--omf-cx-core-color-body-caution, #856b05)",positive:"var(--omf-cx-core-color-body-positive, #008353)",negative:"var(--omf-cx-core-color-body-negative, #d62940)"};class M extends HTMLElement{static observedAttributes=["status","label"];connectedCallback(){this.render()}attributeChangedCallback(){this.isConnected&&this.render()}render(){const t=this.getAttribute("status")??"not-started",e=A[t]??A["not-started"],a=this.getAttribute("label")??e.label;this.innerHTML=`
      <span class="pill" data-tone="${e.tone}">
        <span class="glyph" aria-hidden="true">${$(e.glyph,16)}</span>
        <span class="label">${a}</span>
      </span>`}}customElements.define("du-status-pill",M);class S extends HTMLElement{static observedAttributes=["doc-id","name","description","status","is-other","file-name","file-meta","note","message","progress","accept","hint","mode","files"];connectedCallback(){this.render()}attributeChangedCallback(){this.isConnected&&this.render()}get status(){return this.getAttribute("status")??"not-started"}bodyMarkup(){if(this.getAttribute("mode")==="instant")return this.instantBody();const t=this.status,e=this.getAttribute("file-name")??"",a=this.getAttribute("file-meta")??"",o=this.getAttribute("note")??"",s=this.getAttribute("message")??"",u=Number(this.getAttribute("progress")??"0"),h=this.getAttribute("accept")??".pdf,.jpg,.jpeg,.png",p=this.getAttribute("hint")??"PDF, JPG, or PNG · up to 10 MB",g=this.hasAttribute("is-other"),m=this.getAttribute("mode")==="instant",c=`<du-drop-zone accept="${h}" hint="${p}"></du-drop-zone>`,i=r=>`<du-file-row variant="filled" name="${e}" meta="${a}" actions="${r}"></du-file-row>`,d=r=>`
      <oneapp-poc-note-input
        label="What is this document?"
        placeholder="e.g. Bank statement"
        value="${o.replace(/"/g,"&quot;")}"
        helper="Tell us what it is so your loan team can route it correctly."
        ${r?'invalid error="Add a short note so we can route this document."':""}>
      </oneapp-poc-note-input>`,n=g&&!m?d(!1):"",k=`<oneapp-poc-alert type="error" heading="We couldn't add that file" supporting="${s}"></oneapp-poc-alert>`,v=r=>m?`<oneapp-poc-button class="upload-btn" hierarchy="primary" size="default" label="Upload document" data-action="upload"${r?" disabled":""}></oneapp-poc-button>`:"",y=r=>`<div class="submit-progress">
         <div class="track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${u}" aria-label="${r} ${e}">
           <div class="fill" style="width:${u}%"></div>
         </div>
         <p class="pct">${r}… ${u}%</p>
       </div>`;switch(t){case"not-started":return n+c;case"validation-error":return n+k+c;case"note-required":return d(!0)+i("replace,remove")+v(!0);case"ready":return n+i("replace,remove");case"selected":return n+i("replace,remove")+v(!1);case"submitting":return i("")+y("Submitting");case"uploading":return i("")+y("Uploading");case"submitted":case"uploaded":return i("preview");case"failed":return n+`<oneapp-poc-alert type="error" heading="That didn't go through" supporting="${s}"></oneapp-poc-alert>`+i("")+`<div class="failed-actions">
             <oneapp-poc-button hierarchy="primary" size="small" label="Try again" data-action="retry"></oneapp-poc-button>
             <oneapp-poc-button hierarchy="tertiary" size="small" label="Choose a different file" data-action="replace"></oneapp-poc-button>
           </div>`;default:return c}}instantBody(){const t=this.status,e=Number(this.getAttribute("progress")??"0"),a=this.getAttribute("accept")??".pdf,.jpg,.jpeg,.png",o=this.getAttribute("hint")??"PDF, JPG, or PNG · 10 MB each",s=this.getAttribute("message")??"",u=this.getAttribute("name")??"document",h=this.getAttribute("files-summary")??"";let p=[];try{p=JSON.parse(this.getAttribute("files")??"[]")}catch{p=[]}const g=p.length,m=l=>/(jpe?g|png|gif|webp|image)/i.test(l??"")?"image":"page",c=`<div class="mf-subhead"><span class="mf-subhead-label">Files for this document</span><span class="mf-subhead-summary">${h}</span></div>`,i=l=>{const b=l.split(","),f=[];return b.includes("preview")&&f.push('<oneapp-poc-button hierarchy="tertiary" size="small" label="Preview" data-action="preview"></oneapp-poc-button>'),b.includes("replace")&&f.push('<oneapp-poc-button hierarchy="tertiary" size="small" label="Replace" data-action="replace"></oneapp-poc-button>'),b.includes("remove")&&f.push(`<button type="button" class="mf-remove" data-action="remove" aria-label="Remove file">${$("trash",20)}</button>`),f.length?`<div class="mf-actions">${f.join("")}</div>`:""},d=(l,b)=>`<div class="mf-row" data-file-id="${l.id}">
        <span class="mf-type" aria-hidden="true">${$(m(l.type),20)}</span>
        <div class="mf-text"><p class="mf-name">${l.name}</p><p class="mf-meta">${l.meta}</p></div>
        ${i(b)}
      </div>`,n=l=>`<div class="mf-list">${p.map(b=>d(b,l)).join("")}</div>`,k=`<du-drop-zone compact multiple accept="${a}"></du-drop-zone>`,v=`<oneapp-poc-alert type="error" heading="We couldn't add that file" supporting="${s}"></oneapp-poc-alert>`,y=`
      <div class="submit-progress">
        <div class="track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${e}" aria-label="Uploading ${u}">
          <div class="fill" style="width:${e}%"></div>
        </div>
        <p class="pct">Uploading… ${e}%</p>
      </div>`;if(t==="uploading")return c+n("")+y;if(t==="uploaded"||t==="submitted")return c+n("preview");if(t==="failed")return c+`<oneapp-poc-alert type="error" heading="That didn't go through" supporting="${s}"></oneapp-poc-alert>`+n("replace,remove")+'<div class="failed-actions"><oneapp-poc-button hierarchy="primary" size="small" label="Try again" data-action="retry"></oneapp-poc-button></div>';if(g===0)return`<du-drop-zone multiple accept="${a}" hint="${o}"></du-drop-zone>`+(s?v:"");const r=`<oneapp-poc-button class="upload-btn" hierarchy="primary" size="default" label="Upload document" data-action="upload"${t==="selected"?"":" disabled"}></oneapp-poc-button>`;return c+n("replace,remove")+k+(s?v:"")+'<p class="mf-hint">Add more files only if your document is split into separate files or photos.</p>'+r}render(){const t=this.getAttribute("name")??"",e=this.getAttribute("description")??"",a=this.status,o=`card-h-${this.getAttribute("doc-id")??t.replace(/\s+/g,"-")}`;this.innerHTML=`
      <section class="card" data-status="${a}" aria-labelledby="${o}">
        <div class="header">
          <div class="title-row">
            <h2 class="title" id="${o}">${t}</h2>
            <du-status-pill status="${a}"></du-status-pill>
          </div>
          ${e?`<p class="desc">${e}</p>`:""}
        </div>
        <div class="body">${this.bodyMarkup()}</div>
      </section>`,this.querySelectorAll("[data-action]").forEach(s=>{s.addEventListener("click",()=>{s.dispatchEvent(new CustomEvent("file-action",{detail:s.dataset.action,bubbles:!0}))})})}}customElements.define("du-checklist-card",S);class E extends HTMLElement{static observedAttributes=["submitted","total","compact","verb"];connectedCallback(){this.render()}attributeChangedCallback(){this.isConnected&&this.render()}render(){const t=Number(this.getAttribute("submitted")??"0"),e=Math.max(1,Number(this.getAttribute("total")??"4")),a=this.getAttribute("verb")??"submitted",o=Math.round(Math.min(t,e)/e*100);this.innerHTML=`
      <div class="wrap">
        <div class="labels">
          <p class="title">Session progress</p>
          <p class="count">${t} of ${e} ${a}</p>
        </div>
        <div class="track" role="progressbar" aria-valuemin="0" aria-valuemax="${e}"
             aria-valuenow="${t}" aria-label="Documents ${a}">
          <div class="fill" style="width:${o}%"></div>
        </div>
      </div>`}}customElements.define("du-session-progress",E);class T extends HTMLElement{_data=null;set data(t){this._data=t,this.render()}get data(){return this._data}connectedCallback(){this._data&&this.render()}render(){const t=this._data;if(!t)return;const e=t.docs.map(i=>{const d=A[i.status]??A["not-started"];return`
          <li class="row">
            <span class="row-icon" style="color:${C[d.tone]}" aria-hidden="true">${$(d.glyph,20)}</span>
            <span class="row-name">${i.name}</span>
            <span class="row-status" style="color:${C[d.tone]}">${d.label}</span>
          </li>`}).join(""),a=t.mode==="instant",o=t.verb??"submitted",s=a?t.allSubmitted:!0,u=t.allSubmitted?"Back to home page":"Submit documents",h=t.allSubmitted?"exit":"submit",p=!t.allSubmitted&&!t.canSubmit,g=t.allSubmitted?"":a?'<p class="helper">Each document uploads on its own as you add it.</p>':'<p class="helper">You can add, replace, or remove files until you submit.</p>',m=!a&&!t.allSubmitted&&t.blockReason?`<p class="block-reason" role="status">${t.blockReason}</p>`:"";this.innerHTML=`
      <aside class="rail" aria-label="Request summary">
        <du-session-progress submitted="${t.submittedCount}" total="${t.total}" verb="${o}"></du-session-progress>
        <ul class="checklist">${e}</ul>
        <div class="divider" role="presentation"></div>
        ${g}
        ${s?`<oneapp-poc-button
                 hierarchy="primary" size="default" full
                 label="${u}" data-action="${h}"
                 ${p?"disabled":""} ${t.submitting?"busy":""}></oneapp-poc-button>`:""}
        ${m}
      </aside>`,this.querySelector("[data-action]")?.addEventListener("click",()=>{this.dispatchEvent(new CustomEvent(h,{bubbles:!0}))})}}customElements.define("du-request-rail",T);
