# 素材

- `logo-xjtu.png`：原始模板的校徽与校名，保持比例使用。
- `dab-circuit-paths.svg`：DAB 电路的矢量连线与开关符号；变量标签由 `components/Circuit.jsx` 的公式组件绘制。
- `bg-cover.jpeg`、`bg-toc.png`、`bg-section.jpg`：用于 `Bookends.jsx` 的封面／封底、目录和分章页，按旧复刻的裁切及蒙版规则渲染。

视觉参考见 `template/source/2025redyellownew.pptx`。KaTeX 脚本、样式与字体由安装的 `katex` 依赖提供，随 Vite 构建本地打包，不再维护手工复制的公式库。
