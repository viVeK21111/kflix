import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import axios from "axios";
import { SquareX } from 'lucide-react';
import toast from "react-hot-toast";

const WatchlistPage = () => {
  const [numitems, setNumItems] = useState(Number(localStorage.getItem("numtvitems")) || 6);
  const [datac, setDatac] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getWatchlist = async () => {
      try {
        const response = await axios.get("api/v1/movies/getWatchlist");
        setDatac(response.data.content);
      } catch (err) {
        setError("Failed to fetch watchlist. Try again later.");
      } finally {
        setLoading(false);
      }
    };
    getWatchlist();
  }, []);

  useEffect(() => {
    localStorage.setItem("numtvitems", numitems);
  }, [numitems]);

  const removeFromWatchlist = (e, id) => {
    e.preventDefault();
    const remove = async (id) => {
      try {
        const response = await axios.get(`api/v1/movies/removeWatch/${id}`);
        if (response.data.success) {
          setDatac(datac.filter((item) => item.id !== id));
          toast.success(response.data.message);
          // Only decrease numitems if it's greater than the new length
          setNumItems(prev => Math.min(prev, datac.length - 1));
        }
      } catch (error) {
        toast.error("Failed to remove item from watchlist");
      }
    };
    remove(id);
  };

  const handleLoadMore = () => {
    setNumItems(prev => Math.min(prev + 4, datac?.length || prev));
  };

  const handleLoadLess = () => {
    setNumItems(6);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-4 sm:px-6 lg:px-8 bg-gray-900">
      <header className='flex items-center p-4'>
        <Link to={'/'} className='flex items-center'>
          <img src={'/kflix2.png'} alt='kflix logo' className='w-52' />
        </Link>
      </header>

      {/* Section Title */}
      <div className="text-white w-full max-w-6xl mt-8 text-2xl sm:text-3xl font-extrabold">
        <h3>🎬 Your Watchlist</h3>
      </div>

      {/* Loading State */}
      {loading && <p className="text-white text-lg mt-6">Loading...</p>}

      {/* Error Message */}
      {error && <p className="text-red-500 mt-6">{error}</p>}

      {/* Empty Watchlist Message */}
      {!loading && !error && datac?.length === 0 && (
        <p className="text-gray-400 mt-6 text-lg">Your watchlist is empty. Start adding movies! 🍿</p>
      )}

      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-6 w-full mb-2 max-w-6xl">
        {datac?.slice(0, numitems).map((item, index) => (
          <Link
            key={item.id || index}
            to={item.type === 'movie' ? `/watch?id=${item?.id}&name=${item?.title}` : `/tv/details?id=${item?.id}&name=${item?.title}`}
            className="group relative block bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <button 
              onClick={(e) => removeFromWatchlist(e, item.id)} 
              className='absolute top-2 right-2 rounded-full z-10'
            >
              <SquareX className='size-6 cursor-pointer fill-white hover:fill-red-500' />
            </button>
            
            <img
              src={`${ORIGINAL_IMG_BASE_URL}${item?.image}`}
              className="w-full h-56 sm:h-64 object-cover rounded-lg transition-all"
              alt={item?.title}
            />

            {/* Movie Title (Always Visible) */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3">
              <h3 className="text-sm sm:text-base font-bold text-white truncate">{item.title}</h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Load More Button */}
      {datac && numitems < datac.length && (
        <div className="flex justify-center mt-8 mb-2">
          <button
            onClick={handleLoadMore}
            className="px-2 py-2 text-base font-semibold text-white bg-red-600 rounded-md shadow-md hover:bg-red-700 hover:scale-105 transition-all"
          >
            Load More
          </button>
        </div>
      )}

      {/* Load Less Button */}
      {datac && numitems > 6 && numitems >= datac.length && (
        <div className="flex justify-center mb-2 mt-5">
          <button
            onClick={handleLoadLess}
            className="px-2 py-2 text-base font-semibold text-white bg-red-600 rounded-md shadow-md hover:bg-red-700 hover:scale-105 transition-all"
          >
            Load Less
          </button>
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;