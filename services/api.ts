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
