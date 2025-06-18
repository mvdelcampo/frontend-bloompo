import axios from 'axios';
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
