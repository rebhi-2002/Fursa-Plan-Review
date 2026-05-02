export default function Slide5Features() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#0F172A" }}
    >
      {/* Diagonal accent shape */}
      <div
        className="absolute"
        style={{
          top: 0,
          right: 0,
          width: "45vw",
          height: "55vh",
          background: "linear-gradient(135deg, rgba(30,58,138,0.6) 0%, rgba(30,58,138,0.1) 100%)",
          clipPath: "polygon(100% 0, 100% 100%, 0 0)",
        }}
      />

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
        Key Features
      </div>

      {/* Headline */}
      <div
        className="absolute"
        style={{
          top: "15vh",
          left: "7vw",
          right: "40vw",
          fontFamily: "var(--font-display-family)",
          fontSize: "4vw",
          fontWeight: 900,
          color: "#FFFFFF",
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          textWrap: "balance",
        }}
      >
        Built for the Arabic-speaking world.
      </div>

      {/* Feature list — two columns */}
      <div
        className="absolute"
        style={{
          top: "38vh",
          left: "7vw",
          right: "7vw",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2.5vh 5vw",
        }}
      >
        {/* Feature 1 */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1.2vw" }}>
          <div
            style={{
              width: "0.5vw",
              height: "0.5vw",
              borderRadius: "50%",
              background: "#F59E0B",
              marginTop: "0.8vh",
              flexShrink: 0,
            }}
          />
          <div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.8vw",
                fontWeight: 700,
                color: "#FFFFFF",
                marginBottom: "0.5vh",
              }}
            >
              RTL-First Design
            </div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.5vw",
                color: "#94A3B8",
                lineHeight: 1.5,
              }}
            >
              Full Arabic right-to-left support across every page
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1.2vw" }}>
          <div
            style={{
              width: "0.5vw",
              height: "0.5vw",
              borderRadius: "50%",
              background: "#F59E0B",
              marginTop: "0.8vh",
              flexShrink: 0,
            }}
          />
          <div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.8vw",
                fontWeight: 700,
                color: "#FFFFFF",
                marginBottom: "0.5vh",
              }}
            >
              Bilingual AR / EN
            </div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.5vw",
                color: "#94A3B8",
                lineHeight: 1.5,
              }}
            >
              Instant language toggle for all users
            </div>
          </div>
        </div>

        {/* Feature 3 */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1.2vw" }}>
          <div
            style={{
              width: "0.5vw",
              height: "0.5vw",
              borderRadius: "50%",
              background: "#F59E0B",
              marginTop: "0.8vh",
              flexShrink: 0,
            }}
          />
          <div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.8vw",
                fontWeight: 700,
                color: "#FFFFFF",
                marginBottom: "0.5vh",
              }}
            >
              Role-Based Dashboards
            </div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.5vw",
                color: "#94A3B8",
                lineHeight: 1.5,
              }}
            >
              Tailored experience for seeker, employer, and admin
            </div>
          </div>
        </div>

        {/* Feature 4 */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1.2vw" }}>
          <div
            style={{
              width: "0.5vw",
              height: "0.5vw",
              borderRadius: "50%",
              background: "#F59E0B",
              marginTop: "0.8vh",
              flexShrink: 0,
            }}
          />
          <div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.8vw",
                fontWeight: 700,
                color: "#FFFFFF",
                marginBottom: "0.5vh",
              }}
            >
              Secure Authentication
            </div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.5vw",
                color: "#94A3B8",
                lineHeight: 1.5,
              }}
            >
              Clerk-powered auth with Google sign-in
            </div>
          </div>
        </div>

        {/* Feature 5 */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1.2vw" }}>
          <div
            style={{
              width: "0.5vw",
              height: "0.5vw",
              borderRadius: "50%",
              background: "#F59E0B",
              marginTop: "0.8vh",
              flexShrink: 0,
            }}
          />
          <div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.8vw",
                fontWeight: 700,
                color: "#FFFFFF",
                marginBottom: "0.5vh",
              }}
            >
              Full CRUD Operations
            </div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.5vw",
                color: "#94A3B8",
                lineHeight: 1.5,
              }}
            >
              Complete data management for every role
            </div>
          </div>
        </div>

        {/* Feature 6 */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1.2vw" }}>
          <div
            style={{
              width: "0.5vw",
              height: "0.5vw",
              borderRadius: "50%",
              background: "#F59E0B",
              marginTop: "0.8vh",
              flexShrink: 0,
            }}
          />
          <div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.8vw",
                fontWeight: 700,
                color: "#FFFFFF",
                marginBottom: "0.5vh",
              }}
            >
              Privacy & Legal Pages
            </div>
            <div
              style={{
                fontFamily: "var(--font-body-family)",
                fontSize: "1.5vw",
                color: "#94A3B8",
                lineHeight: 1.5,
              }}
            >
              About, Privacy, and Terms pages fully localized
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
