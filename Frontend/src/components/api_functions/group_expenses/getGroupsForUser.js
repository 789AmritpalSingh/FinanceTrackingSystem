const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getGroupsForUser = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_group_names_for_user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to find groups for this user.");
      }
  
      const data = await response.json();
      return data.data; // Return the fetched groups
  
    } catch (error) {
      throw new Error(error.message || "Error getting any groups of this user.");
    }
  };
  