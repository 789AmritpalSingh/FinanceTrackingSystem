export const getGroupMembers = async (token, groupId) => {
    try {
      const response = await fetch(`http://localhost:5000/get_group_members?group_id=${parseInt(groupId)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to get list of group members.");
      }
  
      const data = await response.json();
      return data.data; // Return the fetched group members
  
    } catch (error) {
      throw new Error(error.message || "Error getting group members list.");
    }
  };
  