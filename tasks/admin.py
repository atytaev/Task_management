from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'priority', 'owner', 'deadline', 'created_at')
    list_filter = ('status', 'priority', 'owner')
    search_fields = ('title', 'description')

