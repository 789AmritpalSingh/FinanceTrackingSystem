const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const deleteExpense = async (token, expenseId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/delete_expense/${expenseId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }
  
      return response.ok;  // Return success or failure as a boolean
    } catch (error) {
      throw new Error(error.message || "Error deleting expense");
    }
  };
  