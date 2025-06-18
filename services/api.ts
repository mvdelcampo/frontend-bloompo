import axios from 'axios';
//import * as SecureStore from 'expo-secure-store';
//import type { AxiosRequestConfig, AxiosError } from 'axios';
import Constants from 'expo-constants';
const API_URL = Constants?.manifest2?.extra?.apiUrl
  ?? Constants?.manifest?.extra?.apiUrl
  ?? Constants?.expoConfig?.extra?.apiUrl;

const API = axios.create({
  baseURL:  API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
// Interceptor para incluir el token JWT
API.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const token = await SecureStore.getItemAsync('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);
*/

/*
// Interceptor para incluir el token JWT
API.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const token = await SecureStore.getItemAsync('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);
*/

export const login = async (userData: {
  mail: string;
  password: string;
}) => {
  return await API.post('/user/login', userData)
  console.log('userData', userData)
  console.log('API_URL')
 };

export const register = async (userData: {
  mail: string;
  password: string;
  username: string;
}) => { return await API.post('/user/create', userData) } ;

export const getGrupos = async () => { return await API.get('/grupos') };
//export const createGrupo = (data: any) => API.post('/grupos', data);
// etc.

export const getFeedPosts = (userId: string) => API.get(`/user/${userId}/getFeedPosts`);

export const getUserPendingGroups = (userId: string) =>
  API.get(`/user/${userId}/getUserPendingGroups`);

export const respondToGroupInvitation = (data: {
  userId: string;
  groupId: string;
  accepted: boolean;
}) => API.post('/user/acceptPendingGroup', data);

export const updatePostReactions = (data: {
  userId: string;
  postOwnerUserId: string;
  habitName: string;
  postDate: string;
  like: boolean;
  dislike: boolean;
}) => API.post('/user/addLikes', data);

export const deletePost = (data: {
  userId: string;
  habitName: string;
  postDate: string;
}) => API.delete('/user/deletePost', { data });

export const createPost = (data: {
  userId: string;
  habitName: string;
  post_photo: string;
}) => API.post('/user/loadHabitUser', data);

export const getUserData = (userId: string) =>
  API.get(`/user/${userId}`);

export const getUserScore = (userId: string) =>
  API.get(`/user/${userId}/getUserScore`);

export const getUserPets = (userId: string) =>
  API.get(`/user/${userId}/pets`);

export const getUserHabits = (userId: string) =>
  API.get(`/user/${userId}/habits`);