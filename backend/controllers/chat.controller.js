
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { fetchFromTMDB } from "../services/tmdb.service.js";
import { spawn } from 'child_process'; 



export const GetMovieList = async (req, res) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const {query} = req.body;

    if(query.length==0){
       return res.status(500).json({success:false,message:"Query can't be empty"});
    }
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
}
        