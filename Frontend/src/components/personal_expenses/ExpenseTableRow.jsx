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
    <TableCell
      align="left"
      sx={{
        color: "#e0e0e0",
        fontSize: { xs: "10px", sm: "12px", md: "16px" }, // responsive font size
        whiteSpace: "nowrap", // prevent text wrapping
        overflow: "hidden",
        textOverflow: "ellipsis", // handle long text gracefully
      }}
    >
      ${expense.amount}
    </TableCell>
    <TableCell
      align="left"
      sx={{
        color: "#e0e0e0",
        fontSize: { xs: "10px", sm: "12px", md: "16px" },
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {expense.category}
    </TableCell>
    <TableCell
      align="left"
      sx={{
        color: "#e0e0e0",
        fontSize: { xs: "10px", sm: "12px", md: "16px" },
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {expense.date}
    </TableCell>
    <TableCell
      align="left"
      sx={{
        color: "#e0e0e0",
        fontSize: { xs: "10px", sm: "12px", md: "16px" },
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {expense.description}
    </TableCell>
    <TableCell align="right" sx={{textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
      <Tooltip title="Update Expense">
        <IconButton
          onClick={() => handleUpdateClick(expense)}
          sx={{ color: "#00e676", fontSize: { xs: "small", md: "medium" } }} // Responsive icon size
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete Expense">
        <IconButton
          onClick={() => handleDeleteClick(expense.id)}
          sx={{ color: "#ff1744", fontSize: { xs: "small", md: "medium" } }} // Responsive icon size
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </TableCell>
  </TableRow>
);

export default ExpenseTableRow;
