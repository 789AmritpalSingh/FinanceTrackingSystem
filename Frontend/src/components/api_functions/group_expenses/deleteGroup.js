export const deleteGroup = async (token, groupId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/delete_group/${groupId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to delete group");
      }
  
      return response.ok;  // Return success or failure as a boolean
    } catch (error) {
      throw new Error(error.message || "Error deleting group");
    }
  };
  