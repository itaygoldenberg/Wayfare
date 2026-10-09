import "./bar-value.css";

// What recharts hands a bar's label: where the bar is, and its value.
class BarValueProps {
  public x?: number;
  public y?: number;
  public width?: number;
  public value?: number;
}

// The number above a bar, in a small glass pill centred over it.
export function BarValue(props: BarValueProps) {
  const centerX = Number(props.x) + Number(props.width) / 2;
  const top = Number(props.y);

  return (
    <g className="BarValue">
      <rect x={centerX - 14} y={top - 26} width={28} height={18} />
      <text x={centerX} y={top - 13}>
        {props.value}
      </text>
    </g>
  );
}
