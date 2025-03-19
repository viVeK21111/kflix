import React from 'react'
import { useState,useEffect } from 'react';
import { ProfileStore } from "../store/ProfileStore";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { Trash2,X} from "lucide-react";
import {Link} from 'react-router-dom'

const SearchHistory = () => {
const [visibleItems, setVisibleItems] = useState(6); // Show max 6 items initially
const { getdata, data,ClearHistory,ClearHistoryid } = ProfileStore();
const [datalocal,setdatalocal] = useState(null);
const [loading,setloading] = useState(true);

 useEffect(() => {
    
      getdata().finally(() => setloading(false));
      setdatalocal(data);
      localStorage.setItem("numitems",6);
  
  }, [data]);
  const ClearButton = (e) => {
    e.preventDefault();
    ClearHistory();
  }
  const ClearButtonid = (e,id) => {
    e.preventDefault();
    ClearHistoryid(id);
  }
  return (
    <div className='min-h-screen bg-slate-900'>
        {/* Search History Section */}
      <div className="pt-10 w-full max-w-2xl pl-3 pb-3">
        <p className='text-white text-xl'>Search History</p>
        <p className="flex justify-end items-center pb-2 max-w-2xl ml-auto text-white text-base font-normal rounded-md hover:underline hover:cursor-pointer" onClick={ClearButton}><X size={20}/> <p className='pl-1 pr-2'>Clear all</p> </p>

        {datalocal?.searchHistory?.length > 0 ? (
          <>
            <div className="flex flex-col gap-1">
              {datalocal.searchHistory.slice().reverse().slice(0, visibleItems).map((item, index) => ( // applying empty slice() to not directly modify the original array
                <Link to={`/${item?.type === 'movie' ? 'watch' : item?.type === 'tv' ? 'tv/details' : 'person/details'}/?id=${item?.id}&name=${item?.name || item?.title}`}>
                   <div className="flex">
                   <img
                      src={`${ORIGINAL_IMG_BASE_URL}${item?.image}`}
                      alt={item.title}
                      className="size-16"
                    />
                  <div className="flex w-full">
                  <div
                  key={index}
                  className="w-full flex bg-gray-800 hover:bg-slate-700 p-2 mx-2 md:mx-0 rounded-r-lg shadow-md "
                >
                  <div>
                  <h3 className="text-base font-bold text-white">{item?.title || item?.name}</h3>
                  <p className="text-gray-300 text-sm">
                    <b>Type:</b> {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </p>
                  </div>
                 
                  <button className="flex ml-auto" onClick={(e) => ClearButtonid(e, item.id)}>< Trash2 color='white' className="transform transition-transform hover:translate-y-[-5px]" /></button>

                </div>

                  </div>
                   </div>
                  
               
                </Link>
                
              ))}
            </div>

            {/* Load More Button */}
            {visibleItems < datalocal.searchHistory.length && (
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