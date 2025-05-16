import React from 'react'
import { useState,useEffect } from 'react';
import { ProfileStore } from "../store/ProfileStore";
import { Trash2,MessagesSquare,Loader,House,TvMinimal,X} from "lucide-react";
import {Link} from 'react-router-dom'

const SearchHistory = () => {
const [visibleItems, setVisibleItems] = useState(6); // Show max 6 items initially
const { getdata, data,ClearHistoryquery,ClearHistoryqueryAll } = ProfileStore();
const [datalocal,setdatalocal] = useState(null);
const [loading,setloading] = useState(true);

 useEffect(() => {
    
      getdata().finally(() => setloading(false));
      setdatalocal(data);
      localStorage.setItem("numitems",6);
  
  }, [data]);
 
  const ClearButtonid = (e,query) => {
    e.preventDefault();
    ClearHistoryquery(query);
  }
  const ClearButton = (e) => {
    e.preventDefault();
    ClearHistoryqueryAll();
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
    <div className='min-h-screen ' style={{ backgroundColor: "#1e1d1d" }}>
        {/* Search History Section */}
      <div  className="pt-5 w-full  pb-3">
        <header className='flex border-b border-gray-700 mb-5'>
        <p className='flex items-center text-white text-xl mb-5'><MessagesSquare className='ml-3'/> <p className='ml-2'>chat History</p></p>
        <div className='ml-auto flex pb-3'>
                <Link className='hover:bg-white hover:bg-opacity-5 text-base p-2 rounded-lg'  to={'/'}> <p className='flex items-center text-white '><House  className='h-5 w-4 sm:h-5 sm:w-5 mr-1 hover:scale-105 transition-transform'/><p className='font-semibold '>Home</p></p></Link>
                <Link className='hover:bg-white hover:bg-opacity-5 text-base p-2 rounded-lg' to={'/watchlist'}> <p className='flex items-center text-white pl-1'><TvMinimal className='h-5 w-4 sm:h-5 sm:w-5 mr-1 hover:scale-105 transition-transform'/><p className='font-semibold'>Watchlist</p></p></Link>
              </div>
            
        </header>
        <div className='max-w-2xl ml-2'>
        {datalocal?.chatHistory?.length > 0 ? (
          <>
                  <p className="flex justify-end items-center pb-2 w-fit ml-auto text-white text-base font-normal rounded-md hover:underline hover:cursor-pointer" onClick={ClearButton}><X size={20}/> <p className='pl-1 pr-2'>Clear all</p> </p>

            <div className="flex flex-col gap-1">
              {datalocal.chatHistory.slice().reverse().slice(0, visibleItems).map((item, index) => ( // applying empty slice() to not directly modify the original array
                <Link to={`/chat?query=${item?.query}`}>
                  
                  
                  <div className="flex w-full">
                  <div
                  key={index}
                  className="w-full flex bg-white bg-opacity-5 hover:bg-opacity-10 p-2 mr-2 md:mx-0 rounded-lg shadow-md "
                >
                  <div>
                  <h3 className="text-base font-bold text-white">{item?.query}</h3>
                 
                  </div>
                 
                  <button className="flex ml-auto" onClick={(e) => ClearButtonid(e, item?.query)}>< Trash2 color='white' className="transform transition-transform hover:translate-y-[-5px]" /></button>

                </div>

                  </div>
                  
                  
               
                </Link>
                
              ))}
            </div>

            {/* Load More Button */}
            {visibleItems < datalocal.chatHistory.length && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setVisibleItems(prev => prev + 6)} // Show 6 more items
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
        </div>
        
      </div>
    </div>
  )
}

export default SearchHistory