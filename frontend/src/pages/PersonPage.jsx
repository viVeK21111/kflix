import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PersonStore } from "../store/PersonStore"; // Assuming store import
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants"; // Import Image base URL
import { DetailsStore } from "../store/tvdetails";
import { Link } from 'react-router-dom';
import {Loader,House,TvMinimal} from 'lucide-react'

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
  const [readov,setreadov] = useState(300);

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
      <header className={`flex w-full items-center bg-black bg-opacity-10`}>
            <div  className='flex items-center ml-1'>
              <img src={'/kflix2.png'} alt='kflix logo' className='w-30 sm:w-32 h-12 sm:h-14' />
            </div>
              <div className='ml-auto flex items-center p-2 '>
                   
                <Link className='hover:bg-white hover:bg-opacity-5 p-2 text-sm sm:text-base rounded-lg'  to={'/'}> <p className='flex items-center text-white '><House  className='h-5 w-4 sm:h-5 sm:w-5 mr-1 hover:scale-105 transition-transform'/><p className='font-semibold '>Home</p></p></Link>
                <Link className='hover:bg-white hover:bg-opacity-5 p-2 text-sm sm:text-base rounded-lg' to={'/watchlist'}> <p className='flex items-center text-white pl-1'><TvMinimal className='h-5 w-4 sm:h-5 sm:w-5 mr-1 hover:scale-105 transition-transform'/><p className='font-semibold'>Watchlist</p></p></Link>
              </div>
            
          </header>
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

      {/* Biography Section bg-[#2e2f2e] */}
      
      <div className="max-w-full bg-[#282a26] bg-opacity-60 border-b border-gray-700 p-3 md:p-4 rounded--blg shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-2">Biography</h2>
        {datap?.biography?.length===0 &&(
              <p className="flex justify-center">No Biography</p>
            )}
        <p className="text-gray-300 text-base leading-relaxed">
          {datap?.biography.length < readov ? datap?.biography : ( 
              <> 
            {datap?.biography.slice(0, readov)}
            
            {readov<datap?.biography.length && (
               <button className="hover:underline text-white text-wheat-600" onClick={() => setreadov(prev => prev+300)}>...Read more</button> 
            )}
           
            </>
          )}
          </p>
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
                    | Rating: <b>{item.vote_average}</b> 
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
                  className="px-3 py-2 bg-white bg-opacity-20 text-white font-semibold rounded-lg hover:bg-opacity-30 transition-all"
                >
                  Load More
                </button>
              </div>
            )}
      </div>
      
     
    </div>
  );
}
