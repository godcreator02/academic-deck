export function Figure({ children, caption, number }) {
  return <figure className="figure"><div className="figure-media">{children}</div><figcaption>{number && <b className="caption-number">图 {number}</b>}{caption}</figcaption></figure>;
}
