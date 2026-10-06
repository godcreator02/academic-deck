# Academic Deck

本文件由 docs-site/content/docs/outputs/agents.mdx 生成，改正本后运行 pnpm --dir docs-site doc:render。

- 组件、样式和素材归 packages/academic-deck；项目创建、构建、浏览器检查、PDF 导出归 plugins/academic-deck。
- examples 放汇报内容；template/react 放设计检查稿。公共组件不反向依赖示例或 gwb。
- 仓根检查：pnpm build，然后 pnpm check。
- 文档站是独立 pnpm 项目。站内 pnpm doc、pnpm verify:roster、pnpm build；不要运行 next dev。
- pnpm --dir docs-site start 仅监听 127.0.0.1:4324，12 小时自动退出。
- README、AGENTS、CLAUDE 与插件的完整 skill 由 docfirst 生成；改 docs-site/content/docs 中的正本。
- skill、组件用法与动画规范全部归 gwb 插件；组件包仅提供组件、样式和素材。两包同一批次配套发布。
- 插件的 SKILL.md 与附件是 docfirst 生成物，render 到 plugins/academic-deck/skills/，不能手改。
- 写文档前通过 gwb 读 docs-writing、docs-site；依赖与版本变更前读 gwb-release。
- 插件运行验证用命名隔离 home。正式发布走 gwb-devkit。
