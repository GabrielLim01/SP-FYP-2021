import warnings
# from newspaper import Article
import _random
import _string
import nltk

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

import sys

warnings.filterwarnings('ignore')

# Download the punkt package
nltk.download('punkt', quiet=True)

# Open text file with optimized data
# client\\src\\components\\chatbot\\
f = open("client\\src\\components\\chatbot\\content.txt", "r")
content = f.read()
# print("Content", content)

# Print the articles text
# print(corpus)

# Tokenization
# text = corpus
# sentence_list = nltk.sent_tokenize(text)  # A list of sentences
sentence_list = nltk.sent_tokenize(content)

# Print the list of sentences
# print(sentence_list)


def index_sort(list_var):
    length = len(list_var)
    list_index = list(range(0, length))

    x = list_var
    for i in range(length):
        for j in range(length):
            if x[list_index[i]] > x[list_index[j]]:
                # swap
                temp = list_index[i]
                list_index[i] = list_index[j]
                list_index[j] = temp

    return list_index


# Create the bots response
# print("This is printing the 1 index:", sys.argv[1])
theUserInput = sys.argv[1]


def bot_response(theUserInput):
    user_input = theUserInput.lower()
    sentence_list.append(user_input)
    bot_response = ''
    cm = CountVectorizer().fit_transform(sentence_list)
    similarity_scores = cosine_similarity(cm[-1], cm)
    similarity_scores_list = similarity_scores.flatten()
    index = index_sort(similarity_scores_list)
    index = index[1:]
    response_flag = 0

    j = 0
    for i in range(len(index)):
        if similarity_scores_list[index[i]] > 0.25:
            bot_response = bot_response+' '+sentence_list[index[i]]
            response_flag = 1
            j = j+1
        if j > 2:
            break

    if response_flag == 0:
        bot_response = bot_response+' '+"Sorry, I don't understand."

    sentence_list.remove(user_input)
    return bot_response


response = bot_response(theUserInput)
print(response)
