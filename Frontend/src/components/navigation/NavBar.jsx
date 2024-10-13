import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import MenuIcon from "@mui/icons-material/Menu"; // For mobile menu icon

const NavBar = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false); // Mobile drawer state

  // Handle user logout
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        "http://localhost:5000/update_user_log_out",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        localStorage.removeItem("token");
        dispatch(logout());
        navigate("/login");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Handle drawer toggle
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Drawer for mobile view
  const drawer = (
    <Box sx={{ width: 250 }} onClick={handleDrawerToggle}>
      <List>
        <ListItem button component={Link} to="/personal_expenses">
          <ListItemText primary="Personal Expenses" sx={{color: "white"}}/>
        </ListItem>
        {isAuthenticated ? (
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Logout" sx={{color: "white"}}/>
          </ListItem>
        ) : (
          <>
            <ListItem button component={Link} to="/login">
              <ListItemText primary="Login" sx={{color: "white"}}/>
            </ListItem>
            <ListItem button component={Link} to="/signup">
              <ListItemText primary="Sign Up" sx={{color: "white"}}/>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#000000" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Section: Finance Tracker Title */}
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          Finance Tracker
        </Typography>

        {/* Menu for desktop */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          <Button color="inherit" component={Link} to="/personal_expenses">
            Personal Expenses
          </Button>
          {isAuthenticated ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Sign Up
              </Button>
            </>
          )}
        </Box>

        {/* Mobile menu icon */}
        <IconButton
          color="inherit"
          edge="start"
          sx={{ display: { xs: "block", md: "none" } }}
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Drawer for mobile */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: "#000000", // Dark background for the drawer menu
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default NavBar;
