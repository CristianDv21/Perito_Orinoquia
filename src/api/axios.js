import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // <-- Asegúrate de incluir el puerto 8000 y el /api aquí
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

export default api;