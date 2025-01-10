from django.urls import path
from .views import RegisterView, LogoutView, ChangePasswordView, CustomTokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
]
