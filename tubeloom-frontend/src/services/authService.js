import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const API = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

//API Call to Backend Auth Service
export const authenticateWithGoogle = async (credential) => {
    const response = await API.post('/api/auth/google', {credential});
    return response.data;
}

//Session Management Helpers
export const saveUserSession = (userData) => {
    localStorage.setItem('tubeloom_user', JSON.stringify(userData));
}

export const getUserSession = () => {
    const data = localStorage.getItem('tubeloom_user');
    return data ? JSON.parse(data) : null;
}

export const clearUserSession = () => {
  localStorage.removeItem('tubeloom_user');
}