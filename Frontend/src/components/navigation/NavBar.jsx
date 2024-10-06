import React, { useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom"; // For navigation
import {useSelector, useDispatch} from "react-redux";
import {logout} from '../../redux/authSlice';
 
const NavBar = () => {
  const isAuthenticated = useSelector((state)=> state.auth.isAuthenticated); // Get authentication state from Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // // Check if user is logged in by checking the token in localStorage
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     setIsLoggedIn(true);
  //   } else {
  //     setIsLoggedIn(false);
  //   }
  // }, []);

  // Handle user logout
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:5000/update_user_log_out", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove the token from localStorage
        localStorage.removeItem("token");

        dispatch(logout())  // Dispatch the logout action

        // Redirect to login page
        navigate("/login");

      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#000000" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Finance Tracker
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
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
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
