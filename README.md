### Setting Up
#### Backend
```sh
npm install
npm start
```
#### Frontend
```sh
npm install
npm run dev
```
Note: The site will be running on localhost:5173 or <local_ipv4>:5173.
Configure vite.config to host on local network.

### screenshots

![Homescreen](/homepage2.png)
<br><br>
AI powered chat by multiple LLMs
<br><br>
![chat page2](/chatf1.png)
<br><br>
Streaming by Third party services
<br><br>
![watch page](/watchpagetv1.png)
<br>

### Technology stack
-> Mongodb for user data <br>
-> Express and node js for backend server <br>
-> vite,react, tailwind css, js for frontend server <br>
-> Gemini llm api and other llms like llama-scout and deepseek-distilled-llama are provided by vercel <br>
-> TMDB api for movie data <br>

### Features
-> All movies and tv shows are for free <br>
(Note: This site doesn't store any movies or tv shows, all are grabbed from third party streaming services)<br>
-> User profile with Settings which includes Security,History and Contact us <br>
-> Watchlist to save movies or Tv shows <br>
-> Chatbot for the user to search any movie or tv with specific details or for custom recommendations <br>
-> Dedicated Search to search tv,movies or person <br>
-> User authentication(jwt) (only loggedin users can access the content) <br>
-> Similar movies or tv shows are displayed when a particular content is viewed by the user <br>
-> History (Search History,chat history and Watch history)

### Deployment 
Frontend server deployed on vercel, backend server deployed on render. <br>
Link: https://kflix-mocha.vercel.app
Custom domain: https://kflix.site

### Documentation
In detailed documentation of kflix platform
Link: https://tinyurl.com/kflixsite
