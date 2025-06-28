from django import forms


class LoginForm(forms.Form):
    username = forms.CharField(max_length=12)
    password = forms.CharField(max_length=1000)
    widget = {
        "username": forms.TextInput(attrs={"class": "form-control"}),
        "password": forms.PasswordInput(attrs={"class": "form-control"}),
    }
