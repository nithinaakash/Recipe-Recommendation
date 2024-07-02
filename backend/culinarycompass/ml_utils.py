import os
import pickle
import numpy as np
import pandas as pd
from django.conf import settings
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
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

def load_embeddings_and_vectorizer():
    embeddings_path = os.path.join(settings.BASE_DIR, 'culinarycompass', 'ml_models', 'combined_embeddings1.pkl')
    vectorizer_path = os.path.join(settings.BASE_DIR, 'culinarycompass', 'ml_models', 'tfidf_vectorizer1.pkl')
    with open(embeddings_path, 'rb') as f:
        combined_embeddings = pickle.load(f)
    with open(vectorizer_path, 'rb') as f:
        vectorizer = pickle.load(f)
    return combined_embeddings, vectorizer

def find_similar_recipes(combined_embeddings, vectorizer, user_input, num_similar=5):
    user_data = pd.DataFrame({'text_data': [user_input]})
    user_data['text_data'] = user_data['text_data'].str.lower()
    user_vectorized_data = vectorizer.transform(user_data['text_data'])
    num_missing_features = combined_embeddings.shape[1] - user_vectorized_data.shape[1]
    if num_missing_features > 0:
        user_vectorized_data = np.pad(user_vectorized_data.toarray(), ((0, 0), (0, num_missing_features)))
    cosine_sim_matrix = cosine_similarity(user_vectorized_data, combined_embeddings)
    similar_recipes = cosine_sim_matrix[0].argsort()[::-1][:num_similar]
    return similar_recipes
