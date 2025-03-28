# models.py
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class UserProfile(models.Model):
    """Extended user profile with additional information for women using the platform"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.username}'s profile"


class SupportCategory(models.Model):
    """Categories of support offered on the platform"""
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=500)
    icon = models.CharField(max_length=50, blank=True)  # CSS icon class
    
    def __str__(self):
        return self.name


class Resource(models.Model):
    """Educational and support resources for women"""
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(SupportCategory, on_delete=models.CASCADE, related_name='resources')
    url = models.URLField(blank=True)
    file = models.FileField(upload_to='resources/', blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resources')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title


class SupportSession(models.Model):
    """Support sessions that can be booked by users"""
    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(SupportCategory, on_delete=models.CASCADE, related_name='sessions')
    mentor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='provided_sessions')
    attendee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='booked_sessions')
    scheduled_time = models.DateTimeField()
    duration_minutes = models.IntegerField(default=60)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.scheduled_time.strftime('%Y-%m-%d %H:%M')}"


class CustomUserManager(models.Manager):
    """Custom manager for User model to add helper methods"""
    
    def get_mentors(self):
        """Return users who are registered as mentors"""
        return self.filter(groups__name='Mentors')
    
    def get_active_users(self):
        """Return users who have been active in the last 30 days"""
        thirty_days_ago = timezone.now() - timezone.timedelta(days=30)
        return self.filter(last_login__gte=thirty_days_ago)


# Extend User model with the custom manager
User.custom = CustomUserManager()
