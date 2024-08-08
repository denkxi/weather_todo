import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BACKEND_URL } from '@/config.js';
import { Task } from '@/model/Task';

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export const getTasks = async () => {
  const response = await axiosInstance.get('/tasks');
  return response.data;
};

export const createTask = async (task: any) => {
  const response = await axiosInstance.post('/tasks', task);
  return response.data;
};

export const updateTask = async (id: number, task: Task) => {
  const response = await axiosInstance.put(`/tasks/${id}`, task);
  return response.data;
};

export const checkTask = async (id: number, task: Task) => {
  task.isComplete = !task.isComplete;
  const response = await axiosInstance.put(`/tasks/${id}`, task);
  return response.data;
}

export const deleteTask = async (id: number) => {
  const response = await axiosInstance.delete(`/tasks/${id}`);
  return response.data;
};