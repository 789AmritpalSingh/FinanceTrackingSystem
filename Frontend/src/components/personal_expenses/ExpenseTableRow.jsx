import React from "react";
import { TableRow, TableCell, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ExpenseTableRow = ({ expense, handleUpdateClick, handleDeleteClick }) => (
  <TableRow
    sx={{
      "&:nth-of-type(odd)": { backgroundColor: "#252525" },
      "&:nth-of-type(even)": { backgroundColor: "#1A1A1A" },
    }}
  >
    <TableCell align="left" sx={{ color: "#e0e0e0" }}>
      ${expense.amount}
    </TableCell>
    <TableCell align="left" sx={{ color: "#e0e0e0" }}>
      {expense.category}
    </TableCell>
    <TableCell align="left" sx={{ color: "#e0e0e0" }}>
      {expense.date}
    </TableCell>
    <TableCell align="left" sx={{ color: "#e0e0e0" }}>
      {expense.description}
    </TableCell>
    <TableCell align="right">
      <Tooltip title="Update Expense">
        <IconButton
          onClick={() => handleUpdateClick(expense)}
          sx={{ color: "#00e676" }}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete Expense">
        <IconButton
          onClick={() => handleDeleteClick(expense.id)}
          sx={{ color: "#ff1744" }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </TableCell>
  </TableRow>
);

export default ExpenseTableRow;
