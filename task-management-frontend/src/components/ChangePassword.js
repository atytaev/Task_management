import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Для перенаправления
import API from '../services/api';

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Используем для перенаправления

    const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await API.post('/users/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
      });
      setMessage(response.data.message); // Успешное сообщение
      setTimeout(() => {
        navigate('/'); // Перенаправление на главную через 2 секунды
      }, 2000);
    } catch (error) {
      console.error('Ошибка смены пароля:', error.response?.data || error.message);
      setError(
        error.response?.data?.old_password?.[0] ||
        error.response?.data?.new_password?.[0] ||
        'Введенные данные некорректны. Перепроверьте их.'
      );
    }
    };

    return (
    <form onSubmit={handleChangePassword} className="auth-form">
      <h2>Смена пароля</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="password"
        placeholder="Старый пароль"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Новый пароль"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <button type="submit">Сменить пароль</button>
    </form>
  );
}

export default ChangePassword;
