import "./likes-tooltip.css";

// What recharts hands the tooltip while the pointer is over a bar.
class LikesTooltipProps {
  public active?: boolean;
  public label?: string;
  public payload?: { value: number }[];
  public total?: number;
}

// The glass bubble shown over a bar: the full destination, its likes, and its share of all the likes.
export function LikesTooltip(props: LikesTooltipProps) {
  if (!props.active || !props.payload?.length) return null;
  const likes = props.payload[0].value;
  const share = props.total ? Math.round((likes / props.total) * 100) : 0;

  return (
    <div className="LikesTooltip">
      <span className="destination">{props.label}</span>
      <span className="likes">
        <strong>{likes}</strong> {likes === 1 ? "like" : "likes"} · {share}% of
        all likes
      </span>
      <progress value={likes} max={props.total} />
    </div>
  );
}
