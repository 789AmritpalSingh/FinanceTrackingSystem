export const addNewExpenseToGroup = async (token, newExpenseData) => {
    try {
      const response = await fetch(
        "http://localhost:5000/add_new_expense_to_group",
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
  
      const data = await response.json()
      return data.message; 
    } catch (error) {
      throw new Error(error.message || "Error adding expense");
    }
  };
  