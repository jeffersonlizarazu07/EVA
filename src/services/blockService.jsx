import axios from 'axios';

const API_URL = 'http://localhost:3000/api/form';

export const createBlock = (blockData) => {
  return axios.post(API_URL, blockData, { withCredentials: true });
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
