const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const changeGroupCreator = async (token, groupId, newGroupCreatorUserId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/update_group_creator/${groupId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ new_creator_user_id: newGroupCreatorUserId }), // Send newGroupCreatorUserId in the request body
      });
  
      if (!response.ok) {
        throw new Error("Failed to change the group creator.");
      }
  
      const data = await response.json();
      return data.message; // Return success message
  
    } catch (error) {
      throw new Error(error.message || "Error changing group creator.");
    }
  };
  