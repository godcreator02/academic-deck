# Academic Deck 文档站

在本站目录运行：

```powershell
pnpm install --frozen-lockfile
pnpm doc:render
pnpm doc
pnpm verify:roster
pnpm build
pnpm start
```

打开[本地文档站](http://127.0.0.1:4324/docs)。只走 build → start，不使用 dev。服务默认 12 小时自动停止。

现状文档在 content/docs；未来方向在 content/future；选择记录在 content/trajectory。
README 与 skill 的输出映射在 docfirst.config.mjs，修改 mdx 正本后重新 render。

交互图和机读文本共用 src/components/explain 的数据。新增组件同步登记 registry.ts、mdx.tsx 与 docfirst.config.mjs。
