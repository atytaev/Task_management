import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import './Login.css';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await API.post('/token/', { username, password });
        console.log('Токены получены.');
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        onLogin();
        navigate('/');
    } catch (error) {
        console.error('Ошибка входа:', error.response);
        setErrorMessage('Ошибка входа, проверьте данные');
    }
    };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
        <h2>Вход</h2>
            <input
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
        />
        <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
      />
            <button type="submit">Войти</button>
            {errorMessage && <p>{errorMessage}</p>}
    </form>
  );
}

export default Login;
