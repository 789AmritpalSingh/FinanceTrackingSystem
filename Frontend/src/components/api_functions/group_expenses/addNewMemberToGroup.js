const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const addNewMemberToGroup = async (token, groupId, userName) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/add_new_member`,
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
  