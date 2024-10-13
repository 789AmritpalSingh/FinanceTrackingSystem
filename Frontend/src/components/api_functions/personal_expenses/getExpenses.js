export const getExpenses = async (token, start_date, end_date, category) => {
    try {

      // Build query parameters string based on available filters
      // URLSearchParams: This is used to dynamically append the query parameters (start_date, end_date, and category) to the API URL
      const params = new URLSearchParams();

      if(start_date) params.append("start_date", start_date);
      if(end_date) params.append("end_date", end_date);
      if(category) params.append("category", category);

      const response = await fetch(`http://localhost:5000/get_user_expenses?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }
  
      return await response.json();  // Return the fetched data
    } catch (error) {
      throw new Error(error.message || "Error fetching expenses");
    }
  };
  