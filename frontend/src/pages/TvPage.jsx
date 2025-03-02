import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { DetailsStore } from "../store/tvdetails";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { SimilarStore } from "../store/SimilarStore";

const TvPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const {datas,getSimilarTv} = SimilarStore();
  const { getTvdetails, data } = DetailsStore();
  const [loading, setLoading] = useState(true);
  const [openSeason, setOpenSeason] = useState(null);
  const [numitemsm, setnumitemsm] = useState(6);
  const [imageSrc, setImageSrc] = useState("");

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
 

  return (
    <div className="text-white bg-gradient-to-b from-gray-900 to-black min-h-screen p-2">
      
      <header className="relative mb-10">
        <img
          className="w-full h-[75vh] object-cover object-top rounded-t-lg shadow-2xl"
          src={imageSrc}
          alt="TV Show"
          style={{ objectPosition: "top 50%" }}
        />
        <div className="bottom-6 left-6 bg-sky-950 bg-opacity-70 p-3 rounded-b-lg">
          <h1 className="text-2xl md:text-3xl xl:text-3xl 2xl:text-4xl font-bold mb-4 text-yellow-500">
            {data?.name}
          </h1>
          <p className="text-lg mb-5 max-w pb-3 border-b-2 border-white-400">{data?.overview}</p>
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
              <strong>View:</strong> {data?.adult ? "18+" : "PG-13"}
            </p>
            <p>
              <strong>Rating:</strong> {data?.vote_average}
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
        </div>
      </header>

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
      <div className='text-white w-full max-w border-t-4 border-yellow-400 pt-2 mt-5 text-xl'><h3 className='font-bold'>Similar Tv shows</h3></div>
        <div className="grid grid-cols-2 w-full max-w-6xl sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6 mt-8 px-4 sm:px-5">
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
          <div className="flex w-full justify-center max-w-4xl mt-6">
            <button
              onClick={() => setnumitemsm(prev => prev + 4)} // Show 6 more items
              className="px-3 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-700 transition-all"
            >
              Load More
            </button>
          </div>
        )}
    </div>
  );
};

export default TvPage;
