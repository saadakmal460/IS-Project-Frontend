// /src/api/api.js
import axios from "axios";

// Create an axios instance with a base URL (replace with your actual API URL)
const apiClient = axios.create({
  baseURL: "http://localhost:5000/api/v1/users", // Replace with your API base URL
});

// Fetch all data from a given URL
export const fetchAll = async (url) => {
  try {
    const response = await apiClient.get(url);
    return response.data; // Return the fetched data
  } catch (error) {
    throw new Error(`Failed to fetch data from ${url}: ${error.message}`);
  }
};

// Fetch a single item by ID from a given URL
export const fetchOne = async (url, id) => {
  try {
    const response = await apiClient.get(`${url}/${id}`);
    return response.data; // Return data for the single item
  } catch (error) {
    throw new Error(`Failed to fetch item with ID ${id} from ${url}: ${error.message}`);
  }
};

// Fetch data with query parameters from a given URL
export const fetchWithQueryParams = async (url, params) => {
  try {
    const response = await apiClient.get(url, { params });
    return response.data; // Return data filtered by query params
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data.message || "An error occurred";
      throw new Error(errorMessage);
    }
    else if (error.request) {
      throw new Error("Network Error: Unable to reach the server.");
    }

    else {
      throw new Error(error.message || "Something went wrong.");
    }
  }
};

// Create a new item (POST request) at a given URL
export const create = async (url, data) => {
  try {
    const response = await apiClient.post(url, data);
    return response;
  } catch (error) {
    if (error.response) {
      
      const errorMessage = error.response.data.message || "An error occurred";
      throw new Error(errorMessage);
    }
    else if (error.request) {
      throw new Error("Network Error: Unable to reach the server.");
    }

    else {
      throw new Error(error.message || "Something went wrong.");
    }
  }
};

export const createWithAuth = async (url, data, config = {}) => {
  try {
    const response = await apiClient.post(url, data, config);
    return response;
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data.message || "An error occurred";
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("Network Error: Unable to reach the server.");
    } else {
      throw new Error(error.message || "Something went wrong.");
    }
  }
};

export const createBlobWithAuth = async (url, data, config = {}) => {
  try {
    const response = await apiClient.post(url, data, {
      responseType: 'blob', // important for binary data like Excel/PDF
      ...config,
    });
    return response;
  } catch (error) {
    if (error.response && error.response.data) {
      // Try to read error from blob
      const text = await error.response.data.text();
      try {
        const parsed = JSON.parse(text);
        const errorMessage = parsed.message || "An error occurred";
        throw new Error(errorMessage);
      } catch {
        throw new Error("An error occurred while processing the file.");
      }
    } else if (error.request) {
      throw new Error("Network Error: Unable to reach the server.");
    } else {
      throw new Error(error.message || "Something went wrong.");
    }
  }
};



export const upload = async (url, data, config = {}) => {
  try {
    const response = await apiClient.post(url, data, config);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error.response?.data?.message || "Upload failed");
  }
};





// Update an existing item by ID (PUT request) at a given URL
export const update = async (url, id, data) => {
  try {
    const response = await apiClient.put(`${url}/${id}`, data);
    return response.data; // Return updated item data
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data.message || "An error occurred";
      throw new Error(errorMessage);
    }
    else if (error.request) {
      throw new Error("Network Error: Unable to reach the server.");
    }

    else {
      throw new Error(error.message || "Something went wrong.");
    }
  }
};

// Delete an item by ID (DELETE request) from a given URL
export const remove = async (url, id) => {
  try {
    const response = await apiClient.delete(`${url}/${id}`);
    return response.data; // Return confirmation of deletion
  } catch (error) {
    throw new Error(`Failed to delete item with ID ${id} from ${url}: ${error.message}`);
  }
};