import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import ChangePassword from './components/ChangePassword';
import './App.css';
import API from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access'));

  // Проверка токенов при старте приложения
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('access');
      if (token) {
        try {
          // Выполним запрос, чтобы проверить, не истек ли токен
          await API.get('/api/'); // Можно заменить на более конкретный эндпоинт
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Ошибка при проверке токена", error);
          setIsAuthenticated(false);
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkToken();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="logo">
            <h1>Task Management</h1>
          </div>
          <nav className="app-nav">
            <Link to="/" className="nav-link">Задачи</Link>
            <Link to="/completed-tasks" className="nav-link">Выполненные</Link>
            {isAuthenticated ? (
              <>
                <Link to="/create-task" className="nav-link">Создать задачу</Link>
                <Link to="/change-password" className="nav-link">Сменить пароль</Link>
                <Link onClick={handleLogout} className="nav-link">Выйти</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Вход</Link>
                <Link to="/register" className="nav-link">Регистрация</Link>
              </>
            )}
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={isAuthenticated ? <TaskList /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-task" element={<TaskForm onClose={() => {}} />} />
            <Route path="/change-password" element={isAuthenticated ? <ChangePassword /> : <Navigate to="/login" />} />
            <Route path="/completed-tasks" element={isAuthenticated ? <TaskList showCompleted={true} /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
