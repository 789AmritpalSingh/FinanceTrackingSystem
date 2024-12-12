export const updateExpense = async (token, expenseToUpdate) => {
    try {
      const response = await fetch(
        `http://localhost:5000/update_expense/${expenseToUpdate.id}`,
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
  