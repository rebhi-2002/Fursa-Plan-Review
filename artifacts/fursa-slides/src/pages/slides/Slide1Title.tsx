const base = import.meta.env.BASE_URL;

export default function Slide1Title() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#0F172A" }}
    >
      {/* Background image */}
      <img
        src={`${base}hero-network.png`}
        crossOrigin="anonymous"
        alt="Network background"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.35 }}
      />

      {/* Blue gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(30,58,138,0.92) 0%, rgba(15,23,42,0.85) 60%, rgba(30,58,138,0.6) 100%)",
        }}
      />

      {/* Accent bar top-left */}
      <div
        className="absolute"
        style={{
          top: "6vh",
          left: "7vw",
          width: "5vw",
          height: "0.5vh",
          background: "#F59E0B",
        }}
      />

      {/* Main content */}
      <div
        className="absolute"
        style={{ top: "15vh", left: "7vw", right: "40vw" }}
      >
        <div
          style={{
            fontFamily: "var(--font-body-family)",
            fontSize: "1.5vw",
            color: "#F59E0B",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "2.5vh",
          }}
        >
          Gaza's Digital Employment Platform
        </div>

        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "9vw",
            color: "#FFFFFF",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            marginBottom: "1vh",
          }}
        >
          فُرصة
        </div>

        <div
          style={{
            fontFamily: "var(--font-display-family)",
            fontSize: "4vw",
            color: "#BFDBFE",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            marginBottom: "4vh",
          }}
        >
          Fursa
        </div>

        <div
          style={{
            fontFamily: "var(--font-body-family)",
            fontSize: "1.7vw",
            color: "#CBD5E1",
            fontWeight: 400,
            lineHeight: 1.6,
            maxWidth: "42vw",
            textWrap: "pretty",
          }}
        >
          Connecting talent with opportunity — one job at a time.
        </div>
      </div>

      {/* Bottom-right decorative element */}
      <div
        className="absolute"
        style={{
          bottom: "8vh",
          right: "7vw",
          fontFamily: "var(--font-body-family)",
          fontSize: "1.4vw",
          color: "rgba(255,255,255,0.4)",
          fontWeight: 400,
          textAlign: "right",
        }}
      >
        {/* fursa.replit.app */}
        fursa.com
      </div>

      {/* Gold accent circle */}
      <div
        className="absolute"
        style={{
          bottom: "12vh",
          left: "7vw",
          width: "0.8vw",
          height: "0.8vw",
          borderRadius: "50%",
          background: "#F59E0B",
        }}
      />
    </div>
  );
}
