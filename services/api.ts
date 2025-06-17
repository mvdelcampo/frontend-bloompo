import axios from 'axios';

const API = axios.create({
  baseURL: 'http://18.218.161.157:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = (userData: {
  mail: string;
  password: string;
}) => API.post('/user/login', userData);

export const register = (userData: {
  mail: string;
  password: string;
  username: string;
}) => API.post('/user/create', userData);

export const getGrupos = () => API.get('/grupos');
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
  API.get(`/user/${userId}/getUserPets`);

