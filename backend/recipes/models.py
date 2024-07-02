from django.db import models
from django.contrib.postgres.fields import ArrayField
# Create your models here.
# User search history model
class UserSearchHistory(models.Model):
    user_id = models.CharField(max_length=100)
    search_query = models.CharField(max_length=100)
    search_timestamp = models.DateTimeField(auto_now_add=True)
    search_data = models.JSONField()

    def __str__(self):
        return self.user_id
    
# Sample Recipe model
class SampleRecipe(models.Model):
    snum = models.IntegerField()
    name = models.CharField(max_length=1000)
    recipe_id = models.CharField(max_length=100)
    minutes = models.IntegerField()
    tags = models.CharField(max_length=10000)
    nutrition = ArrayField(models.FloatField(default=0))
    n_steps = models.IntegerField()
    steps = ArrayField(models.CharField(max_length=10000))
    description = models.CharField(max_length=10000)
    ingredients = ArrayField(models.CharField(max_length=10000))
    n_ingredients = models.IntegerField()
    image_url = models.CharField(max_length=1000)

    def __str__(self):
        return self.user_id
