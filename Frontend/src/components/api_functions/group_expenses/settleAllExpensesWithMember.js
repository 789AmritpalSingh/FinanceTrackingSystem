const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const settleAllExpensesWithMember = async (token, settleWithMemberId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/settle_all_expenses_with_user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ settle_with_user_id:  settleWithMemberId}),
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
  