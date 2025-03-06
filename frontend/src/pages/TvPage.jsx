import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { DetailsStore } from "../store/tvdetails";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { SimilarStore } from "../store/SimilarStore";
import { addWatchStore } from "../store/watchStore";
import { Clock } from "lucide-react";
import { Star } from 'lucide-react';

const TvPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const {datas,getSimilarTv} = SimilarStore();
  const { getTvdetails, data } = DetailsStore();
  const [loading, setLoading] = useState(true);
  const [openSeason, setOpenSeason] = useState(null);
  const [numitemsm, setnumitemsm] = useState(5);
  const [imageSrc, setImageSrc] = useState("");
  const {addTv} = addWatchStore();

  useEffect(() => {
    if (id) {
      setLoading(true);
      getTvdetails(id).finally(() => setLoading(false));
      window.scrollTo(0, 0);
      getSimilarTv(id);
    }
  }, [id]);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setImageSrc(ORIGINAL_IMG_BASE_URL + data?.poster_path);
      } else {
        setImageSrc(ORIGINAL_IMG_BASE_URL + data?.backdrop_path);
      }
    };
  
    if (data) handleResize(); 
  
    window.addEventListener("resize", handleResize); // Listen for resize
    return () => window.removeEventListener("resize", handleResize); // Remove listener
  }, [data]); 

  const toggleSeason = (seasonNumber) => {
    setOpenSeason(openSeason === seasonNumber ? null : seasonNumber);
  };

  if (loading) {
    return (
      <p className="flex justify-center items-center text-xl h-screen w-full font-bold">
        Hold on tight... 🍿
      </p>
    );
  }
  const addWatchList = async(e,id) => {
    e.preventDefault();
    addTv(id);
  }

  return (
    <div className="text-white bg-gradient-to-b from-gray-900 to-black min-h-screen p-2">
      
      <header className="relative ">
        <img
          className="w-full h-[75vh] object-cover object-top rounded-t-lg shadow-2xl"
          src={imageSrc}
          alt="TV Show"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
      <div className="relative lg:absolute lg:max-w-3xl  bg-slate-900 bg-opacity-60  bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4 rounded-t-lg">
        <h1 className="text-xl md:text-2xl xl:text-3xl 2xl:text-3xl font-bold mb-4 text-yellow-500">
            {data?.name}
          </h1>
          <p className="text-sm md:text-base lg:text-base mb-5 max-w pb-3 border-b-2 border-white-400">{data?.overview.length<300 ? data?.overview : data?.overview.slice(0,300)+". . ."}</p>
          <p className="flex gap-2">
          {data?.adult ? "18+" : "PG-13"} | <p className="flex"><Star className='size-5 pt-1'/>{data?.vote_average}  </p> 
        </p>
        </div>
       
        </header>
        <div className=" bg-slate-900 bg-opacity-70 p-3 rounded-b-lg">

          <div className="text-md">
            <p>
              <strong>Creator:</strong>{" "}
              {Array.isArray(data.created_by) &&
              data.created_by.length > 0 &&
              data.created_by[0].name
                ? data.created_by[0].name
                : "Unknown"}
            </p>
            <p>
              <strong>Total Seasons:</strong> {data?.number_of_seasons}
            </p>
            <p>
              <strong>Total Episodes:</strong> {data?.number_of_episodes}
            </p>
            <p>
              <strong>First Air Date:</strong> {data?.first_air_date}
            </p>
            <p>
              <strong>Last Air Date:</strong> {data?.last_air_date}
            </p>
          </div>
          <button
							className='bg-blue-600 hover:bg-blue-800 text-white font-semibold py-1 mt-5 mb-2 px-2 rounded-lg  flex
							 items-center'
               onClick={(e) => addWatchList(e,data?.id)}
						>
							<Clock className='size-5' />
              <p className='ml-1'>Watch Later</p>
						</button>
        </div>
    

      {/* Seasons Section */}
      <div className="mt-6">
        <h2 className="text-4xl font-semibold mb-6 text-white border-b-4 border-yellow-400 pb-2">
          Seasons
        </h2>

        <div className="space-y-3 max-w-2xl">
          {data?.seasons?.map((season) => (
            <div
              key={season.id}
              className="bg-gray-800 p-1 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105"
            >
              {/* Season Header */}
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSeason(season.season_number)}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      season.poster_path
                        ? `${ORIGINAL_IMG_BASE_URL}${season.poster_path}`
                        : `${ORIGINAL_IMG_BASE_URL}${data?.poster_path}`
                    }
                    alt={season?.name}
                    className="w-16 h-20 object-cover rounded-lg"
                  />
                  <h3 className="text-xl font-bold text-white">{season?.name}</h3>
                </div>

                {/* Toggle Arrow */}
                {openSeason === season.season_number ? (
                  <ChevronUpIcon className="text-white w-6 h-6" />
                ) : (
                  <ChevronDownIcon className="text-white w-6 h-6" />
                )}
              </div>

              {/* Episodes List (Dropdown) */}
              {openSeason === season.season_number && (
                <div className="mt-3 grid grid-cols-4 gap-2 p-2 bg-gray-900 rounded-lg">
                  {Array.from({ length: season.episode_count }, (_, i) => i + 1).map((episode) => (
                    <Link
                      key={episode}
                      to={`/watch/?id=${data?.id}&name=${data?.name}&season=${season.season_number}&episode=${episode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-red-700 hover:bg-red-900 rounded-md text-white text-sm text-center"
                    >
                      Ep {episode}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Similar TV Shows */}
      <div className='text-white max-w-8xl max-w border-t-4 border-yellow-400 pt-2 mt-5 text-xl'><h3 className='font-bold'>Similar Tv shows</h3></div>
        <div className="grid grid-cols-2 max-w-8xl sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6 mt-8 px-4 sm:px-5">
                  {datas?.slice(0,numitemsm).map((item, index) => (
                    <Link 
                      key={item.id || index} 
                      to={'/tv/details'+`/?id=${item?.id}&name=${item?.name || item?.title}`}
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
                      
                      {item?.popularity && (
                        <p className="text-xs sm:text-sm text-gray-400">Popularity: {item.popularity}</p>
                      )}
                    </Link>
                  ))}
                </div>
                {numitemsm < datas?.slice(0,10).length && (
          <div className="flex max-w-8xl justify-center items-center mt-6">
            <button
              onClick={() => setnumitemsm(prev => prev + 5)} // Show 6 more items
              className="px-2 py-1 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg  transition-all"
            >
              Load More
            </button>
          </div>
        )}
    </div>
  );
};

export default TvPage;
