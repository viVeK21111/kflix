import React from 'react'
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProfileStore } from "../store/ProfileStore";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { Trash2, X, Search, Loader, TvMinimal, MessagesSquare } from "lucide-react";
import { Link } from 'react-router-dom'

const HistoryPage = () => {
  const [searchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState('search');
  const [visibleItems, setVisibleItems] = useState(6);
  
  const { 
    getdata, 
    data, 
    ClearHistory, 
    ClearHistoryid, 
    ClearWatchHistoryMovie, 
    ClearWatchHistoryTv, 
    ClearWatchHistory,
    ClearHistoryquery,
    ClearHistoryqueryAll
  } = ProfileStore();
  
  const [datalocal, setdatalocal] = useState(null);
  const [loading, setloading] = useState(true);

  // Tab configuration
  const tabs = [
    { id: 'search', label: 'Search History', icon: Search },
    { id: 'watch', label: 'Watch History', icon: TvMinimal },
    { id: 'chat', label: 'Chat History', icon: MessagesSquare }
  ];

  // Initialize selected tab based on URL params, session storage, or default
  useEffect(() => {
    const urlTab = searchParams.get('tab');
    const sessionTab = sessionStorage.getItem('historyTab');
    
    if (urlTab && ['search', 'watch', 'chat'].includes(urlTab)) {
      setSelectedTab(urlTab);
    } else if (sessionTab && ['search', 'watch', 'chat'].includes(sessionTab)) {
      setSelectedTab(sessionTab);
    } else {
      setSelectedTab('search');
    }
  }, [searchParams]);

  // Save tab selection to session storage
  useEffect(() => {
    sessionStorage.setItem('historyTab', selectedTab);
  }, [selectedTab]);

  useEffect(() => {
    getdata().finally(() => setloading(false));
    sessionStorage.setItem("numitems", 6);
  }, []);

  useEffect(() => {
    setdatalocal(data);
  }, [data]);

  // Clear functions
  const ClearButton = async (e) => {
    e.preventDefault();
    await ClearHistory();
    getdata();
  }

  const ClearButtonid = async (e, id) => {
    e.preventDefault();
    await ClearHistoryid(id);
    getdata();
  }

  const ClearButtonMovie = async (e, id, date) => {
    e.preventDefault();
    await ClearWatchHistoryMovie(id, date);
    getdata();
  }

  const clearButtontv = async (e, id, date, season, episode) => {
    e.preventDefault();
    await ClearWatchHistoryTv(id, date, season, episode);
    getdata();
  }

  const handleClearAll = async () => {
    await ClearWatchHistory();
    await getdata();
  };

  const ClearButtonidChat = async (e, query) => {
    e.preventDefault();
    await ClearHistoryquery(query);
    getdata();
  }

  const ClearButtonChat = async (e) => {
    e.preventDefault();
    await ClearHistoryqueryAll();
    getdata();
  }

  const handleTabChange = (tabId) => {
    setSelectedTab(tabId);
    setVisibleItems(6);
    
    // Remove tab parameter from URL
    const url = new URL(window.location);
    url.searchParams.delete('tab');
    window.history.replaceState({}, '', url);
  };

  if (loading) {
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center bg-black h-full">
          <Loader className="animate-spin text-white w-10 h-10" />
        </div>
      </div>
    )
  }

  const renderSearchHistory = () => (
    <>
      <p className='flex items-center text-white text-xl'>
        <Search size={20} /> 
        <p className='ml-2'>Search History</p>
      </p>
      {datalocal?.searchHistory?.length > 0 && (
        <p className="flex justify-end items-center pb-2 w-fit ml-auto text-white text-base font-normal rounded-md hover:underline hover:cursor-pointer" onClick={ClearButton}>
          <X size={18} /> 
          <p className='pl-1 pr-2'>Clear all</p>
        </p>
      )}
      {datalocal?.searchHistory?.length > 0 ? (
        <>
          <div className="flex flex-col gap-1">
            {datalocal.searchHistory.slice().reverse().slice(0, visibleItems).map((item, index) => (
              <Link key={index} to={`/${item?.type === 'movie' ? 'movie' : item?.type === 'tv' ? 'tv/details' : 'person/details'}/?id=${item?.id}&name=${item?.name || item?.title}`}>
                <div className="flex">
                  <img
                    src={`${ORIGINAL_IMG_BASE_URL}${item?.image}`}
                    alt={item.title}
                    className="h-16 w-14"
                  />
                  <div className="flex w-full">
                    <div className="w-full flex bg-gray-800 hover:bg-slate-700 p-2 mx-2 md:mx-0 rounded-r-lg shadow-md">
                      <div>
                        <h3 className="text-base font-bold text-white">{item?.title || item?.name}</h3>
                        <p className="text-gray-300 text-sm">
                          <b>Type:</b> {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </p>
                      </div>
                      <button className="flex ml-auto" onClick={(e) => ClearButtonid(e, item.id)}>
                        <Trash2 size={20} color='white' className="transform transition-transform hover:translate-y-[-5px]" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {visibleItems < datalocal.searchHistory.length && (
            <div className="text-center mt-6">
              <button
                onClick={() => setVisibleItems(prev => prev + 6)}
                className="px-3 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
              >
                Load More
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-400 text-center pt-7">No search history found.</p>
      )}
    </>
  );

  const renderWatchHistory = () => (
    <>
      <p className='flex items-center text-white text-xl'>
        <TvMinimal size={20} /> 
        <p className='ml-2'>Watch History</p>
      </p>
      {datalocal?.watchHistory?.length > 0 && (
        <p className="flex justify-end items-center w-fit ml-auto text-white text-base font-normal rounded-md hover:underline hover:cursor-pointer" onClick={handleClearAll}>
          <X size={18} /> 
          <p className='pl-1 pr-2'>Clear all</p>
        </p>
      )}
      {datalocal?.watchHistory?.length > 0 ? (
        <>
          <div className="flex flex-col gap-2 mt-5 pr-2 md:pr-0">
            {datalocal?.watchHistory.slice().reverse().slice(0, visibleItems).map((item, index) => (
              <Link key={index} to={item?.type === 'movie' ? `/movie/?id=${item?.id}&name=${item?.name}` : `/watch/?id=${item?.id}&name=${item?.name}&season=${item?.season}&episode=${item?.episode}&tepisodes=${item?.tepisodes}`}>
                <div className="flex bg-black rounded-lg text-white">
                  <img
                    src={`${ORIGINAL_IMG_BASE_URL}${item?.image}`}
                    alt={`Episode ${item?.episode}`}
                    className={item.season ? `h-16 my-auto w-16` : `h-22 w-16`}
                  />
                  <div className="flex w-full">
                    <div className="w-full flex bg-gray-800 hover:bg-slate-700 p-1 pl-2 rounded-r-lg shadow-md">
                      <div>
                        <h3 className="text-base font-bold text-white">{item?.name}</h3>
                        <p className="text-gray-300 text-sm">
                          <b>Type:</b> {item?.type.charAt(0).toUpperCase() + item?.type.slice(1)}
                        </p>
                        {item?.season && (
                          <div>
                            <p className="text-gray-300 flex text-sm py-1">
                              <p className='flex font-semibold'> 
                                <p className=''>S</p>{item?.season}
                                <p className='ml-1'><b className='mr-1'>.</b>E</p>{item?.episode}
                              </p>
                              <p className='font-semibold ml-1 '>| {item?.title}</p>
                            </p>
                          </div>
                        )}
                        <p className="text-gray-400 flex text-sm mt-1">
                          {new Date(item?.date).toLocaleDateString()}
                        </p>
                      </div>
                      <button className="flex ml-auto p-2" onClick={(e) => {
                        if (item?.season) {
                          clearButtontv(e, item.id, item.date, item.season, item.episode);
                        } else {
                          ClearButtonMovie(e, item.id, item.date);
                        }
                      }}>
                        <Trash2 size={20} color='white' className="transform transition-transform hover:translate-y-[-5px]" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {visibleItems < datalocal?.watchHistory.length && (
            <div className="text-center mt-6">
              <button
                onClick={() => setVisibleItems(prev => prev + 6)}
                className="px-3 py-2 bg-white bg-opacity-20 text-white font-semibold rounded-lg hover:bg-opacity-25 transition-all"
              >
                Load More
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-400 text-center pt-7">No watch history found.</p>
      )}
    </>
  );

  const renderChatHistory = () => (
    <>
      <p className='flex items-center text-white text-xl mb-4'>
        <MessagesSquare className='ml-3' /> 
        <p className='ml-2'>Chat History</p>
      </p>
      {datalocal?.chatHistory?.length > 0 && (
        <p className="flex justify-end items-center pb-2 w-fit ml-auto text-white text-base font-normal rounded-md hover:underline hover:cursor-pointer" onClick={ClearButtonChat}>
          <X size={18} /> 
          <p className='pl-1 pr-2'>Clear all</p>
        </p>
      )}
      {datalocal?.chatHistory?.length > 0 ? (
        <>
          <div className="flex flex-col gap-1">
            {datalocal.chatHistory.slice().reverse().slice(0, visibleItems).map((item, index) => (
              <Link key={index} to={`/chat?query=${item?.query}`}>
                <div className="flex w-full">
                  <div className="w-full flex bg-white bg-opacity-5 hover:bg-opacity-10 p-2 mr-2 md:mx-0 rounded-lg shadow-md">
                    <div>
                      <h3 className="text-base font-bold text-white">{item?.query}</h3>
                    </div>
                    <button className="flex ml-auto" onClick={(e) => ClearButtonidChat(e, item?.query)}>
                      <Trash2 size={20} color='white' className="transform transition-transform hover:translate-y-[-5px]" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {visibleItems < datalocal.chatHistory.length && (
            <div className="text-center mt-6">
              <button
                onClick={() => setVisibleItems(prev => prev + 6)}
                className="px-3 py-2 bg-white bg-opacity-10 text-white font-semibold rounded-lg hover:bg-opacity-15 transition-all"
              >
                Load More
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-400 text-center">No Chat history found.</p>
      )}
    </>
  );

  return (
    <div className="w-full flex flex-1 min-h-screen bg-slate-900">
     
        {/* Sidebar for larger screens */}
        <aside className="hidden md:flex flex-col w-64 bg-gray-800 p-4 h-screen sticky top-0">
          <h2 className="text-white text-xl font-bold mb-6">History</h2>
          <div className="space-y-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    selectedTab === tab.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <IconComponent size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex-1 bg-slate-900 min-h-0 md:overflow-y-auto scrollbar-hide" 
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitScrollbar: { display: 'none' }
          }}>
          <div className="flex flex-col items-center">
            {/* Mobile Select for smaller screens */}
            <div className='ml-auto flex items-center px-4 pt-4 md:hidden'>
              <select
                value={selectedTab}
                onChange={(e) => handleTabChange(e.target.value)}
                className="bg-gray-800 text-white px-3 py-2 rounded-lg outline-none cursor-pointer"
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div className="w-full mr-auto max-w-2xl p-3 sm:pl-7 pb-3">
              {selectedTab === 'search' && renderSearchHistory()}
              {selectedTab === 'watch' && renderWatchHistory()}
              {selectedTab === 'chat' && renderChatHistory()}
            </div>
          </div>
        </div>
      </div>
  )
}

export default HistoryPage