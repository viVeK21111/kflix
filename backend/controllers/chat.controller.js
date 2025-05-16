
//import path from "path";
//import { fileURLToPath } from "url";
import { fetchFromTMDB } from "../services/tmdb.service.js";
//import { spawn } from 'child_process'; 
import { User } from "../models/user.model.js";
import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Groq } from 'groq-sdk';

export const GetMovieList = async (req, res) => {
    //const __filename = fileURLToPath(import.meta.url);
    //const __dirname = path.dirname(__filename);
    const {query,history,aimodel} = req.body;
    const user = await User.findById(req.user._id);
    const username = user?.username;

    if(query.length==0){
       return res.status(500).json({success:false,message:"Query can't be empty"});
    }   
        // save query in chathistory
        await User.findByIdAndUpdate(req.user._id,{
            $push:{
                chatHistory:{
                query : query,
            }
        }});
        const systemInstruction = `
      You are a chatbot named 'Flix' on a movie and TV streaming platform. 
      Address the user by his name '${username}' in a friendly manner. 
      Your task is to assist the user in finding movies or TV shows only if the user ask about movies or tv shows.
      If prompt includes movies (e.g., "movie", "cinema", "film"), respond with a light, engaging conversation followed by a JSON string like {"movies": ["movie1", "movie2", .... , "movie(n)"]} Give atleast 5 movie names or based on the user preference. 
      If prompt includes TV shows (e.g., "tv", "show", "anime", "series", "serial", "cartoon"), respond with a light conversation followed by a JSON string like {"tv": ["tv1", "tv2",...., "tv(n)"]} Give atleast 5 tv shows or based on user preference. 
      If prompt includes multiple genres, put all of them in single json string {"movies": ["movie1", "movie2",...., "movie(n)"]} or {"tv": ["tv1", "tv2",...., "tv(n)"]}
      For normal greetings or conversations, respond with a friendly message and ask the user what they would like to watch.
      If no specific content is found or explicit prompt is found, chat in engaging manner why you can't find it. 
      If the user asks any question outside of movies or TV context, try to give a response according to the user's context.

    `;
        const conversationHistory = history || []; // Default to empty if no history

        
        let prompt = query.toLowerCase();
        let result;
        let modelname = "llama-3.3-70b-versatile";

       

        if(aimodel==="Gemini") {
            console.log(`${aimodel} model called`)
            const formattedHistory = conversationHistory.map(item => [
                { role: 'user', parts: [{ text: item.query }] },
                { role: 'model', parts: [{ text: item.datatext || 'No response' }] },
            ]).flat();
            try {
                const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash",systemInstruction });
                const chat = model.startChat({
                    history: formattedHistory,
                    generationConfig: {
                      maxOutputTokens: 500, // Adjust as needed
                      temperature: 0.7,
                    },
                  });
              
                result = await chat.sendMessage(prompt);
                result = result.response.text();
            }
           catch (error) {
                return res.status(500).json({success:false,message:error.message});
            }
    
        }
        else {
            if(aimodel==="llama-3.3") {
                console.log(`${aimodel} model called`)
                modelname = "llama-3.3-70b-versatile"
            }
            else if(aimodel==="llama-4-scout"){
                console.log(`${aimodel} model called`)
                modelname = "meta-llama/llama-4-scout-17b-16e-instruct"
            }
            else if(aimodel==="deepseek-r1") {
                console.log(`${aimodel} model called`)
                modelname = "deepseek-r1-distill-llama-70b"
            }
            const messages = []
            messages.push({ role: 'system', content: systemInstruction });
            if (conversationHistory && Array.isArray(conversationHistory)) {
                conversationHistory.forEach((entry) => {
                  if (entry.query) {
                    messages.push({ role: 'user', content: entry.query });
                  }
                  if (entry.datatext) {
                    messages.push({ role: 'assistant', content: entry.datatext });
                  }
                });
            }
            messages.push({ role: 'user', content: prompt });
            const groq = new Groq({ apiKey: process.env.YOUR_SECRET });
            try {
                const response = await groq.chat.completions.create({
                  model: modelname,
                  messages: messages,
                  temperature: 0.7,
                });

                result = response.choices[0].message.content;
                result = result.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();
               

              } catch (error) {
                return res.status(500).json({success:false,message:error.message});
              }
        
        }

        
        try {
       //console.log("result \n"+result);
        let introText;
        let result1;
        let jsonMatch = result.match(/([\s\S]*?)```json([\s\S]*?)```/);
        if (jsonMatch) {
            const jsonString = jsonMatch[2].replace(/```json|```/g, '').trim();
            introText = ((jsonMatch[1]).trim() || "");
            result1 = JSON.parse(jsonString);
        } 
        else {
            jsonMatch = result.match(/([\s\S]*?)({[\s\S]*})/);
            if(jsonMatch) {
                const jsonString = jsonMatch[2].trim();
                introText = ((jsonMatch[1]).trim() || "");
                result1 = JSON.parse(jsonString);
            }
            else {
                introText = result;
                return res.json({success:true,nocontext:introText});
            }
            
        }
        
       
        let content = ""
        let contents = ""
        if("movies" in result1) {
            content = "movie"
            contents = "movies"
            console.log("movies successful via gemini")
        }
        else if ("tv" in result1) {
            content = "tv"
            contents = content
            console.log("tv successful via gemini")
        }
        result1 = result1[contents];
        const resf = []
    
        for(let i=0;i<result1.length;i++) {
            const data = await fetchFromTMDB(`https://api.themoviedb.org/3/search/${content}?query=${result1[i]}&language=en-US&page=1`);
            const movie = data.results;
            if(movie.length===0) {
                continue;
            }
            resf.push(movie[0]);
        }
        if(resf.length===0) {
            return res.json({success:true,introText:`Sorry,No ${content} found`});
        }
        console.log("tmdb content fetched successfully");
        return res.json({success:true,introText:introText,content:resf,contentType:contents});
    }
    catch(error) {
        return res.status(500).json({success:false,message:error.message});
    }
}


         /*
        const moviestring = ["movie","cinema","film"]
        const tvstring = ["tv","show","anime","series","serial","cartoon"]
        
        if(moviestring.some(x => prompt.includes(x))) {
            prompt += '.\nResponse Instructions: Give the movie names in json string format "{"movies": ["movie1","movie2","movie3"]} and have a lite engaging conversation before giving json.\n Note(must give json in the response by finding any movies or else just text explaining why you cant find)'
        }

        else if(tvstring.some(x=> prompt.includes(x))) {
            prompt += '.\nResponse Instructions: Give tvshows names in json string format "{"tv": ["tv1","tv2","tv3"]}" and have a lite engaging conversation before giving json.\n Note(must give json in the response by finding any content or else just text explaining why you cant find)'
        }
        else {
            prompt+=` \nNote: You are a chatbot called 'Flix' which is being used in movie and tv streaming platform. Address the user ${username}'s query in a freindly manner and ask what they want to watch if required. If user asks any question out of the movies or tv context, try to give response according to the users context.`
            try {
                let result = await model.generateContent(prompt);
                return res.json({success:true,nocontext:result.response.text()});
            }
           catch(error) {
            return res.status(500).json({success:false,message:error.message});
           }
        }
        try {
        let result = await model.generateContent(prompt);
        */
        /*
        // Call Python script
        const pythonScriptPath = path.join(__dirname, "Gemini.py"); // Correct script path
        const pythonProcess = spawn('python', [pythonScriptPath, query]); 
        pythonProcess.stdout.on('data', async (data) => { 
                let content = 'content'
                console.log(`Python script output: ${data}`);
                try {
                    let result1 = ''
                    let contents = ''
                    let result = JSON.parse(data); // json string to json object
                    if (typeof result === "string") {
                        result = JSON.parse(result);  // Parse again if still string
                    }
                    console.log("after parsing: "+result)
                    if("movies" in result) {
                        content = "movie"
                        contents = "movies"
                        result1 = result[contents]
                        console.log("movies successful via gemini")
                    }
                    else if("tv" in result) {
                        content = "tv"
                        contents = "tv"
                        result1 = result[content]
                        console.log("tv successful via gemini")
                    }
                    else if("nocontext" in result) {
                        result1 = result['nocontext']
                        contents = "text"
                        console.log("chat successful via gemini")
                        return res.json({content:result1,contentType:contents});
                    }
                    else {
                        result1 = result['error']
                        console.log("chat unsuccessfull")
                        return res.json({content:result1});
                    }
                   
                    const resf = []
                   
                        for(let i=0;i<result1.length;i++) {
                            const data = await fetchFromTMDB(`https://api.themoviedb.org/3/search/${content}?query=${result1[i]}&language=en-US&page=1`);
                            const movie = data.results;
                            if(movie.length===0) {
                                continue;
                            }
                            resf.push(movie[0]);
                        }
                        if(resf.length===0) {
                            return res.json({success:false,message:"Sorry,Error fetching content"});
                        }
                        console.log("content fetched successfully");
                        return res.json({content:resf,contentType:contents});
                    }
                  catch(error) {
                      console.log(`Error in searching ${content}: `+error.message);
                      return res.status(500).json({success:false,message:error.message});
                  }

            });
        /*
        exec(`python ${pythonScriptPath} "${query}"`, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                return res.status(500).json({ error: "Error processing request" });
            }
            
        });
        */
        