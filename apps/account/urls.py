from django.urls import path
from .views import LoginView, RegisterView, ProfileView,LogoutView, ProfileImageUpdateView

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("profile/image/", ProfileImageUpdateView.as_view(), name="profile-image"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("register/", RegisterView.as_view(), name="register"),
]
