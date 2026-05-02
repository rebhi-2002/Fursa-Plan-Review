export default function Slide3Platform() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#1E3A8A" }}
    >
      {/* Subtle top-right accent */}
      <div
        className="absolute"
        style={{
          top: 0,
          right: 0,
          width: "35vw",
          height: "40vh",
          background: "rgba(245,158,11,0.08)",
          borderBottomLeftRadius: "30vw",
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
        The Platform
      </div>

      {/* Headline */}
      <div
        className="absolute"
        style={{
          top: "15vh",
          left: "7vw",
          right: "7vw",
          fontFamily: "var(--font-display-family)",
          fontSize: "4vw",
          fontWeight: 900,
          color: "#FFFFFF",
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          textWrap: "balance",
          textAlign: "center",
        }}
      >
        One platform. Three roles. Every need met.
      </div>

      {/* Three role columns */}
      <div
        className="absolute"
        style={{
          top: "34vh",
          left: "7vw",
          right: "7vw",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "3vw",
        }}
      >
        {/* Job Seeker */}
        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: "1.2vw",
            padding: "4vh 2.5vw",
            borderTop: "0.5vh solid #F59E0B",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.6vw",
              fontWeight: 700,
              color: "#F59E0B",
              marginBottom: "1.5vh",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Job Seeker
          </div>
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "2.2vw",
              fontWeight: 700,
              color: "#FFFFFF",
              marginBottom: "2.5vh",
            }}
          >
            باحث عن عمل
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.5vw",
              color: "#BFDBFE",
              lineHeight: 1.7,
            }}
          >
            Browse listings
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.5vw",
              color: "#BFDBFE",
              lineHeight: 1.7,
            }}
          >
            Apply with one click
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.5vw",
              color: "#BFDBFE",
              lineHeight: 1.7,
            }}
          >
            Track applications
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.5vw",
              color: "#BFDBFE",
              lineHeight: 1.7,
            }}
          >
            Save favorite jobs
          </div>
        </div>

        {/* Employer */}
        <div
          style={{
            background: "rgba(245,158,11,0.15)",
            borderRadius: "1.2vw",
            padding: "4vh 2.5vw",
            borderTop: "0.5vh solid #F59E0B",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.6vw",
              fontWeight: 700,
              color: "#F59E0B",
              marginBottom: "1.5vh",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Employer
          </div>
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "2.2vw",
              fontWeight: 700,
              color: "#FFFFFF",
              marginBottom: "2.5vh",
            }}
          >
            صاحب عمل
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.5vw",
              color: "#FDE68A",
              lineHeight: 1.7,
            }}
          >
            Post job listings
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.5vw",
              color: "#FDE68A",
              lineHeight: 1.7,
            }}
          >
            Manage applicants
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.5vw",
              color: "#FDE68A",
              lineHeight: 1.7,
            }}
          >
            Company profile
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.5vw",
              color: "#FDE68A",
              lineHeight: 1.7,
            }}
          >
            Full CRUD dashboard
          </div>
        </div>

        {/* Admin */}
        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: "1.2vw",
            padding: "4vh 2.5vw",
            borderTop: "0.5vh solid rgba(255,255,255,0.3)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.6vw",
              fontWeight: 700,
              color: "#94A3B8",
              marginBottom: "1.5vh",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Admin
          </div>
          <div
            style={{
              fontFamily: "var(--font-display-family)",
              fontSize: "2.2vw",
              fontWeight: 700,
              color: "#FFFFFF",
              marginBottom: "2.5vh",
            }}
          >
            المدير
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.5vw",
              color: "#BFDBFE",
              lineHeight: 1.7,
            }}
          >
            Moderate listings
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.5vw",
              color: "#BFDBFE",
              lineHeight: 1.7,
            }}
          >
            Manage all users
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.5vw",
              color: "#BFDBFE",
              lineHeight: 1.7,
            }}
          >
            Platform oversight
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.5vw",
              color: "#BFDBFE",
              lineHeight: 1.7,
            }}
          >
            Approval workflows
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div
        className="absolute"
        style={{
          bottom: "5vh",
          right: "7vw",
          fontFamily: "var(--font-display-family)",
          fontSize: "2vw",
          fontWeight: 900,
          color: "rgba(255,255,255,0.15)",
        }}
      >
        فُرصة
      </div>
    </div>
  );
}
