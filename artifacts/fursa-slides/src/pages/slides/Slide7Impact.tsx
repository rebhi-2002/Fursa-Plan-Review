export default function Slide7Impact() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#1E3A8A" }}
    >
      {/* Large decorative quote mark */}
      <div
        className="absolute"
        style={{
          top: "-2vh",
          left: "4vw",
          fontFamily: "var(--font-display-family)",
          fontSize: "30vw",
          fontWeight: 900,
          color: "rgba(255,255,255,0.04)",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        "
      </div>

      {/* Section label */}
      <div
        className="absolute"
        style={{
          top: "7vh",
          left: "7vw",
          fontFamily: "var(--font-body-family)",
          fontSize: "1.4vw",
          fontWeight: 600,
          color: "#F59E0B",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        Impact
      </div>

      {/* Big quote */}
      <div
        className="absolute"
        style={{
          top: "18vh",
          left: "7vw",
          right: "7vw",
          fontFamily: "var(--font-display-family)",
          fontSize: "4.5vw",
          fontWeight: 900,
          color: "#FFFFFF",
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          textWrap: "balance",
        }}
      >
        Every person deserves a dignified opportunity.
      </div>

      {/* Arabic version */}
      <div
        className="absolute"
        style={{
          top: "48vh",
          left: "7vw",
          right: "7vw",
          fontFamily: "var(--font-display-family)",
          fontSize: "3.5vw",
          fontWeight: 900,
          color: "#F59E0B",
          lineHeight: 1.2,
          textAlign: "right",
          direction: "rtl",
        }}
      >
        كل إنسان يستحق فرصة عمل كريمة.
      </div>

      {/* Divider */}
      <div
        className="absolute"
        style={{
          top: "44vh",
          left: "7vw",
          right: "7vw",
          height: "0.2vh",
          background: "rgba(255,255,255,0.15)",
        }}
      />

      {/* Attribution */}
      <div
        className="absolute"
        style={{
          bottom: "8vh",
          left: "7vw",
          fontFamily: "var(--font-body-family)",
          fontSize: "1.5vw",
          color: "#93C5FD",
          fontWeight: 500,
        }}
      >
        Fursa — Gaza's Digital Employment Platform
      </div>

      {/* Gold line */}
      <div
        className="absolute"
        style={{
          bottom: "6vh",
          left: "7vw",
          width: "6vw",
          height: "0.4vh",
          background: "#F59E0B",
        }}
      />
    </div>
  );
}
