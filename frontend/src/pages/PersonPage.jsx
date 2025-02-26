import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PersonStore } from "../store/PersonStore"; // Assuming store import
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants"; // Import Image base URL
import { DetailsStore } from "../store/tvdetails";
import { Link } from 'react-router-dom';
import { use } from "react";

export default function PersonPage() {
  const { datap, getPersonDetails, datac, getPersonCredits } = PersonStore();
  const location = useLocation();
  const [movieids, setMovieIds] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading2,setLoading2] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [numitems,setnumitems] = useState(() => {
    return Number(localStorage.getItem("numitems")) || 6;
  });
  const { getMovieDetail } = DetailsStore();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  useEffect(() => {
    if (id) {
      getPersonDetails(id).finally(() => setLoading(false));
      if(numitems===6) window.scrollTo(0, 0);
      getPersonCredits(id).finally(()=> setLoading2(false));
    }
  }, [id]);

  // Fetch Movie IDs when datac changes

  useEffect(()=> {
    localStorage.setItem("numitems",numitems);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-6 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center gap-6">
        {/* Profile Image */}
        <img
          src={`${ORIGINAL_IMG_BASE_URL}${datap?.profile_path}`}
          alt={datap?.name}
          className="w-48 h-48 rounded-lg object-cover border-4 border-white-500 shadow-lg"
        />

        {/* Details Section */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-yellow-400">{datap?.name}</h1>
          {datap?.also_known_as && (
            <p className="text-gray-300 mt-2 text-sm">
              <b>Also Known As:</b> {datap?.also_known_as.slice(0, 4).join(", ")}
            </p>
          )}
          <p className="mt-2 text-white-400 text-base">
          <b>Born</b>: {datap?.birthday} {!datap?.deathday && (datap?.birthday && <span>({new Date().getFullYear() - (datap?.birthday?.split("-")[0] || 0)} years)</span>)} <b className="ml-3">Place:</b> {datap?.place_of_birth}
        </p>

          {datap?.deathday && (
            <p className="text-base"> <b>Death:</b> {datap.deathday} <span>({datap.deathday.split("-")[0] - (datap?.birthday?.split("-")[0] || 0)} years)</span> </p>
          )}
          {datap?.known_for_department && (
            <p className="mt-2"><b>Department:</b> {datap.known_for_department}</p>
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
                className="px-3 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-700 transition-all"
              >
                IMDB
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Biography Section */}
      <div className="mt-6 max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-yellow-400 mb-2">Biography</h2>
        <p className="text-gray-300 text-sm leading-relaxed">{datap?.biography || "No biography available."}</p>
      </div>

      {/* Movies Section */}
      <div className="w-full max-w-4xl text-xl mt-3"> 
        <p className="font-semibold">Movies Known For: </p>
      </div>
      <div className="mt-6 max-w-4xl grid grid-cols-2 sm:grid-cols-3 gap-4">
        {loading1 ? (
          <div><p>Loading...</p></div>
        ):(
          <>
          {movies.slice(0,numitems).map((item, index) => (
          <Link key={item.id || index} to={`/watch/?id=${item?.id}&name=${item?.name || item?.title}`}>
            <div className="p-2 border rounded-lg bg-slate-900 shadow-md hover:scale-105 transition-transform">
              <img
                src={`${ORIGINAL_IMG_BASE_URL}${item?.backdrop_path || item?.poster_path}`}
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
            </div>
          </Link>
        ))}
        {numitems < movies.length && (
              <div className="flex w-full max-w-4xl mt-6">
                <button
                  onClick={() => setnumitems(prev => prev + 6)} // Show 6 more items
                  className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-700 transition-all"
                >
                  Load More
                </button>
              </div>
            )}
       </>
       )}
      </div>
    </div>
  );
}
