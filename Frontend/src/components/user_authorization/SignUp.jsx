import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Link
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {Link as RouterLink} from "react-router-dom"; 

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false); // For toggling password visibility

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' or 'error'

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Case for missing field
    if (!username || !password || !email) {
      // If either email or username or password is missing
      setSnackbarSeverity("error");
      setSnackbarMessage("Please fill all fields");
      setSnackbarOpen(true);
      return; // Prevent form submission
    }

    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Clear the fields after sign up
      setUsername("");
      setPassword("");
      setEmail("");

      // Open snackbar showing successful registration message
      setSnackbarSeverity("success");
      setSnackbarMessage("User registered successfully!");
      setSnackbarOpen(true);
    } else {
      // Open snackbar showing error message
      setSnackbarSeverity("error");
      setSnackbarMessage(data.message || "Registration failed");
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
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#1976d2" }}
            >
              Sign Up
            </Typography>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"} // Toggle between text and password
              variant="outlined"
              fullWidth
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

          <Grid size={{ xs: 12 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSignUp}
              sx={{ fontWeight: "bold", height: "50px", fontSize: "16px" }}
            >
              Sign Up
            </Button>
          </Grid>

          <Grid size={{xs: 12}}>
            <Typography align="center" sx={{ mt: 1 }}>
              <Link
                component={RouterLink}
                to="/login"
                variant="body1"
                underline="hover"
                sx={{ color: "#1976d2", fontWeight: "bold" }}
              >
                Already have an account?
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

export default SignUp;
