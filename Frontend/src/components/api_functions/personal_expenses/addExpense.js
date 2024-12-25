const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const addExpense = async (token, newExpense) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/add_individual_expense`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newExpense),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to add expense");
      }
  
      return await response.json();  // Return the data containing the expense ID
    } catch (error) {
      throw new Error(error.message || "Error adding expense");
    }
  };
  