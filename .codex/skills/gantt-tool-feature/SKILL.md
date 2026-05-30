---
name: gantt-tool-feature
description: Add or modify features in this workspace's single-file local Gantt chart tool. Use when Codex is asked to change C:\home\js\gantt_tool\gantt.html, adjust behavior tied to gantt.js data, inspect the embedded JavaScript/CSS/DOM structure, or implement UI, rendering, save, comment, filter, manhour, date, plan-cell, or viewer-mode features for this tool.
---

# Gantt Tool Feature

## Workflow

1. Treat `gantt.html` as the only editable HTML target unless the user explicitly changes repository instructions.
2. Read `references/gantt-html-map.md` before making non-trivial changes.
3. Keep JavaScript and CSS embedded in `gantt.html`; keep chart data in `gantt.js` or same-pattern data files.
4. Preserve UTF-8 without BOM and avoid git operations.
  - ただし、windowsのpowershellを使用する場合は文字化け対策としてUTF-8 with BOMで保存する。
5. Prefer small, localized edits around the existing helpers and render functions.
6. Validate by static inspection and, when useful, browser-manual instructions; automated test design is not required.

## Change Strategy

- Normalize or migrate persisted fields in `normalizeLoaded` before rendering or saving new data.
- Add state defaults to the `state` object and mirror persistent state into `state.data` before `saveData`.
- Use `markDirty(state, true)` for user-visible data changes that should trigger save prompts.
- Re-render with `renderAll()` for broad structure changes and targeted DOM refresh helpers for cell-only updates.
- Preserve viewer mode by checking `window.__GANTT_VIEWER_MODE__` paths before exposing editing UI.
- Avoid rewriting large render blocks when a helper or narrow event handler change is sufficient.

## References

- Use `references/gantt-html-map.md` for the current architecture, key functions, data shape, and safe insertion points.
