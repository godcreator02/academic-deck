import { fumadocsRoster } from '@godcreator/docfirst-workflow/fumadocs/roster';
import { diagramRules } from './src/components/explain/diagrams.ai.mjs';
import { stepsText } from '@godcreator/docfirst-explainer/text';
import { workflow } from './src/components/explain/workflow.data.mjs';
import { terms } from './src/glossary.mjs';
export default {
 content: 'content',
 outputs: {
  "content/docs/outputs/site-readme.mdx": ["README.md"],
  "content/docs/outputs/readme.mdx": [
    "../README.md"
  ],
  "content/docs/outputs/components-readme.mdx": [
    "../packages/academic-deck/README.md"
  ],
  "content/docs/outputs/plugin-readme.mdx": [
    "../plugins/academic-deck/README.md"
  ],
  "content/docs/plugin/skill.mdx": [
    {
      "to": "../plugins/academic-deck/skill-source/academic-deck/SKILL.md",
      "frontmatter": [
        "name",
        "description"
      ]
    }
  ],
  "content/docs/plugin/references/authoring.mdx": [
    "../plugins/academic-deck/skill-source/academic-deck/references/authoring.md"
  ],
  "content/docs/plugin/references/animation.mdx": [
    "../plugins/academic-deck/skill-source/academic-deck/references/animation.md"
  ],
  "content/docs/outputs/agents.mdx": [
    "../AGENTS.md"
  ],
  "content/docs/outputs/claude.mdx": [
    "../CLAUDE.md"
  ]
},
 components: {
  ...fumadocsRoster, ...diagramRules, Term: 'children',
  Workflow: (_node,h) => stepsText(workflow).map(t=>h.paragraph(t)),
  Glossary: (_node,h) => terms.map(t=>h.paragraph(t.term+'：'+t.def)),
 },
};
