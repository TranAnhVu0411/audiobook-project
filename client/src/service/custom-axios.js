import axios from 'axios'

export const main_axios_instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8800/api'
        // timeout: 3000
});

export const pdf_axios_instance = axios.create({
    baseURL: 'http://localhost:3500/api'
});