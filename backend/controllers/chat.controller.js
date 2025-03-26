
//import path from "path";
//import { fileURLToPath } from "url";
import { fetchFromTMDB } from "../services/tmdb.service.js";
//import { spawn } from 'child_process'; 
import { User } from "../models/user.model.js";
import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

export const GetMovieList = async (req, res) => {
    //const __filename = fileURLToPath(import.meta.url);
    //const __dirname = path.dirname(__filename);
    const {query} = req.body;

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

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        let prompt = query.toLowerCase();

        const moviestring = ["movie","cinema","film"]
        const tvstring = ["tv","show","anime","series","serial","cartoon"]
        
        if(moviestring.some(x => prompt.includes(x))) {
            prompt += '.\nResponse Instructions: Give the movie names in json string format "{"movies": ["movie1","movie2","movie3"]} and have a lite engaging conversation before giving json.\n Note(must give json in the response by finding any movies or else just text explaining why you cant find)'
        }

        else if(tvstring.some(x=> prompt.includes(x))) {
            prompt += '.\nResponse Instructions: Give tvshows names in json string format "{"tv": ["tv1","tv2","tv3"]}" and have a lite engaging conversation before giving json.\n Note(must give json in the response by finding any content or else just text explaining why you cant find)'
        }
        else {
            prompt+=" \nNote: You are a chatbot called 'Klix' which is being used in movie and tv streaming platform. Address the user query in a freindly manner and ask what they want to watch if required. If user asks any question out of the movies or tv context, try to give response according to the users context."
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
        result = result.response.text();
        console.log("result \n"+result);
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
            return res.json({success:false,message:`Sorry,No ${content} found`});
        }
        console.log("tmdb content fetched successfully");
        return res.json({success:true,introText:introText,content:resf,contentType:contents});
    }
    catch(error) {
        return res.status(500).json({success:false,message:error.message});
    }
}



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
        