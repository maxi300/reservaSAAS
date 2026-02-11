import React from 'react';
import { Link } from 'react-router-dom';

function ClientLayout({ children, onLogout }) {
  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottom: '1px solid #eee' }}>
        <nav>
          <Link to="/dashboard/cliente" style={{ marginRight: 12 }}>Mis citas</Link>
          <Link to="/perfil">Perfil</Link>
        </nav>
        <div>
          <button onClick={onLogout}>Cerrar sesión</button>
        </div>
      </header>
      <main style={{ padding: 16 }}>{children}</main>
    </div>
  );
}

export default ClientLayout;
