from django.urls import path
from .views import TaskViewSet
from rest_framework.routers import DefaultRouter

# Создаём маршрутизатор для API
router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

# Маршруты для задач
urlpatterns = router.urls
