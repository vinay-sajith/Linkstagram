from rest_framework import serializers
from .models import Resource,Category
from django.contrib.auth.models import User

class ResourceSerializer(serializers.ModelSerializer):
    category=serializers.CharField()#it help to take our categoryname as character which was prevously it only take id i.e primary key field cause resourse's category is forign key field 
    class Meta:
        model=Resource
        fields = "__all__"
        extra_kwargs = {
            "owner": {"read_only": True}
        }
    def create(self, validated_data):
        category_name=validated_data["category"]
        category ,created= Category.objects.get_or_create(name=category_name,owner=self.context['request'].user)
        validated_data["category"]=category
        resource=Resource.objects.create(**validated_data,owner=self.context['request'].user)
        return resource
    
    def update(self,instance,validated_data):
        if "category" in validated_data:
            category_name=validated_data["category"]
            category ,created= Category.objects.get_or_create(name=category_name,owner=self.context['request'].user)
            validated_data["category"]=category
        for fields, values in validated_data.items():
            setattr(instance,fields,values)
        instance.save()
        return instance

    def validate_title(self,value):

        if len(value)<5:
            raise serializers.ValidationError("Title must contain at least 5 characters.")
        else:
            return value
    def validate(self, data):
        user=self.context['request'].user
        if self.instance is None:# when post method is being used 
            if Resource.objects.filter(url=data["url"],owner=user).exists():
                raise serializers.ValidationError("link already exit")
            return data
        else: #for put and patch
            if Resource.objects.filter(url=data.get("url",self.instance.url),owner=user).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError("link already exit")
            
            return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password"]


    def create(self, validated_data):
        username=validated_data["username"]
        email=validated_data["email"]
        password=validated_data["password"]
        User.objects.create_user(username=username,email=email,password=password)
        return User

class LoginSerializer(serializers.Serializer):
    username=serializers.CharField()
    password=serializers.CharField()
    




    
    