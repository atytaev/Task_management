import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import './Login.css';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessages, setErrorMessages] = useState([]);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await API.post('/users/register/', { username, email, password });

        navigate('/login');
    } catch (error) {

        if (error.response && error.response.data) {
        const errors = error.response.data;

        setErrorMessages([]);  // Очищаем старые ошибки

        if (errors.password) {
          setErrorMessages(errors.password);
        }

        // Обработка других ошибок
        if (errors.username) {
          setErrorMessages(prevMessages => [...prevMessages, ...errors.username]);
        }
        if (errors.email) {
          setErrorMessages(prevMessages => [...prevMessages, ...errors.email]);
        }
        }
    }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Регистрация</h2>
          <input
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Зарегистрироваться</button>

            {errorMessages.length > 0 && (
              <div className="error-messages">
                {errorMessages.map((message, index) => (
                  <div key={index} className="error-message">{message}</div>
                ))}
              </div>
            )}
        </form>
    );
}

export default Register;
