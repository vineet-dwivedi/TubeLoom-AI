import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const API = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});

export const processVideo = async(videoUrl, googleId = null) => {
    const response = await API.post('/api/process-video', {url: videoUrl, google_id: googleId})
    return response.data;
}

export const askQuestion = async(videoUrl, question) => {
    const response = await API.post('/api/chat', {url: videoUrl, question: question});
    return response.data;
}

export const getUserHistory = async (googleId) => {
    const response = await API.get(`/api/history/${googleId}`);
    return response.data;
}

export const deleteHistoryItem = async (googleId, itemId) => {
    const response = await API.delete(`/api/history/${googleId}/${itemId}`);
    return response.data;
}