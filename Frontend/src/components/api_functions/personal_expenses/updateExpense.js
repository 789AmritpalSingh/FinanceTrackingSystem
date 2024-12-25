const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const updateExpense = async (token, expenseToUpdate) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/update_expense/${expenseToUpdate.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(expenseToUpdate),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to update expense");
      }
  
      return await response.json();  // Return the updated expense
    } catch (error) {
      throw new Error(error.message || "Error updating expense");
    }
  };
  