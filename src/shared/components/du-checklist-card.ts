// du-checklist-card — the per-document card for the Direction A checklist. One contract across all
// states (not-started · validation-error · note-required · ready · submitting · submitted · failed):
// header (title + status pill, stacked on mobile) → description → a body that swaps per status.
// Composes the shared drop-zone / file-row / note-input / alert primitives. Status is always shown
// with icon + text (via du-status-pill), never colour alone.
// Events bubble up to du-a-app, which resolves the owning card via its `doc-id`:
//   • "file-chosen"  (from drop-zone)          — a File was picked/dropped
//   • "file-action"  ("replace"|"remove"|"preview"|"retry") — a row/footer action
//   • "note-change"  (from note-input)         — the Other note changed
// (Figma: Doc Upload / Checklist Card, node 119:1163.)
import "./du-checklist-card.css";
import "./du-status-pill";
import "@shared/components/du-drop-zone";
import "@shared/components/du-file-row";
import "@shared/components/oneapp-poc-note-input";
import "@shared/components/oneapp-poc-alert";
import "@shared/components/oneapp-poc-button";
import { icon } from "../icons";
import type { DocStatus } from "./status-meta";

export class DuChecklistCard extends HTMLElement {
  // `mode`: "batch" (A — stage then one Submit) or "instant" (C — a per-card Upload button that
  // uploads this document on its own). Defaults to batch.
  static observedAttributes = [
    "doc-id",
    "name",
    "description",
    "status",
    "is-other",
    "file-name",
    "file-meta",
    "note",
    "message",
    "progress",
    "accept",
    "hint",
    "mode",
    // Instant mode (C): a document holds 0..N files. `files` is a JSON array of {id,name,meta}.
    "files",
    // Instant mode (C): per-document due date label (e.g. "Sep 30"), shown below the status.
    "due",
    // Instant mode (C): terminal persistent-error state (retries exhausted) → no Try again.
    "persistent",
  ];
  connectedCallback(): void {
    this.render();
  }
  attributeChangedCallback(): void {
    if (this.isConnected) this.render();
  }

  private get status(): DocStatus {
    return (this.getAttribute("status") ?? "not-started") as DocStatus;
  }

  private bodyMarkup(): string {
    // Instant mode (C) is always multi-file — a document can hold several files (e.g. scanned pages).
    if (this.getAttribute("mode") === "instant") return this.instantBody();
    const status = this.status;
    const fileName = this.getAttribute("file-name") ?? "";
    const fileMeta = this.getAttribute("file-meta") ?? "";
    const note = this.getAttribute("note") ?? "";
    const message = this.getAttribute("message") ?? "";
    const progress = Number(this.getAttribute("progress") ?? "0");
    const accept = this.getAttribute("accept") ?? ".pdf,.jpg,.jpeg,.png";
    const hint = this.getAttribute("hint") ?? "PDF, JPG, or PNG · up to 10 MB";
    const isOther = this.hasAttribute("is-other");

    const instant = this.getAttribute("mode") === "instant";

    const dropZone = `<du-drop-zone accept="${accept}" hint="${hint}"></du-drop-zone>`;
    const fileRow = (actions: string) =>
      `<du-file-row variant="filled" name="${fileName}" meta="${fileMeta}" actions="${actions}"></du-file-row>`;
    const noteField = (invalid: boolean) => `
      <oneapp-poc-note-input
        label="What is this document?"
        placeholder="e.g. Bank statement"
        value="${note.replace(/"/g, "&quot;")}"
        helper="Tell us what it is so your loan team can route it correctly."
        ${invalid ? 'invalid error="Add a short note so we can route this document."' : ""}>
      </oneapp-poc-note-input>`;
    // Batch (A) only: the "Other" doc asks the customer to name the document (its note field). Instant
    // mode (C) treats "Other" as an ordinary document — the team-member description is passed straight
    // into the title/description slots upstream, so there's no special treatment and no note field.
    const otherLead = isOther && !instant ? noteField(false) : "";
    const errorAlert = `<oneapp-poc-alert type="error" heading="We couldn't add that file" supporting="${message}"></oneapp-poc-alert>`;
    // Instant mode only: the per-card Upload button (disabled while a required note is missing).
    const uploadBtn = (disabled: boolean) =>
      instant
        ? `<oneapp-poc-button class="upload-btn" hierarchy="primary" size="default" label="Upload document" data-action="upload"${disabled ? " disabled" : ""}></oneapp-poc-button>`
        : "";
    const progressMarkup = (verb: string) =>
      `<div class="submit-progress">
         <div class="track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}" aria-label="${verb} ${fileName}">
           <div class="fill" style="width:${progress}%"></div>
         </div>
         <p class="pct">${verb}… ${progress}%</p>
       </div>`;

    switch (status) {
      case "not-started":
        return otherLead + dropZone;
      case "validation-error":
        return otherLead + errorAlert + dropZone;
      case "note-required":
        // Batch (A) only: the note field shows an error until a type is entered. du-a-app toggles the
        // field's `invalid` attribute live as the user types (note-required ↔ ready), so the body is
        // never re-rendered mid-edit (which would drop input focus). Instant mode (C) no longer gates
        // on a customer note — the "Other" description is team-provided — so this state never occurs.
        return noteField(true) + fileRow("replace,remove") + uploadBtn(true);
      case "ready": // A batch: staged, waiting for the single Submit
        return otherLead + fileRow("replace,remove");
      case "selected": // C instant: staged, waiting for this doc's Upload
        return otherLead + fileRow("replace,remove") + uploadBtn(false);
      case "submitting":
        return fileRow("") + progressMarkup("Submitting");
      case "uploading":
        return fileRow("") + progressMarkup("Uploading");
      case "submitted":
      case "uploaded":
        return fileRow("preview");
      case "failed":
        return (
          otherLead +
          `<oneapp-poc-alert type="error" heading="That didn't go through" supporting="${message}"></oneapp-poc-alert>` +
          fileRow("") +
          `<div class="failed-actions">
             <oneapp-poc-button hierarchy="primary" size="small" label="Try again" data-action="retry"></oneapp-poc-button>
             <oneapp-poc-button hierarchy="tertiary" size="small" label="Choose a different file" data-action="replace"></oneapp-poc-button>
           </div>`
        );
      default:
        return dropZone;
    }
  }

  // Instant (C) multi-file body — one growing, numbered file list per document. A document holds
  // 0..N files (page order = the numbers); a persistent "Add another file" row is always last and
  // doubles as the drop target; files are combined in the shown order and can be reordered; one
  // Upload sends them all together against the document ID.
  private instantBody(): string {
    const status = this.status;
    const progress = Number(this.getAttribute("progress") ?? "0");
    const accept = this.getAttribute("accept") ?? ".pdf,.jpg,.jpeg,.png";
    const hint = this.getAttribute("hint") ?? "PDF, JPG, or PNG · 10 MB each";
    const message = this.getAttribute("message") ?? "";
    const name = this.getAttribute("name") ?? "document";
    const summary = this.getAttribute("files-summary") ?? "";

    let files: Array<{ id: string; name: string; meta: string; type?: string }> = [];
    try {
      files = JSON.parse(this.getAttribute("files") ?? "[]");
    } catch {
      files = [];
    }
    const total = files.length;
    // File-type glyph in the leading slot — a document for PDFs, a photo for images.
    const typeIcon = (type?: string) =>
      /(jpe?g|png|gif|webp|image)/i.test(type ?? "") ? "image" : "page";

    const subhead = `<div class="mf-subhead"><span class="mf-subhead-label">Files for this document</span><span class="mf-subhead-summary">${summary}</span></div>`;
    // Phase one (C): a file row offers Delete only. Replace and post-upload Preview are out of MVP.
    const actionButtons = (actions: string) => {
      const a = actions.split(",");
      const parts: string[] = [];
      if (a.includes("remove"))
        parts.push(`<button type="button" class="mf-remove" data-action="remove" aria-label="Remove file">${icon("trash", 20)}</button>`);
      return parts.length ? `<div class="mf-actions">${parts.join("")}</div>` : "";
    };
    const row = (f: { id: string; name: string; meta: string; type?: string }, actions: string) =>
      `<div class="mf-row" data-file-id="${f.id}">
        <span class="mf-type" aria-hidden="true">${icon(typeIcon(f.type), 20)}</span>
        <div class="mf-text"><p class="mf-name">${f.name}</p><p class="mf-meta">${f.meta}</p></div>
        ${actionButtons(actions)}
      </div>`;
    const rows = (actions: string) =>
      `<div class="mf-list">${files.map((f) => row(f, actions)).join("")}</div>`;
    const addRow = `<du-drop-zone compact multiple accept="${accept}"></du-drop-zone>`;
    const errorAlert = `<oneapp-poc-alert type="error" heading="We couldn't add that file" supporting="${message}"></oneapp-poc-alert>`;
    const progressMarkup = `
      <div class="submit-progress">
        <div class="track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}" aria-label="Uploading ${name}">
          <div class="fill" style="width:${progress}%"></div>
        </div>
        <p class="pct">Uploading… ${progress}%</p>
      </div>`;

    if (status === "uploading") {
      return subhead + rows("") + progressMarkup;
    }
    if (status === "uploaded" || status === "submitted") {
      return subhead + rows("");
    }
    if (status === "failed") {
      // Terminal persistent error (retries exhausted): swap the copy and drop Try again.
      const persistent = this.hasAttribute("persistent");
      const heading = persistent ? "We couldn't upload this document" : "That didn't go through";
      const retry = persistent
        ? ""
        : `<div class="failed-actions"><oneapp-poc-button hierarchy="primary" size="small" label="Try again" data-action="retry"></oneapp-poc-button></div>`;
      return (
        subhead +
        `<oneapp-poc-alert type="error" heading="${heading}" supporting="${message}"></oneapp-poc-alert>` +
        rows("remove") +
        retry
      );
    }

    // Gathering (not-started / validation-error / selected). With no files yet, the drop zone is the
    // whole story — skip the subheader and the "add more" guidance until a file is added.
    if (total === 0) {
      return (
        `<du-drop-zone multiple accept="${accept}" hint="${hint}"></du-drop-zone>` +
        (message ? errorAlert : "")
      );
    }
    const upload = `<oneapp-poc-button class="upload-btn" hierarchy="primary" size="default" label="Upload document" data-action="upload"${status === "selected" ? "" : " disabled"}></oneapp-poc-button>`;
    const addHint = `<p class="mf-hint">Add more files only if your document is split into separate files or photos.</p>`;
    return (
      subhead +
      rows("remove") +
      addRow +
      (message ? errorAlert : "") +
      addHint +
      upload
    );
  }

  private render(): void {
    const name = this.getAttribute("name") ?? "";
    const description = this.getAttribute("description") ?? "";
    const due = this.getAttribute("due") ?? "";
    const status = this.status;
    const headingId = `card-h-${this.getAttribute("doc-id") ?? name.replace(/\s+/g, "-")}`;

    this.innerHTML = `
      <section class="card" data-status="${status}" aria-labelledby="${headingId}">
        <div class="header">
          <div class="title-row">
            <h2 class="title" id="${headingId}">${name}</h2>
            <du-status-pill status="${status}"></du-status-pill>
          </div>
          ${due ? `<p class="due-date">Due ${due}</p>` : ""}
          ${description ? `<p class="desc">${description}</p>` : ""}
        </div>
        <div class="body">${this.bodyMarkup()}</div>
      </section>`;

    // Action buttons → re-emit as "file-action" from the control itself, so the host can resolve
    // which file row (data-file-id) it came from for per-file actions (replace / remove / preview).
    this.querySelectorAll<HTMLElement>("[data-action]").forEach((el) => {
      el.addEventListener("click", () => {
        el.dispatchEvent(
          new CustomEvent("file-action", { detail: el.dataset.action, bubbles: true }),
        );
      });
    });
  }
}
customElements.define("du-checklist-card", DuChecklistCard);
