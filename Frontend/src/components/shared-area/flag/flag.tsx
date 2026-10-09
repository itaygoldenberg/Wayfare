import "./flag.css";

// What the flag needs: a place, like "Kyoto, Japan", or just a country, like "Japan".
class FlagProps {
  public place: string;
}

// The flag of a place's country. The country is the part after the last comma (or the whole text),
// and its picture comes from flag.css, chosen by data-country; a country without a picture there shows nothing.
export function Flag(props: FlagProps) {
  const parts = props.place.split(",");
  const country = parts[parts.length - 1].trim();
  return <span className="Flag" data-country={country} />;
}
