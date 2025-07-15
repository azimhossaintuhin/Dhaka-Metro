from django import forms
from .models import UserProfile


class LoginForm(forms.Form):
    username = forms.CharField(max_length=12)
    password = forms.CharField(max_length=1000)
    widget = {
        "username": forms.TextInput(attrs={"class": "form-control"}),
        "password": forms.PasswordInput(attrs={"class": "form-control"}),
    }

class RegisterForm(forms.Form):
    full_name = forms.CharField(max_length=100)
    nid_number = forms.CharField(max_length=20)
    phone_number = forms.CharField(max_length=15)
    email = forms.EmailField()
    password = forms.CharField(max_length=1000, widget=forms.PasswordInput)
    confirm_password = forms.CharField(max_length=1000, widget=forms.PasswordInput)
    
    def clean(self):
        password = self.cleaned_data.get("password")
        confirm_password = self.cleaned_data.get("confirm_password")
        if password != confirm_password:
            raise forms.ValidationError("Passwords do not match.")
        return self.cleaned_data
    


class  UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = "__all__"
        exclude = ["user"]
    
    