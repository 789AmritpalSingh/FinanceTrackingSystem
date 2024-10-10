export const addExpense = async (token, newExpense) => {
    try {
      const response = await fetch(
        "http://localhost:5000/add_individual_expense",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newExpense),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to add expense");
      }
  
      return await response.json();  // Return the data containing the expense ID
    } catch (error) {
      throw new Error(error.message || "Error adding expense");
    }
  };
  