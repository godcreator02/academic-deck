import { terms } from '../glossary.mjs';
export function Glossary(){return <dl>{terms.map(t=><div key={t.term} className="my-6"><dt className="font-semibold"><a href={t.href}>{t.term}</a></dt><dd className="mt-2 text-fd-muted-foreground">{t.def}</dd></div>)}</dl>}
