from django.db import models
from django.contrib.auth.models import User
from django.core.validators import FileExtensionValidator
import uuid
from datetime import timedelta
from django.utils import timezone

file_extensions = ['jpg', 'jpeg', 'png', 'webp']
extension_validator = FileExtensionValidator(allowed_extensions=file_extensions)

class UserProfile(models.Model):
    user =  models.OneToOneField(User, on_delete=models.CASCADE , related_name='profile')
    full_name = models.CharField(max_length=255)
    nid_number =  models.CharField(max_length=17, null=True, blank=True)
    iamge =  models.ImageField(upload_to='profile_images/', null=True, blank=True , validators=[extension_validator])
    phone_number = models.CharField(max_length=110, null=True, blank=True)
    is_validated = models.BooleanField(default=False)
    
    def __str__(self):
        return self.user.username


class Token(models.Model):
    class TokenType(models.TextChoices):
        FORGOT_PASSWORD = 'fp'
        EMAIL_VERIFICATION = 'ev'

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255)
    type = models.CharField(max_length=255, choices=TokenType.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.user.username
    
    def _generate_token(self):
        return uuid.uuid4()
    
    def save(self, *args, **kwargs):
        if not self.token:
            self.token = self.generate_token()
            self.expires_at = timezone.now() + timedelta(minutes=10)
        return super().save(*args, **kwargs)

    def is_expired(self):
        if self.expires_at and timezone.now() > self.expires_at:
            return True
        return False
    
    def is_valid(self):
        return not self.is_expired()
    
    def is_valid_for_type(self, type):
        return self.type == type and self.is_valid()
    
    



