import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 120000, // 2 minutes timeout for analysis
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.message);
    
    // Handle specific error cases
    if (error.response?.status === 413) {
      throw new Error('File too large. Maximum size is 50MB.');
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data.detail || 'Invalid request. Please check your file format.');
    } else if (error.response?.status === 429) {
      throw new Error('Too many requests. Please wait a moment before trying again.');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to analysis server. Please ensure the backend is running.');
    } else if (error.code === 'TIMEOUT') {
      throw new Error('Analysis timed out. Please try with a smaller contract or try again later.');
    }
    
    return Promise.reject(error);
  }
);

/**
 * Analyze a smart contract file
 * @param {File} file - The contract file to analyze
 * @returns {Promise<Object>} Analysis results
 */
export const analyzeContract = async (file) => {
  try {
    // Validate file before sending
    if (!file) {
      throw new Error('No file provided');
    }

    if (!file.name.endsWith('.sol') && !file.name.endsWith('.vy')) {
      throw new Error('Invalid file type. Please upload a .sol or .vy file.');
    }

    if (file.size > 50 * 1024 * 1024) {
      throw new Error('File too large. Maximum size is 50MB.');
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);

    // Make request with proper headers for file upload
    const response = await api.post('/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Show upload progress
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Upload Progress: ${percentCompleted}%`);
      },
    });

    // Validate response structure
    if (!response.data) {
      throw new Error('Invalid response from server');
    }

    return response.data;
  } catch (error) {
    console.error('Contract analysis failed:', error);
    throw error;
  }
};

/**
 * Get sample vulnerable contracts
 * @returns {Promise<Object>} List of sample contracts
 */
export const getSampleContracts = async () => {
  try {
    const response = await api.get('/sample-contracts');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch sample contracts:', error);
    throw new Error('Failed to load sample contracts');
  }
};

/**
 * Get a specific sample contract
 * @param {string} contractName - Name of the contract file
 * @returns {Promise<Object>} Contract content and metadata
 */
export const getSampleContract = async (contractName) => {
  try {
    const response = await api.get(`/sample-contracts/${contractName}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch sample contract:', error);
    throw new Error(`Failed to load contract: ${contractName}`);
  }
};

/**
 * Health check endpoint
 * @returns {Promise<Object>} Health status
 */
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw new Error('Service unavailable');
  }
};

/**
 * Get API root information
 * @returns {Promise<Object>} API information
 */
export const getApiInfo = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch API info:', error);
    throw new Error('Cannot connect to API');
  }
};

/**
 * Utility function to check if backend is running
 * @returns {Promise<boolean>} True if backend is accessible
 */
export const checkBackendStatus = async () => {
  try {
    await healthCheck();
    return true;
  } catch (error) {
    return false;
  }
};

// Export the axios instance for custom requests
export { api };

// Default export
export default {
  analyzeContract,
  getSampleContracts,
  getSampleContract,
  healthCheck,
  getApiInfo,
  checkBackendStatus,
};