export const removeGroupMember = async (token, memberId, groupId) => {
  try {
    const response = await fetch(
      `http://localhost:5000/delete_group_member/${memberId}/${groupId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to remove group member");
    }

    const data = await response.json();
    return data.message;  // Return the success message from the backend
    
  } catch (error) {
    throw new Error(error.message || "Error removing member from the group");
  }
};
