import { useEffect, type RefObject } from 'react'

/**
 * 舞台自适应缩放：把 960×540pt 的画布等比缩到窗口里并居中。
 *
 * 与静态版 deck.js 的 fit() 同逻辑：读 offsetWidth/offsetHeight（布局像素，
 * 不受 transform 影响）而不是写死 1280/720 —— 960pt 在 96dpi 下是 1280px，
 * 但写死数字会在改画布时静默失效。
 *
 * 注意：这只是**视图**缩放。元数据与打印尺寸仍是精确的 960×540pt。
 */
export function useFitScale(ref: RefObject<HTMLElement | null>, pad = 40) {
  useEffect(() => {
    const fit = () => {
      const el = ref.current
      if (!el) return
      const w = el.offsetWidth || 1280
      const h = el.offsetHeight || 720
      const k = Math.min((window.innerWidth - pad) / w, (window.innerHeight - pad) / h)
      el.style.setProperty('--fit', String(Math.max(k, 0.1)))
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [ref, pad])
}
