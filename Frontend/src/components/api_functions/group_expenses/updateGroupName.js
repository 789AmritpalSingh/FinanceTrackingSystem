const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const updateGroupName = async (token, groupId, newGroupName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/update_group_name/${groupId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ new_group_name: newGroupName }), // Send newGroupName in the request body
      });
  
      if (!response.ok) {
        throw new Error("Failed to update group name.");
      }
  
      const data = await response.json();
      return data.message; // Return success message
  
    } catch (error) {
      throw new Error(error.message || "Error updating group name.");
    }
  };
  