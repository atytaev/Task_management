from django.contrib.auth.models import User
from django.db import models


class Task(models.Model):
    STATUS_CHOICES = [
        ('new', 'Новая'),
        ('in_progress', 'В процессе'),
        ('completed', 'Завершена'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Низкий'),
        ('medium', 'Средний'),
        ('high', 'Высокий'),
    ]

    title = models.CharField(max_length=255)  # Название задачи
    description = models.TextField(blank=True)  # Описание задачи
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')  # Статус задачи
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')  # Приоритет
    deadline = models.DateTimeField(null=True, blank=True)  # Дедлайн задачи
    created_at = models.DateTimeField(auto_now_add=True)  # Время создания
    updated_at = models.DateTimeField(auto_now=True)  # Время последнего обновления
    completed_at = models.DateTimeField(null=True, blank=True)  # Время завершения задачи
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')  # Владелец задачи

    def __str__(self):
        return self.title  # Удобное представление задачи в админке и других местах
