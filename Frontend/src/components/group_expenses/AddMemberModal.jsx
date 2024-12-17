import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button } from "@mui/material";

const AddMemberModal = ({ open, onClose, onAddMember }) => {
  const [username, setUsername] = useState("");

  const handleSubmit = () => {
    if (username.trim()) {
      onAddMember(username);
      setUsername("");
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          backgroundColor: "#2C2C2C",
          color: "#DDD",
          borderRadius: "12px",
        },
      }}
    >
      <DialogTitle sx={{ color: "#FFF" }}>Add New Member</DialogTitle>
      <DialogContent>
        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          sx={{
            marginBottom: 2,
            backgroundColor: "#333",
            borderRadius: 1,
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": { borderColor: "#555" },
              "&:hover fieldset": { borderColor: "#00e676" },
            },
            "& .MuiInputLabel-root": { color: "#ccc" },
          }}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{
            background: "#089404",
            color: "white",
            fontWeight: "bold",
            borderRadius: "8px",
            "&:hover": { background: "#008000" },
          }}
        >
          Add Member
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberModal;
