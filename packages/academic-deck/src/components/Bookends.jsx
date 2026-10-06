import { useId } from 'react';
import logo from '../assets/logo-xjtu.png';
import panorama from '../assets/bg-cover.jpeg';
import campus from '../assets/bg-toc.png';
import gate from '../assets/bg-section.jpg';
import '../styles/bookends.css';

const Brand = ({ className }) => <img className={`brandmark ${className}`} src={logo} alt="西安交通大学"/>;
const Background = () => <><img className="cover-bg" src={panorama} alt=""/><div className="cover-veil"/></>;

// SVG keeps gradient lettering vector-based in both the browser and printed PDF.
function GradientWord({ className, text, width, height, size, start, end, centered = false }) {
  const id = useId();
  return <svg className={className} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={text}>
    <defs><linearGradient id={id} x1={centered ? '49.7%' : '0%'} y1="0%" x2={centered ? '50.3%' : '0%'} y2="100%"><stop offset="1%" stopColor={start}/><stop offset="100%" stopColor={end}/></linearGradient></defs>
    <text x={centered ? width/2 : 7.2} y={height/2} dominantBaseline="central" textAnchor={centered ? 'middle' : 'start'} fontFamily="Microsoft YaHei, 微软雅黑, sans-serif" fontSize={size} fontWeight="700" fill={`url(#${id})`} xmlSpace="preserve">{text}</text>
  </svg>;
}

export function Cover({ title, presenter }) {
  return <div className="replica"><Background/><Brand className="cover__logo"/>
    <GradientWord className="motto cover__motto" text="精勤求学  敦笃励志  果毅力行  忠恕任事" width={801.6996} height={55.7391} size={40} start="#C00000" end="#FFC000" centered/>
    <h1 className="cover__subtitle">{title}</h1>
    <span className="hairline cover__rule--l"/><p className="cover__presenter">汇报人：{presenter}</p><span className="hairline cover__rule--r"/>
  </div>;
}
export function Contents({ chapters }) {
  const ringId = useId();
  return <div className="replica"><svg className="toc__strip" viewBox="0 0 288.1407 540" aria-hidden="true"><defs><clipPath id={`${ringId}-crop`}><rect width="288.1407" height="540"/></clipPath></defs><image href={campus} x="-287.145" y="0" width="810" height="540" preserveAspectRatio="none" clipPath={`url(#${ringId}-crop)`}/></svg><div className="toc__veil"/>
    <h1 className="toc-badge toc__badge">目录</h1>
    <svg className="toc-ring toc__ring" viewBox="0 0 186.603 181.2571" aria-hidden="true"><defs><linearGradient id={ringId} x1="100%" y1="100%" x2="0%" y2="0%"><stop offset="0%" stopColor="#FFC000"/><stop offset="100%" stopColor="#C00000"/></linearGradient></defs><ellipse cx="93.3015" cy="90.62855" rx="93.3015" ry="90.62855" fill="none" stroke={`url(#${ringId})`} strokeWidth="4.5"/></svg>
    {chapters.map((chapter, index) => <a key={chapter.number} href={`#${chapter.page}`} aria-label={`第 ${index + 1} 章：${chapter.title}`}><span className={`toc-num toc__num--${index + 1}`}>{index + 1}</span><span className={`toc-item toc__item--${index + 1}`}>{chapter.title}</span></a>)}
    <Brand className="toc__logo"/>
  </div>;
}
export function Chapter({ number, title, subtitle }) {
  return <div className="replica"><h1 className="band__title">{title}</h1><p className="band__lead">{subtitle}</p>
    <div className="band"><img className="band__img" src={gate} alt=""/></div><div className="band__wash"/><div className="band__bar"/><div className="band__part">{`Part  ${number}`}</div>
  </div>;
}
export function Closing({ subtitle = '谢谢各位老师同学' }) {
  return <div className="replica"><Background/>
    <svg className="thanks__arc" viewBox="0 0 155.6667 155.6667" aria-hidden="true"><circle cx="77.8334" cy="77.8334" r="77.0139" fill="none" stroke="#595959" strokeWidth="1.889" strokeDasharray="203.11 78.90"/><circle cx="77.8334" cy="77.8334" r="77.0139" fill="none" stroke="#E49E3F" strokeWidth="1.639" strokeDasharray="203.11 78.90"/></svg>
    <GradientWord className="wordmark thanks__word" text="THANKS" width={365.1817} height={104.2078} size={80} start="#C86142" end="#E49E3F"/><p className="wordmark-sub thanks__sub">{subtitle}</p><Brand className="thanks__logo"/>
  </div>;
}
