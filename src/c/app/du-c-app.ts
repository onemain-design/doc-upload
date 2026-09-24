// du-c-app — the Direction C (Instant Upload) shell + orchestrator. Option A's single-page layout,
// but each document uploads on its own via a per-card Upload button — so every upload is "pointed"
// at that document's ID. No batch submit. A single centred column at every breakpoint (no status
// rail, no session-progress counter). Subscribes to store-c; renders OneApp web chrome, the
// Info↔Success banner, and the checklist card stack. Upload progress ticks take a light in-place
// update path (no full re-render) so animations never restart. Errors are immediate and local per
// card — no batch scroll-to-top summary.
import "./du-c-app.css";
import "@shared/chrome/du-web-nav";
import "@shared/components/oneapp-poc-alert";
import "@shared/components/oneapp-poc-button";
import "@shared/components/du-checklist-card";
import "@shared/dev/du-scenario-dock";
import type { DuScenarioDock } from "@shared/dev/du-scenario-dock";
import { SCENARIOS_C } from "../state/scenarios-c";
import { storeC, type DocState, type DocStatus } from "../state/store-c";
import { isDesktop, onBreakpointChange } from "@shared/chrome/responsive";
import { icon } from "@shared/icons";

function escAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export class DuCApp extends HTMLElement {
  private unsub: Array<() => void> = [];
  private lastSig = "";
  private liveRegion!: HTMLElement;
  private dock!: DuScenarioDock;
  private prevStatus = new Map<string, DocStatus>();
  private renderedStatus = new Map<string, DocStatus>();
  private cardTops = new Map<string, number>();
  private wasAllUploaded = false;
  private reduceMotion = false;

  connectedCallback(): void {
    this.liveRegion = document.createElement("div");
    this.liveRegion.className = "sr-only";
    this.liveRegion.setAttribute("role", "status");
    this.liveRegion.setAttribute("aria-live", "polite");
    this.append(this.liveRegion);

    this.dock = document.createElement("du-scenario-dock") as DuScenarioDock;
    this.dock.items = SCENARIOS_C.map((s) => ({ id: s.id, label: s.label, group: s.group }));
    this.dock.addEventListener("scenario-pick", (e) => this.applyScenario((e as CustomEvent<string>).detail));
    document.body.appendChild(this.dock);

    this.reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.attachEvents();
    this.unsub.push(storeC.subscribe(this.onChange));
    this.unsub.push(onBreakpointChange(this.onChange));
    this.onChange();

    const initial = new URLSearchParams(location.search).get("scenario");
    if (initial && SCENARIOS_C.some((s) => s.id === initial)) this.applyScenario(initial);
  }
  disconnectedCallback(): void {
    this.unsub.forEach((u) => u());
    this.unsub = [];
    this.dock?.remove();
  }

  private applyScenario(id: string): void {
    const sc = SCENARIOS_C.find((s) => s.id === id);
    if (!sc) return;
    sc.apply();
    this.dock.active = id;
    const url = new URL(location.href);
    url.searchParams.set("scenario", id);
    history.replaceState(null, "", url);
  }

  // ---- Re-render policy: full render on structural change; light progress tick while uploading.
  private onChange = (): void => {
    this.checkAnnouncements();
    const sig = this.signature();
    if (sig !== this.lastSig) {
      this.captureCardTops();
      this.render();
      this.playFlip();
    } else {
      this.updateProgress();
    }
  };

  // ---- FLIP reflow: cards change height between states; siblings should slide, not jump. ----
  private captureCardTops(): void {
    this.cardTops.clear();
    this.querySelectorAll<HTMLElement>("du-checklist-card").forEach((c) => {
      const id = c.getAttribute("doc-id");
      if (id) this.cardTops.set(id, c.getBoundingClientRect().top);
    });
  }
  private playFlip(): void {
    if (this.reduceMotion) return;
    this.querySelectorAll<HTMLElement>("du-checklist-card").forEach((c) => {
      const id = c.getAttribute("doc-id");
      if (!id) return;
      const prev = this.cardTops.get(id);
      if (prev == null) return;
      const dy = prev - c.getBoundingClientRect().top;
      if (Math.abs(dy) < 1) return;
      c.style.transition = "none";
      c.style.transform = `translateY(${dy}px)`;
      requestAnimationFrame(() => {
        c.style.transition = "transform var(--du-dur-base) var(--du-ease-standard)";
        c.style.transform = "";
        c.addEventListener("transitionend", () => { c.style.transition = ""; }, { once: true });
      });
    });
  }

  private signature(): string {
    return JSON.stringify([
      isDesktop(),
      storeC.hasRequest,
      storeC.allUploaded,
      storeC.isUploading,
      // Per-doc status, message, and the file list (id + name + size). Adding/removing/replacing a file
      // changes the body even while the doc-level status stays "not-started", so track the files too.
      storeC.docs.map((d) => [
        d.id,
        d.status,
        d.message ?? "",
        d.files.map((f) => `${f.id}:${f.info.name}:${f.info.sizeLabel}`),
      ]),
    ]);
  }

  // In-place upload tick: advance each uploading card's determinate bar without a re-render.
  private updateProgress(): void {
    for (const d of storeC.docs) {
      if (d.status !== "uploading") continue;
      const card = this.querySelector(`du-checklist-card[doc-id="${d.id}"]`);
      const fill = card?.querySelector<HTMLElement>(".submit-progress .fill");
      const pct = card?.querySelector<HTMLElement>(".submit-progress .pct");
      if (fill) fill.style.width = `${d.progress ?? 0}%`;
      if (pct) pct.textContent = `Uploading… ${d.progress ?? 0}%`;
      card?.querySelector(".submit-progress .track")?.setAttribute("aria-valuenow", String(d.progress ?? 0));
    }
  }

  private checkAnnouncements(): void {
    for (const d of storeC.docs) {
      const prev = this.prevStatus.get(d.id);
      if (prev && prev !== d.status) {
        if (d.status === "selected") this.announce(`${d.name} ready to upload.`);
        else if (d.status === "validation-error")
          this.announce(d.message ?? "That file can't be added.");
        else if (d.status === "uploaded") this.announce(`${d.name} uploaded.`);
        else if (d.status === "failed")
          this.announce(`${d.name} didn't go through. ${d.message ?? ""}`);
      }
      this.prevStatus.set(d.id, d.status);
    }
    if (storeC.allUploaded && !this.wasAllUploaded) {
      const n = storeC.getState().request.docCount;
      this.announce(
        n === 1
          ? "Your document is uploaded. You're all set."
          : `All ${n} documents uploaded. You're all set.`,
      );
    }
    this.wasAllUploaded = storeC.allUploaded;
  }
  private announce(text: string): void {
    if (this.liveRegion) this.liveRegion.textContent = text;
  }

  // ---- Event delegation ----
  private cardIdOf(e: Event): string | null {
    const card = (e.target as HTMLElement).closest("du-checklist-card") as HTMLElement | null;
    return card?.getAttribute("doc-id") ?? null;
  }
  // Which staged file an event came from (row-level actions), or null for the doc-level add zone.
  private fileIdOf(e: Event): string | null {
    return (e.target as HTMLElement).closest("[data-file-id]")?.getAttribute("data-file-id") ?? null;
  }
  private attachEvents(): void {
    this.addEventListener("file-chosen", (e) => {
      const id = this.cardIdOf(e);
      if (id) storeC.addFile(id, (e as CustomEvent<File>).detail);
    });
    // Multi-select: several files picked or dropped at once → append them all (in page order).
    this.addEventListener("files-chosen", (e) => {
      const id = this.cardIdOf(e);
      if (id) storeC.addFiles(id, (e as CustomEvent<File[]>).detail);
    });
    this.addEventListener("file-action", (e) => {
      const id = this.cardIdOf(e);
      if (!id) return;
      const action = (e as CustomEvent<string>).detail;
      const fileId = this.fileIdOf(e);
      if (action === "upload") storeC.upload(id);
      else if (action === "retry") storeC.retry(id);
      else if (action === "remove" && fileId) storeC.removeFile(id, fileId);
    });
    this.addEventListener("nav-back", () => this.goHome());
    // The "Back to home page" completion button is a plain button — wire its click to go home.
    this.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).closest('[data-action="exit"]')) this.goHome();
    });
  }

  private goHome(): void {
    window.location.assign(import.meta.env.BASE_URL);
  }

  // ---- Render ----
  private cardHtml(doc: DocState): string {
    // Phase one: no description; a document holds 0..N files passed as a JSON `files` attribute.
    const files = doc.files.map((f) => ({
      id: f.id,
      name: f.info.name,
      meta: `${f.info.typeLabel} · ${f.info.sizeLabel}`,
      type: f.info.typeLabel,
    }));
    return `<du-checklist-card
      mode="instant"
      doc-id="${doc.id}"
      name="${escAttr(doc.name)}"
      status="${doc.status}"
      ${doc.dueDate ? `due="${escAttr(doc.dueDate)}"` : ""}
      ${doc.persistent ? "persistent" : ""}
      files="${escAttr(JSON.stringify(files))}"
      files-summary="${escAttr(storeC.filesSummary(doc))}"
      message="${escAttr(doc.message ?? "")}"
      progress="${doc.progress ?? 0}"></du-checklist-card>`;
  }
  private bannerHtml(): string {
    const req = storeC.getState().request;
    const single = req.docCount === 1;
    if (storeC.allUploaded) {
      const what = single ? "your document" : `your ${req.docCount} documents`;
      return `<oneapp-poc-alert type="success" heading="You're all set" supporting="We've uploaded ${what} to your loan team for review. There's nothing else you need to do right now."></oneapp-poc-alert>`;
    }
    // Reached from the Document Center entry banner, which already delivered "documents requested".
    // Orients the task (the per-document upload model); each card carries its own due date below its
    // status, so the banner no longer cites a single request-level deadline.
    const heading = single ? "Upload your document" : "Upload your requested documents";
    const supporting = single
      ? "Add your file below, then upload it — it's sent straight to your loan team. Everything's encrypted."
      : "Add each file below, then upload it — each document is sent to your loan team on its own. Everything's encrypted.";
    return `<oneapp-poc-alert type="info" heading="${heading}" supporting="${supporting}"></oneapp-poc-alert>`;
  }

  // No active/expired request: the standalone page still loads (it owns its URL), so it shows an
  // empty state instead of the checklist. Always one column — independent of the layout variant.
  private renderEmpty(): void {
    this.lastSig = this.signature();
    this.renderedStatus.clear();
    this.innerHTML = "";
    this.append(this.liveRegion);
    const shell = document.createElement("div");
    shell.style.display = "contents";
    shell.innerHTML = `
      <du-web-nav current="loans" back-label="Back to home page"></du-web-nav>
      <main class="a-content" aria-label="Upload Documents">
        <div class="a-page a-page--empty">
          <h1 class="a-headline headline-page">Upload Documents</h1>
          <section class="c-empty" aria-label="No documents requested">
            <span class="c-empty-badge" aria-hidden="true">${icon("documents", 32)}</span>
            <div class="c-empty-copy">
              <h2 class="c-empty-title">Nothing to upload right now</h2>
              <p class="c-empty-body">There's no active document request on your account.</p>
            </div>
          </section>
        </div>
      </main>
      <footer class="a-footer" aria-hidden="true"></footer>`;
    this.append(shell);
  }

  private render(): void {
    if (!storeC.hasRequest) {
      this.renderEmpty();
      return;
    }
    this.lastSig = this.signature();
    const cards = storeC.docs.map((d) => this.cardHtml(d)).join("");
    const doneCta = storeC.allUploaded
      ? `<div class="c-done"><oneapp-poc-button hierarchy="primary" label="Back to home page" data-action="exit"></oneapp-poc-button></div>`
      : "";

    // One centred column at every breakpoint: no status rail, no session-progress counter. Each
    // document carries its own status and due date on its card.
    const main = `
        <h1 class="a-headline headline-page">Upload Documents</h1>
        <div class="banner-wrap">${this.bannerHtml()}</div>
        <div class="card-stack">${cards}</div>
        ${doneCta}`;
    const pageClass = "a-page a-page--single";

    const changed = new Set<string>();
    for (const d of storeC.docs) {
      if (this.renderedStatus.get(d.id) !== d.status) changed.add(d.id);
    }
    const wasAll =
      storeC.docs.length > 0 && storeC.docs.every((d) => this.renderedStatus.get(d.id) === "uploaded");
    const justCompleted = storeC.allUploaded && !wasAll;

    this.innerHTML = "";
    this.append(this.liveRegion);
    const shell = document.createElement("div");
    shell.style.display = "contents";
    shell.innerHTML = `
      <du-web-nav current="loans" back-label="Back to home page"></du-web-nav>
      <main class="a-content" aria-label="Upload Documents"><div class="${pageClass}">${main}</div></main>
      <footer class="a-footer" aria-hidden="true"></footer>`;
    this.append(shell);

    for (const id of changed) {
      this.querySelector(`du-checklist-card[doc-id="${id}"]`)?.setAttribute("data-anim", "");
    }
    for (const d of storeC.docs) this.renderedStatus.set(d.id, d.status);

    if (justCompleted) {
      const heading = this.querySelector<HTMLElement>('oneapp-poc-alert[type="success"] .heading');
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus();
      }
    }
  }
}
customElements.define("du-c-app", DuCApp);
