import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5162/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
});

export const getPortfolios = () => api.get("/portfolio");

export const getPortfolioDetails = (id) => api.get(`/portfolio/${id}/value`);

export const createPortfolio = (portfolioData) => api.post('/portfolio', portfolioData);

export default api;