export const settleExpense = async (token, expenseId, memberId) => {
    try {
      const response = await fetch(`http://localhost:5000/settle_expense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ expense_id: expenseId, member_id: memberId }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to settle expense.");
      }
  
      const data = await response.json();
      return data.message; // Return success message
  
    } catch (error) {
      throw new Error(error.message || "Error settling expense.");
    }
  };
  