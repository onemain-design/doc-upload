import{i}from"./du-web-nav-C_BPDic8.js";class a extends HTMLElement{static observedAttributes=["disabled","busy"];btn;connectedCallback(){this.btn||this.render(),this.sync()}attributeChangedCallback(){this.btn&&this.sync()}render(){const n=(this.getAttribute("label")??this.textContent??"").trim(),t=this.getAttribute("icon-start"),e=this.getAttribute("icon-end");this.textContent="",this.btn=document.createElement("button"),this.btn.type="button",this.btn.className="btn",this.btn.innerHTML=`
      <span class="content" style="display:inline-flex;align-items:center;gap:var(--omf-cx-gap-x-component-default,8px);">
        ${t?i(t,20):""}
        <span class="label">${n}</span>
        ${e?i(e,20):""}
      </span>
      <span class="loader" aria-hidden="true"><span></span><span></span><span></span></span>`,this.btn.addEventListener("click",s=>{this.hasAttribute("busy")&&(s.stopImmediatePropagation(),s.preventDefault())},!0),this.append(this.btn)}sync(){if(!this.btn)return;this.btn.disabled=this.hasAttribute("disabled");const n=this.hasAttribute("busy");this.btn.setAttribute("aria-busy",n?"true":"false");const t=this.getAttribute("label");if(t){const e=this.btn.querySelector(".label");e&&e.textContent!==t&&(e.textContent=t)}}}customElements.define("oneapp-poc-button",a);
