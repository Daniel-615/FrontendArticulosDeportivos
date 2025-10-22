export default function DashboardForm() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
        backgroundColor: "#000000",
        minHeight: "100vh",
      }}
    >
      {/* Título del Dashboard */}
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h1
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

      {/* Iframe del Dashboard */}
      <div
        style={{
          width: "90%",
          maxWidth: "1200px",
          height: "80vh",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(255,255,255,0.1)",
          backgroundColor: "#ffffff",
          padding: "1rem",
        }}
      >
        <iframe
          title="DashboardApp"
          width="100%"
          height="100%"
          src="https://app.powerbi.com/view?r=eyJrIjoiYjhjYzRkYmUtZmJkYy00OGY4LTg3YWQtYjdlM2IzOWFlODdmIiwidCI6IjVmNTNiNGNlLTYzZDQtNGVlOC04OGQyLTIyZjBiMmQ0YjI3YSIsImMiOjR9"
          frameBorder="0"
          allowFullScreen={true}
          style={{
            border: "none",
            borderRadius: "5px",
          }}
        />
      </div>
    </div>
  )
}
