export default function Slide6TechStack() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#F8FAFC" }}
    >
      {/* Left blue panel */}
      <div
        className="absolute"
        style={{
          top: 0,
          left: 0,
          width: "42vw",
          height: "100%",
          background: "linear-gradient(180deg, #1E3A8A 0%, #1e40af 100%)",
        }}
      />

      {/* Section label — on blue */}
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
        Technology Stack
      </div>

      {/* Headline — on blue */}
      <div
        className="absolute"
        style={{
          top: "18vh",
          left: "6vw",
          width: "32vw",
          fontFamily: "var(--font-display-family)",
          fontSize: "4.5vw",
          fontWeight: 900,
          color: "#FFFFFF",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          textWrap: "balance",
        }}
      >
        Production-grade from day one.
      </div>

      {/* Subtext — on blue */}
      <div
        className="absolute"
        style={{
          top: "52vh",
          left: "6vw",
          width: "30vw",
          fontFamily: "var(--font-body-family)",
          fontSize: "1.6vw",
          color: "#BFDBFE",
          lineHeight: 1.6,
        }}
      >
        Monorepo architecture with shared types, codegen, and a fully typed API layer.
      </div>

      {/* Tech tiles — right side, 2x3 grid, all written by hand */}
      <div
        className="absolute"
        style={{
          top: "10vh",
          left: "46vw",
          right: "5vw",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2vh 2vw",
        }}
      >
        {/* Tile 1 */}
        <div
          style={{
            background: "#EFF6FF",
            borderRadius: "0.8vw",
            padding: "2.5vh 2vw",
            borderBottom: "0.35vh solid #1E3A8A",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.8vw",
              fontWeight: 700,
              color: "#0F172A",
              marginBottom: "0.5vh",
            }}
          >
            React + Vite
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.4vw",
              color: "#64748B",
              fontWeight: 500,
            }}
          >
            Frontend
          </div>
        </div>

        {/* Tile 2 */}
        <div
          style={{
            background: "#EFF6FF",
            borderRadius: "0.8vw",
            padding: "2.5vh 2vw",
            borderBottom: "0.35vh solid #1E3A8A",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.8vw",
              fontWeight: 700,
              color: "#0F172A",
              marginBottom: "0.5vh",
            }}
          >
            Express.js
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.4vw",
              color: "#64748B",
              fontWeight: 500,
            }}
          >
            API Server
          </div>
        </div>

        {/* Tile 3 */}
        <div
          style={{
            background: "#EFF6FF",
            borderRadius: "0.8vw",
            padding: "2.5vh 2vw",
            borderBottom: "0.35vh solid #1E3A8A",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.8vw",
              fontWeight: 700,
              color: "#0F172A",
              marginBottom: "0.5vh",
            }}
          >
            Drizzle ORM
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.4vw",
              color: "#64748B",
              fontWeight: 500,
            }}
          >
            Database Layer
          </div>
        </div>

        {/* Tile 4 */}
        <div
          style={{
            background: "#EFF6FF",
            borderRadius: "0.8vw",
            padding: "2.5vh 2vw",
            borderBottom: "0.35vh solid #1E3A8A",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.8vw",
              fontWeight: 700,
              color: "#0F172A",
              marginBottom: "0.5vh",
            }}
          >
            Supabase
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.4vw",
              color: "#64748B",
              fontWeight: 500,
            }}
          >
            PostgreSQL Host
          </div>
        </div>

        {/* Tile 5 */}
        <div
          style={{
            background: "#EFF6FF",
            borderRadius: "0.8vw",
            padding: "2.5vh 2vw",
            borderBottom: "0.35vh solid #F59E0B",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.8vw",
              fontWeight: 700,
              color: "#0F172A",
              marginBottom: "0.5vh",
            }}
          >
            Clerk Auth
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.4vw",
              color: "#64748B",
              fontWeight: 500,
            }}
          >
            Authentication
          </div>
        </div>

        {/* Tile 6 */}
        <div
          style={{
            background: "#EFF6FF",
            borderRadius: "0.8vw",
            padding: "2.5vh 2vw",
            borderBottom: "0.35vh solid #F59E0B",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.8vw",
              fontWeight: 700,
              color: "#0F172A",
              marginBottom: "0.5vh",
            }}
          >
            pnpm Monorepo
          </div>
          <div
            style={{
              fontFamily: "var(--font-body-family)",
              fontSize: "1.4vw",
              color: "#64748B",
              fontWeight: 500,
            }}
          >
            Workspace
          </div>
        </div>
      </div>

      {/* Gold accent dot */}
      <div
        className="absolute"
        style={{
          bottom: "6vh",
          left: "6vw",
          width: "1vw",
          height: "1vw",
          borderRadius: "50%",
          background: "#F59E0B",
        }}
      />
    </div>
  );
}
