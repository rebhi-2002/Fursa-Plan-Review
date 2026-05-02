export default function Slide2Challenge() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#F8FAFC" }}
    >
      {/* Left accent bar */}
      <div
        className="absolute"
        style={{
          top: 0,
          left: 0,
          width: "0.8vw",
          height: "100%",
          background: "linear-gradient(180deg, #1E3A8A 0%, #F59E0B 100%)",
        }}
      />

      {/* Section label */}
      <div
        className="absolute"
        style={{
          top: "8vh",
          left: "6vw",
          fontFamily: "var(--font-body-family)",
          fontSize: "1.4vw",
          fontWeight: 600,
          color: "#F59E0B",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        The Challenge
      </div>

      {/* Main headline */}
      <div
        className="absolute"
        style={{
          top: "16vh",
          left: "6vw",
          right: "5vw",
          fontFamily: "var(--font-display-family)",
          fontSize: "4.5vw",
          fontWeight: 900,
          color: "#0F172A",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          textWrap: "balance",
        }}
      >
        Gaza's talent has no digital home.
      </div>

      {/* Three problem cards */}
      <div
        className="absolute"
        style={{
          top: "40vh",
          left: "6vw",
          right: "5vw",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "2.5vw",
        }}
      >
        {/* Card 1 */}
        <div
          style={{
            background: "#EFF6FF",
            borderRadius: "1vw",
            padding: "3vh 2.5vw",
            borderLeft: "0.4vw solid #1E3A8A",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "2.8vw",
              fontWeight: 700,
              color: "#1E3A8A",
              marginBottom: "1.5vh",
            }}
          >
            High Unemployment
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.6vw",
              color: "#475569",
              lineHeight: 1.5,
            }}
          >
            Skilled professionals lack access to employers in a fragmented market.
          </div>
        </div>

        {/* Card 2 */}
        <div
          style={{
            background: "#EFF6FF",
            borderRadius: "1vw",
            padding: "3vh 2.5vw",
            borderLeft: "0.4vw solid #1E3A8A",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "2.8vw",
              fontWeight: 700,
              color: "#1E3A8A",
              marginBottom: "1.5vh",
            }}
          >
            No Central Hub
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.6vw",
              color: "#475569",
              lineHeight: 1.5,
            }}
          >
            Job listings are scattered across social media with no structured platform.
          </div>
        </div>

        {/* Card 3 */}
        <div
          style={{
            background: "#EFF6FF",
            borderRadius: "1vw",
            padding: "3vh 2.5vw",
            borderLeft: "0.4vw solid #F59E0B",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "2.8vw",
              fontWeight: 700,
              color: "#1E3A8A",
              marginBottom: "1.5vh",
            }}
          >
            Arabic-First Gap
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.6vw",
              color: "#475569",
              lineHeight: 1.5,
            }}
          >
            Existing platforms lack RTL support and local context for Arabic speakers.
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div
        className="absolute"
        style={{
          bottom: "6vh",
          left: "6vw",
          width: "8vw",
          height: "0.4vh",
          background: "#F59E0B",
        }}
      />
    </div>
  );
}
