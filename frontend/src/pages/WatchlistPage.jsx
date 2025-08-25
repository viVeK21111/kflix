import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import axios from "axios";
import { SquareX, Loader, House, TvMinimal, Clapperboard, Menu, X,ArrowLeft } from 'lucide-react';
import toast from "react-hot-toast";

const WatchlistPage = () => {
  const [datac, setDatac] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 
  const [selectContent, setSelectContent] = useState(() => {
    const savedContent = sessionStorage.getItem("content");
    return savedContent || "Movie";
  });
  const [displayCount, setDisplayCount] = useState(10);
 
  const movieCount = datac?.filter(item => item.type.toLowerCase() === 'movie').length || 0;
  const tvCount = datac?.filter(item => item.type.toLowerCase() === 'tv').length || 0;
  
  // Get the current content type count
  const currentTypeCount = selectContent.toLowerCase() === 'movie' ? movieCount : tvCount;
  
  // Add memoization for filtered data to ensure consistency
  const filteredData = React.useMemo(() => {
    if (!datac) return [];
    
    const lowerCaseContentType = selectContent.toLowerCase();
    
    return datac.filter(item => {
      const itemType = (item.type || "").toLowerCase();
      const matches = itemType === lowerCaseContentType;
      
      if (!matches && lowerCaseContentType === itemType) {
        console.warn(`Strange case - type strings should match but don't:`, {
          itemType,
          lowerCaseContentType,
          item
        });
      }
      
      return matches;
    });
  }, [datac, selectContent]);

  useEffect(() => {
    const getWatchlist = async () => {
      try {
        const response = await axios.get("api/v1/movies/getWatchlist");
        
        setDatac(response.data.content);
      } catch (err) {
        console.error("Watchlist fetch error:", err);
        setError("Failed to fetch watchlist. Try again later.");
      } finally {
        setLoading(false);
      }
    };
    getWatchlist();
  }, []);

  // Reset display count and re-filter when content type changes
  useEffect(() => {
    setDisplayCount(10);
  
  }, [selectContent]);

  const loadMore = () => {
    setDisplayCount(prevCount => prevCount + 5);
  };

  const loadLess = () => {
    setDisplayCount(prevCount => Math.max(10, prevCount - 5));
  };

  const removeFromWatchlist = (e, id) => {
    e.preventDefault();
    const remove = async (id) => {
      try {
        const response = await axios.delete(`api/v1/movies/removeWatch/${id}`);
        if (response.data.success) {
          setDatac(datac.filter((item) => item.id !== id));
          toast.success(response.data.message);
        }
      } catch (error) {
        toast.error("Failed to remove item from watchlist");
      }
    };
    remove(id);
  };
  
  const removeFromWatchlistE = (e, id, season, episode) => {
    e.preventDefault();
    const remove = async (id, season, episode) => {
      try {
        const response = await axios.delete(`api/v1/tv/removeWatchE/${id}/${season}/${episode}`);
        if (response.data.success) {
          setDatac(datac.filter((item) => !(item.id === id && item.season === season && item.episode === episode)));
          toast.success(response.data.message);
        }
      } catch (error) {
        toast.error("Failed to remove item from watchlist");
      }
    };
    remove(id, season, episode);
  };
  
  const handleSelect = (value) => {
    console.log(`Changing content type from ${selectContent} to ${value}`);
    sessionStorage.setItem("content", value);
    setSelectContent(value);
    setIsSidebarOpen(false);
  };

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col items-center bg-gray-900">
      <header className="flex w-full items-center bg-black bg-opacity-10">
       
        
        <div className='ml-auto flex items-center p-2 md:hidden'>
          <button
            aria-label="Open menu"
            onClick={() => setIsSidebarOpen(true)}
            className='hover:bg-white hover:bg-opacity-5 text-base p-2 rounded-lg'
          >
            <Menu className='h-6 w-6 text-white' />
          </button>
        </div>
      </header>
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden transform transition-transform duration-200 ease-in-out">
          <div className="absolute inset-0 bg-black/50 " onClick={() => setIsSidebarOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-64 bg-slate-900 shadow-xl p-4 ">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white font-bold text-lg">Menu</p>
              <button aria-label="Close menu" onClick={() => setIsSidebarOpen(false)} className="p-2 rounded hover:bg-white/10">
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => handleSelect('Movie')}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-left ${selectContent === 'Movie' ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-200 hover:bg-white/20'}`}
              >
                <span className="flex items-center">
                  <Clapperboard className="h-5 mr-2" /> Movie
                </span>
                <span className="text-sm text-gray-300">{movieCount}</span>
              </button>
              <button
                onClick={() => handleSelect('Tv')}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-left ${selectContent === 'Tv' ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-200 hover:bg-white/20'}`}
              >
                <span className="flex items-center">
                  <TvMinimal className="h-5 mr-2" /> Tv
                </span>
                <span className="text-sm text-gray-300">{tvCount}</span>
              </button>
           
            </nav>
          </div>
        </div>
      )}
      <div className="w-full flex flex-1 min-h-0">
        <aside className="hidden md:flex md:flex-col w-64 bg-white/5 border-r border-white/10 p-4 h-full">
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => handleSelect('Movie')}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-left ${selectContent === 'Movie' ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-200 hover:bg-white/20'}`}
            >
              <span className="flex items-center">
                <Clapperboard className="h-5 mr-2" /> Movie
              </span>
              <span className="text-sm text-gray-300">{movieCount}</span>
            </button>
            <button
              onClick={() => handleSelect('Tv')}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-left ${selectContent === 'Tv' ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-200 hover:bg-white/20'}`}
            >
              <span className="flex items-center">
                <TvMinimal className="h-5 mr-2" /> Tv show
              </span>
              <span className="text-sm text-gray-300">{tvCount}</span>
            </button>
          </nav>
        </aside>
        <div className="flex-1 flex flex-col items-center overflow-y-auto min-h-0" style={{scrollbarColor: 'transparent transparent'}}>

      {/* Section Title with Count */}
      <div className="text-white w-full px-4 sm:px-6 max-w-6xl mt-6">
        <h3 className="flex items-center text-2xl font-bold">
         
          {selectContent} Watchlist 
        
        </h3>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center w-full items-center mt-16 h-full">
          <Loader className="animate-spin text-white w-8 h-8"/>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 mt-6">{error}</p>}

      {/* Empty Watchlist Message */}
      {!loading && !error && datac?.length === 0 && (
        <p className="text-gray-400 mt-6 p-3 text-lg">Your watchlist is empty. Start adding movies! 🍿</p>
      )}

      {/* Show "No [content type] in watchlist" message */}
      {!loading && !error && datac?.length > 0 && filteredData.length === 0 && (
        <p className="text-gray-400 mt-6 p-3 text-lg">
          No {selectContent}s in your watchlist. Switch to {selectContent === 'Movie' ? 'Tv' : 'Movie'} or add some {selectContent}s!
        </p>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 w-full px-4 sm:px-6 mb-2 max-w-6xl">
        {filteredData.slice(0, displayCount).map((item, index) => {
          
          return (
          <Link
            key={item.season ? `${item.id}-${item.season}-${item.episode}` : `${item.id}`}
            to={item.type === 'movie' ? `/movie?id=${item?.id}&name=${item?.title}` : item.season ? `/watch/?id=${item?.id}&name=${item?.name}&season=${item.season}&episode=${item.episode}&tepisodes=${item.totalEpisodes}` :  `/tv/details?id=${item?.id}&name=${item?.title}`}
            className="group relative block bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <button 
              onClick={item.season ? (e)=> removeFromWatchlistE(e,item.id,item.season,item.episode) : (e) => removeFromWatchlist(e, item.id)} 
              className='absolute top-2 right-2 rounded-full z-10'
            >
              <SquareX className='size-6 cursor-pointer fill-white hover:fill-red-500' />
            </button>
            
            <img
              src={`${ORIGINAL_IMG_BASE_URL}${item?.image}`}
              className="w-full h-56 sm:h-64 object-cover rounded-lg transition-all"
              alt={item?.title}
            />

            {/* Item Title (Always Visible) */}
            
            <div className={!item.season ? `absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent px-3 py-2`:`absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-black/60 px-3 py-2`}>
            {item.season && (
              <p className="text-white font-semibold">{item.name}</p>
            )}
              <h3 className="text-sm sm:text-base font-bold text-white truncate">{item.title}</h3>
              {item.season && (
              <p className="text-gray-300 font-semibold">S{item.season}.E{item.episode}</p>
            )}
            </div>
          </Link>
        )})}
      </div>

      {/* Load More/Less buttons */}
      {!loading && !error && filteredData.length > 0 && (
        <div className="flex gap-4 mt-3 mb-10">
          {displayCount > 10 && (
            <button 
              onClick={loadLess} 
              className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded-lg transition-all"
            >
              Load Less
            </button>
          )}
          
          {displayCount < currentTypeCount && (
            <button 
              onClick={loadMore} 
              className="bg-blue-600 hover:bg-blue-500 text-white py-1 px-3 rounded-lg transition-all"
            >
              Load More
            </button>
          )}
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default WatchlistPage;