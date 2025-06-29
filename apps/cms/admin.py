from django.contrib import admin
from .models import Service, Features, TrainSchedule

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):  
    list_display = ["title", "description", "icon_class", "button_text", "button_link"]
    list_filter = ["title", "description", "icon_class", "button_text", "button_link"]
    search_fields = ["title", "description", "icon_class", "button_text", "button_link"]
    
@admin.register(Features)
class FeaturesAdmin(admin.ModelAdmin):
    list_display = ["title", "description", "icon_class"]
    list_filter = ["title", "description", "icon_class"]
    search_fields = ["title", "description", "icon_class"]
   

@admin.register(TrainSchedule)
class TrainScheduleAdmin(admin.ModelAdmin):
    list_display = ["train_number", "from_station", "to_station", "time", "created_at"]
    list_filter = ["train_number", "from_station", "to_station", "time", "created_at"]
    search_fields = ["train_number", "from_station", "to_station", "time", "created_at"]
   