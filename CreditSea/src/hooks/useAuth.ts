import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { loginUser, logoutUser } from "../slices/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      const storedToken = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (storedToken && userId && !user) {
        try {
          const response = await fetch(`/api/user/single/${userId}`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            dispatch(loginUser({ user: data.user, token: storedToken }));
          } else {
            // Token invalid or expired
            dispatch(logoutUser());
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          dispatch(logoutUser());
        }
      }
    };

    // Only fetch user profile if we have a token but no user
    if (token && !user) {
      fetchUserProfile();
    }
  }, [token, user, dispatch]);

  return {
    user,
    token,
    isAuthenticated,
    logout: () => dispatch(logoutUser()),
  };
};
