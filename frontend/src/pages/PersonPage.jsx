import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PersonStore } from "../store/PersonStore"; // Assuming store import
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants"; // Import Image base URL
import { DetailsStore } from "../store/tvdetails";
import { Link } from 'react-router-dom';
import {Loader,House,TvMinimal,Menu,X} from 'lucide-react'

export default function PersonPage() {
  const { datap, getPersonDetails, datac, getPersonCredits } = PersonStore();
  const location = useLocation();
  const [movieids, setMovieIds] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2,setLoading2] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [numitems,setnumitems] = useState(() => {
    return Number(sessionStorage.getItem("numitems")) || 8;
  });
  const { getMovieDetail } = DetailsStore();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const [readov,setreadov] = useState(350);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    window.scroll(0,0);
    if (id) {
      getPersonDetails(id).finally(() => setLoading(false));
      if(numitems===6) window.scrollTo(0, 0);
      getPersonCredits(id).finally(()=> setLoading2(false));
    }
  }, [id]);

  // Fetch Movie IDs when datac changes

  useEffect(()=> {
    sessionStorage.setItem("numitems",numitems);
  },[numitems])

  useEffect(() => {
    if ( datac?.cast?.length > 0 && !loading2) {
      const ids = [...new Set(datac.cast.map(x => x.id))];
      setMovieIds(ids);
    }
  },[datac,loading2]);

  // Fetch Movie Details when movieids updates
  useEffect(() => {
    if (movieids.length > 0 && !loading2) {
      Promise.all(movieids.map(movieId => getMovieDetail(movieId)))
        .then(movieDetails => {
          setMovies(movieDetails);
          setLoading1(false);
        })
        .catch(err => console.error("Error fetching movie details:", err));
    }
  }, [movieids,loading2]);

  

  if (loading) {
    return (
      <div className="h-screen ">
      <div className="flex justify-center items-center bg-black h-full">
      <Loader className="animate-spin text-white w-10 h-10"/>
      </div>
</div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-800 text-white flex flex-col ">
         
          
      <div className="max-w-full w-full bg-black-800 rounded-t-lg shadow-lg flex flex-col sm:flex-row gap-4">
        {/* Profile Image */}
        <div className="flex justify-center p-3">
        <img
          src={`${ORIGINAL_IMG_BASE_URL}${datap?.profile_path}`}
          alt={datap?.name}
          className="w-60 h-60 rounded-lg object-cover border border-gray-600 shadow-lg"
        />
        </div>
       

        {/* Details Section */}
        <div className="flex-1 p-3">
          <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-yellow-400">{datap?.name}</h1>
          {datap?.also_known_as && (
            <p className="text-gray-300 mt-2 text-sm">
              <b>Also Known As:</b> {datap?.also_known_as.slice(0, 4).join(", ")}
            </p>
          )}
          <p className="flex mt-2 text-white-400 text-base">
          <p className="font-semibold">Born:</p> <p className="ml-2 text-gray-300">{datap?.birthday} {!datap?.deathday && (datap?.birthday && <span>({new Date().getFullYear() - (datap?.birthday?.split("-")[0] || 0)} years)</span>)} </p>
        </p>
        <p className="flex mt-2"><p className="font-semibold">Place:</p><p className="ml-2 text-gray-300">{datap?.place_of_birth}</p> </p> 
          {datap?.deathday && (
            <p className="flex text-base mt-2"> <p className="font-semibold">Died:</p><p className="ml-2 text-gray-300">{datap.deathday} <span>({datap.deathday.split("-")[0] - (datap?.birthday?.split("-")[0] || 0)} years)</span> </p> </p>
          )}
          {datap?.known_for_department && (
            <p className="flex mt-2"><p className="font-semibold">Department</p>:<p className="ml-2 text-gray-300 font-semibold"> {datap.known_for_department}</p></p>
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
            {datap?.imdb_id && (
              <a
                href={`https://www.imdb.com/name/${datap.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition-all"
              >
                IMDB
              </a>
            )}
          </div>
          
          </div>
        </div>
      </div>

      {/* Biography Section */}
      <div className="max-w-auto  bg-gray-900 bg-opacity-90 border border-gray-700 rounded-lg shadow-lg p-6">
        <h2 className="md:text-2xl text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>Biography</span>
        </h2>
        {(!datap?.biography || datap?.biography.length === 0) ? (
          <div className="flex items-center gap-2 text-gray-400 italic">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
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
      <div className="w-full  max-w-4xl text-xl mt-3"> 
        <p className="ml-3 font-semibold">Movies Known For: </p>
      </div>
      {loading1 && (
                  <div className="flex justify-center h-screen mt-20"><Loader className="animate-spin text-white w-7 h-7"/></div>

        )}
      <div className="mt-6 mb-3 max-w-full p-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
       
          <>
          {movies.slice(0,numitems).map((item, index) => (
            (item?.backdrop_path || item?.poster_path) && (
              <Link key={item.id || index} to={`/movie/?id=${item?.id}&name=${item?.name || item?.title}`}>
              <div className="rounded-lg bg-slate-800  shadow-md hover:scale-105 transition-transform">
                <img
                  src={`${ORIGINAL_IMG_BASE_URL}${item?.backdrop_path || item?.poster_path}`}
                  className="w-full h-40 sm:h-48 object-cover rounded-t-lg mb-2"
                  alt={item?.title || item?.name}
                />
                <h3 className="pl-2 text-sm sm:text-base font-bold text-white mb-1 truncate">
                  {item.title || item.name}
                </h3>
                {(item.release_date || item.first_air_date) && (
                  <p className="text-xs sm:text-sm text-gray-300 pl-2 pb-3">
                    {item.release_date?.split("-")[0] || item.first_air_date?.split("-")[0]} 
                    | Rating: <b>{item.vote_average.toFixed(1)}</b> 
                    | {item.adult ? "18+" : "PG-13"}
                  </p>
                )}
              </div>
            </Link>
            )
         
        ))}
       
       </>
       
      </div>
      {numitems < movies.length && (
              <div className="flex w-full justify-center mt-4 mb-3">
                <button
                  onClick={() => setnumitems(prev => prev + 4)} // Show 6 more items
                  className="px-3 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
                >
                  Load More
                </button>
              </div>
            )}
      </div>
      
     
    </div>
  );
}
