const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const deleteExpense = async (token, expenseId, groupId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/delete_expense/${expenseId}/${groupId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json(); // Parse the error response
      throw new Error(errorData.message || "Failed to delete expense");
    }

    const data = await response.json(); // Parse the success response
    return data; // Return the response data, e.g., message, updated balances
  } catch (error) {
    throw new Error(error.message || "Error deleting expense");
  }
};
