const ICON_SIZE = 32;
const COLUMNS = 8;  // 64 images → 8 per row

export default function SpriteImage({ code, className ,scale}) {
  if (!code || !code.includes("_n")) {
    return <div style={{ width: ICON_SIZE, height: ICON_SIZE, background: "#555" }} />;
  }

  const [sheet, idx] = code.split("_n");
  const index = Number(idx);

  const x = (index % COLUMNS) * ICON_SIZE;           // column
  const y = Math.floor(index / COLUMNS) * ICON_SIZE; // row

  return (
    <div
      className={className}
      style={{
        width: ICON_SIZE * scale,     // scaled div
        height: ICON_SIZE * scale,    // scaled div
        backgroundImage: `url(/${sheet}.png)`,
        backgroundPosition: `-${x * scale}px -${y * scale}px`, // scale position too
        backgroundSize: `${COLUMNS * ICON_SIZE * scale}px ${COLUMNS * ICON_SIZE * scale}px`,// it was 256*256
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
      }}
    />
  );
}
