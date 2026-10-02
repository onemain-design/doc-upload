import{i as t}from"./du-web-nav-CHnbwIhj.js";class r extends HTMLElement{dialog;connectedCallback(){this.dialog||this.render()}render(){this.innerHTML=`
      <dialog class="preview" aria-label="Document preview">
        <div class="preview-grab" aria-hidden="true"></div>
        <div class="preview-head">
          <p class="preview-name"></p>
          <button type="button" class="preview-close" aria-label="Close preview">${t("close",24)}</button>
        </div>
        <div class="preview-body"></div>
      </dialog>`,this.dialog=this.querySelector("dialog"),this.querySelector(".preview-close").addEventListener("click",()=>this.close()),this.dialog.addEventListener("click",e=>{e.target===this.dialog&&this.close()}),this.dialog.addEventListener("close",()=>{const e=this.querySelector(".preview-body");e&&(e.innerHTML="")})}open(e){this.dialog||this.render(),this.querySelector(".preview-name").textContent=e.name;const i=this.querySelector(".preview-body"),s=/^(jpe?g|png|gif|webp)$/i.test(e.type);e.url?s?i.innerHTML=`<img class="preview-image" src="${e.url}" alt="${e.name}" />`:i.innerHTML=`<iframe class="preview-frame" src="${e.url}" title="${e.name}"></iframe>`:i.innerHTML=`<p class="preview-fallback">Preview isn't available for this file.</p>`,this.dialog.open||this.dialog.showModal()}close(){this.dialog?.open&&this.dialog.close()}}customElements.define("du-file-preview",r);
