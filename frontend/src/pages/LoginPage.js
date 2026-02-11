import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ setToken, setRol }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Solicitud de token
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Credenciales inválidas");

      const data = await response.json();
      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh", data.refresh);
      setToken(data.access);

      // Obtener datos del usuario logueado
      const userRes = await fetch("http://localhost:8000/api/usuarios/me/", {
        headers: { Authorization: `Bearer ${data.access}` },
      });

      if (!userRes.ok) throw new Error("No se pudo obtener información del usuario");

      const user = await userRes.json();

      localStorage.setItem("rol", user.rol);
      setRol(user.rol);

      // Redirigir según rol
      if (user.rol === "cliente") navigate("/");
      else if (user.rol === "negocio") navigate("/");
      else if (user.rol === "admin") navigate("/");
      else alert("Rol no reconocido");

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="text" 
          placeholder="Usuario" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}

export default LoginPage;