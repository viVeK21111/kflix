import sys
import json
import os
import google.generativeai as genai
import dotenv

dotenv.load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)

def get_movie_recommendations(query):
    model = genai.GenerativeModel("gemini-pro")
    query = query.lower()
    if("tv" or "series" or "show" or "serial" or "anime" in query):
        query = query + " and give the names in list format ['tv1','tv2','tv3']"
        response = model.generate_content(query)
        print(json.dumps({"tv": response.text}))  # json string
    elif("movie" or "animation" or "cartoon" or "film" in query):
        query = query + " and give the names in list format ['movie1','movie2','movie3']"
        response = model.generate_content(query)
        print(json.dumps({"movie": response.text})) #json string
    else:
        query = query + "Note: Chat in a friendly manner, like a chatbot used in movie streaming platform"
        response = model.generate_content(query)
        print(json.dumps({"nocontext": response.text}))

if __name__ == "__main__":
    user_query = sys.argv[1]  # Get input from Node.js
    get_movie_recommendations(user_query)
