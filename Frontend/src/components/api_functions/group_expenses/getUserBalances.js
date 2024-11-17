export const getUserBalances = async (token, groupId) => {
    try {
      const response = await fetch(`http://localhost:5000/get_user_balances?group_id=${groupId}`, {
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
  