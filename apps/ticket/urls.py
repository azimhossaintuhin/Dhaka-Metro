from  django.urls import path
from .views import TicketView
urlpatterns = [
    path("", TicketView.as_view(), name="ticket"),
]