const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const updateGroupExpense = async (token, expenseId, groupId, updatedExpenseData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/update_group_expense/${expenseId}/${groupId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedExpenseData), // Send updated expense data in the request body
      });
  
      if (!response.ok) {
        throw new Error("Failed to update expense.");
      }

      const data = await response.json();
      return data; // Return data
  
    } catch (error) {
      throw new Error(error.message || "Error updating expense.");
    }
  };
  