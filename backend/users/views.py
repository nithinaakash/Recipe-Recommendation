from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate, login
from .models import CustomUser
from .serializers import UserLoginSerializer, UserSerializer
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from .helpers import generate_verification_code, restore_verification_code, send_verification_email, store_verification_code

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(request.data['password'])
        user.save()
        code = generate_verification_code()
        store_verification_code(request.data['email'], code)
        send_verification_email(request.data['email'], code)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginAPIView(APIView):
    # send tokens only if user is verified
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if not CustomUser.objects.filter(username=request.data['username']).exists():
            return Response({'message': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        if not CustomUser.objects.get(username=request.data['username']).is_verified:
            return Response({'message': 'User is not verified'}, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)

class UserProfileAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UserVerificationAPIView(APIView):
    def post(self, request):
        email = request.data['email']
        code = request.data['code']
        stored_code = restore_verification_code(email).decode('utf-8')
        if stored_code and code == stored_code and CustomUser.objects.filter(email=email).exists() and not CustomUser.objects.get(email=email).is_verified:
            user = CustomUser.objects.get(email=email)
            user.is_verified = True
            user.save()
            return Response({'message': 'User verified successfully'}, status=status.HTTP_200_OK)
        print("Invalid verification code")
        return Response({'message': 'Invalid verification code'}, status=status.HTTP_400_BAD_REQUEST)