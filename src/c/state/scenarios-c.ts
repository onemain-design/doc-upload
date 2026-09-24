// Demo scenarios for Option C (Instant Upload) — each jumps the store straight to an edge case /
// state so reviewers can explore without walking the whole flow. Consumed by the scenario dock.
import { storeC, type DocState, type StagedFile } from "./store-c";
import { sampleFile } from "../../shared/dev/sample-doc";

export interface Scenario {
  id: string;
  label: string;
  group?: string;
  apply: () => void;
}

// A staged file for a scenario snapshot. `id` only needs to be unique within its document.
const sf = (id: string, name: string, type: string, size: string): StagedFile => ({
  id,
  info: sampleFile(name, type, size),
});

const uploadedAll: Record<string, Partial<DocState>> = {
  "vehicle-insurance": { status: "uploaded", files: [sf("s1", "insurance-policy.pdf", "PDF", "320 KB")] },
  "vehicle-photo-front": { status: "uploaded", files: [sf("s1", "vehicle-front.jpg", "JPG", "1.8 MB")] },
  "vehicle-photo-back": { status: "uploaded", files: [sf("s1", "vehicle-back.jpg", "JPG", "1.7 MB")] },
  "bill-of-sale": { status: "uploaded", files: [sf("s1", "bill-of-sale.pdf", "PDF", "210 KB")] },
  "payoff-letter": { status: "uploaded", files: [sf("s1", "payoff-letter.pdf", "PDF", "180 KB")] },
};

export const SCENARIOS_C: Scenario[] = [
  { id: "default", label: "Empty — all not started", group: "States", apply: () => storeC.reset() },
  {
    id: "mixed",
    label: "Mixed — ready + error + done",
    group: "States",
    apply: () =>
      storeC.loadScenario({
        "vehicle-insurance": { status: "selected", files: [sf("s1", "insurance-policy.pdf", "PDF", "320 KB")] },
        "vehicle-photo-front": {
          status: "validation-error",
          message:
            "That file is 12.4 MB — larger than the 10 MB limit. Choose a smaller PDF, JPG, or PNG file.",
        },
        "vehicle-photo-back": { status: "uploaded", files: [sf("s1", "vehicle-back.jpg", "JPG", "1.7 MB")] },
        "bill-of-sale": { status: "selected", files: [sf("s1", "bill-of-sale.pdf", "PDF", "210 KB")] },
      }),
  },
  {
    id: "multi-file",
    label: "Multiple files on one document",
    group: "States",
    apply: () =>
      storeC.loadScenario({
        "vehicle-insurance": {
          status: "selected",
          files: [
            sf("s1", "insurance-page-1.jpg", "JPG", "1.2 MB"),
            sf("s2", "insurance-page-2.jpg", "JPG", "1.1 MB"),
            sf("s3", "insurance-page-3.jpg", "JPG", "980 KB"),
          ],
        },
      }),
  },
  {
    id: "uploading",
    label: "One uploading",
    group: "States",
    apply: () =>
      storeC.loadScenario({
        "vehicle-insurance": {
          status: "uploading",
          files: [sf("s1", "insurance-policy.pdf", "PDF", "320 KB")],
          progress: 55,
        },
      }),
  },
  {
    id: "one-failed",
    label: "One failed — retry",
    group: "States",
    apply: () =>
      storeC.loadScenario({
        ...uploadedAll,
        "bill-of-sale": {
          status: "failed",
          attempts: 1,
          files: [sf("s1", "bill-of-sale.pdf", "PDF", "210 KB")],
          message: "Something went wrong on our end. Your files are still here. Try again.",
        },
      }),
  },
  {
    id: "persistent-error",
    label: "Persistent error — contact team",
    group: "States",
    apply: () =>
      storeC.loadScenario({
        ...uploadedAll,
        "bill-of-sale": {
          status: "failed",
          attempts: 2,
          persistent: true,
          files: [sf("s1", "bill-of-sale.pdf", "PDF", "210 KB")],
          message:
            "We still couldn't upload this. Contact your team member and they'll help you get it submitted.",
        },
      }),
  },
  { id: "all-uploaded", label: "Complete — all uploaded", group: "States", apply: () => storeC.loadScenario(uploadedAll) },
  {
    id: "one-doc",
    label: "One document requested",
    group: "Edge cases",
    apply: () => storeC.loadSingleRequest(),
  },
  {
    id: "return-visit",
    label: "Return visit (fewer documents)",
    group: "Edge cases",
    apply: () => storeC.loadReturnVisit(),
  },
  {
    id: "no-request",
    label: "No active request (empty state)",
    group: "Edge cases",
    apply: () => storeC.loadEmptyRequest(),
  },
];
