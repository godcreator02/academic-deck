// Generated Markdown retains package-relative links. Resolve those same links for the website.
export function outputLink(href: string | undefined) {
 if (!href) return href;
 if (href.endsWith('references/authoring.md')) return '/docs/plugin/references/authoring';
 if (href.endsWith('references/animation.md')) return '/docs/plugin/references/animation';
 if (href.endsWith('package-version.json')) return '/docs/plugin';
 if (href.includes('skill-source/') && href.endsWith('SKILL.md')) return '/docs/plugin/skill';
 return href;
}
