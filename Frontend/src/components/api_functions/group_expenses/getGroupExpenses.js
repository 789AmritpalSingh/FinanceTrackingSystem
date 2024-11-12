export const getGroupExpenses = async (token, groupId) => {
    try {
      const response = await fetch(`http://localhost:5000/get_group_expenses?group_id=${parseInt(groupId)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to find any expense in this group.");
      }
  
      const data = await response.json();
      return data.data; // Return the fetched group expenses.
  
    } catch (error) {
      throw new Error(error.message || "Error getting group expenses.");
    }
  };
  