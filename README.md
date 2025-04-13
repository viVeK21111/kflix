### Run the project
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
Note: The site will be running on localhost:5173 or <your_local_ipv4>:5173.
To host on local network ipv4, change the url in vite.config to your ipv4.

### screenshots

![Homescreen](/homepage2.png)
<br><br>
AI powered chat by multiple LLMs
<br><br>
![chat page2](/chatf1.png)
<br><br>
Streaming by Third party services
<br><br>
![watch page](/watchpagetv.png)
<br>

### Technology stack
-> Mongodb for user data <br>
-> Express and node js for backend server <br>
-> vite, tailwind css, js for frontend server <br>
-> Gemini llm api for chat search <br>
-> TMDB api for movie data <br>

### Features
-> All movies and tv shows are for free <br>
(Note: This site doesn't store any movies or tv shows, all are grabbed from third party streaming services)<br>
-> User profile with Settings which includes Security,History,Contact us <br>
-> Watchlist to save movies or Tv shows <br>
-> Gemini llm chat for the user to search any movie or tv with specific details or based on users taste <br>
-> Dedicated Search to search tv,movies or person <br>
-> User authentication (only if loggedin the user can access the content) <br>
-> Similar movies or tv shows are displayed when a particular content is viewed by the user <br>

### Deployment 
Frontend deployed on vercel, backend deployed on render. <br>
Link: https://kflix-mocha.vercel.app/