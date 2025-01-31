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
    if("tv" in query):
        query = query + " and give the names in list format ['tv1','tv2','tv3']"
        response = model.generate_content(query)
        print(json.dumps({"tv": response.text}))  # json string
    elif("movie" in query):
        query = query + " and give the names in list format ['movie1','movie2','movie3']"
        response = model.generate_content(query)
        print(json.dumps({"movie": response.text})) #json string
    else:
        response = model.generate_content(query)
        print(json.dumps({"nocontext": response.text}))

if __name__ == "__main__":
    user_query = sys.argv[1]  # Get input from Node.js
    get_movie_recommendations(user_query)
