import axios from 'axios';
import serverConfig from './config';
import qs from 'qs';

// Create axios request instance
const serviceAxios = axios.create({
  baseURL: serverConfig.baseURL,
  timeout: 1000,
});

// Request Interceptors
serviceAxios.interceptors.request.use(
  (config) => {
    // Token authorization
    if (serverConfig.useTokenAuthorization) {
      config.headers['Authorization'] = localStorage.getItem('token'); 
    }
    // Setting header
    if (!config.headers['content-type']) {
      if (config.method === 'post') {
        config.headers['content-type'] = 'application/x-www-form-urlencoded'; // post request
        config.data = qs.stringify(config.data); 
      } else {
        config.headers['content-type'] = 'application/json'; // Default type
      }
    }
    console.log('Request Configuration', config);
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

// 创建响应拦截
serviceAxios.interceptors.response.use(
  (res) => {
    let data = res.data;
    return data;
  },
  (error) => {
    let message = '';
    if (error && error.response) {
        switch (error.response.status) {
            case 302:
              message = 'Interface redirected! ';
              break;
            case 400:
              message = 'Parameters are incorrect! ';
              break;
            case 401:
              message = 'You are not logged in, or your login has timed out, please log in first! ';
              break;
            case 403:
              message = 'You do not have permission to operate! ';
              break;
            case 404:
              message = `Error in request address: ${error.response.config.url}`;
              break;
            case 408:
              message = 'Request timed out! ';
              break;
            case 409:
              message = 'The same data already exists in the system! ';
              break;
            case 500:
              message = 'Server internal error! ';
              break;
            case 501:
              message = 'Service not implemented! ';
              break;
            case 502:
              message = 'Gateway error! ';
              break;
            case 503:
              message = 'Service is not available! ';
              break;
            case 504:
              message = 'The service is temporarily inaccessible, please try again later! ';
              break;
            case 505:
              message = 'HTTP version not supported! ';
              break;
            default:
              message = 'Exception problem, please contact the administrator! ';
              break;
          }
    }
    return Promise.reject(message);
  },
);

export default serviceAxios;
