import axios from 'axios';

const URL = process.env.REACT_APP_BACKEND_URL; // Replace with your actual backend URL

// Function that checks if the company session is live and returns the company data
export const IsCompanySessionLive = async () => {
  try {
    const response = await axios.get(`${URL}/api/auth/company-auth`, {
      withCredentials: true, // Ensure that cookies (like the JWT) are sent with the request
    });

    if (response.data.success) {
      // Session is live, return company data along with success flag
      return { isAuthenticated: true, companyData: response.data.company};
    } else {
      // Session is not live, return an unauthenticated state
      return { isAuthenticated: false, companyData: null };
    }
  } catch (err) {
    console.error('Error checking session:', err);
    // Return an error state and no company data
    return { isAuthenticated: false, companyData: null, error: err.message };
  }
};