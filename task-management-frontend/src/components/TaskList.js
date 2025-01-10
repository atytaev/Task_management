import React, { useEffect, useState } from 'react';
import API from '../services/api';
import TaskForm from './TaskForm';
import { format, differenceInHours } from 'date-fns';

function TaskList({ showCompleted = false }) {
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [completionMessage, setCompletionMessage] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await API.get('/api/tasks/');
                setTasks(response.data);
            } catch (error) {
                console.error('Ошибка при получении задач:', error);
            }
        };
        fetchTasks();
    }, []);

    const toggleForm = () => setShowForm(!showForm);

    const handleDelete = async (id, taskTitle) => {
        try {
            await API.delete(`/api/tasks/${id}/`);
            setTasks(tasks.filter((task) => task.id !== id));
            setDeleteMessage(`Задача "${taskTitle}" удалена`);
            setTimeout(() => setDeleteMessage(null), 3000);
        } catch (error) {
            console.error('Ошибка при удалении задачи:', error.response?.data || error.message);
        }
    };

    const handleMarkCompleted = async (id) => {
        try {
            const currentDate = new Date().toISOString();
            const taskToUpdate = tasks.find((task) => task.id === id);

            if (!taskToUpdate) {
                console.error('Задача не найдена');
                return;
            }

            await API.put(`/api/tasks/${id}/`, {
                ...taskToUpdate,
                status: 'completed',
                completed_at: currentDate,
            });

            setTasks(tasks.map((task) =>
                task.id === id ? { ...task, status: 'completed', completed_at: currentDate } : task
            ));

            setCompletionMessage(`Поздравляем с выполнение задачи "${taskToUpdate.title}"`);
            setTimeout(() => setCompletionMessage(null), 3000);
        } catch (error) {
            console.error('Ошибка при обновлении статуса задачи:', error.response?.data || error.message);
        }
    };

    const handleEdit = (task) => {
        setShowForm(true);
        setTaskToEdit(task);
    };

    const filteredTasks = showCompleted
        ? tasks.filter((task) => task.status === 'completed')
        : tasks.filter((task) => task.status !== 'completed');

    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const sortedTasks = filteredTasks.sort((a, b) =>
        priorityOrder[a.priority] - priorityOrder[b.priority]
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (!isNaN(date)) {
            return format(date, 'dd MMMM yyyy, HH:mm');
        }
        return 'Некорректная дата';
    };

    const isDeadlineNear = (deadline) => {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        return differenceInHours(deadlineDate, now) <= 24 && deadlineDate > now;
    };

    const isDeadlineExpired = (deadline) => {
        return new Date(deadline) < new Date();
    };

    return (
        <div>
            <h2>{showCompleted ? 'Выполненные задачи' : 'Список задач'}</h2>

            {deleteMessage && <div className="delete-message">{deleteMessage}</div>}
            {completionMessage && <div className="completion-message">{completionMessage}</div>}

            {showForm && (
                <TaskForm
                    taskToEdit={taskToEdit}
                    onClose={toggleForm}
                    onTaskCreated={(task) => {
                        setTasks((prevTasks) =>
                            taskToEdit
                                ? prevTasks.map((t) => (t.id === task.id ? task : t))
                                : [...prevTasks, task]
                        );
                    }}
                />
            )}

            <ul>
                {sortedTasks.map((task) => (
                    <li
                        key={task.id}
                        className={
                            isDeadlineExpired(task.deadline)
                                ? 'task-critical'
                                : isDeadlineNear(task.deadline)
                                ? 'task-warning'
                                : ''
                        }
                    >
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p>Приоритет: {task.priority}</p>
                        <p>Статус: {task.status}</p>
                        <p>Срок: {formatDate(task.deadline)}</p>
                        {isDeadlineExpired(task.deadline) && (
                            <p className="critical-notice">Срок задачи истёк!</p>
                        )}
                        {isDeadlineNear(task.deadline) && (
                            <p className="warning-notice">Срок приближается!</p>
                        )}
                        <button onClick={() => handleEdit(task)}>Редактировать</button>
                        <button onClick={() => handleDelete(task.id, task.title)}>Удалить</button>
                        {task.status !== 'completed' && (
                            <button onClick={() => handleMarkCompleted(task.id)}>Выполнено</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TaskList;
