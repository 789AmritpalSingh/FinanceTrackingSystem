import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { login, logout } from "../redux/authSlice";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true); // New loading state
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // Access the authentication state from Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserLoggedInStatus = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        // Logout the user if the token is not available
        dispatch(logout());
        setLoading(false); // Done loading
        navigate("/login"); // Navigate to the landing page
        return;
      }

      // Further check to make sure the user is actually logged in
      try {
        const user_details = await fetch(
          "http://localhost:5000/get_user_account_details",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Use JWT token for authentication
            },
          }
        );

        const data = await user_details.json();

        if (user_details.ok && data.is_logged_in === 0) {
          dispatch(login()); // User is logged in
        } else {
          // Call logout API if user is not logged in or token is invalid
          try {
            const update_log_out_response = await fetch(
              "http://localhost:5000/update_user_log_out",
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (update_log_out_response.ok) {
              // Remove the token from localStorage
              localStorage.removeItem("token");
              dispatch(logout()); // User is not logged in
            } else {
              console.error("Failed to update logout status");
            }
          } catch (error) {
            console.error("Error logging out:", error);
          }
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        dispatch(logout()); // In case of error, consider the user not logged in
      } finally {
        setLoading(false); // Done loading
      }
    };

    checkUserLoggedInStatus();
  }, [dispatch, navigate]);

  if (loading) {
    // While loading, show a loading spinner or message
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // If user is not authenticated, redirect to the login page
    console.log("User is not logged in");
    return <Navigate to="/login" />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
