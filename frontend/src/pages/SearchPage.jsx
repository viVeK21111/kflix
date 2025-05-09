import React, { useEffect, useState } from 'react';
import { searchStore } from '../store/searchStore';
import { Link } from 'react-router-dom';
import { ORIGINAL_IMG_BASE_URL } from '../utils/constants';
import { Search,History,Loader,House,TvMinimal,Menu,X } from 'lucide-react';

const SearchPage = () => {
  const [searchType, setSearchType] = useState(() => sessionStorage.getItem('searchType') || 'movie');
  const [query, setQuery] = useState('');
  const { getTv, getMovie, getPerson, data, Loading } = searchStore();
  const [numitems,setnumitems] = useState(sessionStorage.getItem("numitemss") || 10);
  const [searchType2,setSearchType2] = useState(sessionStorage.getItem('searchType2') || 'movie');
  const [loading,setloading] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(null);
  sessionStorage.setItem("numitems",6);
  const [Searchsubmit,setSearchsubmit] = useState(false);
  const [Loading1,setLoading1] = useState(true);
  const logo = new Image();
  logo.src = '/kflix2.png';
   const [isMobileMenuOpen,setisMobileMenuOpen] = useState(false);
      
      const toggleMobileMenu = () => {
          setisMobileMenuOpen(!isMobileMenuOpen);
      };
 
  logo.onload = () => {
    setLoading1(false);
  }
  useEffect(() => {
    sessionStorage.setItem('searchType', searchType);
  }, [searchType]);

  useEffect(() => {
    setSearchsubmit(false);
    if(Array.isArray(data) && data.length > 0) {
      const imagePromises = data
      .slice(0, numitems)
      .map(item => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = `${ORIGINAL_IMG_BASE_URL}${item?.backdrop_path || item?.poster_path || item?.profile_path}`;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

    Promise.all(imagePromises)
      .then(() => setImagesLoaded(true))
      .catch(() => setImagesLoaded(true));
    }
    else {
      if(data) setImagesLoaded(true);
      setSearchsubmit(true);
    }
   
  }, [data, numitems]);


  const handleSearch = (e) => {
    e.preventDefault();
    setloading(true);
    setImagesLoaded(false);
    
    sessionStorage.setItem('searchType2', searchType);
    setSearchType2(searchType);
    const sortResults = (data) => {
      return data.sort((a, b) => a.name?.localeCompare(b.name) || a.title?.localeCompare(b.title));
    };
  
    if (query.trim()) {
      if (searchType === 'movie') {
        getMovie(query.trim()).then(sortResults).finally(() =>
           setloading(false),
      );
      } else if (searchType === 'tv') {
        getTv(query.trim()).then(sortResults).finally(() => setloading(false));
      } else {
        getPerson(query.trim()).then(sortResults).finally(() => setloading(false));
      }
    }
  };
  if( Loading1) {
    return (
        <div className="h-screen ">
        <div className="flex justify-center items-center bg-black h-full">
        <Loader className="animate-spin text-red-600 w-10 h-10"/>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-gray-800 to-slate-900 text-white overflow-auto flex flex-col items-center ">
      {/* Header */}
      <header className="flex w-full items-center py-1  bg-black bg-opacity-10 pl-1">
             <Link to={'/'} className='mr-auto' >
               <img src={'/kflix2.png'} alt='Kflix Logo' className='w-30 sm:w-32 h-12 sm:h-14' />
             </Link>
                   <div className='hidden md:flex ml-auto items-center p-2 '>
                     <Link className='hover:bg-white hover:bg-opacity-5 text-base p-2 rounded-lg'  to={'/'}> <p className='flex items-center text-white '><House  className='h-5 w-4 sm:h-5 sm:w-5 mr-1 hover:scale-105 transition-transform'/><p className='font-semibold '>Home</p></p></Link>
                     <Link className='hover:bg-white hover:bg-opacity-5 text-base p-2 rounded-lg' to={'/watchlist'}> <p className='flex items-center text-white pl-1'><TvMinimal className='h-5 w-4 sm:h-5 sm:w-5 mr-1 hover:scale-105 transition-transform'/><p className='font-semibold'>Watchlist</p></p></Link>
                     <Link to='/profile/searchHistory' className='flex items-center text-gray-400  transition-all duration-300 hover:scale-110 cursor-pointer text-sm  bg-white bg-opacity-10 py-1 px-2  mx-2 rounded-md'><History size={22} /></Link>
                   </div>
               
                   <div className='md:hidden'>
                    <Menu className='size-8 cursor-pointer p-1 mx-2 rounded-lg ' onClick={toggleMobileMenu}/>
                </div>
     
           </header>
      
               <div className={`fixed top-0 right-0 w-64 h-full bg-gray-900 z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
               <div className="flex justify-between items-center p-4 border-b border-gray-700">
                 <h2 className="text-white text-lg font-semibold">Menu</h2>
                 <button onClick={toggleMobileMenu} className="text-white">
                   <X size={24} />
                 </button>
                        </div>
               
                    <div className="flex flex-col ">
                  <Link onClick={toggleMobileMenu} className='hover:bg-slate-800 border-b border-gray-800 p-4 text-base' to={'/'}>
                    <p className='flex items-center text-white'>
                      <House className='h-5 w-5 mr-3'/>
                      <p className='font-semibold'>Home</p>
                    </p>
                  </Link>
                  <Link onClick={toggleMobileMenu} className='hover:bg-slate-800 p-4 border-b border-gray-800 text-base' to={'/watchlist'}>
                    <p className='flex items-center text-white'>
                      <TvMinimal className='h-5 w-5 mr-3'/>
                      <p className='font-semibold'>Watchlist</p>
                    </p>
                  </Link>
                  
                  <Link onClick={toggleMobileMenu} to='/profile/searchHistory' className='hover:bg-slate-800  border-b border-gray-800 p-4 text-base'>
                    <p className='flex items-center text-white'>
                      <History className='h-5 w-5 mr-3'/>
                      <p className='font-semibold'>Search History</p>
                    </p>
                  </Link>
                </div>
                </div>
                
          
              {isMobileMenuOpen && (
                    <div 
                      className="fixed inset-0 bg-black bg-opacity-50 z-40"
                      onClick={toggleMobileMenu}
                    ></div>
                  )}
      
      
      {/* Search Section */}
      <form onSubmit={handleSearch} className="flex max-w-2xl mt-28 md:mt-20 w-full px-3">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="p-3 rounded-lg bg-gray-800 outline-none focus:ring-0 text-white border mr-2 border-gray-700 w-24"
        >
          <option value="movie">Movies</option>
          <option value="tv">Tv Show</option>
          <option value="person">Person</option>
        </select>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search term..."
          className="py-3 px-2 rounded-l-lg bg-slate-700 outline-none focus:ring-0 text-white w-full flex-1"
          required
        />
        <button
          type="submit"
          className="px-3 bg-slate-600 hover:bg-slate-500 rounded-r-lg font-semibold"
        >
          <Search size={25} />
        </button>
      </form>

      {(imagesLoaded===false && Searchsubmit===false) && (
        <div className="flex justify-center mt-20"><Loader className="animate-spin text-white w-7 h-7"/></div>
      )}
      {/* Search Results */}
      {!Loading && data && imagesLoaded && (searchType==='movie' && searchType2==='movie') && !loading && (
        Array.isArray(data) ? (
          <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-3 mt-8 px-2 lg:px-3 mb-3">
            {data.slice(0,numitems).map((item, index) => (
              (item?.backdrop_path || item?.poster_path || item?.profile_path) && (
                <Link 
                key={item.id || index} 
                to={`/${'movie'}/?id=${item?.id}&name=${item?.name || item?.title}`}
                className="block bg-[#172c47] rounded-lg shadow-md hover:scale-105 transition-transform"
              >
                <img 
                  src={`${ORIGINAL_IMG_BASE_URL}${item?.backdrop_path || item?.poster_path || item?.profile_path}`} 
                  className={ "w-full h-52 object-cover rounded-t-lg"} 
                  alt={item?.title || item?.name} 
                />
                <h3 className="text-sm px-2 sm:text-base font-bold text-white pt-2 truncate">
                  {item.title || item.name}
                </h3>
                {(item.release_date || item.first_air_date) && (
                  <p className="text-xs sm:text-sm pb-4 p-2 text-gray-400">
                    {item.release_date?.split("-")[0] || item.first_air_date?.split("-")[0]} 
                    | Rating: <b>{item.vote_average}</b> 
                    | {item.adult ? "18+" : "PG-13"}
                  </p>
                )}
               
              </Link>
              )
             
            ))}
             
          </div>
          {numitems < data?.length &&  (
            <div className="flex justify-center items-center mt-6 mb-3 ">
              <button
                onClick={() => {
                  setnumitems(prev => {
                      const updatedNumItems = prev + 4;
                      sessionStorage.setItem("numitemss", updatedNumItems); // Store the new value
                      return updatedNumItems;
                  });
              }}
                className="px-2 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold rounded-md transition-all"
              >
                Load More
              </button>
            </div>
          )}
          </>
        ) : (
          <div className="mt-6 p-4 bg-gray-800 text-center text-white rounded-lg shadow-md max-w-md">
            <p>{data}</p>
          </div>
        )
      )}
       {!Loading && data && imagesLoaded && (searchType==='person' && searchType2==='person') && !loading && (
        Array.isArray(data) ? (
          <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-3 mt-8 px-1 lg:px-3 mb-3">
            {data.slice(0,numitems).map((item, index) => (
              (item?.profile_path || item?.poster_path) && (
                <Link 
                key={item.id || index} 
                to={`/${'person/details'}/?id=${item?.id}&name=${item?.name || item?.title}`}
                className="block bg-gray-800 rounded-lg shadow-md hover:scale-105 transition-transform"
              >
                <img 
                  src={`${ORIGINAL_IMG_BASE_URL}${item?.backdrop_path || item?.poster_path || item?.profile_path}`} 
                  className={ "w-52 h-52 object-cover rounded-t-lg"} 
                  alt={item?.title || item?.name} 
                />
                <h3 className="text-sm sm:text-base px-2 font-bold text-white mt-2 truncate">
                  {item.title || item.name}
                </h3>
               
                {item.popularity && searchType === 'person' && (
                  <p className="text-xs p-2 sm:text-sm text-gray-400">Popularity: {(item.popularity).toFixed(2)}</p>
                )}
              </Link>
              )
              
            ))}
             
          </div>
          {numitems < data?.length && (
            <div className="flex justify-center items-center mt-6 mb-3 ">
              <button
               onClick={() => {
                setnumitems(prev => {
                    const updatedNumItems = prev + 4;
                    sessionStorage.setItem("numitemss", updatedNumItems); // Store the new value
                    return updatedNumItems;
                });
            }}
                className="px-2 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold rounded-md transition-all"
              >
                Load More
              </button>
            </div>
          )}
          </>
        ) : (
          <div className="mt-6 p-4 bg-gray-800 text-center text-white rounded-lg shadow-md max-w-md">
            <p>{data}</p>
          </div>
        )
      )}
       {!Loading && data && imagesLoaded && (searchType==='tv' && searchType2==='tv') && !loading && (
        Array.isArray(data) ? (
          <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-3 mt-8 px-1 lg:px-3 mb-3">
            {data.slice(0,numitems).map((item, index) => (
              (item?.backdrop_path || item?.poster_path || item?.poster_path) && (
                <Link 
                key={item.id || index} 
                to={`/${'tv/details'}/?id=${item?.id}&name=${item?.name || item?.title}`}
                className="block bg-[#172c47] rounded-lg shadow-md hover:scale-105 transition-transform"
              >
                <img 
                  src={`${ORIGINAL_IMG_BASE_URL}${item?.backdrop_path || item?.poster_path || item?.profile_path}`} 
                  className={ "w-full h-52 object-cover rounded-t-lg"}
                  alt={item?.title || item?.name} 
                />
                <h3 className="text-sm sm:text-base font-bold text-white px-2 mt-2 truncate">
                  {item.title || item.name}
                </h3>
                {(item.release_date || item.first_air_date) && (
                  <p className="text-xs sm:text-sm text-gray-400 p-2 ">
                    {item.release_date?.split("-")[0] || item.first_air_date?.split("-")[0]} 
                    | Rating: <b>{item.vote_average}</b> 
                    | {item.adult ? "18+" : "PG-13"}
                  </p>
                )}
                {item.popularity && searchType === 'person' && (
                  <p className="text-xs sm:text-sm text-gray-400">Popularity: {(item.popularity).toFixed(2)}</p>
                )}
              </Link>
              )
              
            ))}
             
          </div>
          {numitems < data?.length &&  (
            <div className="flex justify-center items-center mt-6 mb-3 ">
              <button
                onClick={() => {
                  setnumitems(prev => {
                      const updatedNumItems = prev + 4;
                      sessionStorage.setItem("numitemss", updatedNumItems); // Store the new value
                      return updatedNumItems;
                  });
              }}
                className="px-2 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold rounded-md transition-all"
              >
                Load More
              </button>
            </div>
          )}
          </>
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
