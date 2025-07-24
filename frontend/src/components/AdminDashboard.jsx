import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LogoutIcon from '@mui/icons-material/Logout';

const AdminDashboard = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:768px)");

  const token = sessionStorage.getItem("token");

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const handleNavigation = (path) => {
    setDrawerOpen(false);
    navigate(path);
  };

  const navItems = [
    { label: "Pending Products", path: "/admin/dashboard" },
    // { label: "Logs", path: "/admin/logs" },
    // { label: "Cart", path: "/cart" },
  ];

  return (
    <div>
      <AppBar  sx={{ background: "#1976d2" }}>
        <Toolbar>
          <Typography variant="h6" sx={{display:"flex",justifyContent:"start", flexGrow: 1, fontWeight: "bold", cursor: "pointer" }} onClick={() => navigate("/home")}>
            NextCart
          </Typography>

          {isMobile ? (
            <>
              <IconButton color="inherit" edge="end" onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <List sx={{ width: 200 }}>
                  {navItems.map((item) => (
                    <ListItem button key={item.label} onClick={() => handleNavigation(item.path)}>
                      <ListItemText primary={item.label} />
                    </ListItem>
                  ))}
                  <ListItem button onClick={token ? handleLogout : () => handleNavigation("/login")}>
                    <ListItemText primary={token ? "Logout" : ""} />
                  </ListItem>
                </List>
              </Drawer>
            </>
          ) : (
            <Box>
              {navItems.map((item) => (
                <Button key={item.label} color="inherit" onClick={() => navigate(item.path)}>
                  {item.label}
                </Button>
              ))}
              <Button color="inherit" onClick={token ? handleLogout : () => navigate("/login")}>
                {token ? "Logout" : "Login"}
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default AdminDashboard
