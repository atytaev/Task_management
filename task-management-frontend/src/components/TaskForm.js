import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Импортируем хук useNavigate
import API from '../services/api';

function TaskForm({ onClose, onTaskCreated, taskToEdit = null }) {
    const [title, setTitle] = useState(taskToEdit ? taskToEdit.title : '');
    const [description, setDescription] = useState(taskToEdit ? taskToEdit.description : '');
    const [priority, setPriority] = useState(taskToEdit ? taskToEdit.priority : 'medium');
    const [status, setStatus] = useState(taskToEdit ? taskToEdit.status : 'new');
    const [deadline, setDeadline] = useState(taskToEdit ? taskToEdit.deadline : '');

    const [successMessage, setSuccessMessage] = useState(null); // Инициализация состояния для сообщения об успешной задаче

    const navigate = useNavigate(); // Хук для перенаправления

    const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
        title,
        description,
        priority,
        status,
        deadline,
    };

    try {
        if (taskToEdit) {
        // Редактирование задачи
            await API.put(`/api/tasks/${taskToEdit.id}/`, taskData);

        if (onTaskCreated) {
              onTaskCreated({ ...taskToEdit, ...taskData });
        }
        } else {
        // Создание новой задачи
            const response = await API.post('/api/tasks/', taskData);
        if (onTaskCreated) {
              onTaskCreated(response.data);
        }

        // Показать сообщение об успешном создании задачи
        setSuccessMessage('Задача успешно создана!');

        // Перенаправить на список задач через 2 секунды
        setTimeout(() => {
          navigate('/'); // Перенаправление на список задач
        }, 2000);
        }

        onClose();
    } catch (error) {
        console.error('Ошибка при сохранении задачи:', error);
    }
    };

    return (
    <form onSubmit={handleSubmit}>
      <h3>{taskToEdit ? 'Редактировать задачу' : 'Создать новую задачу'}</h3>
      <input
        type="text"
        placeholder="Заголовок"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Низкий</option>
        <option value="medium">Средний</option>
        <option value="high">Высокий</option>
      </select>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="new">Новая</option>
        <option value="in_progress">В процессе</option>
        <option value="completed">Завершена</option>
      </select>
      <input
        type="datetime-local"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <button type="submit">{taskToEdit ? 'Сохранить изменения' : 'Создать задачу'}</button>
      <button type="button" onClick={onClose}>Отменить</button>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
    </form>
    );
}

export default TaskForm;
