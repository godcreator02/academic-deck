import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

/* 与静态版共用同一套 CSS —— 单一真值住在 ../src，React 这边一个几何值都不复制。
   顺序必须与 src/pages/*.html 的 <link> 顺序一致，否则层叠会变。 */
import '@deck/tokens.css'
import '@deck/deck.css'
import '@deck/components.css'
import '@deck/pages.css'
import 'katex/dist/katex.min.css'
import './demo/styleguide.css'

import { StyleGuide } from './demo/StyleGuide'

const el = document.getElementById('root')
if (!el) throw new Error('找不到 #root')
createRoot(el).render(
  <StrictMode>
    <StyleGuide />
  </StrictMode>,
)
