import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";

const PersonalExpenses = () => {
  const [expenses, setExpenses] = useState([]); // for storing the expense details
  const [loading, setLoading] = useState(true); 

  // Fetch expenses from backend
  const fetchExpenses = async () => {
    const token = localStorage.getItem("token"); // Get JWT token from local storage

    try {
      const response = await fetch("http://localhost:5000/get_user_expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setExpenses(data); // Store fetched expenses in state
      } else {
        console.error("Failed to fetch expenses.");
        setExpenses([]);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  // Fetch expenses on component mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{color: "white"}}>
          Personal Expenses
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress /> {/* Show loader while fetching data */}
          </Box>
        ) : expenses.length === 0 ? (
          <Typography align="center" color="textSecondary" sx={{ mt: 4 }}>
            No expenses found.
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Amount</TableCell>
                  <TableCell align="left">Category</TableCell>
                  <TableCell align="left">Date</TableCell>
                  <TableCell align="left">Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell align="left">${expense.amount}</TableCell>
                    <TableCell align="left">{expense.category}</TableCell>
                    <TableCell align="left">{expense.date}</TableCell>
                    <TableCell align="left">{expense.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};

export default PersonalExpenses;
