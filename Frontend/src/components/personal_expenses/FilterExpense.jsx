import { Box, Button, TextField } from "@mui/material";
import React from "react";

{
  /*Filter section - for filtering the expenses based on start date, end date and category. */
}
const FilterExpense = ({ filters, handleFilterChange, handleSearch }) => (
  <Box
    sx={{
      flexGrow: 1,
      display: "flex",
      flexWrap: "wrap", // Enable wrapping for smaller screens
      gap: 2,
      // justifyContent: "space-between", // Space out elements on larger screens
      alignItems: "center", // Ensure alignment in center
    }}
  >
    <TextField
      label="Start Date"
      type="date"
      name="start_date"
      value={filters.start_date}
      onChange={handleFilterChange}
      sx={{
        flexGrow: 0,
        minWidth: { xs: "100%", sm: "150px", md: "200px" }, // Responsive width
        backgroundColor: "#2C2C2C",
        borderRadius: "20px", // Set the TextField's border radius
        "& .MuiOutlinedInput-root": {
          height: { xs: "40px", md: "50px" }, // Smaller height for mobile
          fontSize: { xs: "14px", md: "16px" }, // Smaller font size for mobile
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
        minWidth: { xs: "100%", sm: "150px", md: "200px" }, // Responsive width
        backgroundColor: "#2C2C2C",
        borderRadius: "20px", // Set the TextField's border radius
        "& .MuiOutlinedInput-root": {
          height: { xs: "40px", md: "50px" }, // Smaller height for mobile
          fontSize: { xs: "14px", md: "16px" }, // Smaller font size for mobile
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
        minWidth: { xs: "100%", sm: "150px", md: "200px" }, // Responsive width
        backgroundColor: "#2C2C2C",
        borderRadius: "20px", // Set the TextField's border radius
        "& .MuiOutlinedInput-root": {
          height: { xs: "40px", md: "50px" }, // Smaller height for mobile
          fontSize: { xs: "14px", md: "16px" }, // Smaller font size for mobile
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
        shrink: true
      }}
      InputProps={{
        style: { color: "white" },
      }}
    />
    <Button
      variant="text"
      onClick={handleSearch}
      sx={{
        minWidth: { xs: "100%", sm: "150px" }, // Button width is responsive
        bgcolor: "#089404", // Button color to match the focus border color
        "&:hover": {
          bgcolor: "#008000", // Darker shade for hover
        },
        borderRadius: "20px", // Add border radius here
        fontSize: { xs: "14px", md: "16px" }, // Responsive font size
        fontWeight: "bold",
        color: "white",
        height: { xs: "40px", md: "50px" }, // Adjust height for smaller screens
      }}
    >
      Search
    </Button>
  </Box>
);

export default FilterExpense;
