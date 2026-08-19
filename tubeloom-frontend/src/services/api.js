import axios from "axios";

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json'
    },
});

export const processVideo = async(videoUrl) => {
    const response = await API.post('/api/process-video', {url: videoUrl})
    return response.data;
}

export const askQuestion = async(videoUrl, question) => {
    const response = await API.post('/api/chat', {url: videoUrl, question: question});
    return response.data;
}