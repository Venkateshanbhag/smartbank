import axios from "axios";

const API_URL = "http://localhost:5000";

export const createAccount = (username) => axios.post(`${API_URL}/create`, { username });
export const getBalance = (username) => axios.get(`${API_URL}/balance/${username}`);
export const handleTransaction = (username, amount, type) => axios.post(`${API_URL}/transaction`, { username, amount, type });
