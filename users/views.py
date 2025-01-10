from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from .serializers import UserSerializer, ChangePasswordSerializer


# Регистрация нового пользователя
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        """
        Переопределим метод создания, чтобы обработать ошибки.
        """
        serializer = self.get_serializer(data=request.data)
        try:
            # Попытка выполнить валидацию и создание пользователя
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            # В случае ошибки валидации, выводим её в ответе
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

# Выход и аннулирование токенов
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()  # Черный список refresh токена
            return Response({"message": "Вы успешно вышли из системы."})
        except Exception as e:
            return Response({"error": str(e)}, status=400)

#Смена пароля
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"message": "Пароль успешно изменен."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# обновления токенов
class CustomTokenRefreshView(TokenRefreshView):
    pass