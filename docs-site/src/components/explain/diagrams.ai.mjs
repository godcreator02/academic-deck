import { system, components, plugin } from './diagrams.data.mjs';
const rule = data => (_node,h) => [h.paragraph(data.title), ...data.nodes.map(n=>h.paragraph(n.title+'：'+n.detail+'。'+(n.capabilities??[]).join('；'))), ...data.edges.map(e=>h.paragraph(e.text))];
export const diagramRules = {SystemMap:rule(system), ComponentsMap:rule(components), PluginMap:rule(plugin)};
