const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createGroup = async (token, groupName) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/create_group`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ group_name: groupName }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to create group");
      }
  
      return await response.json(); // It contains the newly created group details
    } catch (error) {
      throw new Error(error.message || "Error creating new group");
    }
  };
  