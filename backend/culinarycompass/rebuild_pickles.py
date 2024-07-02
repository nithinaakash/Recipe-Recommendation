import numpy as np
import pandas as pd
import nltk
from gensim.models import Word2Vec
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import string
import os

# Ensure necessary NLTK downloads
nltk.download('stopwords')
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

# Define the tokenizer
stemmer = PorterStemmer()
ENGLISH_STOP_WORDS = stopwords.words('english')

def recipe_tokenizer(sentence):
    sentence = sentence.translate(str.maketrans('', '', string.punctuation)).lower()
    listofwords = sentence.split(' ')
    listofstemmed_words = [
        stemmer.stem(word) for word in listofwords 
        if word not in ENGLISH_STOP_WORDS and word != ''
    ]
    return listofstemmed_words

# Function for word embedding using Word2Vec
def word_embedding(sampled_data, column):
    tokenized_data = sampled_data[column].apply(recipe_tokenizer)
    model = Word2Vec(sentences=tokenized_data, vector_size=100, window=5, min_count=1, workers=4)
    embeddings = {word: model.wv[word] for word in model.wv.index_to_key}
    return embeddings

# Main function to rebuild embeddings and vectorizer
def precompute_embeddings():
    # Assuming this script is located at the same level as the culinarycompass folder
    base_path = os.path.join(os.getcwd(), 'culinarycompass', 'ml_models')
    data_path = os.path.join(base_path, 'food.pkl')  # Update this path

    data = pd.read_pickle(data_path)
    sampled_data = data.sample(frac=0.25, random_state=42)

    # Process 'ingredients' using word2vec and other processing steps...
    # Process 'ingredients' using word2vec to create word embeddings
    embeddings = word_embedding(sampled_data, 'ingredients')

    # Concatenate relevant columns and preprocess text data
    sampled_data['text_data'] = sampled_data[['name', 'tags', 'description']].astype(str).agg(' '.join, axis=1).str.lower()

    # Vectorize the text data using TF-IDF
    vectorizer = TfidfVectorizer(min_df=5, tokenizer=recipe_tokenizer)
    vectorized_data = vectorizer.fit_transform(sampled_data['text_data'])

    # Combine the vectorized data and ingredient embeddings
    ingredient_embeddings = np.array([
        np.mean([embeddings.get(word, np.zeros(100)) for word in recipe_tokenizer(ingredients)], axis=0)
        for ingredients in sampled_data['ingredients']
    ])
    combined_embeddings = np.concatenate([vectorized_data.toarray(), ingredient_embeddings], axis=1)

    # Save paths for the .pkl files inside the ml_models folder
    combined_embeddings_path = os.path.join(base_path, 'combined_embeddings1.pkl')
    vectorizer_path = os.path.join(base_path, 'tfidf_vectorizer1.pkl')

    with open(combined_embeddings_path, 'wb') as f:
        pickle.dump(combined_embeddings, f)
    with open(vectorizer_path, 'wb') as f:
        pickle.dump(vectorizer, f)
    print("Rebuilt and saved embeddings and vectorizer in the ml_models folder.")

if __name__ == "__main__":
    precompute_embeddings()
