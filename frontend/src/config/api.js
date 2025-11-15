import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Adjust this to your backend's URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
