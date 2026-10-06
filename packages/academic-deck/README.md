# @godcreator/academic-deck

电力电子学术汇报的纯 React 组件包，包含页面、公式、题注、电路与动画组件，以及样式和素材。
消费端使用 React 19 与 Vite；组件已编译 JSX，CSS、图片和 SVG raw import 由消费端 Vite 处理。

```jsx
import { Presentation, Cover, Equation } from '@godcreator/academic-deck';
import '@godcreator/academic-deck/styles.css';
```

`samples/dab` 提供内容示例，`assets/*` 提供品牌素材。
制作流程、组件用法与动画规范统一由配套 gwb 插件的 academic-deck skill 提供。两包按同一批次配套发布。
本包没有 bin 入口、项目模板、文件创建或浏览器检查工具；这些操作由 gwb-academic-deck 的命令提供。
