export const deleteExpense = async (token, expenseId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/delete_expense/${expenseId}`,
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
  