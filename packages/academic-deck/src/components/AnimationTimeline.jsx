import { useEffect, useRef, useState } from 'react';
import { useSlidePlayback } from './SlidePlayback';
import '../styles/animation.css';

const clamp = value => Math.max(0, Math.min(1, value));

export function useAnimationTimeline({ durationMs = 12000, loop = false, autoPlay: initialAutoPlay = true, printProgress = 1 } = {}) {
  const { canAnimate, reducedMotion, printing } = useSlidePlayback({ motionRequested: true });
  const [autoPlay, setAutoPlayState] = useState(() => initialAutoPlay && !reducedMotion);
  const [playing, setPlaying] = useState(() => initialAutoPlay && !reducedMotion);
  const [position, setPosition] = useState(0);
  const progressRef = useRef(0);
  const playingRef = useRef(playing);
  const running = playing && canAnimate;
  const updatePlaying = value => { playingRef.current = value; setPlaying(value); };
  const updatePosition = value => {
    const next = clamp(Number.isFinite(value) ? value : 0);
    progressRef.current = next;
    setPosition(next);
  };

  useEffect(() => {
    if (reducedMotion) { setAutoPlayState(false); playingRef.current = false; setPlaying(false); }
  }, [reducedMotion]);
  useEffect(() => {
    if (!running) return;
    let frame, previous;
    const tick = timestamp => {
      if (!playingRef.current) return;
      if (previous !== undefined) {
        const next = progressRef.current + (timestamp - previous) / Math.max(1, durationMs);
        if (!loop && next >= 1) {
          progressRef.current = 1; setPosition(1);
          playingRef.current = false; setPlaying(false);
          return;
        }
        progressRef.current = loop ? next % 1 : next;
        setPosition(progressRef.current);
      }
      previous = timestamp;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, durationMs, loop]);

  const pause = () => updatePlaying(false);
  const play = () => { if (progressRef.current >= 1) updatePosition(0); updatePlaying(true); };
  const seek = value => { pause(); updatePosition(value); };
  const restart = () => { updatePosition(0); updatePlaying(true); };
  const setAutoPlay = value => { setAutoPlayState(value); if (value) play(); else pause(); };
  return { progress: printing ? clamp(printProgress) : position, position, playing, running, autoPlay, printing, play, pause, seek, restart, setAutoPlay };
}

export function AnimationControls({ timeline, label = '动画', valueText, readout = valueText, markers = [] }) {
  return <div className="animation-controls" role="group" aria-label={`${label}播放控制`} onClick={event => event.stopPropagation()} onKeyDown={event => event.stopPropagation()}>
    <button type="button" aria-label={`${timeline.playing ? '暂停' : '播放'}${label}`} onClick={timeline.playing ? timeline.pause : timeline.play}>{timeline.playing ? '暂停' : '播放'}</button>
    <div className="animation-track">
      <input type="range" aria-label={`${label}进度`} aria-valuetext={valueText} min="0" max="1" step="0.001" value={timeline.position}
        onPointerDown={timeline.pause} onKeyDown={event => { if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown'].includes(event.key)) timeline.pause(); }}
        onChange={event => timeline.seek(Number(event.target.value))}/>
      <div className="animation-markers">{markers.map(marker => <button key={marker.progress} type="button" style={{ left: `${clamp(marker.progress)*100}%` }} aria-label={`${label}定位到${marker.label}`} title={marker.label} onClick={() => timeline.seek(marker.progress)}/>)}</div>
    </div>
    <output className="animation-value">{readout}</output>
    <button type="button" aria-label={`重播${label}`} onClick={timeline.restart}>重播</button>
    <label className="animation-auto"><input type="checkbox" aria-label={`${label}自动播放`} checked={timeline.autoPlay} onChange={event => timeline.setAutoPlay(event.target.checked)}/>自动</label>
  </div>;
}
