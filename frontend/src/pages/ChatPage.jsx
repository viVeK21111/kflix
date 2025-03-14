import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { chatStore } from "../store/chat";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";

export default function Chatbot() {
  const [query, setQuery] = useState("");
  const [Loading,setLoading] = useState(false);
  const [pLoading,setpLoading] = useState(true);
  const {getdata,data,contentType} = chatStore();

  useEffect(() => {
 
    const logoImage = new Image();
    logoImage.src = '/batman.jpg';
    

    logoImage.onload = () => {
      setpLoading(false);
    };
    
    // Fallback in case image doesn't load properly
    logoImage.onerror = () => {
      setpLoading(false);
    };
    
    // Add a fallback timeout to ensure we don't get stuck loading
    const timeout = setTimeout(() => {
      setpLoading(false);
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await getdata({query});
   setLoading(false);
  }
  console.log("contentType "+contentType);


  //console.log("data "+data);
  if(pLoading) {
    return (
      <p className="flex text-red-600 bg-slate-950 justify-center items-center text-xl h-screen w-full font-bold">
      I am Batman...!
    </p>
    )
  }
  return (
      <div
        className='h-screen w-full chat-bg overflow-auto'
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.2)), url('batman.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
    
        }}
      > 
      <header className='flex justify-center xl:justify-start p-4'>
        <Link to={'/'} className='flex items-center'>
        <img src={'/kflix2.png'} alt='logo' className='w-28 md:w-44'
        />
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
  <div className="flex justify-center px-2 xl:px-0 mb-3">
     <div className="mt-4 max-w-6xl text-white bg-gray-800 p-4 rounded-lg w-full">
    <h2 className="font-semibold mb-3 text-lg border-b pb-2">Response:</h2>
    {/* Movie Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
    
    {data.map((item, index) => (
          <Link 
            key={item.id || index} 
            to={`/${contentType === 'movies' ? 'watch' : 'tv/details'}/?id=${item?.id}&name=${item?.name || item?.title}`}
            onClick={() => window.scroll(0,0)}
          >
            <div className=" rounded-lg bg-slate-900 shadow-md hover:scale-105 transition-transform">
              <img 
                src={`${ORIGINAL_IMG_BASE_URL}${item?.backdrop_path || item?.poster_path}`} 
                className="w-full h-40 sm:h-48 object-cover rounded-t-lg" 
                alt={item?.title || item?.name} 
              />
              <h3 className="text-lg font-bold text-white p-2">{item.title || item.name}</h3>
              <p className="text-sm text-gray-300 pb-2 pl-2">
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
