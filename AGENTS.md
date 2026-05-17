# AGENTS.md

## Project Overview

- 単一htmlで構築された、ローカルで使用する前提のガントチャートツール
    - ChromeあるいはEdgeブラウザで動作するツール
    - javascript, css もhtml内に記述する
    - ガントチャートで表示するデータのみ.jsファイルとして独立して保存し、htmlファイルからscriptタグでロードする


## Code Style

- ファイルの文字コードはすべて UTF-8 とすること。bomは付けない。すべてのファイルが UTF-8 である。


## Testing

- テスト設計は不要


## Git

- AIがgit操作はしないこと


## Boundaries

- gantt.html が開発対象でありAIによる変更を実施する。その他のhtmlファイルはAIによる変更をしないこと。


