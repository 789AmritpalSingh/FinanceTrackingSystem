import { Box, Button, TextField } from "@mui/material";
import React from "react";

{/*Filter section - for filtering the expenses based on start date, end date and category. */}
const FilterExpense = ({
    filters,
    handleFilterChange,
    handleSearch
}) => (
  <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
    <TextField
      label="Start Date"
      type="date"
      name="start_date"
      value={filters.start_date}
      onChange={handleFilterChange}
      sx={{
        flexGrow: 0,
        backgroundColor: "#2C2C2C",
        borderRadius: "20px", // Set the TextField's border radius
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderRadius: "20px", // Match the TextField's border radius
            borderColor: "transparent", // Set initial border color
          },
          "&:hover fieldset": {
            borderColor: "#00e676", // Border color on hover
          },
          "&.Mui-focused fieldset": {
            borderColor: "#00e676", // Border color when focused
          },
        },
      }}
      InputLabelProps={{
        shrink: true,
        style: { color: "#00e676" },
      }}
      InputProps={{
        style: { color: "white" },
      }}
    />
    <TextField
      label="End Date"
      type="date"
      name="end_date"
      value={filters.end_date}
      onChange={handleFilterChange}
      sx={{
        flexGrow: 0,
        backgroundColor: "#2C2C2C",
        borderRadius: "20px", // Set the TextField's border radius
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderRadius: "20px", // Match the TextField's border radius
            borderColor: "transparent", // Set initial border color
          },
          "&:hover fieldset": {
            borderColor: "#00e676", // Border color on hover
          },
          "&.Mui-focused fieldset": {
            borderColor: "#00e676", // Border color when focused
          },
        },
      }}
      InputLabelProps={{
        shrink: true,
        style: { color: "#00e676" },
      }}
      InputProps={{
        style: { color: "white" },
      }}
    />
    <TextField
      label="Category"
      name="category"
      value={filters.category}
      onChange={handleFilterChange}
      sx={{
        flexGrow: 0,
        backgroundColor: "#2C2C2C",
        borderRadius: "20px", // Set the TextField's border radius
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderRadius: "20px", // Match the TextField's border radius
            borderColor: "transparent", // Set initial border color
          },
          "&:hover fieldset": {
            borderColor: "#00e676", // Border color on hover
          },
          "&.Mui-focused fieldset": {
            borderColor: "#00e676", // Border color when focused
          },
        },
      }}
      InputLabelProps={{
        style: { color: "#00e676" },
      }}
      InputProps={{
        style: { color: "white" },
      }}
    />
    <Button
      variant="text"
      onClick={handleSearch}
      sx={{
        minWidth: "150px",
        bgcolor: "#089404", // Button color to match the focus border color
        "&:hover": {
          bgcolor: "#008000", // Darker shade for hover
        },
        borderRadius: "20px", // Add border radius here
        fontSize: "16px",
        fontWeight: "bold",
        color: "white",
        height: "50px"
      }}
    >
      Search
    </Button>
  </Box>
);

export default FilterExpense;
