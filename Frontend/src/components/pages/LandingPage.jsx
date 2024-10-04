import React from "react";
import { Container, Typography, Button, Box, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";

const LandingPage = () => {
  return (
    <Box
      sx={{
        background: "#1A1A1A",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: "15px",
            background: "black",
            boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
            ":hover": {
              boxShadow: "0 4px 20px rgba(0,0,0,0.7)",
            },
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#00e676",
            }}
          >
            Welcome to Finance Tracker
          </Typography>
          <Typography variant="h6" sx={{ color: "white" }}>
            A smart way to manage your personal and group expenses. Keep track
            of your spending, settle group expenses with friends, and gain
            insights into your finances.
          </Typography>

          <Box sx={{ mt: 6 }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: "#1976d2",
              }}
            >
              Features
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: "10px",
                    backgroundColor: "#333333",
                    height: "100%",
                    ":hover": {
                      boxShadow: "0 4px 20px rgba(0,0,0,0.7)",
                    },
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: "bold", color: "#00e676" }}>
                    Track Personal Expenses
                  </Typography>
                  <Typography variant="body2" sx={{color: "white"}}>
                    Monitor your personal expenses easily.
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: "10px",
                    backgroundColor: "#333333",
                    height: "100%",
                    ":hover": {
                      boxShadow: "0 4px 20px rgba(0,0,0,0.7)",
                    },
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: "bold", color: "#00e676" }}>
                    Manage Group Expenses
                  </Typography>
                  <Typography variant="body2" sx={{color: "white"}}>
                    Split bills and settle debts with your friends.
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: "10px",
                    backgroundColor: "#333333",
                    height: "100%",
                    ":hover": {
                      boxShadow: "0 4px 20px rgba(0,0,0,0.7)",
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#00e676" }}>
                    Detailed Analytics
                  </Typography>
                  <Typography variant="body2" sx={{color: "white"}}>
                    Get insights on where you are spending the most.
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: "10px",
                    backgroundColor: "#333333",
                    height: "100%",
                    ":hover": {
                      boxShadow: "0 4px 20px rgba(0,0,0,0.7)",
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#00e676" }}>
                    Real-time Notifications
                  </Typography>
                  <Typography variant="body2" sx={{color: "white"}}>
                    Receive alerts on payments and settlements.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LandingPage;
