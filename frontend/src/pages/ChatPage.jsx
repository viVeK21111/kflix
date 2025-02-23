import { useState } from "react";
import { Link } from "react-router-dom";
import { chatStore } from "../store/chat";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";

export default function Chatbot() {
  const [query, setQuery] = useState("");
  const [Loading,setLoading] = useState(false);
  const {getdata,data,contentType} = chatStore();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await getdata({query});
   setLoading(false);
  }
  console.log("contentType "+contentType);
  //console.log("data "+data);
  return (
    <div className='h-screen w-full chat-bg overflow-auto'>
       <header className='max-w-6xl flex items-left justify-left p-4'>
        <Link to={'/'} className='flex items-center'>
        <img src={'/kflix2.png'} alt='logo' className='w-52' />
        </Link>
      </header>
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-2xl max-h-screen bg-slate-900/55 shadow-md p-8 rounded-lg">
      <div className="flex items-center justify-center">
      <h1 className="text-3xl font-bold mb-4 text-red-700">Flix Chat</h1>
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
   
    {!Loading && data && contentType && (
    Array.isArray(data) ? (
  <div className="mx-4 sm:mx-8 md:mx-16 lg:mx-24 xl:mx-32 2xl:mx-40 mt-6">
  <div className="mt-4 text-white bg-gray-800 p-4 rounded-lg w-full">
    <h2 className="font-semibold mb-3 text-lg border-b pb-2">Response:</h2>
    {/* Movie Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    
    {data.map((item, index) => (
          <Link 
            key={item.id || index} 
            to={`/${contentType === 'movies' ? 'watch' : 'tv/details'}/?id=${item?.id}&name=${item?.name || item?.title}`}
          >
            <div className="p-3 border rounded-lg bg-slate-900 shadow-md hover:scale-105 transition-transform">
              <img 
                src={`${ORIGINAL_IMG_BASE_URL}${item?.backdrop_path || item?.poster_path}`} 
                className="w-full h-40 sm:h-48 object-cover rounded-lg mb-2" 
                alt={item?.title || item?.name} 
              />
              <h3 className="text-lg font-bold text-white mb-1">{item.title || item.name}</h3>
              <p className="text-sm text-gray-300">
                {item?.release_date?.split("-")[0] || item?.first_air_date?.split("-")[0]} | 
                Rating: <b>{item?.vote_average}</b> | {item?.adult ? "18+" : "PG-13"}
              </p>
            </div>
          </Link>
        ))}</div>
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
