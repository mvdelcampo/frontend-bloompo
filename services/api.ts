import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import type { InternalAxiosRequestConfig, AxiosError } from 'axios';
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

API.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await SecureStore.getItemAsync('jwtToken');

    // Rutas que NO deben llevar token
    const excludedRoutes = ['/user/login', '/user/create'];

    const isExcluded = config.url && excludedRoutes.some(route => config.url?.endsWith(route));

    if (token && !isExcluded) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);


export const login = async (userData: {
  mail: string;
  password: string;
}) => {
  return await API.post('/user/login', userData)
  // console.log('userData', userData)
  // console.log('API_URL')
 };

export const register = async (userData: {
  mail: string;
  password: string;
  username: string;
}) => { return await API.post('/user/create', userData) };


// ---------- Pantalla Tracker ----------------------

export const createGroup = async (data: {
	name: string;
	color: string;
	pet_name: string;
}) => {
	return await API.post("/group/create", data);
};

export const getGroup = async (groupId: string) => {
	return await API.get(`/group/${groupId}`);
};

export const editGroup = async (data: {
	_id: string;
	name: string;
	color: string;
	pet_name: string;
}) => {
	return await API.post("/group/edit", data);
};

export const createHabit = async (data: {
	habit: {
		name: string;
		icon: string;
		color: string;
		frequency: number;
	};
}) => {
	return await API.post("/user/createHabit", data);
};

export const addGroupToHabit = async (data: {
  habitName: string,
  newGroupId: string
}) => {
	return await API.post("/user/addGroupToHabit", data);
};

export const sendInvitation = async (data: {
	friendEmail: string;
	groupId: string;
}) => {
	return await API.post("/user/addPendingGroup", data);
};

export const deleteFriend = async (data: {
	friendEmail: string;
	groupId: string;
}) => {
	return await API.post("/user/deleteFriendFromGroup", data);
};

export const getUserGroups = async () => {
	return await API.get(`/user/me/groups`);
};

export const getGroupRanking = async (groupId: string) => {
	return await API.get(`/group/${groupId}/getGroupRanking`);
};

export const getHabitsFromGroup = async (groupId: string) => {
  return await API.get(`/group/${groupId}/getHabits`);
  
};
export const getHabitsFromUser = async () => {
	return await API.get(`/user/me/habits`);
};


// ---------- Pantalla Home ----------------------

// Obtener posts para el feed
export const getFeedPosts = async () => 
  {return await API.get(`/user/me/getFeedPosts`)};

// Borrar foto
export const deletePost = async (data: {
  habitName: string;
  postDate: string;
}) => 
  {return await API.delete('/user/deletePost', { data })};

// Dar me gusta/no me gusta a foto
export const addLikes = async (dataPost: {
  postOwnerUserId: string;
  habitName: string;
  postDate: string;
  like: boolean;
  dislike: boolean;
}) => {return await API.post('/user/addLikes', dataPost)};

// Obtener invitaciones pendientes
export const getUserInvitations = async () =>
  {return await API.get(`/user/me/pendingGroups`)};

// Aceptar/Rechazar invitacion pendiente
export const acceptInvitation = async (data: {
  groupId: string;
  accepted: boolean;
}) => 
  {return await API.post('/user/acceptPendingGroup', data)};

// Crear post
export const createPost = async (formData: FormData) => {
  return await API.post('/user/loadHabit', formData, {
    timeout: 40000,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Obtener habitos del usuario
export const getUserHabits = async () =>
 {return await API.get(`/user/me/habits`)};

// ---------- Pantalla Mascota ----------------------

// Obtener mascotas de todos los grupos a los que pertenece un usuario
export const getUserPets = async () =>
  {return await API.get(`/user/me/pets`)};

// Obtener puntos (o monedas) del usuario
export const getUserScore = async () =>
  {return await API.get(`/user/me/getUserScore`)};

// ------------ Pantalla Usuario --------------------

export const getUserData = async () =>
  {return await API.get(`/user/me`)};






