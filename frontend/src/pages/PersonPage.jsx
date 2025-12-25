import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PersonStore } from "../store/PersonStore";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { Link } from 'react-router-dom';
import { Loader, Star } from 'lucide-react';

export default function PersonPage() {
  const { datap, getPersonDetails, datac, getPersonCredits } = PersonStore();
  const location = useLocation();
  const [movies, setMovies] = useState([]);
  const [loadingMovies,setLoadingMovies] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [numitems, setnumitems] = useState(() => {
    const stored = sessionStorage.getItem("numitems");
    return stored ? Number(stored) : 8;
  });
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const [readov, setreadov] = useState(350);
  const [mediaFilter, setMediaFilter] = useState('movie'); // 'all', 'movie', 'tv'

  useEffect(() => {
    window.scroll(0, 0);
    if (id) {
      getPersonDetails(id).finally(() => setLoading(false));
      if (numitems === 6) window.scrollTo(0, 0);
      getPersonCredits(id).finally(() => setLoading2(false));
    }
  }, [id]);

  // Save numitems to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("numitems", numitems.toString());
  }, [numitems]);

  useEffect(() => {
    // Wait until credits are fully loaded
    if (loading2) return;
  
    setLoadingMovies(true);
  
    let credits = [];
  
    if (datap?.known_for_department === 'Acting') {
      credits = datac?.cast || [];
    } else {
      credits = datac?.crew || [];
    }
  
    setMovies(credits);
    setLoadingMovies(false);
  
  }, [datac, loading2, datap?.known_for_department]);

  // Handle load more functionality
  const handleLoadMore = () => {
    setnumitems(prev => prev + 4);
  };

  // Filter movies based on selected media type
  const filteredMovies = movies.filter(item => {
    if (mediaFilter === 'all') return true;
    return item.media_type === mediaFilter;
  });

  if (loading) {
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center bg-black h-full">
          <Loader className="animate-spin text-white w-10 h-10"/>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-800 text-white flex flex-col">
      <div className="max-w-full w-full bg-black-800 rounded-t-lg shadow-lg flex flex-col sm:flex-row gap-4">
        {/* Profile Image */}
        <div className="flex justify-center pl-3 py-3">
          <img
            src={`${ORIGINAL_IMG_BASE_URL}${datap?.profile_path}`}
            alt={datap?.name}
            className="w-60 h-72 rounded-lg object-cover border border-gray-600 shadow-lg"
          />
        </div>

        {/* Details Section */}
        <div className="flex-1 p-3">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-yellow-400 my-2">{datap?.name}</h1>
            {datap?.also_known_as && (
              <p className="text-gray-300 mt-2 text-sm">
                <b>Also Known As:</b> {datap?.also_known_as.slice(0, 4).join(", ")}
              </p>
            )}
            <p className="flex mt-2 text-white-400 text-base">
              <p className="font-semibold">Born:</p> 
              <p className="ml-2 text-gray-300">
                {datap?.birthday} 
                {!datap?.deathday && (datap?.birthday && 
                  <span>({new Date().getFullYear() - (datap?.birthday?.split("-")[0] || 0)} years)</span>
                )} 
              </p>
            </p>
            <p className="flex mt-2">
              <p className="font-semibold">Place:</p>
              <p className="ml-2 text-gray-300">{datap?.place_of_birth}</p> 
            </p> 
            {datap?.deathday && (
              <p className="flex text-base mt-2"> 
                <p className="font-semibold">Died:</p>
                <p className="ml-2 text-gray-300">
                  {datap.deathday} 
                  <span>({datap.deathday.split("-")[0] - (datap?.birthday?.split("-")[0] || 0)} years)</span> 
                </p> 
              </p>
            )}
            {datap?.known_for_department && (
              <p className="flex mt-2">
                <p className="font-semibold">Department</p>:
                <p className="ml-2 text-gray-300 font-semibold"> {datap?.known_for_department}</p>
              </p>
            )}

            {/* Links */}
            <div className="flex gap-4 mt-4">
              {datap?.homepage && (
                <a
                  href={datap.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 transition-all"
                >
                  Official Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Biography Section */}
      <div className="max-w-auto bg-gray-900 bg-opacity-90 border border-gray-700 rounded-lg shadow-lg p-6">
        <h2 className="md:text-2xl text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>Biography</span>
        </h2>
        {(!datap?.biography || datap?.biography.length === 0) ? (
          <div className="flex items-center gap-2 text-gray-400 italic">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            No biography available for this person.
          </div>
        ) : (
          <blockquote className="text-gray-200 text-md md:text-lg leading-relaxed relative transition-all duration-300">
            {datap?.biography.length < readov ? datap?.biography : (
              <>
                {datap?.biography.slice(0, readov)}
                {readov < datap?.biography.length && (
                  <button
                    className="ml-2 text-blue-400 hover:underline font-semibold focus:outline-none"
                    onClick={() => setreadov(prev => prev + 300)}
                  >
                    ...Read more
                  </button>
                )}
              </>
            )}
            {readov >= datap?.biography.length && datap?.biography.length > 350 && (
              <button
                className="ml-2 text-gray-500 hover:underline font-semibold focus:outline-none"
                onClick={() => setreadov(350)}
              >
                Read less
              </button>
            )}
          </blockquote>
        )}
      </div>

      {/* Movies Section */}
      <div className="bg-slate-900">
        <div className="w-full flex items-center justify-between px-3 mt-3"> 
          <p className="text-xl font-semibold">Known For:</p>
          
          
          {/* Filter Buttons */}
          
          <div className="flex gap-2">
           
            <button
              onClick={() => {
                setMediaFilter('movie');
               
              }}
              className={`px-3 py-1 text-sm rounded-lg transition-all ${
                mediaFilter === 'movie'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => {
                setMediaFilter('tv');
               
              }}
              className={`px-3 py-1 text-sm rounded-lg transition-all ${
                mediaFilter === 'tv'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              TV Shows
            </button>
          </div>
        </div>

      
        {loadingMovies ? (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-white w-7 h-7"/>
      </div>
    ) : (

        <div className="mt-6 mb-3 max-w-full p-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredMovies.slice(0, numitems).map((item, index) => (
            (item?.backdrop_path || item?.poster_path || item?.profile_path) && (
              <Link 
                key={item.id || index} 
                to={item.media_type === 'tv' 
                  ? `/tv/details/?id=${item?.id}&name=${item?.name}` 
                  : `/movie/?id=${item?.id}&name=${item?.name || item?.title}`
                }
              >
                <div className="rounded-lg bg-slate-800 aspect-[4/3] shadow-md hover:bg-slate-700">
                  <img
                    src={`${ORIGINAL_IMG_BASE_URL}${item?.backdrop_path || item?.poster_path || item?.profile_path}`}
                    className={`${(item?.backdrop_path || item?.profile_path) ? "w-full object-cover rounded-t-lg mb-2" : "w-full object-cover h-48 rounded-t-lg mb-2"}`}
                    alt={item?.title || item?.name}
                    loading="lazy"
                  />
                  <h3 className="pl-2 text-sm sm:text-base font-bold text-white mb-1 truncate">
                    {item.title || item.name}
                  </h3>
                  {(item.release_date || item.first_air_date) && (
                    <p className="text-xs flex items-center sm:text-sm text-gray-300 pl-2 pb-3">
                      {item.release_date?.split("-")[0] || item.first_air_date?.split("-")[0]} 
                      | <Star size={12} className='mx-1' /> <b>{item.vote_average?.toFixed(1)}</b> 
                      | {item.media_type === 'tv' ? 'TV' : 'Movie'}
                    </p>
                  )}
                </div>
              </Link>
            )
          ))}
        </div>
    )}

        {/* Load More Button */}
        {numitems < filteredMovies.length && (
          <div className="flex w-full justify-center mt-4 mb-3">
            <button
              onClick={handleLoadMore}
              className="px-3 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
            >
              Load More ({filteredMovies.length - numitems} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}