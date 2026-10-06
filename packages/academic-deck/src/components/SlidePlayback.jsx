import { createContext, useContext, useEffect, useState } from 'react';

export const SlideActivityContext = createContext(false);

// The player supplies visibility; each slide owns its animation and manual controls.
export function useSlidePlayback({ motionRequested = false } = {}) {
  const active = useContext(SlideActivityContext);
  const [environment, setEnvironment] = useState(() => ({
    visible: !document.hidden,
    printing: matchMedia('print').matches,
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
  }));
  useEffect(() => {
    const print = matchMedia('print');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnvironment({ visible: !document.hidden, printing: print.matches, reducedMotion: motion.matches });
    const beforePrint = () => setEnvironment(value => ({ ...value, printing: true }));
    document.addEventListener('visibilitychange', update);
    print.addEventListener('change', update);
    motion.addEventListener('change', update);
    window.addEventListener('beforeprint', beforePrint);
    window.addEventListener('afterprint', update);
    return () => {
      document.removeEventListener('visibilitychange', update);
      print.removeEventListener('change', update);
      motion.removeEventListener('change', update);
      window.removeEventListener('beforeprint', beforePrint);
      window.removeEventListener('afterprint', update);
    };
  }, []);
  return { active, canAnimate: active && environment.visible && !environment.printing && (!environment.reducedMotion || motionRequested), reducedMotion: environment.reducedMotion, printing: environment.printing };
}
