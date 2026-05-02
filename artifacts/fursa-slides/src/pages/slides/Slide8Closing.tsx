const base = import.meta.env.BASE_URL;

export default function Slide8Closing() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#0F172A" }}
    >
      {/* Background image — same hero */}
      <img
        src={`${base}hero-network.png`}
        crossOrigin="anonymous"
        alt="Network background"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.2, transform: "scaleX(-1)" }}
      />

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(15,23,42,0.7) 0%, rgba(30,58,138,0.85) 100%)",
        }}
      />

      {/* Center content */}
      <div
        className="absolute"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          width: "80vw",
        }}
      >
        {/* Gold bar */}
        <div
          style={{
            width: "6vw",
            height: "0.5vh",
            background: "#F59E0B",
            margin: "0 auto 4vh",
          }}
        />

        {/* Large brand name */}
        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "10vw",
            fontWeight: 900,
            color: "#FFFFFF",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            marginBottom: "2vh",
          }}
        >
          فُرصة
        </div>

        <div
          style={{
            fontFamily: "var(--font-body-family)",
            fontSize: "2.2vw",
            fontWeight: 600,
            color: "#F59E0B",
            letterSpacing: "0.08em",
            marginBottom: "4vh",
          }}
        >
          FURSA
        </div>

        <div
          style={{
            fontFamily: "var(--font-body-family)",
            fontSize: "1.8vw",
            color: "#CBD5E1",
            lineHeight: 1.6,
            marginBottom: "6vh",
          }}
        >
          Gaza's first dedicated digital employment platform.
        </div>

        {/* Gold bar bottom */}
        <div
          style={{
            width: "6vw",
            height: "0.5vh",
            background: "#F59E0B",
            margin: "0 auto",
          }}
        />
      </div>
    </div>
  );
}
