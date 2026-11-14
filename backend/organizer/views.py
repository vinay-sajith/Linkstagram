from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework import generics
from .models import*
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from .authentication import CookieJWTAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from .permissions import IsOwner
from rest_framework_simplejwt.tokens import RefreshToken,TokenError
import requests
from django.db import transaction
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from django.conf import settings

N8N_WEBHOOK_URL = "http://localhost:5678/webhook/linkstagram-resource"
class ResourceAPIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated,IsOwner]

    def get(self, request, pk=None):

        if pk==None:


            resource=Resource.objects.filter(owner=request.user)
            category_id = request.query_params.get("category_id")
            if category_id:
                resource=resource.filter(category_id=category_id)
            serialized_resource = ResourceSerializer(resource, many=True)


        else:
            resource=get_object_or_404(Resource,id=pk)
            self.check_object_permissions(request,resource)
            serialized_resource = ResourceSerializer(resource)

        return Response(serialized_resource.data)
        
    
    def post(self,request):
        serialized_resource= ResourceSerializer(data=request.data,context={"request":request})
        if serialized_resource.is_valid():
            serialized_resource.save()
            return Response(serialized_resource.data,status=201)
        else:
            return Response(serialized_resource.errors,status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        with transaction.atomic():
            resource = get_object_or_404(
        Resource,
        id=pk
    )
            self.check_object_permissions(request,resource)
            category = resource.category
            resource.delete()
            if not category.resource_set.exists():
                category.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self,request,pk):
        resource=get_object_or_404(Resource,id=pk)
        self.check_object_permissions(request,resource)
        serialized_resource= ResourceSerializer(resource,data=request.data,context={"request":request})
        if serialized_resource.is_valid():
            serialized_resource.save()
            return Response(serialized_resource.data)
        
        else:
            return Response(serialized_resource.errors,status=status.HTTP_400_BAD_REQUEST)


    def patch(self,request,pk):
        resource=get_object_or_404(Resource,id=pk)
        self.check_object_permissions(request,resource)
        serialized_resource = ResourceSerializer(resource,data=request.data,partial=True,context={"request":request})
        if serialized_resource.is_valid():
            serialized_resource.save()
            return Response(serialized_resource.data)
        else:
            return Response(serialized_resource.errors,status=status.HTTP_400_BAD_REQUEST)

class RegisterAPIView(APIView):
    def post(self,request):
        serializeruser=UserSerializer(data=request.data)
        if serializeruser.is_valid():
            serializeruser.save()
            return Response("successfull",status=status.HTTP_201_CREATED)
        return Response(serializeruser.errors,status=status.HTTP_400_BAD_REQUEST)

class LoginAPIView(APIView):
    def post(self,request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data["username"]
            password = serializer.validated_data["password"]
            user= authenticate(username=username,password=password)
            if user is not None:
                refresh = RefreshToken.for_user(user)
                access = refresh.access_token
                response = Response({"message": "Login successful"})
                response.set_cookie(key="refresh",value=str(refresh),httponly=True,secure=False,samesite="Lax",)
                response.set_cookie(key="access",value=str(access),httponly=True,secure=False,samesite="Lax",)
                return response            
            else:
                return Response("invaild username or password",status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class AIResourceAPIView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes=[IsAuthenticated]
    def post(self, request):
        url = request.data.get("url")
        if not url:
            return Response(
            {"error": "URL is required"},
            status=status.HTTP_400_BAD_REQUEST
        )
        try:
            response = requests.post(
            N8N_WEBHOOK_URL,
            json={"url": url},
            timeout=60
        )
            response.raise_for_status()
            resource_data = response.json()
            serialized_resource = ResourceSerializer(data=resource_data,context={"request": request})
            if serialized_resource.is_valid():
                serialized_resource.save()
                return Response(serialized_resource.data,status=201)
            else:
                return Response(serialized_resource.errors,status=status.HTTP_400_BAD_REQUEST)

        except ValueError:
            return Response(
        {"error": "n8n returned invalid JSON"},
        status=status.HTTP_502_BAD_GATEWAY
    )


class TokenRefreshAPIView(APIView):
    def post(self, request):

        raw_token = request.COOKIES.get("refresh")

        if raw_token is None:
            return Response(
                {"error": "Refresh token does not exist"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            token_serializer = TokenRefreshSerializer(
                data={"refresh": raw_token}
            )

            token_serializer.is_valid(raise_exception=True)

            token = token_serializer.validated_data

            response = Response({
                "message": "Token refreshed successfully"
            })

            response.set_cookie(
                key="access",
                value=token["access"],
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax",
                path="/"
            )

            response.set_cookie(
                key="refresh",
                value=token["refresh"],
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax",
                path="/"
            )

            return response

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_401_UNAUTHORIZED
            )


class CategoryListAPIView(generics.ListAPIView):
    authentication_classes = [CookieJWTAuthentication]


    serializer_class = CategorySerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(owner=self.request.user)



