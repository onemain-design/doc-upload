import{i as e}from"./du-web-nav-C_BPDic8.js";import"./oneapp-poc-button-DhAI0vn-.js";const c="/doc-upload/c-v1/",l=[{loan:"****5839",date:"6/12/23",status:"present"},{loan:"****0486",date:"11/19/22",status:"present"},{loan:"****9065",date:"2/21/21",status:"past"}];class o extends HTMLElement{connectedCallback(){const s=new URLSearchParams(location.search).get("flow"),n=s==="a"||s==="b"?s:"c",t=l.map(a=>`
        <li class="tile" data-status="${a.status}">
          <span class="badge-slot"><span class="badge">${a.status==="present"?"Present loan":"Past loan"}</span></span>
          <div class="cell cell-loan"><span class="val">${a.loan}</span><span class="lbl">Loan #</span></div>
          <div class="cell cell-date"><span class="val">${a.date}</span><span class="lbl">Date of loan</span></div>
          <span class="action" aria-hidden="true">
            <span class="action-text">Go to folder</span>
            <span class="chev">${e("chevron-right",16)}</span>
          </span>
        </li>`).join("");this.innerHTML=`
      <du-web-nav current="loans"></du-web-nav>
      <main class="dc-content" aria-label="Document Center">
        <div class="dc-page">
          <h1 class="headline-page dc-title">Document Center</h1>

          <section class="entry-banner" aria-label="Documents requested">
            <div class="eb-row">
              <span class="eb-icon" aria-hidden="true">${e("warning-triangle",24)}</span>
              <p class="eb-heading">Your loan team requested documents</p>
            </div>
            <p class="eb-body">See what's needed to keep your personal loan on track.</p>
            <oneapp-poc-button hierarchy="primary" size="small" label="Review request" data-cta></oneapp-poc-button>
          </section>

          <section class="accounts" aria-label="Your loans">
            <div class="acc-head" aria-hidden="true">
              <span class="ah ah-status">Account Status</span>
              <span class="ah ah-loan">Loan #</span>
              <span class="ah ah-date">Date of loan</span>
              <span class="ah ah-actions">Actions</span>
            </div>
            <ul class="acc-list">${t}</ul>
          </section>
        </div>
      </main>
      <footer class="dc-footer" aria-hidden="true"></footer>`,this.querySelector("[data-cta]")?.addEventListener("click",()=>{window.location.assign(`${c}${n}/`)})}}customElements.define("du-doc-center",o);
