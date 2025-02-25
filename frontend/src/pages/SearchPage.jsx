import React, { useEffect, useState } from 'react';
import { searchStore } from '../store/searchStore';
import { Link } from 'react-router-dom';
import { ORIGINAL_IMG_BASE_URL } from '../utils/constants';

const SearchPage = () => {
  const [searchType, setSearchType] = useState(() => localStorage.getItem('searchType') || 'movie');
  const [query, setQuery] = useState('');
  const { getTv, getMovie, getPerson, data, Loading } = searchStore();
  localStorage.setItem("numitems",6);

  useEffect(() => {
    localStorage.setItem('searchType', searchType);
  }, [searchType]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      searchType === 'movie' ? getMovie(query.trim()) : searchType === 'tv' ? getTv(query.trim()) : getPerson(query.trim());
    }
  };

  return (
    <div className="min-h-screen w-full overflow-auto flex flex-col items-center p-6 bg-gray-900 text-white">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center p-4">
        <Link to={'/'}>
          <img src={'/kflix2.png'} alt='Kflix Logo' className='w-40 sm:w-52' />
        </Link>
        <Link to='/profile' className='text-blue-400 hover:underline'>Search History</Link>
      </header>
      
      {/* Search Section */}
      <h2 className="text-2xl font-bold mt-8">Search</h2>
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mt-4 w-full max-w-lg">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="p-2 rounded-lg bg-gray-800 text-white border border-gray-700 w-full sm:w-40"
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
          className="p-2 rounded-lg text-black w-full flex-1"
          required
        />
        <button
          type="submit"
          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold w-full sm:w-auto"
        >
          Search
        </button>
      </form>
      
      {/* Search Results */}
      {!Loading && data && searchType && (
        Array.isArray(data) ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-8 px-4 sm:px-8">
            {data.map((item, index) => (
              <Link 
                key={item.id || index} 
                to={`/${searchType === 'movie' ? 'watch' : searchType === 'tv' ? 'tv/details' : 'person/details'}/?id=${item?.id}&name=${item?.name || item?.title}`}
                className="block bg-gray-800 p-2 rounded-lg shadow-md hover:scale-105 transition-transform"
              >
                <img 
                  src={`${ORIGINAL_IMG_BASE_URL}${item?.backdrop_path || item?.poster_path || item?.profile_path}`} 
                  className="w-full h-48 object-cover rounded-lg" 
                  alt={item?.title || item?.name} 
                />
                <h3 className="text-sm sm:text-base font-bold text-white mt-2 truncate">
                  {item.title || item.name}
                </h3>
                {(item.release_date || item.first_air_date) && (
                  <p className="text-xs sm:text-sm text-gray-400">
                    {item.release_date?.split("-")[0] || item.first_air_date?.split("-")[0]} 
                    | Rating: <b>{item.vote_average}</b> 
                    | {item.adult ? "18+" : "PG-13"}
                  </p>
                )}
                {item.popularity && searchType === 'person' && (
                  <p className="text-xs sm:text-sm text-gray-400">Popularity: {item.popularity}</p>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-6 p-4 bg-gray-800 text-center text-white rounded-lg shadow-md max-w-md">
            <p>{data}</p>
          </div>
        )
      )}
    </div>
  );
};

export default SearchPage;
