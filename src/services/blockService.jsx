import { apiClient } from '../utils/axiosConfig';

const API_URL = '/blocks';

export const createBlock = async (data) => {
  try {
    const res = await apiClient.post(API_URL, data, { withCredentials: true });
    return res.data;
  } catch (err) {
    console.error("Respuesta del backend:", err.response?.data); // <-- agrega esto
    throw err;
  }
};

export const getAllBlocks = () => {
  return apiClient.get(API_URL, { withCredentials: true });
};

export const getBlockById = (id) => {
  return apiClient.get(`${API_URL}/${id}`, { withCredentials: true });
};

export const getBlocksByFormId = (formId) => {
  return apiClient.get(`${API_URL}/form/${formId}`, { withCredentials: true });
};

export const updateBlock = (id, updatedData) => {
  return apiClient.put(`${API_URL}/${id}`, updatedData, { withCredentials: true });
};

export const deleteBlock = (id) => {
  return apiClient.delete(`${API_URL}/${id}`, { withCredentials: true });
};
