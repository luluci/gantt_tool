# gantt.html マップ

## 対象範囲

- 主な編集対象ファイル: `gantt.html`。
- データファイル: `gantt.js`。`<script src="gantt.js">` で読み込まれ、`window.__GANTT_DATA__` を代入する想定。
- その他の HTML ファイルは通常の編集対象ではない。
- このアプリは Chrome または Edge で使うローカル用の単一ページツールであり、JavaScript と CSS は `gantt.html` 内に記述されている。

## ページ構造

- head では `window.__GANTT_DATA__ = null` と `window.__GANTT_VIEWER_MODE__ = false` を初期化する。
- `gantt.js` は埋め込みアプリケーションスクリプトより前に読み込まれる。
- body 直下のルート:
  - `#topPane`: ツールバー、マスターデータ、フィルタ、保存コントロール。
  - `#hResizer`: 上下ペイン間の縦方向サイズ調整コントロール。
  - `#bottomPane`: メインの分割レイアウト。
  - `#leftPane`: 編集可能なツリーと入力ペイン。
  - `#resizer`: 横方向の分割コントロール。
  - `#rightWrap > #ganttVScroll`: 描画済みのガント表、オーバーレイ、コメント、マイルストーン。

## 主要データ形状

`emptyData()` は永続化される基準構造を返す。

- `phases`: 配列。常に `"all"` を含む。
- `cases`: `{ id, name }[]`。
- `members`: `{ id, name, defaultColor, holidays }[]`。
- `statuses`: `{ id, name }[]`。
- `commonHolidays`: `YYYY-MM-DD[]`。
- `milestones`: 日付をキーにしたオブジェクト。
- `domains`: ドメイン、プロジェクト、バージョン、タスク、予定の階層。
- `totalPattern`: 対応している工数集計パターンのいずれか。

予定オブジェクトでは、主に次の項目を扱う。

- 識別と担当: `id`, `name`, `caseId`, `ownerId`, `statusId`, `color`。
- 日付: `plannedStart`, `plannedEnd`, `actualStart`, `actualEnd`。
- 作業量: `utilization`, `phaseHours`, `cells`, `actualCells`。
- モードとコメント: `isPlanOrActual`, `comment`。

セルオブジェクトは `YYYY-MM-DD` をキーにする。予定セルは `plan.cells`、実績セルは `plan.actualCells` を使う。有効なセルには通常 `util` オブジェクトが含まれ、デフォルト以外の稼働率には任意で `util.value` が入る。

## 重要な関数

- 日付ヘルパー: `toDateString`, `parseYMD`, `addDays`, `daysBetween`。
- データのデフォルトと移行: `emptyData`, `normalizeLoaded`, `migrateCellsToDayModel`, `migratePlanCellsToDayModel`。
- 保存シリアライズ: `cloneForSave`, `serializeJs`, `saveData`, `saveViewer`, `saveNamedData`。
- 予定の走査と検索: `eachPlan`, `findPlan`, `findTaskForPlan`。
- 変更状態と保存状態: `markDirty`, `updateToolSaveStatus`。
- セル処理: `getCellsByKind`, `cellIsOn`, `effectiveCellUtil`, `dayHoursAll`, `recomputeAllPhaseFromCells`。
- 日付範囲と営業日処理: `getDateRange`, `isHolidayDate`, `capacityForDate`, `computePlannedEnd`, `shiftIndexByBusinessDays`。
- コメントとマイルストーン: `getNodeComment`, `setNodeComment`, `getCellComment`, `setCellComment`, `getMilestoneComment`, `openCommentPopup`。
- 工数集計: `totalManhoursByPattern`, `refreshManhoursRowsDom`, `buildSummaryMatrix`, `renderManhourSummaryPopup`。
- 描画の入口: `renderTop`, `renderInputPane`, `renderGantt`, `renderAll`。
- ガント操作: `appendPlanDayCells`, `appendTaskPlanRows`, `onCellPointerDown`, `onCellPointerMove`, `inputCellUtil`。

## 描画フロー

1. `initData()` は `window.__GANTT_DATA__` を読み込んで正規化し、永続化された UI 状態を `state` にコピーし、予定合計を再計算して閲覧者モードのデフォルトを設定する。
2. `renderAll()` はレイアウト用 CSS 変数を同期し、主要ペインの表示を切り替えたうえで、`renderTop()`、`renderInputPane()`、`renderGantt()` を呼び出す。
3. `renderTop()` はツールバー、フィルタ、マスター一覧、保存コントロール、モード切り替えを構築する。
4. `renderInputPane()` はドメイン、プロジェクト、バージョン、タスク、予定、休日、マイルストーン、詳細の編集可能な階層コントロールを構築する。
5. `renderGantt()` はカレンダーヘッダー、工数行、階層行、予定行と実績行、オーバーレイ、コメントカード、マイルストーン線を構築する。

## 安全な挿入位置

- 新しい永続化アプリ設定: `emptyData` にデフォルトを追加し、`normalizeLoaded` で正規化し、`initData` で `state` にコピーし、該当 UI ハンドラで保存元を更新する。
- 新しい一時 UI 状態: `state` のみに追加し、描画処理またはイベントハンドラで使用する。
- 新しい上部ペインのコントロール: `renderTop` 内に追加し、保存データを変更する場合は `markDirty` で永続化対象にする。
- 新しい左ペインの予定項目: `makePlanNode` 内に追加し、`normalizeLoaded` で正規化し、合計や日付に影響する場合は計算処理も更新する。
- 新しい日付またはセルの挙動: `getCellsByKind`、`cellIsOn`、`effectiveCellUtil` を使用し、`updatePlanCellDomByData` または `renderGantt` で DOM を更新する。
- 新しい工数集計の挙動: 合計パターン定数、`normalizeTotalPattern`、`getTotalPatternList`、`totalManhoursByPattern`、集計表示をまとめて更新する。
- 新しい保存またはエクスポートの挙動: `saveData`、`saveViewer`、`saveNamedData` の区別を維持する。

## 制約

- モジュール、バンドラ、サーバーサイド API に依存しない。
- ローカルファイルを直接開く使い方と、既存の `wri` フックが存在する WebView2 ホスト連携の両方に対応した挙動を維持する。
- 自動テストが存在する前提にしない。焦点を絞った確認と簡潔な手動確認手順を使う。
- ユーザーが明示的に依頼しない限り、大規模なリファクタリングは避ける。
