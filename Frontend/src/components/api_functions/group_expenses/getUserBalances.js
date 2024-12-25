const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUserBalances = async (token, groupId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_user_balances?group_id=${groupId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch balances.");
      }
  
      const data = await response.json();
      return data.balances;
    } catch (error) {
      throw new Error(error.message || "Error fetching balances.");
    }
  };
  