
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { fetchFromTMDB } from "../services/tmdb.service.js";
import { json } from "stream/consumers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const GetMovieList = async (req, res) => {
    const {query} = req.body;
    if(query.length==0){
       return res.status(500).json({success:false,message:"Query can't be empty"});
    }
        // Call Python script
       
        const pythonScriptPath = path.join(__dirname, "Gemini.py"); // Correct script path
        exec(`python ${pythonScriptPath} "${query}"`, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                return res.status(500).json({ error: "Error processing request" });
            }
            try {
            let result1 = ''
            let content = ''
            console.log(stdout);
            const result = JSON.parse(stdout); // json string to json object
            console.log(result);
            if("movie" in result) {
                content = "movie"
                result1 = result[content]
                console.log("movies successful via gemini")
            }
            else if("tv" in result) {
                content = "tv"
                result1 = result[content]
                console.log("tv successful via gemini")
            }
            else if("nocontext" in result) {
                result1 = result['nocontext']
                console.log("chat successful via gemini")
                res.json({content:result1})
                return;
            }
            else {
                result1 = result['error']
                console.log("chat unsuccessfull")
                res.json({content:result1})
                return;
            }
           
            const resf = []
           
                for(let i=0;i<result1.length;i++) {
                    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/search/${content}?query=${result1[i]}&language=en-US&page=1`);
                    const movie = data.results;
                    if(movie.length===0) {
                        continue;
                    }
                    resf.push(movie);
                }
                if(resf.length===0) {
                    return res.json({success:false,message:"Sorry,Error fetching content"});
                }
                console.log("content fetched successfully");
                return res.json({content:resf});
            }
          catch(error) {
              console.log("Error in searching movies: "+error.message);
              return res.status(500).json({success:false,message:error.message});
          }
           
        });
}
        