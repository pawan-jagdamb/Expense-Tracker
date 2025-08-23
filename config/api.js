// API Configuration for different environments
export const API_CONFIG = {
  // For Android Emulator
  android: {
    baseURL: 'http://10.0.2.2:8000',
  },
  // For iOS Simulator
  ios: {
    baseURL: 'http://localhost:8000',
  },
  // For physical device (replace with your computer's IP address)
  device: {
    baseURL: 'http://192.168.1.100:8000', // Replace with your actual IP
  },
};

// Get the appropriate base URL based on platform
export const getBaseURL = () => {
  // You can add logic here to detect platform or use environment variables
  // For now, we'll use Android emulator as default
  return API_CONFIG.android.baseURL;
};

// API endpoints
export const API_ENDPOINTS = {
  expenses: '/expenses',
  // Add more endpoints as needed
};