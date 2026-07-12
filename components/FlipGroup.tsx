import { FlipDigit } from "./FlipDigit";

export function FlipGroup({
  digits,
  size = "lg",
  ariaLabel,
}: {
  digits: string; // e.g. "02059"
  size?: "lg" | "sm";
  ariaLabel: string;
}) {
  return (
    <span className="flip-group" role="img" aria-label={ariaLabel}>
      {digits.split("").map((d, i) => (
        <FlipDigit key={i} value={d} size={size} />
      ))}
    </span>
  );
}
