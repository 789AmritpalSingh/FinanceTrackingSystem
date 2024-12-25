const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const deleteGroup = async (token, groupId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/delete_group/${groupId}`,
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
  