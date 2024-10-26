import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL; // Replace with your actual backend URL

// Function that checks if the mentor session is live and returns the mentor data
export const IsMentorSessionLive = async () => {
  try {
    const response = await axios.get(`${URL}/api/auth/mentor-auth`, {
      withCredentials: true, // Ensure that cookies (like the JWT) are sent with the request
    });

    if (response.data.success) {
      // Session is live, return mentor data along with success flag
      return { isAuthenticated: true, mentorData: response.data.mentor};
    } else {
      // Session is not live, return an unauthenticated state
      return { isAuthenticated: false, mentorData: null };
    }
  } catch (err) {
    console.error('Error checking session:', err);
    // Return an error state and no mentor data
    return { isAuthenticated: false, mentorData: null, error: err.message };
  }
};