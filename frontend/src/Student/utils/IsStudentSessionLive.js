import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL; // Replace with your actual backend URL

// Function that checks if the student session is live and returns the student data
export const IsStudentSessionLive = async () => {
  try {
    const response = await axios.get(`${URL}/api/auth/student-auth`, {
      withCredentials: true, // Ensure that cookies (like the JWT) are sent with the request
    });

    if (response.data.success) {
      // Session is live, return student data along with success flag
      return { isAuthenticated: true, studentData: response.data.student};
    } else {
      // Session is not live, return an unauthenticated state
      return { isAuthenticated: false, studentData: null };
    }
  } catch (err) {
    console.error('Error checking session:', err);
    // Return an error state and no student data
    return { isAuthenticated: false, studentData: null, error: err.message };
  }
};