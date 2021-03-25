from django.contrib import admin

from tasks.models import TaskSettings


@admin.register(TaskSettings)
class TaskSettingsAdmin(admin.ModelAdmin):
    pass
