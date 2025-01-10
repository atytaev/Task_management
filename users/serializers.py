import re

from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_password(self, value):
        # Проверка пароля
        if len(value) < 8:
            raise serializers.ValidationError("Пароль должен быть не менее 8 символов.")
        if not re.search(r'[A-Z]', value):  # Проверка на заглавную букву
            raise serializers.ValidationError("Пароль должен содержать хотя бы одну заглавную букву.")
        if not re.search(r'\d', value):  # Проверка на цифру
            raise serializers.ValidationError("Пароль должен содержать хотя бы одну цифру.")
        if not re.match(r'^[A-Za-z\d]+$', value):  # Проверка на латинские буквы и цифры
            raise serializers.ValidationError("Пароль должен содержать только латинские буквы и цифры.")
        return value

    def create(self, validated_data):
        # Хешируем пароль при создании пользователя
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Старый пароль неверен.")
        return value

    def validate_new_password(self, value):
        # Проверяем, что пароль содержит латинские буквы, хотя бы одну заглавную и может включать цифры
        if not re.match(r'^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$', value):
            raise serializers.ValidationError(
                "Пароль должен содержать только латинские буквы, хотя бы одну заглавную букву и хотя бы одну цифру."
            )
        if len(value) < 8:
            raise serializers.ValidationError("Пароль должен быть не менее 8 символов.")
        return value