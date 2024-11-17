export const getGroupDetailsUsingGroupId = async (token, groupId) => {
    try {
      const response = await fetch(`http://localhost:5000/get_group_details_using_group_id?group_id=${parseInt(groupId)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to get group details for group id - ${groupId}.`);
      }
  
      const data = await response.json();
      return data.group_details; // Return the fetched group details
  
    } catch (error) {
      throw new Error(error.message || "Error getting group details.");
    }
  };
  