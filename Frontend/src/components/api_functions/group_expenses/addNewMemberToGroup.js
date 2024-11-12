export const addNewMemberToGroup = async (token, groupId, userName) => {
    try {
      const response = await fetch(
        "http://localhost:5000/add_new_member",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ group_id: groupId, username: userName }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to add new member");
      }
  
      return await response.json(); // returns the newly added member details
    } catch (error) {
      throw new Error(error.message || "Error adding new member");
    }
  };
  