# urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView # type: ignore
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from api import views  

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('auth/register/', views.register_view, name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', views.user_profile_view, name='user_profile'),
    path('categories/', views.SupportCategoryList.as_view(), name='category_list'),
    path('resources/', views.ResourceListCreate.as_view(), name='resource_list'),
    path('resources/category/<int:category_id>/', views.resources_by_category, name='resources_by_category'),
    path('sessions/', views.UserSessions.as_view(), name='user_sessions'),
    path('sessions/<int:pk>/', views.SupportSessionDetail.as_view(), name='session_detail'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
