// du-status-pill — the per-document status chip for the Single Page. Always icon + text (never
// color alone). Colors follow the Pencil status palette: neutral (not started), blue (ready /
// submitting), amber (needs attention), green (submitted), red (failed).
// (Figma: Doc Upload / Document Status, node 110:1125.)
import "./du-status-pill.css";
import { icon, type IconName } from "@shared/icons";
import { STATUS_META, type DocStatus, type StatusTone } from "./status-meta";

export class DuStatusPill extends HTMLElement {
  // `label`, `glyph`, and `tone` optionally override the status-derived defaults — used to render the
  // due-date variant ("Due Sep 30" with a clock glyph in a caution tone) in place of the status label.
  static observedAttributes = ["status", "label", "glyph", "tone"];
  connectedCallback(): void {
    this.render();
  }
  attributeChangedCallback(): void {
    if (this.isConnected) this.render();
  }
  private render(): void {
    const status = (this.getAttribute("status") ?? "not-started") as DocStatus;
    const meta = STATUS_META[status] ?? STATUS_META["not-started"];
    const label = this.getAttribute("label") ?? meta.label;
    const glyph = (this.getAttribute("glyph") as IconName | null) ?? meta.glyph;
    const tone = (this.getAttribute("tone") as StatusTone | null) ?? meta.tone;
    this.innerHTML = `
      <span class="pill" data-tone="${tone}">
        <span class="glyph" aria-hidden="true">${icon(glyph, 16)}</span>
        <span class="label">${label}</span>
      </span>`;
  }
}
customElements.define("du-status-pill", DuStatusPill);
