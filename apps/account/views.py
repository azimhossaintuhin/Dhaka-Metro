from typing import Any
from django.http import HttpRequest
from django.http.response import HttpResponse as HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.views.generic import View
from .forms import LoginForm ,RegisterForm



class RegisterView(View):
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect("index")
        return super().dispatch(request, *args, **kwargs)
    
    def get(self,request):
        registerForm = RegisterForm()
        return render(request, "register.html", {"form": registerForm})
    

    def post(self,request):
        registerForm = RegisterForm(request.POST)
        if registerForm.is_valid():
            full_name = registerForm.cleaned_data["full_name"]
            nid_number = registerForm.cleaned_data["nid_number"]
            phone_number = registerForm.cleaned_data["phone_number"]
            email = registerForm.cleaned_data["email"]
            password = registerForm.cleaned_data["password"]

            user = User.objects.create_user(
                username=phone_number, 
                password=password
            )
            user.profile.nid_number = nid_number
            user.profile.phone_number = phone_number
            user.profile.full_name = full_name
            user.profile.save()
            user.save()
            login(request, user)
            return redirect("index")
        else:
            return render(request, "register.html", {"form": registerForm})
   


class LoginView(View):
    def dispatch(self, request: HttpRequest, *args: Any, **kwargs: Any) -> HttpResponse:
        if request.user.is_authenticated:
            return redirect("index")
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):
        return render(request, "login.html")

    def post(self, request):
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data["username"]
            password = form.cleaned_data["password"]
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect("index")
            else:
                return render(request, "login.html", {"form": form})
        else:
            return render(request, "login.html", {"form": form})


class LogoutView(View):
    def get(self, request):
        logout(request)
        return redirect("index")


    


class ProfileView(View):
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect("login")
        return super().dispatch(request, *args, **kwargs)
    
    def get(self, request):
        return render(request, "account.html")
    
 
 