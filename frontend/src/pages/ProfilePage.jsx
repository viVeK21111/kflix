import React, { useEffect,useState } from "react";
import { ProfileStore } from "../store/ProfileStore";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { userAuthStore } from "../store/authUser";
import {Link} from 'react-router-dom';
import { Trash2 } from "lucide-react";


export default function ProfilePage(){
  const { getdata, data,ClearHistory,ClearHistoryid } = ProfileStore();
  const {logout} = userAuthStore();
  const [visibleItems, setVisibleItems] = useState(6); // Show max 6 items initially
  const [datalocal,setdatalocal] = useState(null);
  

  useEffect(() => {
    getdata();
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
    
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-4">
  
      {/* User Profile Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md text-center">
        <img
          src={datalocal?.image || "/a1.jpg"}
          alt="Profile"
          className="w-32 h-32 mx-auto border-red-600 shadow-lg object-cover"
        />
        <h1 className="text-2xl font-bold mt-4">{datalocal?.username || "Unknown"}</h1>
        <p className="text-gray-400">{datalocal?.email || "No email available"}</p>
     <button onClick={logout} className='w-max-2xl mt-2 py-2 px-4 bg-red-500 text-white rounded-md font-semibold hover:bg-red-700'>Logout</button>  

      </div>

      {/* Search History Section */}
      <div className="mt-8 w-full max-w-3xl">
        <h2 className="text-xl font-semibold mb-4 text-yellow-400 border-b border-yellow-500 pb-2">
          Search History
        </h2>
        <button className="flex p-1 ml-auto mb-2 px-2 bg-red-600 text-white text-base font-normal rounded-md hover:bg-red-700 transition-all" onClick={ClearButton}>Clear</button>

        {datalocal?.searchHistory?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {datalocal.searchHistory.slice().reverse().slice(0, visibleItems).map((item, index) => ( // applying empty slice() to not directly modify the original array
                <Link to={`/${item?.type === 'movie' ? 'watch' : item?.type === 'tv' ? 'tv/details' : 'person/details'}/?id=${item?.id}&name=${item?.name || item?.title}`}>
                <div
                  key={index}
                  className="bg-gray-800 p-1 mx-2 md:mx-0 rounded-lg shadow-md hover:scale-105 transition-transform"
                >
                  <img
                    src={`${ORIGINAL_IMG_BASE_URL}${item?.image}`}
                    alt={item.title}
                    className="w-full h-[30vh] object-cover rounded-md mb-3"
                  />
                  <h3 className="text-lg font-bold text-white">{item?.title || item?.name}</h3>
                  <p className="text-gray-300 text-sm">
                    <b>Type:</b> {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </p>
                  <p className="text-gray-400 text-xs">
                    <b>Search Date:</b> {new Date(item.date).toLocaleDateString()}
                  </p>
                  <button className="flex px-1 ml-auto mb-2 text-sm font-normal rounded-lg transition-all" onClick={(e) => ClearButtonid(e, item.id)}>< Trash2 className="transform transition-transform hover:translate-y-[-5px]" /></button>
                </div>
                </Link>
                
              ))}
            </div>

            {/* Load More Button */}
            {visibleItems < datalocal.searchHistory.length && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setVisibleItems(prev => prev + 6)} // Show 6 more items
                  className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-700 transition-all"
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
  );
};


