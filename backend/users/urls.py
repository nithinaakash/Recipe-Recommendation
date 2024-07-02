from django.urls import path
from users import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.UserLoginAPIView.as_view(), name='login'),
    path('profile/', views.UserProfileAPIView.as_view(), name='user_profile'),
    path('verify/', views.UserVerificationAPIView.as_view(), name='verify'),
]
