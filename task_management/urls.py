from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.views.generic import TemplateView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('tasks.urls')),
    path('api-auth/', include('rest_framework.urls')),
    path('users/', include('users.urls')),
    path('', TemplateView.as_view(template_name='index.html')),
    path('<path:path>/', TemplateView.as_view(template_name='index.html')),
]