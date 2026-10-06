---
name: academic-deck
description: 在项目单元里创建或修改 React 电力电子学术汇报时读，包含组件、版式与动画用法，并通过 gwb 的 deck.create、deck.build、deck.check、deck.export 创建项目、构建、检查和导出 PDF。
---

# 学术汇报制作

汇报代码引用独立组件包 `@godcreator/academic-deck`。创建、构建、检查、导出由本插件的 gwb 命令执行。
命令参数与 effect 用 `search {"prefix":"deck."}` 查询；回执必须成功才算完成。四条命令都会写本机文件。
本插件与组件包配套发布，对应组件版本见 [版本附件](package-version.json)。编辑已有汇报前先查看项目 package.json 中锁定的组件版本，升级由项目显式决定。

## 工作流程

1. 确认汇报所在单元并读其 AGENTS.md。新建单元走 unit-folder；已有单元内的新汇报调用 `deck.create {directory, title?}`，directory 是尚不存在的目录绝对路径。
   默认引用版本附件中的固定组件版本。正式发布前验证可传 `packageSpec` 为本地组件 .tgz 绝对路径。创建只写起步项目，不安装依赖、不覆盖旧目录。
2. 在生成目录运行 `pnpm install`。编辑 `src/slides.jsx` 的 pages 数组，页面数据、正文和素材归本项目。组件用法见 [组件与版式](references/authoring.md)，制作动画再读 [动画规范](references/animation.md)。
3. 调用 `deck.build {directory}`，使用该项目安装的 Vite 构建 dist。失败回执包含输出，缺依赖时先完成安装。
4. 调用 `deck.check {directory, browser?}`。驱动随插件提供，需要机器上已安装 Chrome（默认）或 Edge（browser: msedge），汇报项目不用安装 Playwright。
   检查编译后的网页，截图及完整报告写入 .artifacts。回执给出页数和产物路径；溢出或资源错误会失败。逐页查看截图，继续核对内容、标注、公式与视觉效果，直到检查与人工审阅都通过。
5. 需要 PDF 时调用 `deck.export {directory, out?, browser?}`，会先执行同样的页面检查。out 是新 PDF 的绝对路径，默认 .artifacts/report.pdf；已有同名文件拒绝覆盖。确认 PDF 页数、公式和分页后交付。
6. 网页交付整个 dist，通过 HTTP 静态服务放映。可在项目里运行 pnpm preview 查看；左右键／空格翻页，Home／End 到首尾，F 全屏。

构建超时为 120 秒，页面检查与导出超时为 180 秒；结束、失败或插件卸载会关闭自建进程、浏览器与临时 HTTP 服务。同一目录不并行操作。
初始三页是排版起点，替换占位文字和示例数据。当前交付是网页或 PDF，可编辑 PPTX 需要其他制作工具。
