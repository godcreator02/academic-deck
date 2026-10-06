import React from 'react';

export function createDesignPages({MathText,Equation,Figure,Circuit}) {
  const tex=String.raw;
  function Typography(){
    const samples=[['页面标题',32,700,'DAB 单移相控制'],['分区标题',24,700,'主电路与电流方向'],['正文 / 公式',20,400,'分析条件与主要结论'],['数据表格',16,400,'400 V　100 kHz'],['图注 / 表题',16,400,'图 1　DAB 主电路'],['参考文献',14,400,'[1] 作者. 文献题名, 年份.']];
    return <div className="content spec-columns"><section><h2>字号与用途</h2><div className="type-scale">{samples.map(([name,size,weight,sample])=><div className="type-row" key={name}><span className="type-role">{name}</span><span style={{fontSize:size+'pt',fontWeight:weight,color:name==='参考文献'?'#737373':name==='图注 / 表题'?'#666':'#252525'}}>{sample}</span><span className="type-size">{size} pt</span></div>)}</div><p className="small muted spec-note">字号均以 pt 定义。页面整体等比缩放，内部字号比例保持一致。</p></section>
      <section><h2>字体与行距</h2><ul className="spec-list"><li>中文与普通英文：微软雅黑。正文常规字重，标题使用粗体。</li><li>数学表达式：KaTeX 数学字体。变量用数学斜体，单位用正体。</li><li>标题行高 1.25；正文 1.4；图注与表题 1.35；页脚 1.25。</li><li>正文默认 20 pt；表格 16 pt。复杂分段公式可用已示范的 19 pt。</li><li>内容超出时先删减、换行或拆页，不自动缩小整页文字。</li></ul><p className="small muted">示例：电感 <MathText>{tex`L=40\,\mathrm{\mu H}`}</MathText>，频率 <MathText>{tex`f_s=100\,\mathrm{kHz}`}</MathText>。</p></section>
    </div>;
  }
  function Colors(){
    const colors=[['#C00000','主红','标题箭头、编号、关键结论'],['#FFC000','金黄','标题箭头与页底色带'],['#BB862E','波形金','第二路电压波形'],['#426780','蓝灰','电流或对照数据'],['#252525','正文黑','标题、正文与数学表达式'],['#666666','说明灰','图注、表题与条件说明'],['#737373','文献灰','参考文献、页码总数'],['#D9D9D9','分隔灰','内容区细分隔线']];
    return <div className="content spec-columns"><section><h2>颜色及用途</h2><div className="palette">{colors.map(([value,name,use])=><div className="palette-row" key={value}><i style={{background:value}}/><div><strong>{name}</strong><code>{value}</code></div><span>{use}</span></div>)}</div></section>
      <section><h2>使用规则</h2><ul className="spec-list"><li>白底为主，正文采用深灰；红色集中用于本页的主要结论。</li><li>金黄保留给品牌装饰；图表曲线用更深的波形金。</li><li>同一物理量在整份报告中保持同色；换页后不交换颜色含义。</li><li>对照数据同时用线型或点型区分，图例明确标注含义。</li><li>安全区的蓝框、绿框与尺寸线仅用于核对，打印时隐藏。</li></ul><div className="line-examples"><span><i style={{borderColor:'#C00000'}}/>理论曲线</span><span><i style={{borderColor:'#426780',borderTopStyle:'dashed'}}/>示例采样</span></div><p className="small muted spec-note">校徽使用原图。底部色带沿用现有红金渐变，高度 4 pt。</p></section>
    </div>;
  }
  function Layout(){
    return <div className="content spec-columns"><section><h2>画布与安全区</h2><div className="layout-map" role="img" aria-label="960乘540pt画布，左右24、上80、下28pt的核心内容区域"><div className="map-heading">页眉：标题组与校徽居中对齐</div><div className="map-core"><strong>核心内容 912 × 432 pt</strong><div><span>左栏</span><span>右栏</span></div><small>左右 24 pt · 上 80 pt · 下 28 pt</small></div><div className="map-footer"><span>参考文献</span><span>页码</span></div></div><p className="small muted spec-note">固定画布 960 × 540 pt，比例 16∶9；浏览器内部尺寸 1280 × 720 px。</p><p className="small">正文坐标：横向 24–936 pt，纵向 80–512 pt。图、表、公式和图注均放在核心区内。</p></section>
      <section><h2>对齐与间距</h2><dl className="spec-facts"><div><dt>页眉</dt><dd>顶端 22 pt，高 40 pt；箭头与标题间距 6 pt。</dd></div><div><dt>左右标识</dt><dd>箭头左沿对齐正文；校徽右沿对齐正文，宽 136 pt。</dd></div><div><dt>栏间距</dt><dd>常规双栏 24 pt；理论推导页 28 pt，左右宽度比 1.38∶1。</dd></div><div><dt>图文间距</dt><dd>图与图注 7 pt；主要上下区域间隔 12 pt。</dd></div><div><dt>页脚</dt><dd>底部距离 8 pt；参考文献和紧凑页码共用基线。</dd></div></dl><p className="small muted spec-note">安全区控件用于试排。规范页记录的是已确认的默认值；调整后应核对整份报告。</p></section>
    </div>;
  }
  function Formulas(){
    return <div className="content spec-columns"><section><h2>行内公式融入正文</h2><p>移相角 <MathText>{tex`\varphi=30^\circ`}</MathText>，电感 <MathText>{tex`L=40\,\mathrm{\mu H}`}</MathText>。用 <MathText>{tex`i_L`}</MathText> 表示电感电流。</p><p className="small muted">上下标、分数、希腊字母与单位统一通过公式组件排版。</p><section className="spec-section"><h2>行间公式与编号</h2><Equation number="1">{tex`L\frac{\mathrm{d}i_L}{\mathrm{d}t}=v_{AB}-nv_{CD}`}</Equation><p className="small muted">公式按整栏居中；左右各留 30 pt，右侧放编号。</p></section><section className="spec-section"><h2>推导按等号对齐</h2><Equation number="2">{tex`\begin{aligned}D&=\varphi/\pi,\\[4pt]I_{\mathrm{pk}}&=\frac{VD}{2f_sL}.\end{aligned}`}</Equation></section></section>
      <section><h2>数学排版规则</h2><ul className="spec-list"><li>行内公式跟随所在段落字号与基线；行间公式默认 20 pt。</li><li>变量斜体，描述性下标正体，例如 <MathText>{tex`I_{\mathrm{pk}}`}</MathText>、<MathText>{tex`P_{\mathrm{th}}`}</MathText>。</li><li>数值和单位之间保留薄空格，例如 <MathText>{tex`400\,\mathrm{V}`}</MathText>。</li><li>微分符号采用正体 <MathText>{tex`\mathrm{d}`}</MathText>；分段函数使用统一的大括号。</li><li>长公式在关系符号处分行，推导用等号对齐；优先调整推导结构。</li><li>需要引用的公式编号。编号 16 pt、灰色，与公式垂直居中。</li></ul><p className="small muted">电路标签、坐标轴变量和图注中的表达式同样使用公式渲染。</p></section>
    </div>;
  }
  function Captions(){
    return <div className="content spec-columns"><section className="caption-demo"><h2>图下放图注，表上放表题</h2><Figure number="1" caption="DAB 主电路（排版示例）"><Circuit/></Figure><table><caption><b className="caption-number">表 1</b>工作点参数（排版示例）</caption><thead><tr><th>参数</th><th>数值</th></tr></thead><tbody><tr><td>开关频率 <MathText>{tex`f_s`}</MathText></td><td><MathText>{tex`100\,\mathrm{kHz}`}</MathText></td></tr><tr><td>串联电感 <MathText>{tex`L`}</MathText></td><td><MathText>{tex`40\,\mathrm{\mu H}`}</MathText></td></tr></tbody></table></section>
      <section><h2>题注与图表规则</h2><ul className="spec-list"><li>图注按对应图的宽度居中；表题按对应表的宽度居中。</li><li>子图注对齐各子图，总图注对齐整组图；并列图注底线齐平。</li><li>题注用 16 pt 灰字，编号用主红；长题注允许换行。</li><li>采用三线表，表头加粗；数值统一精度、单位和对齐方式。</li><li>图像保持比例，坐标轴写明物理量及单位。</li><li>标明实测、仿真或合成数据；来源放在页底文献区。</li></ul><p className="small muted">图内标注过小时，优先放大图表或拆页。</p></section>
    </div>;
  }
  return [
    {label:'字体字号',title:'设计规范 · 字体与字号',body:Typography,spec:true},
    {label:'颜色规则',title:'设计规范 · 颜色与强调',body:Colors,spec:true},
    {label:'排版规则',title:'设计规范 · 边界与排版',body:Layout,spec:true},
    {label:'公式规则',title:'设计规范 · 数学公式',body:Formulas,spec:true},
    {label:'图表题注',title:'设计规范 · 图表与题注',body:Captions,spec:true},
  ];
}
