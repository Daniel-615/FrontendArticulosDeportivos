import React, { useState } from "react";

export default function DashboardForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Bienvenido ${nombre}! El dashboard se ha cargado correctamente.`);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ color: "#333", marginBottom: "1rem" }}>
        Panel de Ventas - Dashboard Power BI
      </h2>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#fff",
          padding: "1.5rem",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          marginBottom: "2rem",
        }}
      >
        <label style={{ fontWeight: "600" }}>Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Escribe tu nombre"
          required
          style={{
            padding: "0.5rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <label style={{ fontWeight: "600" }}>Correo electrónico:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ejemplo: usuario@email.com"
          required
          style={{
            padding: "0.5rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <button
          type="submit"
          style={{
            backgroundColor: "#0078D4",
            color: "#fff",
            padding: "0.75rem",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Ver Dashboard
        </button>
      </form>

      {/* Iframe del Dashboard */}
      <div
        style={{
          width: "90%",
          maxWidth: "1200px",
          height: "80vh",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        }}
      >
        <iframe
          title="DashboardApp"
          width="100%"
          height="100%"
          src="https://app.powerbi.com/view?r=eyJrIjoiYjhjYzRkYmUtZmJkYy00OGY4LTg3YWQtYjdlM2IzOWFlODdmIiwidCI6IjVmNTNiNGNlLTYzZDQtNGVlOC04OGQyLTIyZjBiMmQ0YjI3YSIsImMiOjR9"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
