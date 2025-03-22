import React from 'react'
import { useState,useEffect } from 'react';
import { ProfileStore } from "../store/ProfileStore";
import { Trash2,MessagesSquare} from "lucide-react";
import {Link} from 'react-router-dom'

const SearchHistory = () => {
const [visibleItems, setVisibleItems] = useState(6); // Show max 6 items initially
const { getdata, data,ClearHistoryquery } = ProfileStore();
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
  if(loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-xl font-semibold bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    )
  }
  return (
    <div className='min-h-screen bg-slate-900'>
        {/* Search History Section */}
      <div className="pt-10 w-full max-w-2xl pl-3 pb-3">
        <p className='flex items-center text-white text-xl mb-5'><MessagesSquare/> <p className='ml-2'>chat History</p></p>

        {datalocal?.chatHistory?.length > 0 ? (
          <>
            <div className="flex flex-col gap-1">
              {datalocal.chatHistory.slice().reverse().slice(0, visibleItems).map((item, index) => ( // applying empty slice() to not directly modify the original array
                <Link to={`/chat?query=${item?.query}`}>
                  
                  
                  <div className="flex w-full">
                  <div
                  key={index}
                  className="w-full flex bg-gray-800 hover:bg-slate-700 p-2 mr-2 md:mx-0 rounded-lg shadow-md "
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
                  className="px-3 py-2 bg-white bg-opacity-20 text-white font-semibold rounded-lg hover:bg-opacity-25 transition-all"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-400 text-center">No search history found.</p>
        )}
      </div>
    </div>
  )
}

export default SearchHistory