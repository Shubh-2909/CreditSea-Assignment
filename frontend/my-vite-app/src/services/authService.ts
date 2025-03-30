// src/services/authService.ts

import axios from "axios";

const API_URL = "http://localhost:4000/users";

export const registerUser = async (userData: {
  fullName: string;
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};
