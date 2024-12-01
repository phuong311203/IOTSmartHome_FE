import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Địa chỉ backend

// Đăng ký
export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/users/register`, userData);
};

// Đăng nhập
export const loginUser = async (userData) => {
  return await axios.post(`${API_URL}/users/login`, userData);
};

// Lấy danh sách thiết bị
export const getDevices = async () => {
  return await axios.get(`${API_URL}/devices`);
};

// Cập nhật trạng thái thiết bị
export const updateDevice = async (id, status) => {
  return await axios.put(`${API_URL}/devices/${id}`, { status });
};
