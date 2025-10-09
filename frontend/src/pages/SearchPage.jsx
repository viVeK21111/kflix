import React, { useEffect, useState, useRef } from 'react';
import { searchStore } from '../store/searchStore';
import { Link } from 'react-router-dom';
import { ORIGINAL_IMG_BASE_URL } from '../utils/constants';
import { Search,History,Loader,House,TvMinimal,Menu,X, ChevronDown,Tv, Shuffle,Star} from 'lucide-react';
import useDebounce from '../hooks/useDebounce';
import axios from 'axios';

const SearchPage = () => {
  const [searchType, setSearchType] = useState(() => sessionStorage.getItem('searchType') || 'movie');
  const [query, setQuery] = useState(sessionStorage.getItem("squery") || '');
  const { getTv, getMovie, getPerson, data, Loading } = searchStore();
  const [Data,setData] = useState(sessionStorage.getItem("data") || data)
  const [numitems,setnumitems] = useState(sessionStorage.getItem("numitemss") || 10);
  const [loading,setloading] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(null);
  sessionStorage.setItem("numitems",6);
  const [Loading1,setLoading1] = useState(true);
  const [surpriseLoading, setSurpriseLoading] = useState(false);
  const [TrendingData,setTrendingData] = useState([]);
  const logo = new Image();
  logo.src = '/kflix3.png';
 
  useEffect(()=> {
    if(data) {
      setData(data);
      sessionStorage.setItem("data",data);
    }
  },[data])

  useEffect(() => {
    sessionStorage.setItem("squery",query);
  },[query])

  useEffect(() => {
    const func = async() => {
      const trendingM = await axios.get('/api/v1/movies/trending')
      const trendingT = await axios.get('/api/v1/tv/trending');
      const movies = trendingM.data.content.map(item => ({
        ...item,
        type: 'movie'
      }));
      
      const tvShows = trendingT.data.content.map(item => ({
        ...item,
        type: 'tv'
      }));
      

    

      const combined = [];
        let mIndex = 0;
        let tIndex = 0;

        while (mIndex < movies.length || tIndex < tvShows.length) {
          // Add 2 movies
          for (let i = 0; i < 2 && mIndex < movies.length; i++) {
            combined.push(movies[mIndex++]);
          }
          // Add 2 TV shows
          for (let i = 0; i < 2 && tIndex < tvShows.length; i++) {
            combined.push(tvShows[tIndex++]);
          }
        }
        setTrendingData(combined);
    }
    func();  
  },[]);

  // Function to get a random content and populate search
  const handleSurpriseMe = async () => {
    try {
      setSurpriseLoading(true);
      let endpoint = '';
      let contentType = '';
      
      if (searchType === 'movie') {
        endpoint = '/api/v1/movies/category/now_playing';
        contentType = 'movie';
      } else if (searchType === 'tv') {
        endpoint = '/api/v1/tv/category/on_the_air';
        contentType = 'tv';
      }
      
      const response = await axios.get(endpoint);
      if (response.data.success && response.data.content && Array.isArray(response.data.content)) {
        const content = response.data.content;
        const randomIndex = Math.floor(Math.random() * content.length);
        const randomItem = content[randomIndex];
        setQuery(randomItem.title || randomItem.name);
        setSearchType(contentType);
      }
    } catch (error) {
      console.error('Error fetching random content:', error);
    } finally {
      setSurpriseLoading(false);
    }
  };
 
  logo.onload = () => {
    setLoading1(false);
  }
  useEffect(() => {
    sessionStorage.setItem('searchType', searchType);
  }, [searchType]);

  useEffect(() => {
    if(Array.isArray(Data) && Data.length > 0) {
      const imagePromises = Data
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
      if(Data) setImagesLoaded(true);
    }
   
  }, [Data, numitems]);

  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(query, 250);

  // Dynamic search effect
  useEffect(() => {
    if (debouncedQuery.length > 2) {
      setloading(true);
      setImagesLoaded(false);
      sessionStorage.setItem('searchType', searchType);
      const sortResults = (Data) => {
        return Data.sort((a, b) => a.name?.localeCompare(b.name) || a.title?.localeCompare(b.title));
      };
      if (searchType === 'movie') {
        getMovie(debouncedQuery.trim()).then(sortResults).finally(() => setloading(false));
      } else if (searchType === 'tv') {
        getTv(debouncedQuery.trim()).then(sortResults).finally(() => setloading(false));
      } else {
        getPerson(debouncedQuery.trim()).then(sortResults).finally(() => setloading(false));
      }
    } else {
      // Clear results if query is too short
      searchStore.setState({ data: null });
      setData(null);
      setImagesLoaded(null);
    }
    setData(data);
  }, [debouncedQuery, searchType]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchTypeOptions = [
    { value: 'movie', label: 'Movies' },
    { value: 'tv', label: 'TV Show' },
    { value: 'person', label: 'Person' },
  ];
  const selectedLabel = searchTypeOptions.find(opt => opt.value === searchType)?.label || 'Movies';

  if( Loading1) {
    return (
        <div className="h-screen ">
        <div className="flex justify-center items-center bg-black h-full">
        <Loader className="animate-spin text-gray-500 w-10 h-10"/>
        </div>
      </div>
    )
  }

 

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-gray-800 to-slate-900 text-white overflow-auto flex flex-col items-center ">
      {/* Header */}
    
      
      <Link to='/history?tab=search' className='flex items-center ml-auto m-4 text-gray-400  transition-all duration-300 hover:scale-110 cursor-pointer text-sm  bg-white bg-opacity-10 py-1 px-2  mx-2 rounded-md'><History size={22} /></Link>
  
      
      {/* Search Section */}
      <div className="flex max-w-2xl mt-8 md:mt-6 w-full px-3">

        <div className="relative mr-2">
          <button
            type="button"
            onClick={() => setDropdownOpen((open) => !open)}
            className="flex items-center px-4 py-2 rounded-lg font-semibold transition-all border bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700 focus:outline-none focus:ring-0  min-w-[120px]"
          >
            <span className="mr-2 w-16">{selectedLabel}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20">
              {searchTypeOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setSearchType(opt.value);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all ${searchType === opt.value ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-200'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="relative w-full flex">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter atleast 3 characters to search"
            className="py-3 px-2  rounded-lg bg-gray-900 border placeholder-gray-600 border-gray-700 outline-none focus:ring-0 text-white w-full flex-1"
            required
            autoComplete="off"
          />
          {searchType !== 'person' && (
            <button
              type="button"
              onClick={handleSurpriseMe}
              className="hidden sm:flex ml-1 px-4 rounded-lg my-1 bg-gray-800  text-white hover:bg-gray-700 transition-all text-xs font-medium items-center gap-1"
              disabled={surpriseLoading}
              title="Surprise Me"
            >
              {surpriseLoading ? (
                <Loader className="animate-spin h-3 w-3" />
              ) : (
                <>
                  <Shuffle className="h-4 sm:h-5" />
                 {/* <span className=''>random</span>*/} 
                </>
              )}
            </button>
          )}
        </div>
      </div>


      {/* AI Recommendation Section */}
      {!query.trim() && (
        <div className="flex justify-center mt-5 mb-12 text-gray-400 text-sm">
          Not sure? Ask our AI chatbot 
          <Link 
            to="/chat" 
            className="text-gray-200 ml-1 hover:text-white hover:underline text-sm cursor-pointer flex items-center gap-2"
          >
            Flix 
          </Link>
        </div>
      )}
      

      {(imagesLoaded===false) && (
        <div className="flex justify-center my-auto absolute items-center h-screen"><Loader className="animate-spin text-white w-7 h-7"/></div>
      )}
      {/* Search Results */}
      {/* Search Results */}

      { query.length==0 && (
        <>
        <div className='text-gray-400 flex mr-auto'><p className='font-semibold text-xl ml-4 lg:ml-11 md:text-2xl'>Trending Searches</p></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 mr-auto gap-4 lg:gap-8 mt-8 px-3 lg:px-10 mb-3">
          
          {TrendingData.slice(0,14).map((item, index) => (
            (item?.backdrop_path || item?.poster_path || item?.profile_path) && (
              <Link 
              key={item.id || index} 
              to={item.type==='movie' ? `/movie/?id=${item?.id}&name=${item?.name || item?.title}` : `/tv/details/?id=${item?.id}&name=${item?.name || item?.title}`}
              className="block bg-[#172c47] rounded-lg shadow-md hover:scale-105 transition-transform"
            >
              <img 
                src={`${ORIGINAL_IMG_BASE_URL}${item?.backdrop_path || item?.poster_path || item?.profile_path}`} 
                className={ "h-[179px] object-cover rounded-t-lg"} 
                alt={item?.title || item?.name} 
              />
              <h3 className="text-sm px-2 sm:text-base font-bold text-gray-300 pt-2 truncate">
                {item.title || item.name}
              </h3>
              {(item.release_date || item.first_air_date) && (
                <p className="text-xs flex items-center sm:text-sm pb-4 p-2 text-gray-400">
                  {item.release_date?.split("-")[0] || item.first_air_date?.split("-")[0]} {" "} 
                  |<Star size={13} className='mx-1' /> <b className='pr-1'>{item.vote_average.toFixed(1)}</b> 
                  | {item.type}
                </p>
              )}
             
            </Link>
            )
           
          ))}
           
        </div>
        </>
        
      )}

      {query.length>0 && (
        <div className='flex justify-start mr-auto pl-4 xl:pl-10 pt-5'><p className='font-semibold text-xl lg:text-2xl flex '>Showing results for <p className='pl-2 text-yellow-500'>"{query}"</p></p></div>
      )}
      


      {!Loading && Data && imagesLoaded && searchType==='movie' && !loading && (
        Array.isArray(Data) ? (
          <>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6  mt-8 px-3 xl:px-10 mb-3">
        {Data.slice(0,numitems).map((item, index) => (
              (item?.backdrop_path || item?.poster_path || item?.profile_path) && (
                <Link 
                key={item.id || index} 
                to={`/${'movie'}/?id=${item?.id}&name=${item?.name || item?.title}`}
                className="block bg-[#172c47] rounded-lg shadow-md hover:scale-105 transition-transform"
              >
                <img 
                  src={`${ORIGINAL_IMG_BASE_URL}${item?.backdrop_path || item?.poster_path || item?.profile_path}`} 
                  className={ "w-[330px] h-[183px] object-cover rounded-t-lg"} 
                  alt={item?.title || item?.name} 
                />
                <h3 className="text-sm px-2 sm:text-base font-bold text-white pt-2 truncate">
                  {item.title || item.name}
                </h3>
                {(item.release_date || item.first_air_date) && (
                  <p className="text-xs sm:text-sm pb-4 p-2 text-gray-400">
                    {item.release_date?.split("-")[0] || item.first_air_date?.split("-")[0]} 
                    | Rating: <b>{item.vote_average.toFixed(1)}</b> 
                    | {item.adult ? "18+" : "PG-13"}
                  </p>
                )}
               
              </Link>
              )
             
            ))}
             
          </div>
          {numitems < Data?.length &&  (
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
            <p>{Data}</p>
          </div>
        )
      )}
      {!Loading && Data && imagesLoaded && searchType==='tv' && !loading && (
        Array.isArray(Data) ? (
          <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 xl:px-10  mt-8 px-3 mb-3">
          {Data.slice(0,numitems).map((item, index) => (
              (item?.backdrop_path || item?.poster_path || item?.poster_path) && (
                <Link 
                key={item.id || index} 
                to={`/${'tv/details'}/?id=${item?.id}&name=${item?.name || item?.title}`}
                className="block bg-[#172c47] rounded-lg shadow-md hover:scale-105 transition-transform"
              >
                <img 
                  src={`${ORIGINAL_IMG_BASE_URL}${item?.backdrop_path || item?.poster_path || item?.profile_path}`} 
                  className={ "w-[330px] h-[183px] object-cover rounded-t-lg"}
                  alt={item?.title || item?.name} 
                />
                <h3 className="text-sm sm:text-base font-bold text-white px-2 mt-2 truncate">
                  {item.title || item.name}
                </h3>
                {(item.release_date || item.first_air_date) && (
                  <p className="text-xs sm:text-sm text-gray-400 p-2 ">
                    {item.release_date?.split("-")[0] || item.first_air_date?.split("-")[0]} 
                    | Rating: <b>{item.vote_average.toFixed(1)}</b> 
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
          {numitems < Data?.length &&  (
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
            <p>{Data}</p>
          </div>
        )
      )}
      {!Loading && Data && imagesLoaded && searchType==='person' && !loading && (
        Array.isArray(Data) ? (
          <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8  mt-8 px-3 mb-3">
          {Data.slice(0,numitems).map((item, index) => (
              (item?.profile_path || item?.poster_path) && (
                <Link 
                key={item.id || index} 
                to={`/${'person/details'}/?id=${item?.id}&name=${item?.name || item?.title}`}
                className="block bg-gray-800 rounded-lg shadow-md hover:scale-105 transition-transform"
              >
                <img 
                  src={`${ORIGINAL_IMG_BASE_URL}${item?.backdrop_path || item?.poster_path || item?.profile_path}`} 
                  className={ "w-72 object-cover rounded-t-lg"} 
                  alt={item?.title || item?.name} 
                />
                <h3 className="text-sm sm:text-base px-2 font-bold text-white mt-2 truncate">
                  {item.title || item.name}
                </h3>
               
                {item.known_for_department && searchType === 'person' && (
                  <p className="text-xs p-2 sm:text-sm text-gray-400">Known for: {(item.known_for_department)}</p>
                )}
              </Link>
              )
              
            ))}
             
          </div>
          {numitems < Data?.length && (
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
            <p>{Data}</p>
          </div>
        )
      )}
    </div>
  );
};

export default SearchPage;

