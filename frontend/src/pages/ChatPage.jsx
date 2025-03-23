import { useEffect, useState, useRef } from "react";
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
  const [submitloading, setsubmitloading] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const chatContainerRef = useRef(null);

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

  // Add effect to scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [query1]);

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

  // Update conversation history when we get new data
  useEffect(() => {
    // Only add to conversation if we have a query and either data or datatext
    if (query1 && (Data || DataText) && !Loading) {
      const newEntry = {
        query: query1,
        data: Data,
        datatext: DataText,
        contentType: ContentType
      };
      
      // Check if this entry is already in the history to avoid duplicates
      const isDuplicate = conversationHistory.some(
        item => item.query === query1 && 
        (item.data === Data || item.datatext === DataText)
      );
      
      if (!isDuplicate) {
        setConversationHistory(prev => [...prev, newEntry]);
      }
    }
  }, [Data, DataText, Loading]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setsubmitloading(true);
    setQuery1(query);
    sessionStorage.setItem("query1", query);
    
    // Clear previous data
    setData(null);
    setDataText(null);
    
    setLoading(true);
    
    // Store current query to use after data loads
    const currentQuery = query;
    
    // Clear input for better UX
    setQuery("");
    
    try {
      await getdata({ query: currentQuery });
      // Data will be handled by the useEffect that watches data and datatext
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setsubmitloading(false);
    }
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
      <div 
        ref={chatContainerRef}
        className="flex-col overflow-auto bg-slate-800 bg-opacity-70 overflow-x-hidden scrollbar-hide rounded-lg lg:pl-48 lg:mx-0 lg:pr-24 flex-1"
      >
        {/* Render conversation history */}
        {conversationHistory.map((item, index) => (
          <div key={index} className="mb-4">
            {/* User query */}
            <p className="flex text-white font-semibold justify-end rounded-t-lg p-2 mt-5 mr-2">
              {item.query}
            </p>

            {/* Text response */}
            {item.datatext && (
              <div className="flex mx-auto p-4 pt-2 text-left items-center">
                <p className="text-white">{item.datatext}</p>
              </div>
            )}
            
            {/* Content grid response */}
            {item.data && item.contentType && (
              <div className="flex">
                <div className="p-3 rounded-b-lg w-full">
                  <h2 className="font-semibold mb-3 text-white text-lg border-b pb-2">
                    {item.contentType === 'tv' ? "TV Shows" : "Movies"}
                  </h2>
                  
                  {/* Movie/TV Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
                    {item.data.map((content, idx) => (
                      (content?.backdrop_path || content?.poster_path) && (
                        <Link 
                          key={`${content.id}-${idx}`}
                          to={`/${item.contentType === 'movies' ? 'watch' : 'tv/details'}/?id=${content?.id}&name=${content?.name || content?.title}`}
                          onClick={() => window.scroll(0, 0)}
                        >
                          <div className="rounded-lg bg-slate-900 shadow-md hover:scale-105 transition-transform">
                            <img 
                              src={`${ORIGINAL_IMG_BASE_URL}${content?.backdrop_path || content?.poster_path}`} 
                              className="w-full h-40 object-cover rounded-t-lg" 
                              alt={content?.title || content?.name} 
                            />
                            <h3 className="text-base text-white p-2">{content.title || content.name}</h3>
                            <p className="text-sm text-gray-400 pb-2 pl-2">
                              {content?.release_date?.split("-")[0] || content?.first_air_date?.split("-")[0]} | 
                              Rating: <b>{content?.vote_average.toFixed(2)}</b> | {content?.adult ? "18+" : "PG-13"}
                            </p>
                          </div>
                        </Link>
                      )
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Current query and loading state */}
        {query1 && submitloading && (
          <p className="flex text-white font-semibold justify-end rounded-t-lg p-2 mt-5 mr-2">
            {query1}
          </p>
        )}
        
        {/* Loading indicator */}
        {Loading && (
          <div className="flex w-full justify-center my-4">
            <div className="flex items-center space-x-2 bg-slate-900 rounded-lg p-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input form - fixed at the bottom */}
      <div className="p-4 bg-slate-900 mt-auto bg-opacity-50">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={onSubmit} className="w-full">
            <div className="flex items-center">
              <input
                type="text" 
                className="p-3 bg-black text-white border border-red-500 rounded-lg w-full" 
                placeholder="Ask me anything...!"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={Loading}
              />
              <button
                type="submit"
                className={`ml-2 bg-red-600 p-3 text-white rounded-full ${Loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}
                disabled={Loading}
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