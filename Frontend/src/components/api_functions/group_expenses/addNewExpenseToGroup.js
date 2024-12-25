const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const addNewExpenseToGroup = async (token, newExpenseData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/add_new_expense_to_group`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newExpenseData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add expense");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || "Error adding expense");
  }
};
