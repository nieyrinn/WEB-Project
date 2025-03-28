# views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import UserProfile
from .serializers import UserSerializer, UserProfileSerializer
from rest_framework_simplejwt.tokens import RefreshToken # type: ignore
from .models import UserProfile, SupportCategory, Resource, SupportSession
from .serializers import (
    UserSerializer, UserProfileSerializer, SupportCategorySerializer, 
    ResourceSerializer, SupportSessionSerializer
)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """Register a new user"""
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = User.objects.create_user(
            username=request.data.get('username'),
            email=request.data.get('email'),
            password=request.data.get('password'),
            first_name=request.data.get('first_name'),
            last_name=request.data.get('last_name')
        )        
        UserProfile.objects.create(user=user)
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login view that returns JWT token"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user is not None:
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        })
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout view that blacklists the refresh token"""
    try:
        refresh_token = request.data.get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response(status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    """Get or update the current user's profile"""
    try:
        profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        profile = UserProfile.objects.create(user=request.user)
    
    if request.method == 'GET':
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def resources_by_category(request, category_id):
    """Get all resources for a specific category"""
    resources = Resource.objects.filter(category_id=category_id)
    serializer = ResourceSerializer(resources, many=True)
    return Response(serializer.data)

# Class-based views (CBV)
class SupportCategoryList(APIView):
    """List all support categories or create a new one"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        categories = SupportCategory.objects.all()
        serializer = SupportCategorySerializer(categories, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = SupportCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResourceListCreate(APIView):
    """List all resources or create a new one"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        resources = Resource.objects.all()
        serializer = ResourceSerializer(resources, many=True, context={'request': request})
        return Response(serializer.data)
    
    def post(self, request):
        serializer = ResourceSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SupportSessionDetail(APIView):
    """Retrieve, update or delete a support session"""
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk):
        return get_object_or_404(SupportSession, pk=pk)
    
    def get(self, request, pk):
        session = self.get_object(pk)
        serializer = SupportSessionSerializer(session)
        return Response(serializer.data)
    
    def put(self, request, pk):
        session = self.get_object(pk)
        if request.user != session.attendee and request.user != session.mentor:
            return Response(
                {'error': 'You do not have permission to edit this session'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = SupportSessionSerializer(session, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        session = self.get_object(pk)
        if request.user != session.attendee and request.user != session.mentor:
            return Response(
                {'error': 'You do not have permission to delete this session'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        session.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserSessions(APIView):
    """List all sessions for the current user (either as attendee or mentor)"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        sessions = SupportSession.objects.filter(
            attendee=request.user
        ) | SupportSession.objects.filter(
            mentor=request.user
        )
        
        serializer = SupportSessionSerializer(sessions, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = SupportSessionSerializer(
            data=request.data, 
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)