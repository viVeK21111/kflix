import React from 'react'
import { useState,useEffect } from 'react';
import { ProfileStore } from "../store/ProfileStore";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { Trash2,Loader,House,TvMinimal,X} from "lucide-react";
import {Link} from 'react-router-dom'

const WatchHistory = () => {
const [visibleItems, setVisibleItems] = useState(6); // Show max 6 items initially
const { getdata, data,ClearWatchHistoryMovie,ClearWatchHistoryTv,ClearWatchHistory } = ProfileStore();
const [datalocal,setdatalocal] = useState(null);
const [loading,setloading] = useState(true);

  useEffect(() => {
     
       getdata().finally(() => setloading(false));
       setdatalocal(data);
       sessionStorage.setItem("numitems",6);
   
   }, [data]);
 
  const ClearButtonMovie = (e,id,date) => {
    e.preventDefault();
    ClearWatchHistoryMovie(id,date);
  }
  const clearButtontv = (e,id,date,season,episode) => {
    e.preventDefault();
    ClearWatchHistoryTv(id,date,season,episode);
    
  }
  

  if(loading) {
    return (
     <div className="h-screen ">
           <div className="flex justify-center items-center bg-black h-full">
           <Loader className="animate-spin text-white w-10 h-10"/>
           </div>
     </div>
    )
  }
  return (
    <div className='min-h-screen bg-slate-900'>
       <header className={`flex w-full items-center bg-black bg-opacity-10`}>
            <Link to={'/'} className='flex items-center ml-1'>
              <img src={'/kflix2.png'} alt='kflix logo' className='w-30 sm:w-32 h-12 sm:h-14' />
            </Link>
              <div className='ml-auto flex items-center p-2 '>
                   
                <Link className='hover:bg-white hover:bg-opacity-5 text-base p-2 rounded-lg'  to={'/'}> <p className='flex items-center text-white '><House  className='h-5 w-4 sm:h-5 sm:w-5 mr-1 hover:scale-105 transition-transform'/><p className='font-semibold '>Home</p></p></Link>
                <Link className='hover:bg-white hover:bg-opacity-5 text-base p-2 rounded-lg' to={'/watchlist'}> <p className='flex items-center text-white pl-1'><TvMinimal className='h-5 w-4 sm:h-5 sm:w-5 mr-1 hover:scale-105 transition-transform'/><p className='font-semibold'>Watchlist</p></p></Link>
              </div>
            
          </header>
        {/* watch History Section */}
      <div className="pt-10 w-full max-w-2xl pl-3 pb-3">
     
        <p className='flex items-center text-white text-xl'><TvMinimal size={20}/> <p className='ml-2'>Watch History</p></p>
        {datalocal?.watchHistory?.length > 0 && (
        <p className="flex justify-end items-center pb-2 w-fit ml-auto text-white text-base font-normal rounded-md hover:underline hover:cursor-pointer" onClick={ClearWatchHistory}><X size={20}/> <p className='pl-1 pr-2'>Clear all</p> </p>

        )}

        {datalocal?.watchHistory?.length > 0 ? (
          <>
            <div className="flex flex-col gap-2 mt-5 pr-2 md:pr-0">
              {datalocal?.watchHistory.slice().reverse().slice(0, visibleItems).map((item, index) => ( // applying empty slice() to not directly modify the original array
                <Link to={item?.type === 'movie' ? `/movie/?id=${item?.id}&name=${item?.name}` : `/watch/?id=${item?.id}&name=${item?.name}&season=${item?.season}&episode=${item?.episode}&tepisodes=${item?.tepisodes}`}>
                   <div className="flex bg-black rounded-lg text-white">
                   <img
                      src={`${ORIGINAL_IMG_BASE_URL}${item?.image}`}
                      alt={`Episode ${item?.episode}`}
                      className={item.season ? `h-16 my-auto w-16` : `h-22 w-16`}
                    />
                  <div className="flex w-full">
                  <div
                  key={index}
                  className="w-full flex bg-gray-800 hover:bg-slate-700 p-1 pl-2  rounded-r-lg shadow-md "
                >
                  <div>
                  <h3 className="text-base font-bold text-white">{item?.name}</h3>
                  <p className="text-gray-300 text-sm">
                    <b>Type:</b> {item?.type.charAt(0).toUpperCase() + item?.type.slice(1)}
                  </p>
                  {item?.season && (
                    <div>
                      <p className="text-gray-300 flex text-sm py-1">
                     <p className='flex font-semibold'> <p className=''>S</p>{item?.season}<p className='ml-1'><b className='mr-1'>.</b>E</p>{item?.episode}</p>
                     <p className='font-semibold ml-1 '>| {item?.title}</p>
                    </p>
                   
                    </div>
                 
                  )}
                  <p className="text-gray-400 flex text-sm mt-1">
                    <p className='font-semibold'></p> {new Date(item?.date).toLocaleDateString()}
                  </p>
                  </div>
                 
                  <button className="flex ml-auto p-2" onClick={(e) => {
                    if(item?.season) {
                      clearButtontv(e,item.id,item.date,item.season,item.episode);
                    }
                    else {
                      ClearButtonMovie(e,item.id,item.date);
                    }
          
                  }}>< Trash2 color='white' className="transform transition-transform hover:translate-y-[-5px] " />
                  </button>

                </div>

                  </div>
                   </div>
                  
               
                </Link>
                
              ))}
            </div>

            {/* Load More Button */}
            {visibleItems < datalocal?.watchHistory.length && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setVisibleItems(prev => prev + 6)} // Show 6 more items
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
      </div>
    </div>
  )
}

export default WatchHistory;