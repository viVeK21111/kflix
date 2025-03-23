import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { chatStore } from "../store/chat";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { ArrowUp } from 'lucide-react';

export default function Chatbot() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryres = queryParams.get("query");
  const [query, setQuery] = useState(queryres || "");
  const [Loading, setLoading] = useState(false);
  const [pLoading, setpLoading] = useState(true);
  const [Data, setData] = useState(null);
  const [DataText, setDataText] = useState(null);
  const [ContentType, setContentType] = useState(null);
  let { getdata, data, datatext, contentType } = chatStore();
  const [query1, setQuery1] = useState(sessionStorage.getItem("query1") || null);

  useEffect(() => {
    if (data) {
      setData(data);
    }
    if (datatext) {
      setDataText(datatext);
    }
    if (contentType) {
      setContentType(contentType);
    }
  }, [data, datatext, contentType]);

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
    setQuery1(query);
    sessionStorage.setItem("query1",query);
    setData(null);
    setDataText(null);
    e.preventDefault();
    setLoading(true);
    await getdata({ query }).finally(() => setLoading(false));
  };

  if (pLoading) {
    return (
      <p className="flex text-red-500 bg-slate-950 justify-center items-center text-xl h-screen w-full font-bold">
        I am Batman...!
      </p>
    );
  }

  return (
    <div
      className="h-screen w-full chat-bg flex flex-col"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.2)), url('batman.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    > 
      <header className="flex justify-center xl:justify-start p-4">
        <Link to={'/chat'} className="flex items-center">
          <div className="flex items-center">
            <img src={'/chat.png'} alt="chat" className="w-10" />
            <h1 className="text-3xl ml-2 font-bold text-red-700">Flix Chat</h1>
          </div>
        </Link>
      </header>
      
      {/* Main content area - takes up most of the space */}
      <div className="flex flex-col overflow-auto overflow-x-hidden scrollbar-hide rounded-lg mx-3 lg:mx-32 bg-slate-800 bg-opacity-50">
      { query1 && (
          <p className="text-white  ml-auto bg-slate-800 rounded-lg p-2 mt-5 mr-2 mb-2">{query1}</p>
        )

        }
        {/* Loading indicator */}
        {Loading && (
          <div className="flex justify-center my-4">
            <p className="text-white bg-slate-800/70 p-3 rounded-lg">Loading...</p>
          </div>
        )}
        
        {/* Text response */}
     
        {!Loading && DataText && (
          <div className="flex rounded-t-lg mx-auto p-4 pt-6 text-left items-center">
            <p className="text-white">{datatext}</p>
          </div>
        )}
        
        {/* Content grid response */}
        {!Loading && Data && ContentType && (
          <div className="flex">
            <div className="p-3 rounded-b-lg w-full">
              <h2 className="font-semibold mb-3 text-white text-lg border-b pb-2">{ContentType==='tv'? "Tv Shows" : "Movies"}</h2>
              
              {/* Movie/TV Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
                {Data.map((item, index) => (
                  <Link 
                    key={item.id || index} 
                    to={`/${contentType === 'movies' ? 'watch' : 'tv/details'}/?id=${item?.id}&name=${item?.name || item?.title}`}
                    onClick={() => window.scroll(0, 0)}
                  >
                    <div className="rounded-lg bg-slate-900 shadow-md hover:scale-105 transition-transform">
                      <img 
                        src={`${ORIGINAL_IMG_BASE_URL}${item?.backdrop_path || item?.poster_path}`} 
                        className="w-full h-40 object-cover rounded-t-lg" 
                        alt={item?.title || item?.name} 
                      />
                      <h3 className="text-base text-white  p-2">{item.title || item.name}</h3>
                      <p className="text-sm text-gray-400 pb-2 pl-2">
                        {item?.release_date?.split("-")[0] || item?.first_air_date?.split("-")[0]} | 
                        Rating: <b>{item?.vote_average.toFixed(2)}</b> | {item?.adult ? "18+" : "PG-13"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input form - fixed at the bottom */}
      <div className="p-4 bg-slate-900 bg-opacity-50 mt-auto">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={onSubmit} className="w-full">
            <div className="flex items-center">
              <input
                type="text" 
                className="p-3 bg-black text-white border border-red-500 rounded-lg w-full" 
                placeholder="Ask me anything...!"
                value={query || queryres}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                className="ml-2 bg-red-600 p-3 text-white rounded-full hover:bg-red-700"
              >
                <ArrowUp />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}