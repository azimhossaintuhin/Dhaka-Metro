from django.shortcuts import render
from django.views.generic import View, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin


# Create your views here.


class TicketView(LoginRequiredMixin, TemplateView):
    template_name = "buy-ticket.html"
    login_url = "/account/login/"
