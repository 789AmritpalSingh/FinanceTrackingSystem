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
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/authSlice";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // For toggling password visibility

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' or 'error'
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

      dispatch(login()); // Dispatch the login action

      // Navigate to the personal expenses
      navigate("/personal_expenses");
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

  // Handle key press event
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin(e); // Trigger login when Enter is pressed
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: { xs: 6, md: 8 },
          p: { xs: 3, md: 4 },
          borderRadius: "10px",
          boxShadow: 3,
          backgroundColor: "black",
        }}
      >
        <form onSubmit={handleLogin}>
          {" "}
          {/* Wrap in a form */}
          <Grid container spacing={2} maxWidth="400px">
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  color: "#00e676",
                  fontSize: { xs: "2rem", md: "2.5rem" },
                }} // Green for a standout effect
              >
                Login
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  input: { color: "white" }, // White text inside input
                  label: { color: "white" }, // White label
                  fieldset: { borderColor: "white" }, // White border
                  "& .MuiOutlinedInput-root:hover fieldset": {
                    borderColor: "#00e676",
                  }, // Green on hover
                  "& .MuiOutlinedInput-root:before": {
                    borderColor: "white", // Custom border before interaction
                  },
                  "& .MuiOutlinedInput-root:after": {
                    borderColor: "#00e676", // Green border after interaction
                  },
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 1000px black inset !important", // Black background for autofill
                    WebkitTextFillColor: "white !important", // White text color on autofill
                    transition: "background-color 5000s ease-in-out 0s", // Prevent flashing of the background color
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
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
                        sx={{ color: "white" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  input: { color: "white" }, // White text inside input
                  label: { color: "white" }, // White label
                  fieldset: { borderColor: "white" }, // White border
                  "& .MuiOutlinedInput-root:hover fieldset": {
                    borderColor: "#00e676",
                  }, // Green on hover
                  "& .MuiOutlinedInput-root:before": {
                    borderColor: "white", // Custom border before interaction
                  },
                  "& .MuiOutlinedInput-root:after": {
                    borderColor: "#00e676", // Green border after interaction
                  },
                  "& input:-webkit-autofill": {
                    WebkitBoxShadow: "0 0 0 1000px black inset !important", // Black background for autofill
                    WebkitTextFillColor: "white !important", // White text color on autofill
                    transition: "background-color 5000s ease-in-out 0s", // Prevent flashing of the background color
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  backgroundColor: "#089404",
                  fontWeight: "bold",
                  height: "50px",
                  fontSize: { xs: "14px", md: "16px" },
                  "&:hover": { backgroundColor: "#008000" }, // Darker green on hover
                }}
              >
                Login
              </Button>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography
                align="center"
                sx={{
                  mt: 1,
                  color: "white",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                }}
              >
                Don't have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/signup"
                  variant="body1"
                  underline="hover"
                  style={{
                    color: "#00e676",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
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
        </form>
      </Box>
    </Container>
  );
};

export default Login;
