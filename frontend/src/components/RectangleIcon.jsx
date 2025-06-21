export function RectangleIcon({
  width = 50,
  height = 30,
  color = "black",
  className,
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width={width} height={height} fill={color} />
    </svg>
  );
}
