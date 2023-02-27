import axios from 'axios'

export const main_axios_instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8800/api'
});

export const pdf_axios_instance = axios.create({
    baseURL:  process.env.REACT_APP_PDF_BASE_URL || 'http://localhost:3500/api'
});