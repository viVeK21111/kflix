import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { chatStore } from "../store/chat";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { ArrowUp, History,Loader } from 'lucide-react';
import { userAuthStore } from '../store/authUser';

export default function ChatPage() {
  const { user } = userAuthStore();
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
  const [conversationHistory, setConversationHistory] = useState(JSON.parse(sessionStorage.getItem("conversationHistory")) || []);
  const chatContainerRef = useRef(null);
  const [formEnd, setFormEnd] = useState(false);

  useEffect(() => {
    if (data) setData(data);
    if (datatext) setDataText(datatext);
    if (contentType) setContentType(contentType);
  }, [data, datatext, contentType]);

  // Scroll to bottom when query1 changes
  useEffect(() => {
    if (chatContainerRef.current) {
      // Use a slight delay to ensure DOM updates are complete
      setTimeout(() => {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
       
      }, 0);
    } 
  }, [query1]);
  


  useEffect(() => {
    const logoImage = new Image();
    logoImage.src = '/batman.jpg';
    logoImage.onload = () => setpLoading(false);
    logoImage.onerror = () => setpLoading(false);
    const timeout = setTimeout(() => setpLoading(false), 3000);
    if(conversationHistory.length>0) {
    // Use a slight delay to ensure DOM updates are complete
    setTimeout(() => {
      if(chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'instant'
          });
        }
    },300);
    }
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (query1 && (Data || DataText) && !Loading) {
      const newEntry = { query: query1, data: Data, datatext: DataText, contentType: ContentType };
      //const isDuplicate = conversationHistory.some(
        //item => item.query === query1 && (item.data === Data || item.datatext === DataText)
      //);
      //if (!isDuplicate) {
        setConversationHistory(prev => [...prev, newEntry]);
        sessionStorage.setItem("conversationHistory", JSON.stringify([...conversationHistory, newEntry]));
      //}
    }
  }, [Data, DataText, Loading]);

  const onSubmit = async (e) => {
    setFormEnd(true);
    e.preventDefault();
    if (!query.trim()) return;
    setQuery1(query); // Set query1 immediately to trigger scroll
    setsubmitloading(true);
    sessionStorage.setItem("query1", query);
    setData(null);
    setDataText(null);
    setLoading(true);
    const currentQuery = query;
    setQuery("");
    try {
      if(conversationHistory.length > 0) {
        await getdata({ query: currentQuery,history:conversationHistory });
      }
      else {
        await getdata({ query: currentQuery });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setsubmitloading(false);
    }
  };

  if (pLoading) {
    return (
        <div className="flex flex-col w-screen h-screen justify-center items-center bg-black">
            <Loader className="animate-spin text-red-600 w-10 h-10"/>
            <p className="text-red-500  text-xl font-bold">
              I am Batman...!
            </p>
            </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#1e1d1d" }} className="h-screen w-full flex flex-col">
      <header className="flex justify-center xl:justify-start p-4">
        <Link to={'/chat'} className="flex items-center">
          <div className="flex items-center">
            <img src={'/chat.png'} alt="chat" className="w-10" />
            <h1 className="text-3xl ml-2 font-bold text-red-500">Flix Chat</h1>
          </div>
        </Link>
        <div className="ml-auto flex items-center">
          <Link className="ml-auto  rounded-lg text-white hover:scale-105 transition-transform" to={'/profile/chatHistory'}>
            <History size={22} />
          </Link>
          <Link to={'/profile'}>
            <img src={user.image} alt='avatar' className='h-7 ml-2 rounded transition-all duration-300 hover:scale-110 cursor-pointer' />
          </Link>
        </div>
      </header>

      {/* Chat content area - scrollable */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto  px-4 lg:px-48"
        style={{
          scrollbarColor: 'rgb(53, 52, 52) #1e1d1d'
        }}
      >


        {conversationHistory.map((item, index) => (
          <div key={index} className="mb-4">
            <p className="flex text-white font-semibold justify-end rounded-t-lg p-2 mt-5 mr-2 ">
              <p className="bg-white bg-opacity-10 px-3 py-2 rounded-xl">{item.query}</p>
            </p>
            {item.datatext && (
  <div className="flex mx-auto p-4 pt-2 text-left items-center">
    <div className="text-white whitespace-pre-wrap max-w-5xl">
      {/* Using a div with dangerouslySetInnerHTML to render formatted text */}
      <div 
        dangerouslySetInnerHTML={{
          __html: item.datatext
            // Replace Markdown with HTML equivalents
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
            .replace(/^\s*\*\s*(.*)$/gm, '• $1<br/>') // Bullet points
            .replace(/\n/g, '<br/>') // Line breaks
        }}
      />
    </div>
  </div>
)}
            {item.data && item.contentType && (
              <div className="p-3 rounded-b-lg w-full">
                <h2 className="font-semibold mb-3 text-white text-lg border-b pb-2">
                  {item.contentType === 'tv' ? "TV Shows" : "Movies"}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
                  {item.data.map((content, idx) => (
                    (content?.backdrop_path || content?.poster_path) && (
                      <Link
                        key={`${content.id}-${idx}`}
                        to={`/${item.contentType === 'movies' ? 'movie' : 'tv/details'}/?id=${content?.id}&name=${content?.name || content?.title}`}
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
            )}
          </div>
        ))}

        {query1 && submitloading && (
          <p className="flex text-white font-semibold justify-end rounded-t-lg p-2 mt-5 mr-2">
            <p className="bg-white bg-opacity-10 px-3 py-2 rounded-xl">{query1}</p>
          </p>
        )}

        {Loading && (
          <div className="flex w-full justify-center mt-4 mb-48">
            <div className="flex items-center space-x-2 bg-white bg-opacity-10 rounded-lg p-3">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Input form - fixed at the bottom */}
      <div className={(formEnd || DataText || conversationHistory.length>0) ? `pb-3 pt-2 bg-[#1e1d1d] sticky bottom-0` :`pb-3 pt-2 bg-[#1e1d1d] sticky bottom-0 sm:bottom-80`}>
        <div className="max-w-2xl p-1 mx-auto">
          {(!formEnd && !DataText && conversationHistory.length===0) && (
            <p className="text-white flex justify-center pb-3 text-lg sm:text-xl mb-60 sm:mb-0 font-semibold">What's on your mind?</p>
          )}
          <form onSubmit={onSubmit} className="w-full">
            <div className="flex items-center">
              <input
                type="text"
                className="p-3 text-white bg-white bg-opacity-5 rounded-lg w-full outline-none focus:ring-0 focus:bg-black"
                placeholder="Ask me anything...!"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={Loading}
              />
              <button
                type="submit"
                className={`ml-2 bg-white p-2 text-black rounded-full ${Loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transition-transform'}`}
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