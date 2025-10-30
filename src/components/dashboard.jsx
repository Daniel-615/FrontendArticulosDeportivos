export default function DashboardForm() {
  return (
    <div
      className="min-h-screen bg-black flex flex-col items-center p-4 sm:p-6 md:p-8"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
        backgroundColor: "#000000",
        minHeight: "100vh",
      }}
    >
      <div className="mb-6 sm:mb-8 md:mb-12 text-center w-full" style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2"
          style={{
            color: "#ffffff",
            fontSize: "3rem",
            fontWeight: "bold",
            letterSpacing: "0.1em",
            marginBottom: "0.5rem",
          }}
        >
          DASHBOARD
        </h1>
        <p
          className="text-white/60 text-xs sm:text-sm tracking-wider uppercase"
          style={{
            color: "#a0a0a0",
            fontSize: "0.875rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Análisis y Métricas en Tiempo Real
        </p>
      </div>

      <div
        className="w-full max-w-7xl flex-1 min-h-[500px] sm:min-h-[600px] md:min-h-[700px]"
        style={{
          width: "90%",
          maxWidth: "1200px",
          height: "80vh",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(255,255,255,0.1)",
          backgroundColor: "#ffffff",
          padding: "0", // quitar padding para usar todo el espacio
        }}
      >
        <div className="w-full h-full rounded-lg overflow-hidden shadow-2xl bg-white border border-white/10">
          <iframe
            title="DashboardApp"
            src="https://app.powerbi.com/view?r=eyJrIjoiYjhjYzRkYmUtZmJkYy00OGY4LTg3YWQtYjdlM2IzOWFlODdmIiwidCI6IjVmNTNiNGNlLTYzZDQtNGVlOC04OGQyLTIyZjBiMmQ0YjI3YSIsImMiOjR9"
            frameBorder="0"
            allowFullScreen
            className="w-full h-full"
            style={{ width: "100%", height: "100%", border: "none", minHeight: "500px" }}
          ></iframe>
        </div>
      </div>
    </div>
  )
}
