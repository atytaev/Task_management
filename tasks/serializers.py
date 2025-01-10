from django.utils.timezone import localtime
from rest_framework import serializers

from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    created_at_formatted = serializers.SerializerMethodField()  # Форматированное время создания
    updated_at_formatted = serializers.SerializerMethodField()  # Форматированное время обновления
    deadline_formatted = serializers.SerializerMethodField()  # Форматированный дедлайн

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'status', 'priority', 'deadline',
            'owner', 'created_at', 'updated_at',
            'created_at_formatted', 'updated_at_formatted', 'deadline_formatted',
        ]
        read_only_fields = ['owner', 'created_at', 'updated_at']

    def get_created_at_formatted(self, obj):
        return localtime(obj.created_at).strftime('%d.%m.%Y %H:%M')

    def get_updated_at_formatted(self, obj):
        return localtime(obj.updated_at).strftime('%d.%m.%Y %H:%M')

    def get_deadline_formatted(self, obj):
        return localtime(obj.deadline).strftime('%d.%m.%Y %H:%M') if obj.deadline else None
