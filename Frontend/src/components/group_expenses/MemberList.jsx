import React from "react";
import {
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Divider,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const MemberList = ({
  members,
  loading,
  loggedInUserId,
  creatorUserId,
  loggedInUsername,
  onDeleteMember,
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        mt: 2,
        backgroundColor: "#262626",
        borderRadius: 3,
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)",
        maxHeight: "300px",
        overflowY: "auto",
      }}
    >
      {loading ? (
        <Typography sx={{ textAlign: "center", color: "#FFF" }}>
          Loading...
        </Typography>
      ) : (
        <List>
          {members.map((member) => (
            <React.Fragment key={member.id}>
              <ListItem
                secondaryAction={
                  loggedInUserId === creatorUserId &&
                  loggedInUsername !== member.username && (
                    <IconButton
                      edge="end"
                      onClick={() => onDeleteMember(member.id)}
                      sx={{
                        backgroundColor: "#333",
                        "&:hover": { backgroundColor: "#FF5252" },
                      }}
                    >
                      <DeleteIcon sx={{ color: "#FF5252" }} />
                    </IconButton>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "#777", color: "#fff" }}>
                    {member.username[0].toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    member.username === loggedInUsername
                      ? "You"
                      : member.username
                  }
                  primaryTypographyProps={{
                    fontWeight: "bold",
                    color: "#F0DB4F",
                    fontSize: "1rem",
                  }}
                />
              </ListItem>
              <Divider sx={{ backgroundColor: "#444" }} />
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default MemberList;
