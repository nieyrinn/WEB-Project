# serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, SupportCategory, Resource, SupportSession


class UserSerializer(serializers.ModelSerializer):
    """ModelSerializer for User model"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class UserProfileSerializer(serializers.ModelSerializer):
    """ModelSerializer for UserProfile model"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'bio', 'location', 'birth_date', 'profile_image']


class SupportCategorySerializer(serializers.Serializer):
    """Custom Serializer for SupportCategory"""
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=100)
    description = serializers.CharField(max_length=500)
    icon = serializers.CharField(max_length=50, required=False, allow_blank=True)
    
    def create(self, validated_data):
        return SupportCategory.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.icon = validated_data.get('icon', instance.icon)
        instance.save()
        return instance


class ResourceSerializer(serializers.ModelSerializer):
    """ModelSerializer for Resource model"""
    created_by = UserSerializer(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Resource
        fields = ['id', 'title', 'description', 'category', 'category_name', 'url', 
                 'file', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    
    def create(self, validated_data):
        # Assign the current authenticated user as the creator
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class SupportSessionSerializer(serializers.Serializer):
    """Custom Serializer for SupportSession"""
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=200)
    description = serializers.CharField()
    category_id = serializers.IntegerField()
    mentor_id = serializers.IntegerField()
    attendee = serializers.PrimaryKeyRelatedField(read_only=True)
    scheduled_time = serializers.DateTimeField()
    duration_minutes = serializers.IntegerField(default=60)
    status = serializers.ChoiceField(choices=SupportSession.STATUS_CHOICES, default='scheduled')
    notes = serializers.CharField(required=False, allow_blank=True)
    created_at = serializers.DateTimeField(read_only=True)
    
    # Add nested representation for related fields
    category_name = serializers.CharField(source='category.name', read_only=True)
    mentor_name = serializers.SerializerMethodField()
    
    def get_mentor_name(self, obj):
        return f"{obj.mentor.first_name} {obj.mentor.last_name}"
    
    def create(self, validated_data):
        # Set the authenticated user as the attendee
        validated_data['attendee'] = self.context['request'].user
        
        # Get the related objects
        category_id = validated_data.pop('category_id')
        mentor_id = validated_data.pop('mentor_id')
        
        # Create the SupportSession instance
        session = SupportSession.objects.create(
            category_id=category_id,
            mentor_id=mentor_id,
            **validated_data
        )
        return session
    
    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        
        if 'category_id' in validated_data:
            instance.category_id = validated_data.get('category_id')
        
        if 'mentor_id' in validated_data:
            instance.mentor_id = validated_data.get('mentor_id')
        
        instance.scheduled_time = validated_data.get('scheduled_time', instance.scheduled_time)
        instance.duration_minutes = validated_data.get('duration_minutes', instance.duration_minutes)
        instance.status = validated_data.get('status', instance.status)
        instance.notes = validated_data.get('notes', instance.notes)
        
        instance.save()
        return instance