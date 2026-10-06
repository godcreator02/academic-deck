# 电力电子学术汇报

```text
packages/academic-deck/   纯 React 组件、样式与素材
plugins/academic-deck/    gwb 命令、起步模板、浏览器检查与制作流程说明
examples/                DAB、SST、MCC/gwb 三份汇报
template/react/          八页设计规范与内容样张
template/source/         原始 PPTX 视觉参考
```

汇报代码依赖组件包；agent 通过 gwb 执行制作操作。本仓没有独立 CLI。

## 制作汇报

先读 [制作流程 skill](plugins/academic-deck/skill-source/academic-deck/SKILL.md)。
四条命令的 directory 都是项目绝对路径，完整参数用 gwb `search {"prefix":"deck."}` 查询。

| 命令 | 作用 |
| --- | --- |
| deck.create | 创建新汇报目录，固定组件版本，不自动安装依赖 |
| deck.build | 使用项目安装的 Vite 构建 dist |
| deck.check | 检查编译产物的资源、画布、溢出和打印，保存截图与报告 |
| deck.export | 检查通过后导出 PDF，拒绝覆盖已有 PDF |

deck.create 后在新目录运行 pnpm install，再编辑 src/slides.jsx。
检查与导出使用插件随带的驱动和机器上已安装的 Chrome／Edge；汇报项目不安装 Playwright。
组件用法见插件 skill 的[组件与版式附件](plugins/academic-deck/skill-source/academic-deck/references/authoring.md)。

网页交付整个 dist，通过 HTTP 放映；项目自身可用 pnpm preview。脱离 gwb 仍能构建和放映网页。
当前输出为网页或 PDF，原始 PPTX 仅作视觉参考。

## 维护与验证

在仓根运行：

```powershell
pnpm install --frozen-lockfile
pnpm build
pnpm check
```

构建先产出组件包与插件，再构建设计稿和三份汇报。
check 包含创建保护、参数、任务清理与真实溢出反例测试，并运行全部 51 页的既有专项检查；需要本机 Chrome。

插件通过 gwb-devkit 的隔离 home 验证。正式发布前，可先打包组件：
`pnpm --dir packages/academic-deck pack --pack-destination ../../.artifacts/components`，
然后给隔离 home 的 deck.create 传 packageSpec 为该 tgz 的绝对路径。
正式发布走 devkit.release，两包按同一批次配套发布，按依赖顺序先组件包后插件；插件记录该批组件版本。本地构建不发布、不安装到 default。

## 源码分工

- packages/academic-deck/src：浏览器运行的组件，不包含项目操作。
- plugins/academic-deck/src：命令登记与内部实现，不对外发布另一套函数接口。
- plugins/academic-deck/templates：新项目起步文件。
- plugins/academic-deck/skill-source：完整 skill 的生成物，包括制作流程、组件用法和动画规范。正本在 docs-site/content/docs/plugin；插件构建打包到自己的 skills/。
- examples：汇报内容与专项检查。template/react：设计检查稿。

## 文档站

站位于 docs-site，独立安装依赖。文档正本、README 与 skill 的生成映射见 docs-site/docfirst.config.mjs。

```powershell
pnpm --dir docs-site install --frozen-lockfile
pnpm --dir docs-site doc:render
pnpm --dir docs-site doc
pnpm --dir docs-site build
pnpm --dir docs-site start
```

打开[本地文档站](http://127.0.0.1:4324/docs)。只使用 build → start，start 默认 12 小时自动停止。
