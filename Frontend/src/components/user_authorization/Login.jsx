import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  Snackbar,
  Link,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link as RouterLink } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // For toggling password visibility

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' or 'error'

  const handleLogin = async (e) => {
    e.preventDefault();

    // Case for missing field
    if (!username || !password) {
      // If either username or password is missing
      setSnackbarSeverity("error");
      setSnackbarMessage("Please enter both username and password");
      setSnackbarOpen(true);
      return; // Prevent form submission
    }

    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.access_token); // Store the JWT token
      // Clear the fields after login
      setUsername("");
      setPassword("");

      // Open snackbar showing successful login message
      setSnackbarSeverity("success");
      setSnackbarMessage("Login successful");
      setSnackbarOpen(true);
    } else {
      // Open snackbar showing error message
      setSnackbarSeverity("error");
      setSnackbarMessage(data.message || "Login failed");
      setSnackbarOpen(true);
    }
  };

  // Handle password visibility toggle
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Handle mouse down event (to prevent the focus loss on the icon)
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const handleSnackbarClose = () => {
    // Close the snackbar
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 6,
          p: 4,
          borderRadius: "10px",
          boxShadow: 3,
          backgroundColor: "#f7f7f7",
        }}
      >
        <Grid container spacing={2} maxWidth="400px">
          <Grid size={{xs: 12}}>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#1976d2" }}
            >
              Login
            </Typography>
          </Grid>

          <Grid size={{xs: 12}}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>

          <Grid size={{xs: 12}}>
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              type={showPassword ? "text" : "password"} // Toggle between text and password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{xs: 12}}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLogin}
              sx={{ fontWeight: "bold", height: "50px", fontSize: "16px" }}
            >
              Login
            </Button>
          </Grid>

          <Grid size={{xs: 12}}>
            <Typography align="center" sx={{ mt: 1 }}>
              Don't have an account?{" "}
              <Link
                component={RouterLink}
                to="/signup"
                variant="body1"
                underline="hover"
                sx={{ color: "#1976d2", fontWeight: "bold" }}
              >
                Create one
              </Link>
            </Typography>
          </Grid>

          {/* Snackbar for success or error messages */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Grid>
      </Box>
    </Container>
  );
};

export default Login;
