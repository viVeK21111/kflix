import React, { useEffect, useState } from 'react';
import { searchStore } from '../store/searchStore';
import {Link} from 'react-router-dom';
import { ORIGINAL_IMG_BASE_URL } from '../utils/constants';

const SearchPage = () => {
  const [searchType, setSearchType] = useState(() => localStorage.getItem('searchType') || 'movie');
  const [query, setQuery] = useState('');
  const {getTv,getMovie,getPerson,data,Loading} = searchStore();

  localStorage.setItem("numitems",6);

  const handleSearch = (e) => {
    e.preventDefault();
    if(searchType==='movie') {
        getMovie(query.trim())
    }
    else if(searchType==='tv') {
       getTv(query.trim());
    }
    else {
        getPerson(query.trim());
    }
  };
  useEffect(() => {
        console.log("data is empty")
    }, [data]);
  useEffect(()=> {
    localStorage.setItem("searchType",searchType);
  },[searchType])
  return (
    <div className="h-screen w-full overflow-auto flex flex-col items-center p-6 bg-gray-900 text-white shadow-lg">
       <header className='flex items-center mr-auto p-4'>
          <Link to={'/'} className='flex items-center'>
          <img src={'/kflix2.png'} alt='kflix logo' className='w-52' />
          </Link>
          </header>
      <h2 className="text-xl font-bold mt-20">Search</h2>
      <form onSubmit={handleSearch} className="flex gap-4 mt-3 items-center">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="p-2 ml-2 w-full rounded-lg bg-gray-800 text-white border border-gray-700"
        >
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
          <option value="person">People</option>
        </select>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search term..."
          className="p-2 rounded-lg text-black"
          required
        />

        <button
          type="submit"
          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
        >
          Search
        </button>
      </form>
      <Link to = '/profile' className='flex text-blue-500 underline mt-2'>Search History</Link>
      {!Loading && data && searchType && (
        Array.isArray(data) ? (
<div className="flex items-center mt-3 px-4 sm:px-6 md:px-12 lg:px-40 justify-center"> 
  <div className="mt-4 text-white bg-gray-800 p-4 rounded-lg w-full">
    <h2 className="font-semibold mb-3 text-lg border-b pb-2">Response:</h2>

    {/* Movie Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {data.map((item, index) => (
        <Link 
          key={item.id || index} 
          to={`/${searchType === 'movie' ? 'watch' : searchType==='tv'? 'tv/details' : 'person/details'}/?id=${item?.id}&name=${item?.name || item?.title}`}
        >
          <div className="p-2 border rounded-lg bg-slate-900 shadow-md hover:scale-105 transition-transform">
            <img 
              src={`${ORIGINAL_IMG_BASE_URL}${item?.backdrop_path || item?.poster_path || item?.profile_path}`} 
              className="w-full h-40 sm:h-48 object-cover rounded-lg mb-2" 
              alt={item?.title || item?.name} 
            />
            <h3 className="text-sm sm:text-base font-bold text-white mb-1 truncate">
              {item.title || item.name}
            </h3>
            {(item.release_date || item.first_air_date) && (
              <p className="text-xs sm:text-sm text-gray-300">
                {item.release_date?.split("-")[0] || item.first_air_date?.split("-")[0]} 
                | Rating: <b>{item.vote_average}</b> 
                | {item.adult ? "18+" : "PG-13"}
              </p>
            )}
            {item.popularity && searchType === 'person' && (
              <p className="text-xs sm:text-sm">Popularity: {item.popularity}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  </div>
</div>

       ) : (
        <div className="flex items-center justify-between">
        <div className="mx-auto max-w-2xl max-h-screen justify-center p-3 border rounded-lg bg-slate-900 shadow-md">
          <p className="text-white text-center">{data}</p>
        </div>
        </div>
        )
   
)}

    </div>
  );
};

export default SearchPage;
