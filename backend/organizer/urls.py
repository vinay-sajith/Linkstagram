from django.urls import path
from . import views

urlpatterns = [
    path("resources/", views.ResourceAPIView.as_view(), name="resources"),
    path("resources/<int:pk>/", views.ResourceAPIView.as_view(), name="resource-detail"),
    path("register/",views.RegisterAPIView.as_view(),name="register"),
    path("login/",views.LoginAPIView.as_view(),name="login")
    
]