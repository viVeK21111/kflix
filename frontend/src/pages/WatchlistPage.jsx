import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import axios from "axios";
import { SquareX, Loader, House, TvMinimal, ChevronDown, Clapperboard } from 'lucide-react';
import toast from "react-hot-toast";
import { Listbox } from "@headlessui/react";

const WatchlistPage = () => {
  const [datac, setDatac] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
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

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-900">
      <header className="flex w-full items-center bg-black bg-opacity-10">
        <Link to={'/'} className='flex items-center ml-1'>
          <img src={'/kflix3.png'} alt='kflix logo' className='w-30 sm:w-32 h-12 sm:h-14' />
        </Link>
        <div className='ml-auto flex items-center p-2'>
          <Link className='hover:bg-white hover:bg-opacity-5 text-base p-2 rounded-lg' to={'/'}>
            <p className='flex items-center text-white'>
              <House className='h-5 w-4 sm:h-5 sm:w-5 mr-1 hover:scale-105 transition-transform'/>
              <p className='font-semibold'>Home</p>
            </p>
          </Link>
          
        </div>
      </header>
      
      <div className="mr-auto mt-3 ml-2 rounded-lg items-center bg-white bg-opacity-5 hover:cursor-pointer hover:bg-opacity-10">
        <Listbox value={selectContent} onChange={(value) => {
          console.log(`Changing content type from ${selectContent} to ${value}`);
          sessionStorage.setItem("content", value);
          setSelectContent(value);
        }}>
          <Listbox.Button className="w-36 md:w-40 flex justify-center items-center text-gray-300 py-3 text-left font-semibold">
            {selectContent}
            <ChevronDown color="white" className="ml-1" size={22} />
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 font-semibold bg-slate-900 rounded-lg shadow-lg overflow-y-auto z-10">
            <Listbox.Option
              value='Movie'
              className={({ active }) =>
                `cursor-pointer text-base border-b border-gray-600 p-3 w-36 md:w-40 flex justify-center ${
                  active ? "bg-white bg-opacity-20 text-white" : "text-white bg-white bg-opacity-10"
                }`
              }
            >
              Movie
            </Listbox.Option>
            <Listbox.Option
              value='Tv'
              className={({ active }) =>
                `cursor-pointer p-3 text-base border-b border-gray-700 w-36 md:w-40 flex justify-center ${
                  active ? "bg-white bg-opacity-20 text-white" : "text-white bg-white bg-opacity-10"
                }`
              }
            >
              Tv
            </Listbox.Option>
          </Listbox.Options>
        </Listbox>
      </div>

      {/* Section Title with Count */}
      <div className="text-white w-full px-4 sm:px-6 max-w-6xl mt-8">
        <h3 className="flex items-center text-2xl font-bold">
          <Clapperboard className="mr-2"/> 
          Your Watchlist 
          <span className="ml-2 text-base font-normal">
            ({selectContent === 'Movie' ? movieCount : tvCount} {selectContent}s)
          </span>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 w-full px-4 sm:px-6 mb-2 max-w-6xl">
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
        <div className="flex gap-4 mt-6 mb-10">
          {displayCount > 10 && (
            <button 
              onClick={loadLess} 
              className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-all"
            >
              Load Less
            </button>
          )}
          
          {displayCount < currentTypeCount && (
            <button 
              onClick={loadMore} 
              className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg transition-all"
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;