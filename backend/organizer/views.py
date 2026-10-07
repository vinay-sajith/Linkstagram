from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from .models import*
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from .permissions import IsOwner
from rest_framework.authtoken.models import Token
class ResourceAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated,IsOwner]

    def get(self, request, pk=None):

        if pk==None:

            resource=Resource.objects.filter(owner=request.user)
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
        resource = get_object_or_404(
        Resource,
        id=pk
    )
        self.check_object_permissions(request,resource)
        resource.delete()
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
                token, created=Token.objects.get_or_create(user=user)
                return Response({"token":token.key})
                return Response("login successful")
            else:
                return Response("invaild username or password",status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        