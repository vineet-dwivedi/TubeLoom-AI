import axios from "axios";

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000',
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
    const response = await API.get(`/api/hiistory/${googleId}`);
    return response.data;
}