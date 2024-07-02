# culinarycompass/views.py
import json
import random
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import SampleRecipe, UserSearchHistory
from .helpers import temp_data
from .serializers import RecipeListSerialzer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes, authentication_classes
import pickle
import numpy as np
import pandas as pd
import os
from django.conf import settings
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
import gensim
from gensim.models import Word2Vec
from nltk.stem import PorterStemmer
from nltk.corpus import stopwords
import string

nltk.download('stopwords')
stemmer = PorterStemmer()
ENGLISH_STOP_WORDS = stopwords.words('english')

def recipe_tokenizer(sentence):
    for punctuation_mark in string.punctuation:
        sentence = sentence.replace(punctuation_mark, '').lower()
    listofwords = sentence.split(' ')
    listofstemmed_words = [stemmer.stem(word) for word in listofwords if word not in ENGLISH_STOP_WORDS and word != '']
    return listofstemmed_words

# Function for word embedding using Word2Vec
def word_embedding(sampled_data, column):
    # Tokenize the text data
    tokenized_data = sampled_data[column].apply(recipe_tokenizer)

    # Train a Word2Vec model
    model = Word2Vec(tokenized_data, vector_size=100, window=5, min_count=1, workers=4)

    # Create word embeddings for each word in the vocabulary
    embeddings = {word: model.wv[word] for word in model.wv.index_to_key}

    return embeddings

def load_embeddings_and_vectorizer(sampled_data):
    embeddings_path = os.path.join(settings.BASE_DIR, 'culinarycompass', 'ml_models', 'combined_embeddings1.pkl')
    vectorizer_path = os.path.join(settings.BASE_DIR, 'culinarycompass', 'ml_models', 'tfidf_vectorizer1.pkl')
    try:
        with open(embeddings_path, 'rb') as f:
            combined_embeddings = pickle.load(f)
    except Exception as e:
        print({'error': str(e)})
        return JsonResponse({'error': str(e)}, status=500)
    try:
        vectorizer = TfidfVectorizer(min_df=5, tokenizer=recipe_tokenizer)
        sampled_data['text_data'] = sampled_data[['name', 'tags', 'description']].astype(str).agg(' '.join, axis=1).str.lower()
        vectorized_data = vectorizer.fit_transform(sampled_data['text_data'])
    except Exception as e:
        print({'error58': str(e)})
        return JsonResponse({'error': str(e)}, status=500)
    
    return combined_embeddings, vectorizer

def find_similar_recipes(user_input, num_similar=6):
    
    data_path = os.path.join(settings.BASE_DIR, 'culinarycompass', 'ml_models', 'food.pkl')
    full_data = pd.read_pickle(data_path)
    sampled_data = full_data.sample(frac=0.25, random_state=42)
    combined_embeddings, vectorizer = load_embeddings_and_vectorizer(sampled_data)
    user_data = pd.DataFrame({'text_data': [user_input]})
    user_data['text_data'] = user_data['text_data'].str.lower()
    user_vectorized_data = vectorizer.transform(user_data['text_data'])
    num_missing_features = combined_embeddings.shape[1] - user_vectorized_data.shape[1]
    if num_missing_features > 0:
        user_vectorized_data = np.pad(user_vectorized_data.toarray(), ((0, 0), (0, num_missing_features)))
    cosine_sim_matrix = cosine_similarity(user_vectorized_data, combined_embeddings)
    similar_recipes = cosine_sim_matrix[0].argsort()[::-1][:num_similar]
    fields = ['name', 'id', 'minutes', 'tags', 'n_steps', 'steps', 'description', 'ingredients', 'n_ingredients', 'calories', 'total_fat', 'sugar', 'sodium', 'protein', 'saturated_fat', 'carbohydrates', 'dairy-free', 'gluten-free', 'low-carb', 'vegan', 'vegetarian', 'recipe_id', 'average_rating']
    similar_recipe_json = sampled_data.iloc[similar_recipes][fields].to_json(orient='records')
    # similar_recipe_names = sampled_data.iloc[similar_recipes]['name'].tolist()
    return similar_recipe_json

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def recipe_recommendation(request):
    user_input = request.data.get('user_input', '')
    # check if user_input is available in UserSearchHistory and return search_results
    search_history = UserSearchHistory.objects.filter(search_query=user_input).first()
    if search_history is not None:
        return JsonResponse({'similar_recipes':search_history.search_data})
    else:
        try:
            similar_recipe_names = json.loads(find_similar_recipes(user_input))
            # save search history
            search_data = {'user_id': request.user.id, 'search_query': user_input, 'search_data': similar_recipe_names}
            search_history = UserSearchHistory.objects.create(**search_data)
            return JsonResponse({'similar_recipes': similar_recipe_names})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def RecipeListAPIView(request):
    rand_entities = random.sample(range(150),9)
    sampled_data = SampleRecipe.objects.filter(id__in=rand_entities).all()
    serializer = RecipeListSerialzer(sampled_data, many=True)
    return JsonResponse(serializer.data, safe=False)
