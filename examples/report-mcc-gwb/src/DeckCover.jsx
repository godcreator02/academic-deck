import { useId } from 'react';
import logo from '@godcreator/academic-deck/assets/logo-xjtu.png';
import panorama from '@godcreator/academic-deck/assets/bg-cover.jpeg';

// 与模板 Bookends 的 Cover 同构，但标题走大字校训位、副标题固定为「组会汇报」、
// 落款行不再带「汇报人：」前缀。仅本 deck 使用。
function GradientWord({ className, text, width, height, size, start, end, centered = false }) {
  const id = useId();
  return <svg className={className} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={text}>
    <defs><linearGradient id={id} x1={centered ? '49.7%' : '0%'} y1="0%" x2={centered ? '50.3%' : '0%'} y2="100%"><stop offset="1%" stopColor={start}/><stop offset="100%" stopColor={end}/></linearGradient></defs>
    <text x={centered ? width/2 : 7.2} y={height/2} dominantBaseline="central" textAnchor={centered ? 'middle' : 'start'} fontFamily="Microsoft YaHei, 微软雅黑, sans-serif" fontSize={size} fontWeight="700" fill={`url(#${id})`} xmlSpace="preserve">{text}</text>
  </svg>;
}

export function DeckCover({ title, subtitle, presenter }) {
  return <div className="replica mg-cover"><img className="cover-bg" src={panorama} alt=""/><div className="cover-veil"/>
    <img className="brandmark cover__logo" src={logo} alt="西安交通大学"/>
    <GradientWord className="motto cover__motto" text={title} width={801.6996} height={55.7391} size={40} start="#C00000" end="#FFC000" centered/>
    <h1 className="cover__subtitle">{subtitle}</h1>
    <span className="hairline cover__rule--l"/><p className="cover__presenter">{presenter}</p><span className="hairline cover__rule--r"/>
  </div>;
}
