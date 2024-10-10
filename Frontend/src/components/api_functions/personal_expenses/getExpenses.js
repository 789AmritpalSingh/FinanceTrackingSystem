export const getExpenses = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/get_user_expenses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }
  
      return await response.json();  // Return the fetched data
    } catch (error) {
      throw new Error(error.message || "Error fetching expenses");
    }
  };
  