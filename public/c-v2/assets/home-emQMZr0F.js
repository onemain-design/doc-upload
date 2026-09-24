import{i as e}from"./du-web-nav-FdHFP31x.js";const a="/doc-upload/c-v2/";class s extends HTMLElement{connectedCallback(){this.innerHTML=`
      <du-web-nav current="home"></du-web-nav>
      <main class="home-main" aria-label="Choose a flow">
        <div class="home-page">
          <h1 class="headline-page home-title">Document upload</h1>
          <p class="home-sub body-supporting">Three prototype directions for the same flow. Pick one to explore.</p>
          <div class="home-cards">
            <a class="flow-card" href="${a}a/">
              <span class="flow-eyebrow">Direction A</span>
              <span class="flow-name">Single Page</span>
              <span class="flow-desc">See every document at once, stage files with instant validation, then submit them all together.</span>
              <span class="flow-go">Open ${e("chevron-right",18)}</span>
            </a>
            <a class="flow-card" href="${a}b/">
              <span class="flow-eyebrow">Direction B</span>
              <span class="flow-name">Guided Flow</span>
              <span class="flow-desc">Upload one document at a time in a focused, step-by-step flow with a document rail.</span>
              <span class="flow-go">Open ${e("chevron-right",18)}</span>
            </a>
            <a class="flow-card" href="${a}c/">
              <span class="flow-eyebrow">Direction C</span>
              <span class="flow-name">Instant Upload</span>
              <span class="flow-desc">Every document on one page — add one or more files per document, then upload each on its own.</span>
              <span class="flow-go">Open ${e("chevron-right",18)}</span>
            </a>
            <a class="flow-card flow-card--archive" href="${a}c-v1/c/">
              <span class="flow-eyebrow">Direction C · Previous version</span>
              <span class="flow-name">Instant Upload (as reviewed)</span>
              <span class="flow-desc">The earlier version shared with stakeholders — one file per document, with the front/back photo ID. Kept for reference.</span>
              <span class="flow-go">Open ${e("chevron-right",18)}</span>
            </a>
          </div>
        </div>
      </main>
      <footer class="home-footer" aria-hidden="true"></footer>`}}customElements.define("du-home",s);
