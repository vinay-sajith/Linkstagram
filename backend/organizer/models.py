from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Category(models.Model):
    name=models.CharField(max_length=100)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    def __str__(self):
        return self.name

class Resource(models.Model):
    title=models.CharField(max_length=100)
    url=models.URLField()
    category=models.ForeignKey(Category,on_delete=models.CASCADE)#means deleting a category model delete the resourse attched on it
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title