import axios from 'axios'; 
const API_URL = 'http://localhost:8000/api/gamification'; // Sesuaiin kalau base URL lu beda

// 1. Ambil Saldo & History
const getPointStatus = async () => {
    const response = await axios.get(`${API_URL}/points`);
    return response.data;
};

// 2. Ambil Barang Toko
const getStoreItems = async () => {
    const response = await axios.get(`${API_URL}/store`);
    return response.data;
};

// 3. Beli Barang
const buyItem = async (itemId) => {
    const response = await axios.post(`${API_URL}/buy/${itemId}`);
    return response.data;
};

// 4. Liat Inventory
const getMyTokens = async () => {
    const response = await axios.get(`${API_URL}/my-tokens`);
    return response.data;
};

const GamificationService = {
    getPointStatus,
    getStoreItems,
    buyItem,
    getMyTokens
};

export default GamificationService;