// du-doc-center — the Document Center screen: the product entry point into the document-upload
// experience. OneApp web chrome (Loans active) + a caution "documents requested" banner whose
// "Review request" CTA opens the upload summary, + the customer's loans (desktop table / mobile
// tiles, inert here). The CTA's destination is chosen by `?flow=a|b` (default a) so either the
// Single Page (A) or Guided Flow (B) journey can be demoed from the same screen.
// (Figma: "Entry points" section, node 440:5320.)
import "./du-doc-center.css";
import "@shared/chrome/du-web-nav";
import "@shared/components/oneapp-poc-button";
import { icon } from "@shared/icons";

const BASE = import.meta.env.BASE_URL;

interface Loan {
  loan: string;
  date: string;
  status: "present" | "past";
}
const LOANS: Loan[] = [
  { loan: "****5839", date: "6/12/23", status: "present" },
  { loan: "****0486", date: "11/19/22", status: "present" },
  { loan: "****9065", date: "2/21/21", status: "past" },
];

export class DuDocCenter extends HTMLElement {
  connectedCallback(): void {
    // The entry banner routes into whichever upload direction the demo wants (default: Instant
    // Upload / Option C — the direction that fits the backend document-ID tagging model).
    const flowParam = new URLSearchParams(location.search).get("flow");
    const flow = flowParam === "a" || flowParam === "b" ? flowParam : "c";

    const rows = LOANS.map(
      (l) => `
        <li class="tile" data-status="${l.status}">
          <span class="badge-slot"><span class="badge">${l.status === "present" ? "Present loan" : "Past loan"}</span></span>
          <div class="cell cell-loan"><span class="val">${l.loan}</span><span class="lbl">Loan #</span></div>
          <div class="cell cell-date"><span class="val">${l.date}</span><span class="lbl">Date of loan</span></div>
          <span class="action" aria-hidden="true">
            <span class="action-text">Go to folder</span>
            <span class="chev">${icon("chevron-right", 16)}</span>
          </span>
        </li>`,
    ).join("");

    this.innerHTML = `
      <du-web-nav current="loans"></du-web-nav>
      <main class="dc-content" aria-label="Document Center">
        <div class="dc-page">
          <h1 class="headline-page dc-title">Document Center</h1>

          <section class="entry-banner" aria-label="Documents requested">
            <div class="eb-row">
              <span class="eb-icon" aria-hidden="true">${icon("warning-triangle", 24)}</span>
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
            <ul class="acc-list">${rows}</ul>
          </section>
        </div>
      </main>
      <footer class="dc-footer" aria-hidden="true"></footer>`;

    this.querySelector("[data-cta]")?.addEventListener("click", () => {
      // When embedded (e.g. as the entry gate inside /c/), a host handles this and reveals the upload
      // flow in place. Standalone (the /loans/document-center/ route), it navigates into the flow.
      const ev = new CustomEvent("review-request", { bubbles: true, cancelable: true });
      this.dispatchEvent(ev);
      if (ev.defaultPrevented) return;
      // For C, land straight in the upload view so its own entry gate is not shown twice.
      window.location.assign(flow === "c" ? `${BASE}c/?view=upload` : `${BASE}${flow}/`);
    });
  }
}
customElements.define("du-doc-center", DuDocCenter);
