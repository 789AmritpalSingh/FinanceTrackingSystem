import React from "react";
import { Container, Typography, Button, Box, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";

const LandingPage = () => {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #F3F4F6, #E5E7EB)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 4 }}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: "15px",
            background: "#fff",
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#333" }}
          >
            Welcome to Finance Tracker
          </Typography>
          <Typography variant="h6" sx={{ color: "#555" }}>
            A smart way to manage your personal and group expenses. Keep track
            of your spending, settle group expenses with friends, and gain
            insights into your finances.
          </Typography>

          <Box sx={{ mt: 6 }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#1976d2" }}
            >
              Features
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid size={{xs: 12, sm: 6}}>
                <Paper
                  elevation={3}
                  sx={{ p: 3, borderRadius: "10px", height: "100%" }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Track Personal Expenses
                  </Typography>
                  <Typography>
                    Monitor your personal expenses easily.
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{xs: 12, sm: 6}}>
                <Paper
                  elevation={3}
                  sx={{ p: 3, borderRadius: "10px", height: "100%" }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Manage Group Expenses
                  </Typography>
                  <Typography>
                    Split bills and settle debts with your friends.
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{xs: 12, sm: 6}}>
                <Paper
                  elevation={3}
                  sx={{ p: 3, borderRadius: "10px", height: "100%" }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Detailed Analytics
                  </Typography>
                  <Typography>
                    Get insights on where you are spending the most.
                  </Typography>
                </Paper>
              </Grid>
              <Grid size={{xs: 12, sm: 6}}>
                <Paper
                  elevation={3}
                  sx={{ p: 3, borderRadius: "10px", height: "100%" }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Real-time Notifications
                  </Typography>
                  <Typography>
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
