from django.urls import path
from recipes import views

urlpatterns = [
    path('recipe_list/', views.RecipeListAPIView, name='recipe_list'),
    path('recipe_recommendation/', views.recipe_recommendation, name='recipe_recommendation'),
]
