# gantt.html Map

## Scope

- Main editable file: `gantt.html`.
- Data file: `gantt.js`, loaded by `<script src="gantt.js">` and expected to assign `window.__GANTT_DATA__`.
- Other HTML files are not the normal edit target.
- The app is a local single-page tool for Chrome or Edge; JavaScript and CSS live inside `gantt.html`.

## Page Structure

- Head initializes `window.__GANTT_DATA__ = null` and `window.__GANTT_VIEWER_MODE__ = false`.
- `gantt.js` is loaded before the embedded application script.
- Body root:
  - `#topPane`: toolbar, master data, filters, save controls.
  - `#hResizer`: vertical sizing control between top and bottom panes.
  - `#bottomPane`: main split layout.
  - `#leftPane`: editable tree/input pane.
  - `#resizer`: horizontal split control.
  - `#rightWrap > #ganttVScroll`: rendered Gantt table, overlays, comments, milestones.

## Core Data Shape

`emptyData()` returns the baseline persisted structure:

- `phases`: array, always includes `"all"`.
- `cases`: `{ id, name }[]`.
- `members`: `{ id, name, defaultColor, holidays }[]`.
- `statuses`: `{ id, name }[]`.
- `commonHolidays`: `YYYY-MM-DD[]`.
- `milestones`: object keyed by date.
- `domains`: hierarchy of domains, projects, versions, tasks, plans.
- `totalPattern`: one of the supported manhour aggregation patterns.

Plan objects commonly include:

- Identity and ownership: `id`, `name`, `caseId`, `ownerId`, `statusId`, `color`.
- Dates: `plannedStart`, `plannedEnd`, `actualStart`, `actualEnd`.
- Workload: `utilization`, `phaseHours`, `cells`, `actualCells`.
- Mode/comment fields: `isPlanOrActual`, `comment`.

Cell objects are keyed by `YYYY-MM-DD`. Planned cells use `plan.cells`; actual cells use `plan.actualCells`. Active cells generally contain a `util` object, with optional `util.value` for non-default utilization.

## Important Functions

- Date helpers: `toDateString`, `parseYMD`, `addDays`, `daysBetween`.
- Data defaults/migration: `emptyData`, `normalizeLoaded`, `migrateCellsToDayModel`, `migratePlanCellsToDayModel`.
- Save serialization: `cloneForSave`, `serializeJs`, `saveData`, `saveViewer`, `saveNamedData`.
- Plan traversal and lookup: `eachPlan`, `findPlan`, `findTaskForPlan`.
- Dirty/save status: `markDirty`, `updateToolSaveStatus`.
- Cell logic: `getCellsByKind`, `cellIsOn`, `effectiveCellUtil`, `dayHoursAll`, `recomputeAllPhaseFromCells`.
- Date range and business-day logic: `getDateRange`, `isHolidayDate`, `capacityForDate`, `computePlannedEnd`, `shiftIndexByBusinessDays`.
- Comments/milestones: `getNodeComment`, `setNodeComment`, `getCellComment`, `setCellComment`, `getMilestoneComment`, `openCommentPopup`.
- Manhour summary: `totalManhoursByPattern`, `refreshManhoursRowsDom`, `buildSummaryMatrix`, `renderManhourSummaryPopup`.
- Rendering entry points: `renderTop`, `renderInputPane`, `renderGantt`, `renderAll`.
- Gantt interactions: `appendPlanDayCells`, `appendTaskPlanRows`, `onCellPointerDown`, `onCellPointerMove`, `inputCellUtil`.

## Render Flow

1. `initData()` loads and normalizes `window.__GANTT_DATA__`, copies persisted UI state into `state`, recomputes plan totals, and sets viewer-mode defaults.
2. `renderAll()` syncs layout CSS variables, toggles major panes, then calls `renderTop()`, `renderInputPane()`, and `renderGantt()`.
3. `renderTop()` builds toolbar, filters, master lists, save controls, and mode toggles.
4. `renderInputPane()` builds editable hierarchy controls for domains, projects, versions, tasks, plans, holidays, milestones, and details.
5. `renderGantt()` builds calendar headers, manhour rows, hierarchy rows, plan/actual rows, overlays, comment cards, and milestone lines.

## Safe Insertion Points

- New persisted app setting: add default in `emptyData`, normalize in `normalizeLoaded`, copy into `state` in `initData`, update save source in the relevant UI handler.
- New transient UI state: add to `state` only, then use in render/event handlers.
- New top-pane control: add inside `renderTop`, persist with `markDirty` if it changes saved data.
- New left-pane plan field: add inside `makePlanNode`, normalize in `normalizeLoaded`, and update calculations if it affects totals or dates.
- New date/cell behavior: use `getCellsByKind`, `cellIsOn`, `effectiveCellUtil`, and update DOM through `updatePlanCellDomByData` or `renderGantt`.
- New manhour aggregation behavior: update total pattern constants, `normalizeTotalPattern`, `getTotalPatternList`, `totalManhoursByPattern`, and summary rendering together.
- New save/export behavior: preserve `saveData`, `saveViewer`, and `saveNamedData` distinctions.

## Constraints

- Do not rely on modules, bundlers, or server-side APIs.
- Keep behavior compatible with direct local-file usage and WebView2 host integration where existing `wri` hooks are present.
- Do not assume automated tests exist; use focused inspection and concise manual verification steps.
- Avoid large-scale refactors unless the user explicitly requests them.
