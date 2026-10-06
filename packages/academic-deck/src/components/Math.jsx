import katex from 'katex';
export function MathText({ children, display = false }) {
  const html = katex.renderToString(children, { displayMode: display, throwOnError: true, strict: 'error', output: 'htmlAndMathml' });
  const Tag = display ? 'div' : 'span';
  return <Tag className={display ? 'math-display' : 'math-inline'} data-tex={children} dangerouslySetInnerHTML={{ __html: html }} />;
}
export function Equation({ children, number, className = '' }) {
  return <div className={`equation ${className}`}><div className="formula"><MathText display>{children}</MathText></div>{number && <span className="number">({number})</span>}</div>;
}
export function SvgMath({ x, y, w = 80, h = 32, children, size = 20 }) {
  return <foreignObject x={x} y={y} width={w} height={h}><div xmlns="http://www.w3.org/1999/xhtml" className="math-svg" style={{ fontSize: size }}><MathText>{children}</MathText></div></foreignObject>;
}
