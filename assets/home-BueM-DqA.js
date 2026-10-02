import{i as e}from"./du-web-nav-CHnbwIhj.js";const a="/doc-upload/";class s extends HTMLElement{connectedCallback(){this.innerHTML=`
      <du-web-nav current="home"></du-web-nav>
      <main class="home-main" aria-label="Choose a flow">
        <div class="home-page">
          <h1 class="headline-page home-title">Document upload</h1>
          <p class="home-sub body-supporting">Instant Upload is the current direction. Earlier explorations and frozen versions are kept for reference.</p>
          <div class="home-cards">
            <a class="flow-card" href="${a}c/">
              <span class="flow-eyebrow">Direction C · Current</span>
              <span class="flow-name">Instant Upload</span>
              <span class="flow-desc">Every document on one page — add one or more files per document, then upload each on its own.</span>
              <span class="flow-go">Open ${e("chevron-right",18)}</span>
            </a>
          </div>

          <details class="home-archive">
            <summary class="home-archive-summary">See previous options</summary>
            <div class="home-cards home-archive-cards">
              <a class="flow-card flow-card--archive" href="${a}c-v2/c/">
                <span class="flow-eyebrow">Direction C · Previous version</span>
                <span class="flow-name">Instant Upload (multi-file, pre-updates)</span>
                <span class="flow-desc">The multi-file version before the latest PM updates — with the status rail, session-progress counter, and Replace. Kept for reference.</span>
                <span class="flow-go">Open ${e("chevron-right",18)}</span>
              </a>
              <a class="flow-card flow-card--archive" href="${a}c-v1/c/">
                <span class="flow-eyebrow">Direction C · First reviewed</span>
                <span class="flow-name">Instant Upload (as first reviewed)</span>
                <span class="flow-desc">The earliest version shared with stakeholders — one file per document, with the front/back photo ID. Kept for reference.</span>
                <span class="flow-go">Open ${e("chevron-right",18)}</span>
              </a>
              <a class="flow-card flow-card--archive" href="${a}a/">
                <span class="flow-eyebrow">Direction A</span>
                <span class="flow-name">Single Page</span>
                <span class="flow-desc">See every document at once, stage files with instant validation, then submit them all together.</span>
                <span class="flow-go">Open ${e("chevron-right",18)}</span>
              </a>
              <a class="flow-card flow-card--archive" href="${a}b/">
                <span class="flow-eyebrow">Direction B</span>
                <span class="flow-name">Guided Flow</span>
                <span class="flow-desc">Upload one document at a time in a focused, step-by-step flow with a document rail.</span>
                <span class="flow-go">Open ${e("chevron-right",18)}</span>
              </a>
            </div>
          </details>
        </div>
      </main>
      <footer class="home-footer" aria-hidden="true"></footer>`}}customElements.define("du-home",s);
