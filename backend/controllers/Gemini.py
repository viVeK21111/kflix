import sys
import json
import os
import google.generativeai as genai
import dotenv

dotenv.load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)

def get_movie_recommendations(query):
    try:
        model = genai.GenerativeModel(model_name='gemini-2.0-flash')
        query = query.lower()
        tv_keywords = ["tv", "series", "show", "serial", "anime"]
        movie_keywords = ["movie", "animation", "cartoon", "film"]
        if any(keyword in query for keyword in tv_keywords):
            query += """./nResponse Instructions: Give tvshows names in json string format "{"tv": ["tv1","tv2","tv3"]}" and no slashes in the names.
             and no other conversational or engaging text at any cost. Don't give empty json incase if u didn't find any tv shows, just give text.
             Only must give the response according to my instructions."""
            response = model.generate_content(query)
            if "json" not in response.text:
                print(json.dumps({"nocontext": response.text}))
                return
            print(response.text[7:-4])# json string
        elif any(keyword in query for keyword in movie_keywords):
            query += """./nResponse Instructions: Give the movie names in json string format "{"movies": ["movie1","movie2","movie3"]}" and no slashes in the names.
               and no other conversational or engaging text in the response. Don't give empty json incase if u didn't find any movies, just give text.
               Only must give the response according to my instructions above."""
            response = model.generate_content(query)
            if "json" not in response.text:
                print(json.dumps({"nocontext": response.text}))
                return
            else:print(response.text[7:-4])  # json string
        else:
            query += " Note: Chat in a friendly manner, like a chatbot used in movie streaming platform(kflix) and ask user whether he wants to watch some movies or tvshows"
            response = model.generate_content(query)
            print(json.dumps({"nocontext": response.text}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    user_query = sys.argv[1]  # Get input from Node.js
    get_movie_recommendations(user_query)
