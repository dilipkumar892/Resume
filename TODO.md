# TODO / Development Tracking

> This file tracks active development tasks for the Resume Portfolio project.
> Status legend: `[ ]` pending · `[x]` completed

## Current Task — Error Audit & Documentation Update

**Task:** Show all errors, make new `TESTING_REPORT.md` and `README.md` files, and apply approved minor code fixes.

### Steps

- [x] **1. Audit the repository** — Read all project files and identify every error, inconsistency, and dead code path.
- [x] **2. Present findings + plan** — Report all errors and get user approval before editing.
- [x] **3. Create `images/og-cover.svg`** — Missing Open Graph / Twitter card image (1200×630).
- [x] **4. Create `TODO.md`** — This file (was missing but referenced in README / TESTING_REPORT).
- [x] **5. Regenerate `TESTING_REPORT.md`** — Corrected test counts (45 / 16 / 12 / 19 / 8 / 12 / 9 / 12 / 23 = 156 total), added missing `F37` & `R9` cases, plus a new **Error Audit & Fixes** section.
- [x] **6. Regenerate `README.md`** — Accurate project-file list, corrected test-report summary, and reference to the new files.
- [x] **7. Apply minor code fixes**
  - Remove duplicate `body::before/::after { content: ''; }` declaration in `style.css`.
  - Remove dead CSS for unused selectors (`.help-modal-content`, `.help-modal-close`, `.help-shortcuts`, `.skill-bar`, `.skill-progress`, `.skills-rings`, `.skeleton*`, `.edu-list`, `.tilt-card*`, `.counter-number`, `.shimmer*`).
  - Remove dead JS `animateSkillBars()` (no `.skill-progress` elements exist in markup) and its calls in `script.js`.
  - Fix help-modal focus restore in `script.js` (set `lastFocusedButton` when opening via `?` shortcut).
- [x] **8. Final verification** — Confirm all references resolve and counts are consistent.

## Notes

- Code files `index.html`, `style.css`, `script.js`, and `Code.gs` are the core implementation.
- `Code.gs` is a standalone Google Apps Script deployment (paste into the Apps Script editor bound to the target Sheet).
- The contact form posts to the Google Apps Script Web App URL defined in `index.html`.

