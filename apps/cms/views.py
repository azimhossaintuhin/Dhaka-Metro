from django.shortcuts import render
from django.views.generic import TemplateView
from .models import Service, Features, TrainSchedule, Updates   


class HomeView(TemplateView):
    template_name = "index.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["services"] = Service.objects.all()
        context["features"] = Features.objects.all()
        context["train_schedules"] = TrainSchedule.objects.all()
        context["updates"] = Updates.objects.all().select_related("category")
        return context
