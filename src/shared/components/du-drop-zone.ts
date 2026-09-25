// du-drop-zone — file selection target. Responsive by breakpoint:
//   • Desktop (≥840): decorative icon + "Drag and drop your file(s) here" + a "Choose file(s)" button
//     that triggers a visually-hidden native <input type=file>; drag-and-drop is a progressive add-on.
//   • Mobile (≤839): the whole area is a single tappable <button> — "Tap to choose a file".
//   • Row mode (`compact`): a slim full-width "Add another file" row for appending further files to a
//     document that already has one. It stays a drop target (same footprint) but reads as optional.
// `multiple` allows selecting several files at once; the component then emits "files-chosen" (File[]).
// Otherwise it emits "file-chosen" (a single File). (Figma: Upload Drop Zone 106:964; mobile 381:14698.)
import "./du-drop-zone.css";
import "./du-decorative-icon";
import "./oneapp-poc-button";
import { icon } from "../icons";
import { isDesktop, onBreakpointChange } from "../chrome/responsive";

export class DuDropZone extends HTMLElement {
  static observedAttributes = ["accept", "hint", "headline", "compact", "multiple"];
  private input?: HTMLInputElement;
  private offBreakpoint?: () => void;

  connectedCallback(): void {
    this.render();
    this.offBreakpoint = onBreakpointChange(() => this.render());
  }
  disconnectedCallback(): void {
    this.offBreakpoint?.();
  }
  attributeChangedCallback(): void {
    if (this.isConnected) this.render();
  }

  private get multiple(): boolean {
    return this.hasAttribute("multiple");
  }

  private render(): void {
    const accept = this.getAttribute("accept") ?? ".pdf,.jpg,.jpeg,.png";
    const hint = this.getAttribute("hint") ?? "PDF, JPG, or PNG · up to 10 MB";
    const headline = this.getAttribute("headline");
    const multipleAttr = this.multiple ? " multiple" : "";
    const desktop = isDesktop();

    // Row mode: the slim "Add another file" row (a drop target in the list's position). The whole row
    // is one tap target; the supporting line explains when to add more, so no separate paragraph.
    if (this.hasAttribute("compact")) {
      this.innerHTML = `
        <button type="button" class="add-row">
          <span class="ar-plus" aria-hidden="true">${icon("plus", 20)}</span>
          <span class="ar-text">
            <span class="ar-label">${headline ?? "Add another file"}</span>
            <span class="ar-sub">For additional pages or photos of this document</span>
          </span>
          <input type="file" accept="${accept}"${multipleAttr} tabindex="-1" aria-hidden="true" />
        </button>`;
      const row = this.querySelector<HTMLButtonElement>(".add-row")!;
      this.wireInput();
      row.addEventListener("click", (e) => {
        if ((e.target as HTMLElement).tagName !== "INPUT") this.input!.click();
      });
      this.wireDrop(row);
      return;
    }

    if (desktop) {
      this.innerHTML = `
        <div class="zone">
          <du-decorative-icon glyph="upload" size="large"></du-decorative-icon>
          <div class="instructions">
            <p class="headline">${headline ?? (this.multiple ? "Drag and drop your files here" : "Drag and drop your file here")}</p>
            <p class="hint">${hint}</p>
          </div>
          <oneapp-poc-button hierarchy="secondary" size="small" label="${this.multiple ? "Choose files" : "Choose file"}"></oneapp-poc-button>
          <input type="file" accept="${accept}"${multipleAttr} tabindex="-1" aria-hidden="true" />
        </div>`;
    } else {
      this.innerHTML = `
        <button type="button" class="zone zone--tap">
          <du-decorative-icon glyph="upload" size="large"></du-decorative-icon>
          <div class="instructions">
            <p class="headline">${headline ?? (this.multiple ? "Tap to choose files" : "Tap to choose a file")}</p>
            <p class="hint">${hint}</p>
          </div>
        </button>
        <input type="file" accept="${accept}"${multipleAttr} tabindex="-1" aria-hidden="true" />`;
    }

    this.wireInput();

    if (desktop) {
      const zone = this.querySelector<HTMLElement>(".zone")!;
      this.querySelector("oneapp-poc-button")!.addEventListener("click", () => this.input!.click());
      this.wireDrop(zone);
    } else {
      this.querySelector<HTMLButtonElement>(".zone--tap")!.addEventListener("click", () =>
        this.input!.click(),
      );
    }
  }

  private wireInput(): void {
    this.input = this.querySelector<HTMLInputElement>('input[type="file"]')!;
    this.input.addEventListener("change", () => {
      this.emit([...(this.input!.files ?? [])]);
      this.input!.value = "";
    });
  }
  private wireDrop(zone: HTMLElement): void {
    zone.addEventListener("dragover", (e) => {
      // Only react to files dragged from outside — internal row reordering is handled by the app.
      if (![...(e.dataTransfer?.types ?? [])].includes("Files")) return;
      e.preventDefault();
      zone.classList.add("is-dragover");
    });
    zone.addEventListener("dragleave", () => zone.classList.remove("is-dragover"));
    zone.addEventListener("drop", (e) => {
      if (!e.dataTransfer?.files.length) return; // not an external file drop
      e.preventDefault();
      zone.classList.remove("is-dragover");
      this.emit([...e.dataTransfer.files]);
    });
  }

  private emit(files: File[]): void {
    if (files.length === 0) return;
    if (this.multiple) {
      this.dispatchEvent(new CustomEvent("files-chosen", { detail: files, bubbles: true }));
    } else {
      this.dispatchEvent(new CustomEvent("file-chosen", { detail: files[0], bubbles: true }));
    }
  }
}
customElements.define("du-drop-zone", DuDropZone);
