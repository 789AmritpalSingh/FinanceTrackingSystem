import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation

const NavBar = () => {
  return (
    <AppBar position="sticky" sx={{backgroundColor: "#000000"}} >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Finance Tracker
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button color="inherit" component={Link} to="/signup">
            Sign Up
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
