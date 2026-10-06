import { SvgMath, MathText, useAnimationTimeline, AnimationControls } from '@godcreator/academic-deck';
import { Waveforms } from '@godcreator/academic-deck/samples/dab';
import './dab-waveforms.css';

const markers = [0, 1/12, .5, 7/12, 1].map(progress => ({ progress, label: `${(progress*10).toFixed(3)} μs` }));

export function AnimatedDabWaveforms() {
  const timeline = useAnimationTimeline({ durationMs: 12000, loop: true, printProgress: .25 });
  const phase = timeline.progress;
  const interval = phase < 1/12 ? 0 : phase < .5 ? 1 : phase < 7/12 ? 2 : 3;
  return <div className="dab-animation" data-phase={phase} data-position={timeline.position} data-running={timeline.running}>
    <Waveforms>{({ x, current, peak, delta }) => {
      const edges = [0, delta, .5, .5 + delta, 1];
      const vab = phase < .5 ? 400 : -400;
      const vcd = phase >= delta && phase < .5 + delta ? 400 : -400;
      return <g className="dab-motion-layer" aria-hidden="true">
        <rect x={x(edges[interval])} y="28" width={x(edges[interval+1])-x(edges[interval])} height="197" fill="#426780" opacity=".07"/>
        <line className="dab-time-cursor" x1={x(phase)} x2={x(phase)} y1="28" y2="225" stroke="#52636d" strokeWidth="1.5" strokeDasharray="4 3"/>
        {[[57-vab/400*22,'#c00000'],[125-vcd/400*22,'#bb862e'],[199-current(phase)*23/peak,'#426780']].map(([y,color]) => <circle key={color} cx={x(phase)} cy={y} r="4.5" fill={color} stroke="white" strokeWidth="1.4"/>)}
        <SvgMath x={285} y={-2} w={235}>{`v_L=${vab-vcd}\\,\\mathrm{V}`}</SvgMath>
      </g>;
    }}</Waveforms>
    <AnimationControls timeline={timeline} label="波形动画" markers={markers} valueText={`t = ${(phase*10).toFixed(3)} μs`}
      readout={<MathText>{`t=${(phase*10).toFixed(3)}\\,\\mathrm{\\mu s}`}</MathText>}/>
  </div>;
}
