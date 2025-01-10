import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

// Добавление токена в заголовки запросов
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Обработка ошибки с истекшим токеном и автоматическое обновление токена
API.interceptors.response.use(
  (response) => response, // Пропускаем успешные ответы
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 и токен истек
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh');
      if (refreshToken) {
        try {
          // Пытаемся обновить access токен
          const response = await axios.post('http://127.0.0.1:8000/token/refresh/', { refresh: refreshToken });

          const newAccessToken = response.data.access;
          localStorage.setItem('access', newAccessToken); // Сохраняем новый токен

          // Повторно отправляем оригинальный запрос с новым access токеном
          originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
          return axios(originalRequest);
        } catch (refreshError) {
          // В случае ошибки обновления, нужно выйти из системы
          console.error('Ошибка обновления токенов:', refreshError);
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
