from django.conf import settings 
from django.contrib import admin 
from django.urls import include, path 
from api import views 
from rest_framework_simplejwt.views import TokenRefreshView  # type: ignore
from django.conf.urls.static import static 
 
urlpatterns = [ 
    path('admin/', admin.site.urls), 
    path('api/', include([
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
    ])), 
] 

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)