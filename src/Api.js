import axios from 'axios';

const apiUrl = 'http://localhost:3001'; // Replace with your backend API URL

// Example function to fetch data from API
export const fetchData = async () => {
  try {
    const response = await axios.get(`${apiUrl}/data`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Add more functions for other API endpoints as needed