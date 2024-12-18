import React from "react";
import { Avatar, Box, Button, Divider, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ReceiptIcon from "@mui/icons-material/Receipt"; // Importing the Receipt icon

const BalanceAndExpensesDisplay = ({
  formattedTotalBalance,
  balances,
  members,
  loggedInUsername,
  expenses,
  loggedInUserId,
  creatorUserId,
  handleUpdateExpenseModalOpen,
  setExpenseToDelete,
  setConfirmDeleteOpen,
  formatDate,
}) => (
  <>
    <Typography
      variant="body1"
      sx={{
        color: "#4CAF50",
        fontWeight: "bold",
        mb: 2,
        mt: 2,
        background: "linear-gradient(45deg, #333, #1E1E1E)",
        p: 2,
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0, 150, 0, 0.2)",
      }}
    >
      {formattedTotalBalance}
    </Typography>
    {balances.length > 0 && (
      <Grid container spacing={2}>
        {balances.map((balance) => {
          const member = members.find(
            (m) => m.user_id === balance.other_user_id
          );
          const username = member?.username || "Unknown";
          const isOwed = balance.balance > 0;
          const formattedBalance = Math.abs(balance.balance).toFixed(2);
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={balance.other_user_id}>
              <Paper
                elevation={3}
                sx={{ p: 2, bgcolor: "#333", borderRadius: 2 }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: isOwed ? "#4CAF50" : "#FF5722",
                    fontWeight: "medium",
                  }}
                >
                  {username}: ${formattedBalance}
                </Typography>
                <Typography variant="body2" sx={{ color: "#CCC" }}>
                  {isOwed
                    ? `You are owed $${formattedBalance} by ${username}`
                    : `You owe $${formattedBalance} to ${username}`}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    )}
    <Divider sx={{ my: 4, bgcolor: "#555" }} /> {/* Divider after balances */}
    <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
      <Avatar sx={{ bgcolor: "#FF5722", width: 36, height: 36, mr: 2 }}>
        <ReceiptIcon sx={{ color: "#FFF" }} />
      </Avatar>
      <Typography variant="h5" sx={{ color: "#FF5722", fontWeight: "bold" }}>
        Expenses
      </Typography>
    </Box>
    {expenses.length > 0
      ? expenses.map((expense) => {
          const displayName =
            expense.username === loggedInUsername
              ? "You"
              : expense.username || "Unknown";
          const formattedAmount = parseFloat(expense.amount).toFixed(2);
          const userShare = expense.shares?.find(
            (share) => share.user_id === loggedInUserId
          );
          let userInvolvementMessage = "You are not involved";
          if (userShare) {
            const shareAmount = parseFloat(userShare.share_amount).toFixed(2);
            userInvolvementMessage =
              expense.paid_by === loggedInUserId
                ? `You lent $${shareAmount}`
                : `You borrowed $${shareAmount}`;
          }
          const canDeleteAndEdit =
            loggedInUserId === creatorUserId ||
            loggedInUserId === expense.paid_by;
          return (
            <Paper
              key={expense.id}
              elevation={3}
              sx={{ my: 2, p: 2, bgcolor: "#333", borderRadius: 2 }}
            >
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: "#FFF", fontWeight: "medium" }}
              >
                {expense.expense_name}
              </Typography>
              <Typography variant="body2" sx={{ color: "#CCC" }}>
                Amount: ${formattedAmount} - Paid by: {displayName} - Date:{" "}
                {formatDate(expense.date)}
              </Typography>
              <Typography variant="body2" sx={{ color: "#CCC" }}>
                {userInvolvementMessage}
              </Typography>
              {canDeleteAndEdit && (
                <Box
                  sx={{
                    mt: 1,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleUpdateExpenseModalOpen(expense)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      setExpenseToDelete(expense.id);
                      setConfirmDeleteOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </Paper>
          );
        })
      : null}
  </>
);

export default BalanceAndExpensesDisplay;
