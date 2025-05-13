import axios from 'axios';

const API_URL = 'http://localhost:3000/api/blocks';

export const createBlock = async (data) => {
  try {
    const res = await axios.post('/api/blocks', data, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("Respuesta del backend:", err.response?.data); // <-- agrega esto
    throw err;
  }
};

export const getAllBlocks = () => {
  return axios.get(API_URL, { withCredentials: true });
};

export const getBlockById = (id) => {
  return axios.get(`${API_URL}/${id}`, { withCredentials: true });
};

export const updateBlock = (id, updatedData) => {
  return axios.put(`${API_URL}/${id}`, updatedData, { withCredentials: true });
};

export const deleteBlock = (id) => {
  return axios.delete(`${API_URL}/${id}`, { withCredentials: true });
};
