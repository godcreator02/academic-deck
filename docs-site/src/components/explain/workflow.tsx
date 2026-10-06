'use client';
import { Pane, Pill, Stepper, Terminal } from '@godcreator/docfirst-explainer';
import { workflow } from './workflow.data.mjs';
export function Workflow(){return <div className="not-prose workflow"><Stepper steps={workflow} label="汇报制作流程">{(step,index)=><div className="workflow-frame"><div className="workflow-track">{workflow.map((s,i)=><Pill key={s.title} tone={i===index?'info':i<index?'good':undefined}>{i+1} {s.title}</Pill>)}</div><div className="workflow-panels"><Terminal title="同一个汇报项目 · MCP 参数 / 本地操作" lines={step.lines}/><Pane title={step.owner} role="emerald"><p>这一步得到</p><strong>{step.artifact}</strong><p>项目目录：D:/reports/dab-weekly</p></Pane></div></div>}</Stepper></div>}
