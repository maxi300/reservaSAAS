function DashboardAdmin({ data, onLogout }) {
  return (
    <div>
      <h2>Dashboard Admin</h2>
      <button onClick={onLogout}>Cerrar sesión</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
export default DashboardAdmin;