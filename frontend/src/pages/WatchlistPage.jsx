import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import axios from "axios";
import { SquareX,Loader,House,TvMinimal,ChevronDown,Clapperboard } from 'lucide-react';
import toast from "react-hot-toast";
import { Listbox } from "@headlessui/react";

const WatchlistPage = () => {

  const [datac, setDatac] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectContent,setselectContent] = useState(sessionStorage.getItem('content') || 'Movie');



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




  const removeFromWatchlist = (e, id,type) => {
    e.preventDefault();
    const remove = async (id) => {
      try {
        const response = await axios.get(`api/v1/movies/removeWatch/${id}`);
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



  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-900">
     <header className={`flex w-full items-center bg-black bg-opacity-10`}>
            <div  className='flex items-center ml-1'>
              <img src={'/kflix2.png'} alt='kflix logo' className='w-30 sm:w-32 h-12 sm:h-14' />
            </div>
              <div className='ml-auto flex items-center p-2 '>
                   
                <Link className='hover:bg-white hover:bg-opacity-5 text-sm sm:text-base p-2 rounded-lg'  to={'/'}> <p className='flex items-center text-white '><House  className='h-5 w-4 sm:h-5 sm:w-5 mr-1 hover:scale-105 transition-transform'/><p className='font-semibold '>Home</p></p></Link>
                <Link className='hover:bg-white hover:bg-opacity-5 text-sm sm:text-base p-2 rounded-lg' to={'/watchlist'}> <p className='flex items-center text-white pl-1'><TvMinimal className='h-5 w-4 sm:h-5 sm:w-5 mr-1 hover:scale-105 transition-transform'/><p className='font-semibold'>Watchlist</p></p></Link>
              </div>
            
          </header>
          <div className=" mr-auto mt-3 ml-2 rounded-lg items-center bg-white bg-opacity-5 hover:cursor-pointer hover:bg-opacity-10">
            
           <Listbox value={selectContent} onChange={(value) => {
            sessionStorage.setItem("content",value);
            setselectContent(value);
            }}>
                  <Listbox.Button className="w-36 md:w-40 flex justify-center items-center  text-gray-300 py-3 text-left font-semibold">
                    {selectContent}
                    <ChevronDown color="white " className="ml-1" size={22}></ChevronDown>
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
                          `cursor-pointer p-3 text-base border-b border-gray-700 w-36 md:w-40 flex justify-center  ${
                            active ? "bg-white bg-opacity-20 text-white" : "text-white bg-white bg-opacity-10"
                          }`
                        }
                      >
                        Tv
                      </Listbox.Option>
                 
                  </Listbox.Options>
                </Listbox>
                </div>
                  

      {/* Section Title */}
      <div className="text-white w-full px-4 sm:px-6 max-w-6xl mt-8 text-2xl font-bold">
        <h3 className="flex items-center"> <Clapperboard className="mr-2"/> Your Watchlist</h3>
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
        <p className="text-gray-400 mt-6 text-lg">Your watchlist is empty. Start adding movies! 🍿</p>
      )}

      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 w-full px-4 sm:px-6 mb-2 max-w-6xl">
        {datac?.map((item, index) => (
          (selectContent.toLowerCase() === item.type) && (
            <Link
            key={item.id || index}
            to={item.type === 'movie' ? `/movie?id=${item?.id}&name=${item?.title}` : `/tv/details?id=${item?.id}&name=${item?.title}`}
            className="group relative block bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <button 
              onClick={(e) => removeFromWatchlist(e, item.id,item.type)} 
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
          )
         
        ))}
      </div>

    </div>
  );
};

export default WatchlistPage;