from rest_framework import status, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet для управления задачами.
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]  # Только аутентифицированные пользователи

    def get_queryset(self):
        # Ограничиваем выборку задач только для текущего пользователя
        return self.queryset.filter(owner=self.request.user)

    def perform_create(self, serializer):
        # Указываем владельца при создании задачи
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'], url_path='mark-completed')
    def mark_completed(self, request, pk=None):
        """
        Отдельное действие для пометки задачи как завершенной.
        """
        task = self.get_object()
        task.status = 'completed'
        task.completed_at = localtime()
        task.save()
        return Response(
            {'status': 'Задача помечена как выполненная'},
            status=status.HTTP_200_OK
        )
