export default function Slide4HowItWorks() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#F8FAFC" }}
    >
      {/* Top bar accent */}
      <div
        className="absolute"
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: "1vh",
          background: "linear-gradient(90deg, #1E3A8A 0%, #F59E0B 100%)",
        }}
      />

      {/* Section label */}
      <div
        className="absolute"
        style={{
          top: "8vh",
          left: "7vw",
          fontFamily: "var(--font-body-family)",
          fontSize: "1.4vw",
          fontWeight: 600,
          color: "#F59E0B",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        How It Works
      </div>

      {/* Headline */}
      <div
        className="absolute"
        style={{
          top: "15vh",
          left: "7vw",
          fontFamily: "var(--font-display-family)",
          fontSize: "4vw",
          fontWeight: 900,
          color: "#0F172A",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
        }}
      >
        From sign-up to hire —<br />four steps.
      </div>

      {/* Steps row */}
      <div
        className="absolute"
        style={{
          top: "40vh",
          left: "7vw",
          right: "7vw",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "2.5vw",
          alignItems: "start",
        }}
      >
        {/* Step 1 */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "5vw",
              fontWeight: 900,
              color: "#DBEAFE",
              lineHeight: 1,
              marginBottom: "1.5vh",
            }}
          >
            01
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.9vw",
              fontWeight: 700,
              color: "#1E3A8A",
              marginBottom: "1vh",
            }}
          >
            Register
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.5vw",
              color: "#64748B",
              lineHeight: 1.5,
            }}
          >
            Create an account via Clerk. Choose your role: seeker or employer.
          </div>
        </div>

        {/* Step 2 */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "5vw",
              fontWeight: 900,
              color: "#DBEAFE",
              lineHeight: 1,
              marginBottom: "1.5vh",
            }}
          >
            02
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.9vw",
              fontWeight: 700,
              color: "#1E3A8A",
              marginBottom: "1vh",
            }}
          >
            Build Profile
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.5vw",
              color: "#64748B",
              lineHeight: 1.5,
            }}
          >
            Complete your profile. Seekers add CV details; employers set up company info.
          </div>
        </div>

        {/* Step 3 */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "5vw",
              fontWeight: 900,
              color: "#FEF3C7",
              lineHeight: 1,
              marginBottom: "1.5vh",
            }}
          >
            03
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.9vw",
              fontWeight: 700,
              color: "#1E3A8A",
              marginBottom: "1vh",
            }}
          >
            Connect
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.5vw",
              color: "#64748B",
              lineHeight: 1.5,
            }}
          >
            Employers post jobs. Seekers browse, save, and apply — all in one place.
          </div>
        </div>

        {/* Step 4 */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "5vw",
              fontWeight: 900,
              color: "#FEF3C7",
              lineHeight: 1,
              marginBottom: "1.5vh",
            }}
          >
            04
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.9vw",
              fontWeight: 700,
              color: "#F59E0B",
              marginBottom: "1vh",
            }}
          >
            Hired
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.5vw",
              color: "#64748B",
              lineHeight: 1.5,
            }}
          >
            Employers review applicants. Admin moderates quality. Opportunity realized.
          </div>
        </div>
      </div>

      {/* Bottom line connecting steps */}
      <div
        className="absolute"
        style={{
          top: "51vh",
          left: "7vw",
          right: "7vw",
          height: "0.3vh",
          background: "linear-gradient(90deg, #1E3A8A 0%, #F59E0B 100%)",
          opacity: 0.3,
        }}
      />
    </div>
  );
}
