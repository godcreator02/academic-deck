import { C, FS, LADDER, META_SIZE, BODY_FLOOR, type FontRole } from '../theme/tokens'
import { Deck } from '../deck/Deck'
import { Box, FigCap, FnRef, Footnotes, Point, Points } from '../components/Text'
import { Formula, Pre } from '../components/Formula'
import { ContentSlide, CoverSlide, SectionSlide, ThanksSlide, TocSlide } from '../slides'

/**
 * 自指视觉规范 deck —— 与静态版 src/demo.html 同一套内容。
 * 规范与 demo 合一：这份 deck 就是模板自己的样子，漂移无处可藏。
 * 章节名只声明一次（chapters），目录页与页码自动读它。
 */

const CHAPTERS = ['色彩与用色', '字号体系', '版式与组件', '公式与代码']

/** 色板数据（页面 srgbClr 实测 + 出现次数） */
const SWATCHES: { hex: string; role: string; use: string; n: number }[] = [
  { hex: C.amber, role: '橙黄 · 二号主色', use: 'icon / 强调', n: 19 },
  { hex: C.brick, role: '砖红 · 三红之一', use: '图标底 / 要点条', n: 14 },
  { hex: C.redDeep, role: '深红 · D1 之一', use: '页眉/序号/细线', n: 10 },
  { hex: C.redTrue, role: '正红 · D1 之一', use: '封面副标题', n: 4 },
  { hex: C.yellow, role: '标黄 · 高亮', use: '页眉箭头/渐变', n: 5 },
  { hex: C.cream, role: '奶黄 · 浅暖底', use: '封面/封底顶部', n: 2 },
  { hex: C.navy, role: '藏青 · 重字强调', use: '定义类 / 投影色', n: 4 },
  { hex: '#20307D', role: '藏青（浅）', use: '重字', n: 2 },
  { hex: C.gray100, role: '浅灰底块', use: '卡片底 / 代码底', n: 3 },
  { hex: C.gray500, role: '次要信息', use: '图注 / 页码', n: 4 },
  { hex: C.gray900, role: '正文重灰', use: '封底副行', n: 1 },
  { hex: C.blueGray, role: '蓝灰', use: '次要线条', n: 2 },
]

/** 阶梯的角色名与用途 */
const LADDER_ROLES: Record<FontRole, { role: string; use: string }> = {
  meta: { role: '辅助档', use: '图注/脚注/页码/代码' },
  code: { role: '辅助档', use: '代码' },
  body: { role: '正文档', use: '正文/列表/表格/卡片' },
  sub: { role: '小节题', use: 'h3、谢谢各位专家' },
  nav: { role: '目录条目', use: '目录胶囊' },
  title: { role: '页题', use: '正文页页眉' },
  part: { role: 'Part', use: '章节页 Part 01' },
  lead: { role: '校训', use: '封面校训' },
  h1: { role: '大标题', use: '章节页标题' },
  badge: { role: '徽标', use: '目录「目录」' },
  mega: { role: '展示档', use: '封底 THANKS' },
}
const LADDER_ORDER: FontRole[] = ['meta', 'body', 'sub', 'nav', 'title', 'part', 'lead', 'h1', 'badge', 'mega']

function Ladder() {
  return (
    <div className="ladder">
      {LADDER_ORDER.map((k) => {
        const r = LADDER_ROLES[k]
        return (
          <div key={k} className={'ladder__row' + (FS[k] < BODY_FLOOR ? ' is-meta' : '')}>
            <span className="ladder__pt">{FS[k]}pt</span>
            <span className="ladder__role">{r.role}</span>
            <span className="ladder__use">{r.use}</span>
          </div>
        )
      })}
    </div>
  )
}

export function StyleGuide() {
  return (
    <Deck chapters={CHAPTERS}>
      {/* 1 封面 */}
      <CoverSlide subtitle="西交大红黄学术风 · React 组件版" presenter="本文档即模板本身" />

      {/* 2 目录 —— 条目来自 Deck 的 chapters，不重复声明 */}
      <TocSlide />

      {/* 3 章节 01 */}
      <SectionSlide
        part="01"
        title="色彩与用色"
        lead="全部分色实测自源模板页面硬编码，未做任何「设计归纳」。"
      />

      {/* 4 色板 */}
      <ContentSlide
        title="色板（页面 srgbClr 实测）"
        figure={
          <FigCap no="图 1" style={{ position: 'absolute', left: 93.7113, right: 93.7113, bottom: 60 }}>
            数字为源模板中该色值的出现次数
          </FigCap>
        }
      >
        <div className="swatches">
          {SWATCHES.map((s) => (
            <div className="sw" key={s.hex + s.role}>
              <div className="sw__chip" style={{ background: s.hex }} />
              <div className="sw__meta">
                <div className="sw__hex">{s.hex}</div>
                <div className="sw__use">{s.role}</div>
                <div className="sw__use">
                  {s.use} · <span className="sw__n">{s.n}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ContentSlide>

      {/* 5 用色规则与已定项 */}
      <ContentSlide title="用色规则与已定项" cols={2}>
        <div>
          <h3>已成规则</h3>
          <Points>
            <Point n={1}>页眉双箭头红压黄，左红右黄</Point>
            <Point n={2}>底部渐变条红→黄，中心对称</Point>
            <Point n={3}>强调只用暖色，冷色仅藏青</Point>
            <Point n={4}>灰阶承担全部次要信息</Point>
          </Points>
          <p>四条规则之外，D1–D3 是拍板项，见右栏。</p>
        </div>
        <div>
          <h3>已拍板</h3>
          <Box variant="remark" label="D1　">双红并存，不分主次，各沿用源模板用法。</Box>
          <Box variant="lemma" label="D2　">正文与西文固定微软雅黑；代码走等宽栈。</Box>
          <Box variant="def" label="D3　">带 KaTeX 自动渲染，本地内置不引 CDN。</Box>
        </div>
      </ContentSlide>

      {/* 6 章节 02 */}
      <SectionSlide
        part="02"
        title="字号与版式"
        lead="16 起、每档 +4 的等差阶梯；正文下限 20pt。全模板无小于 20pt 的正文。"
      />

      {/* 7 字号体系 */}
      <ContentSlide title="字号体系" sidebar>
        <Ladder />
        <div className="prose">
          <h3>三条规则</h3>
          <Points>
            <Point n={1}>给人读的 ≥20pt；注解与代码 {META_SIZE}pt。</Point>
            <Point n={2}>密度靠行距与内边距调，不缩字号。</Point>
            <Point n={3}>低于 20pt 的值只允许 {META_SIZE}pt。</Point>
          </Points>
          <p>源值 12/14/18 已退役；阶梯共 {LADDER.length} 档。</p>
        </div>
      </ContentSlide>

      {/* 8 单栏 */}
      <ContentSlide
        title="版式：单栏满宽"
        figure={
          <FigCap no="图 2" style={{ position: 'absolute', left: 93.7113, right: 93.7113, bottom: 74 }}>
            图注与脚注走 {META_SIZE}pt 辅助档
          </FigCap>
        }
        footnotes={
          <Footnotes>
            <p>
              <FnRef>1</FnRef>　脚注区同理：{META_SIZE}pt，靠主红上标区分，不靠缩得更小。
            </p>
          </Footnotes>
        }
      >
        <h3>每行 38 字 · 单页约 418 字</h3>
        <p>
          单栏适合需要连续阅读的内容：长段落、公式推导、代码块。20pt
          下的满宽行长为 772.5774pt，每行 38 个汉字，是中文最舒服的阅读行长区间。
        </p>
        <Box variant="theorem" label="定理 1　">
          该框的 2.85pt 彩条宽度取自源模板 slide7 两条色条的实测值；框内文字守 20pt
          正文下限，靠内边距而非缩字号省版面。
        </Box>
        <Formula display number={2}>
          {'\\operatorname{gap}(\\mathcal{H})\\le C\\sqrt{\\frac{\\log(1/\\delta)}{2n}}+\\lambda\\lVert f^{\\star}\\rVert_{\\mathcal{H}}'}
        </Formula>
        <p>
          公式与正文同号（KaTeX 基准 1em）；其中 <Formula>{'\\lambda>0'}</Formula>{' '}
          为正则项系数，<Formula>{'n'}</Formula> 为样本量。
        </p>
      </ContentSlide>

      {/* 9 两栏 */}
      <ContentSlide title="版式：两栏等宽" cols={2}>
        <div>
          <h3>两栏：每行 18 字</h3>
          <p>两栏适合并列对比、要点清单、术语表。栏数不改变总容量，只改变每行字数。</p>
          <h3>页面层</h3>
          <ul>
            <li><strong>cover</strong>　封面</li>
            <li><strong>toc</strong>　目录</li>
            <li><strong>section</strong>　章节过渡</li>
            <li><strong>doc</strong>　正文页</li>
            <li><strong>thanks</strong>　封底</li>
          </ul>
        </div>
        <div>
          <h3>原子层</h3>
          <ul>
            <li><strong>页眉</strong>　.chev、.page-head</li>
            <li><strong>页码</strong>　.pager、.page-bar</li>
            <li><strong>目录</strong>　.toc-badge、.toc-item</li>
            <li><strong>章节页</strong>　.band 系列</li>
            <li><strong>首尾页</strong>　.motto、.wordmark</li>
            <li><strong>文字块</strong>　.box、.points、.iconblk</li>
            <li><strong>注解</strong>　.figcap、.footnotes</li>
            <li><strong>公式代码</strong>　.formula、.code</li>
          </ul>
        </div>
      </ContentSlide>

      {/* 10 公式与代码 */}
      <ContentSlide title="公式与代码" sidebar>
        <div className="prose">
          <h3>公式（KaTeX 本地内置）</h3>
          <p>
            行内写 <code className="code">{'$…$'}</code>：正则项系数 <Formula>{'\\lambda>0'}</Formula>{' '}
            控制假设空间复杂度。
          </p>
          <Formula display number={1}>
            {'\\hat{f}=\\arg\\min_{f\\in\\mathcal{H}}\\ \\frac{1}{n}\\sum_{i=1}^{n}\\ell\\bigl(f(x_i),y_i\\bigr)+\\lambda\\lVert f\\rVert_{\\mathcal{H}}^{2}'}
          </Formula>
          <p>
            独立写 <code className="code">{'$$…$$'}</code>；公式号用{' '}
            <code className="code">.formula__no</code> 绝对定位在右端。
          </p>
        </div>
        <div className="prose">
          <h3>代码（不受 20pt 下限约束）</h3>
          <Pre>
            <span className="c"># 本地文件，无需联网{'\n'}</span>
            <span className="k">import</span> numpy <span className="k">as</span> np{'\n\n'}
            <span className="k">def</span> <span className="s">gap_bound</span>(n, delta, lamb):{'\n'}
            {'    '}<span className="c">"""式(1) 的数值上界"""</span>{'\n'}
            {'    '}<span className="k">return</span> np.sqrt(np.log(<span className="s">1.0</span>/delta){'\n'}
            {'                   '}/ (<span className="s">2.0</span>*n)) + lamb
          </Pre>
          <p>
            代码走 <strong>{META_SIZE}pt</strong> 辅助档（用户 2026-09-20
            确认不受下限约束），行内与块级同号。
          </p>
        </div>
      </ContentSlide>

      {/* 11 封底 */}
      <ThanksSlide />
    </Deck>
  )
}
