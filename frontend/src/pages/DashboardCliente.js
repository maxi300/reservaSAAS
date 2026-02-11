import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

function DashboardCliente({ data, onLogout }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Panel Cliente
          </Typography>
          <Button color="inherit">Inicio</Button>
          <Button color="inherit">Mis Reservas</Button>
          <Button color="inherit">Mi Perfil</Button>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={onLogout}>
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Bienvenido al Dashboard Cliente
        </Typography>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </Container>
    </Box>
  );
}
export default DashboardCliente;