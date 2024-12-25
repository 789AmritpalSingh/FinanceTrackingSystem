const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const removeGroupMember = async (token, memberId, groupId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/delete_group_member/${memberId}/${groupId}`,
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
