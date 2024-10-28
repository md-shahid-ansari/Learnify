import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL; // Replace with your actual backend URL

// Function that checks if the admin session is live and returns the admin data
export const IsAdminSessionLive = async () => {
  try {
    const response = await axios.get(`${URL}/api/auth/admin-auth`, {
      withCredentials: true, // Ensure that cookies (like the JWT) are sent with the request
    });

    if (response.data.success) {
      // Session is live, return admin data along with success flag
      return { isAuthenticated: true, adminData: response.data.admin };
    } else {
      // Session is not live, return an unauthenticated state
      return { isAuthenticated: false, adminData: null };
    }
  } catch (err) {
    console.error('Error checking session:', err);
    // Return an error state and no admin data
    return { isAuthenticated: false, adminData: null, error: err.message };
  }
};
