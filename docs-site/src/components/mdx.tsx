/**
 * 组件名册里页面渲染用的那一半：docfirst.config.mjs 里声明机读规则表，这里给 React 组件表。
 * 表的类型由 registry.ts 的名单限定：少一个或多一个都编译不过。
 * 跟机读规则表是否一致，由 scripts/verify-roster.mjs 核对。
 * 以 fumadocs 的默认组件表为基础，再把 pre 换成 @godcreator/docfirst-workflow/fumadocs 里会显示引用状态点的 DocfirstPre。
 */
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import type { MDXComponents } from 'mdx/types';
import type { ReactNode } from 'react';
import { DocfirstPre } from '@godcreator/docfirst-workflow/fumadocs/pre';
import type { ComponentName } from './registry';
import { Term } from '@godcreator/docfirst-workflow/fumadocs/term';
import { SystemMap, ComponentsMap, PluginMap } from './explain/diagrams';
import { Workflow } from './explain/workflow';
import { Glossary } from './glossary';

export function Note({ children }: { children?: ReactNode }) {
  return <div className="note">{children}</div>;
}

const table: Record<ComponentName, MDXComponents[string]> = {
  SystemMap, ComponentsMap, PluginMap, Workflow, Glossary, Term,
  Note,
  Files,
  Folder,
  File,
};

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ...components,
    ...table,
    pre: DocfirstPre,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
