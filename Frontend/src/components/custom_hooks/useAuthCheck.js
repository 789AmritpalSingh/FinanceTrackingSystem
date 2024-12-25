import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../redux/authSlice";

// This custom hook is for automatically logging in the user if the user was logged in before.
const useAuthCheck = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const checkUserLoggedInStatus = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        // Logout the user if no token found
        dispatch(logout());
        navigate("/"); // Redirect to Landing Page
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/get_user_account_details`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Use JWT token for authentication
            },
          }
        );

        const data = await response.json();
        if (response.ok && data.is_logged_in === 0) {
          dispatch(login(data)); // User is logged in
          navigate("/personal_expenses"); // Redirect to personal expenses
        } else {
          dispatch(logout()); // User is not logged in
          navigate("/"); // Redirect to Landing Page
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        dispatch(logout()); // In case of error, consider user not logged in
        navigate("/"); // Redirect to Landing Page
      }
    };

    checkUserLoggedInStatus();
  }, [dispatch, navigate]);
};

export default useAuthCheck;
