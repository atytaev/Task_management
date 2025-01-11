# Task Management System

Проект для управления задачами с возможностью создания, редактирования, пометки выполненных задач и смены пароля пользователя.

## Стек технологий

* Backend: Django, Django REST Framework
* Frontend: React
* Database: PostgreSQL

## Установка и настройка

1. ### Установка зависимостей

Клонируйте репозиторий и установите зависимости для серверной части и фронтенда.

#### Backend (Django):
1. Создайте виртуальное окружение:

`python3 -m venv venv`

`source venv/bin/activate  # Для Linux/Mac`

`venv\Scripts\activate  # Для Windows`

2. Установите зависимости:

`pip install -r requirements.txt`

#### Frontend (React):

1. Перейдите в папку frontend:

`cd frontend`

Установите зависимости:

`npm install`

### 2. Настройка PostgreSQL

#### 1. Установите PostgreSQL и создайте базу данных:

`CREATE DATABASE task_management;`

`CREATE USER task_user WITH PASSWORD 'your_password';`

`ALTER ROLE task_user SET client_encoding TO 'utf8';`

`ALTER ROLE task_user SET default_transaction_isolation TO 'read committed';`

`ALTER ROLE task_user SET timezone TO 'UTC';`

`GRANT ALL PRIVILEGES ON DATABASE task_management TO task_user;`

#### 2. В файле .env добавьте настройки для подключения к базе данных:

`DB_NAME=task_management`

`DB_USER=task_user`

`DB_PASSWORD=your_password`

`DB_HOST=localhost`

`DB_PORT=5432`

### 3. Миграции базы данных

Примените миграции:

`python manage.py migrate`

### 4. Запуск серверной части

Запустите сервер Django:

`python manage.py runserver`

### 5. Запуск фронтенда

Перейдите в папку frontend и запустите React приложение:

`npm start`

### 6. Документация API

Для работы с API используйте эндпоинты:

POST /api/register/ — Регистрация пользователя

POST /api/login/ — Вход пользователя (получение токенов)

GET /api/tasks/ — Получение списка задач текущего пользователя

POST /api/tasks/ — Создание задачи

POST /api/tasks/{id}/mark-completed/ — Пометка задачи как завершенной

PUT /api/tasks/{id}/ — Редактирование задачи

POST /api/change-password/ — Смена пароля пользователя

### Структура проекта

backend/ — серверная часть на Django.

frontend/ — клиентская часть на React.

.env — файл с переменными окружения для конфигурации базы данных и секретных ключей.

README.md — документация проекта.


