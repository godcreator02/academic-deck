import { useEffect, useState } from 'react';
import { Slide } from './Deck';
import '../styles/presentation.css';

export function Presentation({ pages }) {
  const clamp = value => Math.max(0, Math.min(pages.length - 1, value));
  const fromHash = () => clamp((Number.parseInt(location.hash.slice(1), 10) || 1) - 1);
  const [page, setPage] = useState(fromHash);
  const [scale, setScale] = useState(() => Math.min(innerWidth / 1280, innerHeight / 720));
  useEffect(() => {
    const resize = () => setScale(Math.min(innerWidth / 1280, innerHeight / 720));
    const hash = () => setPage(fromHash());
    const key = event => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.target.closest('a,button,input,textarea,select')) return;
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault(); setPage(current => clamp(current + 1));
      } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
        event.preventDefault(); setPage(current => clamp(current - 1));
      } else if (['Home', 'End'].includes(event.key)) {
        event.preventDefault(); setPage(event.key === 'Home' ? 0 : pages.length - 1);
      } else if (event.key.toLowerCase() === 'f') {
        const action = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
        action?.catch(() => {});
      }
    };
    document.body.classList.add('presentation-body');
    addEventListener('resize', resize); addEventListener('hashchange', hash); addEventListener('keydown', key);
    return () => {
      document.body.classList.remove('presentation-body');
      removeEventListener('resize', resize); removeEventListener('hashchange', hash); removeEventListener('keydown', key);
    };
  }, [pages.length]);
  useEffect(() => { history.replaceState(null, '', `#${page + 1}`); }, [page]);
  const advance = event => {
    if (event.target.closest('a,button,input,label,select,textarea') || window.getSelection()?.toString()) return;
    setPage(current => clamp(current + 1));
  };
  return <main className="presentation no-guides" aria-label="幻灯片放映" onClick={advance}>
    {pages.map((item, index) => <div className="slide-slot" hidden={page !== index} key={item.label} style={{ width: 1280 * scale, height: 720 * scale }}>
      <div className="slide-transform" style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}><Slide page={item} index={index} total={pages.length} active={page===index}/></div>
    </div>)}
  </main>;
}
