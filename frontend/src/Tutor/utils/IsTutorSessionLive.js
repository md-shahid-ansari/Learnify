import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL; // Replace with your actual backend URL

// Function that checks if the tutor session is live and returns the tutor data
export const IsTutorSessionLive = async () => {
  try {
    const response = await axios.get(`${URL}/api/auth/tutor-auth`, {
      withCredentials: true, // Ensure that cookies (like the JWT) are sent with the request
    });

    if (response.data.success) {
      // Session is live, return tutor data along with success flag
      return { isAuthenticated: true, tutorData: response.data.tutor };
    } else {
      // Session is not live, return an unauthenticated state
      return { isAuthenticated: false, tutorData: null };
    }
  } catch (err) {
    console.error('Error checking session:', err);
    // Return an error state and no tutor data
    return { isAuthenticated: false, tutorData: null, error: err.message };
  }
};
