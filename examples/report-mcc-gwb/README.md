# MCC 案例复盘＋GWB 工作台 · 组会汇报

使用 `@godcreator/academic-deck` 组件的十七页组会汇报：MCC 闭环复现过程复盘（14 页）＋ GWB 开放工作台介绍。

构建与检查在仓库根目录执行：

```powershell
pnpm --dir examples/report-mcc-gwb build
pnpm --dir examples/report-mcc-gwb verify
pnpm --dir examples/report-mcc-gwb preview --host 127.0.0.1 --port 4176
```

方向键／空格翻页，Home／End 到首尾，F 全屏；目录条目可点击跳转。

## 素材来源

- 封面：大字标题＋「组会汇报」＋杨道远 9月22日（`src/DeckCover.jsx`，本地封面组件）。
- 第 7／8 页：与 Opus 5 实际会话的聊天记录，人方提示词原文照录；「AI·摘述」为概要非原文。
- 第 9／10／12 页图片：`plecs-studio/mcc/runs/`（grid-n12 原理图，open、inj-up、grid-n12 的 Scope 截图），
  裁带脚本在 `.artifacts/final-assets.cjs`（源图更新后重跑再 build）。
- 第 5 页页脚：R. Bai et al., IEEE Trans. Power Electron., vol. 39, no. 3, 2024（MCC 同族 MDC 长文）。
- 主要论点（概览页与复盘页）：相信 AI 的判断——AI 有自己做控制策略的能力，很多时候只是人不懂。
