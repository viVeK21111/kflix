import { useState } from "react";
import { Link } from "react-router-dom";
import { chatStore } from "../store/chat";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";

export default function Chatbot() {
  const [query, setQuery] = useState("");
  const [Loading,setLoading] = useState(false);

  const {getdata,data} = chatStore();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await getdata({query});
   setLoading(false);
  }
  console.log('Fetched Data:', data);
  return (
    <div className='h-screen w-full chat-bg overflow-auto'>
       <header className='max-w-6xl flex items-left justify-left p-4'>
        <Link to={'/'} className='flex items-center'>
        <img src={'/kflix2.png'} alt='logo' className='w-52' />

        </Link>
      </header>
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-2xl max-h-screen bg-slate-900/55 shadow-md p-8 rounded-lg">
      <div className="flex items-center">
      <h1 className="text-3xl ml-52 font-bold mb-4 text-red-700">Flix Chat</h1>
      <img src={'/chat.png'} alt="chat" className="w-10 ml-3" />
      </div>
      

    <form onSubmit={onSubmit} className="space-y-4 mt-3">
      <div>
      <label className="text-white font-semibold text-lg items-center">Ask Me anything</label>
      <input
      type="text" className="my-5 p-2 bg-black text-white border rounded-lg w-full" placeholder="Whats on your mind...!"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      />
      </div>
     
      <button
      className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
      Search
      </button>
    </form>
    {Loading && (
            <p className=" text-white mt-4">Loading...</p>
      )}
    
    </div>
    </div>
   
    {!Loading && data && (
    Array.isArray(data) ? (
  <div className="flex items-center mx-40 justify-center"> 
  <div className="mt-4 text-white bg-gray-800 p-4 rounded-lg w-full">
    <h2 className="font-semibold mb-3 text-lg border-b pb-2">Response:</h2>
    {/* Movie Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
    
      {data.map((movie, index) => (
        <div key={index} className="p-3 border rounded-lg bg-slate-900 shadow-md hover:scale-105 transition-transform">
          <img 
            src={`${ORIGINAL_IMG_BASE_URL}${movie?.backdrop_path ||movie?.poster_path}`} 
            className="w-full h-40 object-cover rounded-lg mb-2" 
            alt={movie?.title} 
          />
          <h3 className="text-lg font-bold text-white mb-1">{movie.title || movie.name}</h3>
          {movie?.release_date ? movie.release_date.split("-")[0] : movie?.first_air_date.split("-")[0]}
          <p className="text-sm text-gray-300">Rating: <b>{movie?.vote_average}</b> | {movie?.adult ? "18+" : "PG-13"} </p>
        </div>
      ))}
      </div>
      </div>
      </div>
    ) : (
      <div className="flex items-center justify-between">
      <div className="mx-auto max-w-2xl max-h-screen justify-center p-3 border rounded-lg bg-slate-900 shadow-md">
        <p className="text-white text-center">{data}</p>
      </div>
      </div>
      )
)}

    </div>

  );
}
