# DAB 组会汇报样张

十五页完整汇报：封面、目录、四张分章页、八页正文和封底。正文包含研究概览、研究问题、电路与波形、理论推导、工作点计算、合成示例对比、验证计划和阶段总结。汇报人、研究组及日期为待填写项；验证记录不填入虚构实测数据。

封面、目录、分章页和封底沿用旧版已复刻的构图，由模板的 React 组件渲染。正文保留后续定稿的字体、边界、公式和图表规则。

## 放映

界面仅显示当前幻灯片，按窗口比例缩放并居中。没有工具栏、安全区或设计说明。

- 方向键、PageUp／PageDown 翻页；空格或单击页面前进。
- Home／End 到首尾；最后一页停止，不自动循环。
- F 切换全屏；Esc 退出全屏。
- 点击目录条目进入对应章节；链接不会触发额外翻页。
- Ctrl+P 打印全部 15 页，关闭打印页眉页脚并启用背景图形。

第 7 页的 DAB 波形采用[统一动画规范](../../template/ANIMATION.md)：一个真实的 10 μs 周期以 12 秒慢放展示。控制条可播放／暂停、拖动定位、重播和切换自动播放；拖动松手后保持暂停，关键刻度可准确定位开关切换时刻，时间读数使用真实 μs。离开页面、隐藏标签页或打印时停止计时，返回时保留原进度和播放状态。系统启用“减少动态效果”时默认静止，仍可手动播放和定位。打印保留完整稳态波形，隐藏游标、区间高亮和控制条。

## 运行与交付

在项目根目录执行：

```powershell
pnpm install --frozen-lockfile
pnpm --filter @godcreator/academic-deck build
pnpm --dir examples/example-dab dev
pnpm --dir examples/example-dab build
pnpm --dir examples/example-dab preview --host 127.0.0.1 --port 4173
pnpm --dir examples/example-dab verify
node template/react/scripts/verify.cjs --example --pdf
```

标准编译产物在 `dist/`，通过 HTTP 加载：预览地址为 `http://127.0.0.1:4173/`，动画页为 `http://127.0.0.1:4173/#7`。不再使用 `file://` 双击入口。PDF 为 `dist/dab-group-meeting.pdf`。发送浏览器版时打包整个 `dist/` 并部署到静态服务；构建会清空输出目录，因此先构建再导出 PDF。验证脚本会自动启动临时 HTTP 预览并在结束时关闭。验证依赖与环境配置见 [模板说明](../../README.md#维护与验证)。

## 修改内容

- `src/slides.jsx`：页面顺序、四章目录、正文与参考文献。
- `src/presentation.css`：本次汇报的组合排版。
- `src/main.jsx`：汇报入口和放映设置。
- `src/components/AnimatedDabWaveforms.jsx`：DAB 专属动画，复用静态波形的坐标及电流模型。

本目录通过 workspace 依赖引用 @godcreator/academic-deck 的组件与样式。依赖和锁文件由仓根管理。其他单元通过独立包创建器创建汇报，参见仓根 README。专项验证脚本只用于本十五页样张。
