# 模板设计稿

公共实现已提取到 [academic-deck 独立包](../packages/academic-deck/README.md)。
本目录保留原始视觉参考和八页设计稿：三页 DAB 内容样张、五页字体／颜色／排版／公式／题注规范。
设计稿通过正常包引用消费同一套组件和样式。

在仓根安装依赖并构建独立包后：

```powershell
pnpm --dir template/react build
pnpm --dir template/react verify
pnpm --dir template/react preview --host 127.0.0.1 --port 4174
```

设计稿的 App 与 DesignSpec 留在 react/src，带安全区检查控件的 Deck 来自独立包。
`react/scripts/verify.cjs` 保留设计稿与 DAB 的专项验收；实际汇报在 examples/。
布局约定见插件 skill 的[组件与版式](../plugins/academic-deck/skill-source/academic-deck/references/authoring.md)，动画约定见[动画规范](../plugins/academic-deck/skill-source/academic-deck/references/animation.md)。
