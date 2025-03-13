import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { DetailsStore } from "../store/tvdetails";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { SimilarStore } from "../store/SimilarStore";
import { addWatchStore } from "../store/watchStore";
import { Plus, Star,Dot,Play } from "lucide-react";

const TvPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const { datas, getSimilarTv } = SimilarStore();
  const { getTvdetails, data } = DetailsStore();
  const [loading, setLoading] = useState(true);
  const [openSeason, setOpenSeason] = useState(null);
  const [numitemsm, setnumitemsm] = useState(5);
  const [imageSrc, setImageSrc] = useState("");
  const [imageload, setimageload] = useState(true);
  const { addTv } = addWatchStore();
  const [scrollRestored, setScrollRestored] = useState(false);
  const [readov,setreadov] = useState(300);
  
  const navigate = useNavigate();

  useEffect( ()=> {
    if(openSeason===null || openSeason==="0" || sessionStorage.getItem("navigating_from_tv_page") === null) {
      window.scroll(0,0);
    } 
  },[])

  // Save scroll position before navigating away
  const saveScrollPosition = () => {
    sessionStorage.setItem("navigating_from_tv_page", "true");
    sessionStorage.setItem("tv_page_scroll_position", window.scrollY.toString());
  };

  const handleNavigation = (episode, season) => {
    saveScrollPosition();
    navigate(`/watch/?id=${data?.id}&name=${data?.name}&season=${season.season_number}&episode=${episode}`);
  };
  const handleNavigation1 = (episode,season) => {
    saveScrollPosition();
    navigate(`/watch/?id=${data?.id}&name=${data?.name}&season=${season}&episode=${episode}`);
  }

  useEffect(() => {
    const storedSeason = sessionStorage.getItem("openseason");
    // Fix the condition check
    if (storedSeason !== null && storedSeason !== "0" && storedSeason !== 0) {
      setOpenSeason(parseInt(storedSeason));
    }
    const isNavigatingBack = sessionStorage.getItem("navigating_from_tv_page") === "true";
    if (isNavigatingBack && !loading && !imageload && !scrollRestored) {
      const storedScrollPosition = sessionStorage.getItem("tv_page_scroll_position");
      if (storedScrollPosition && parseInt(storedScrollPosition) > 0) {
        // Increase timeout to ensure everything is rendered
        requestAnimationFrame(() => {
          window.scrollTo({
            top: parseInt(storedScrollPosition),
            left: 0,
            behavior: "instant"
          });
        });
      sessionStorage.removeItem("navigating_from_tv_page");
    }
      else if (!isNavigatingBack && !scrollRestored) {
        window.scrollTo(0, 0);
        setScrollRestored(true);
      }
      
      // Clear the navigation flag after restoring
     
    }
  }, [loading, imageload, scrollRestored]);
  
  useEffect(() => {
    setLoading(true);
    if(id) {
    Promise.all([
      getTvdetails(id),
      getSimilarTv(id)
    ]).finally(() => {
      setLoading(false);
    });
  }
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setImageSrc(ORIGINAL_IMG_BASE_URL + (data?.backdrop_path || data?.poster_path));
      } else {
        setImageSrc(ORIGINAL_IMG_BASE_URL + (data?.backdrop_path || data?.poster_path));
      }
    };

    if (data) handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [data]);

  
  const toggleSeason = (seasonNumber) => {
    const newOpenSeason = openSeason === seasonNumber ? null : seasonNumber;
    setOpenSeason(newOpenSeason);
    sessionStorage.setItem("openseason", seasonNumber);
  };

  if (loading) {
    return (
      <p className="flex text-white bg-slate-800 justify-center items-center text-xl h-screen w-full font-bold">
        Hold on tight... 🍿
      </p>
    );
  }

  const addWatchList = async (e, id) => {
    e.preventDefault();
    addTv(id);
  };

  return (
    <div className="text-white bg-gradient-to-b from-gray-900 to-black min-h-screen p-2">
      <header className="relative">
        <img
          className="w-full md:h-[80vh] object-cover object-top rounded-t-lg shadow-2xl"
          src={imageSrc}
          alt="TV Show"
          onLoad={() => setimageload(false)}
        />

        <div className="md:absolute inset-0 md:bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
        <div className="md:absolute lg:max-w-3xl bottom-2 left-3 rounded-t-lg">
        <div className='mt-4 sm:hidden ml-1'>
            <div className='flex'>
            <p className="flex gap-2 items-center bg-white bg-opacity-20 text-semibold rounded-md px-2 py-1">
                  {data?.adult ? "18+" : "PG-13"} 
          </p>
          <div className='flex items-center'>
          <p className="flex ml-2"><Star className='size-5 pt-1'/>{data?.vote_average}  </p>
          <p className='ml-5 flex'>
          {data?.genres && data?.genres.slice(0,2).map((item, index) => (
          <div key={item.id} className="flex items-center text-white">
            {(index!==2 && index!==0) && (<Dot />)} 
            <span>{item.name}</span>
         </div>
         
            ))}
          </p>
          </div>
            </div>

            <div className="mt-3">
            <p>{data?.first_air_date} - {data?.last_air_date}</p>
            <p className="flex mt-3">
        
            <p className="">Seasons: {data?.number_of_seasons}</p>
            <p className="ml-2">Episodes: {data?.number_of_episodes}</p>
            </p>
            
            </div>
          <button className='flex w-full justify-center p-2 bg-blue-600 items-center mt-4 hover:bg-blue-800 px-2 rounded-md'
            onClick={() => handleNavigation1(1, 1)}
            >
            <Play className='size-6 fill-white p-1'/>
            <p className='font-semibold text-lg'>Play S1 E1</p>
            </button>
           
        </div>
          <h1 className="text-xl px-1 md:text-2xl xl:text-3xl font-bold mb-4 mt-3 text-white">
            {data?.name}
          </h1>
          <p className={(window.innerWidth < 768 && data?.overview.length>readov) ? `text-base mb-2 px-1 max-w pb-2` : `text-sm px-1 md:text-base mb-2 max-w pb-2` }>
            {data?.overview.length < readov ? data?.overview : ( 
              <> 
            {data?.overview.slice(0, readov)}
            {readov<data?.overview.length && (
               <button className="hover:underline text-white text-wheat-600" onClick={() => setreadov(data?.overview.length)}>...Read more</button> 
            )}
            </>
          )}
          </p>
          <p className="hidden sm:flex gap-2 mb-2">
            {data?.adult ? "18+" : "PG-13"} | <p className="flex"><Star className='size-5 pt-1' />{data?.vote_average}</p>
            <p className="flex ml-2 items-center">
            {data?.genres && data?.genres.slice(0,2).map((item, index) => (
          <div key={item.id} className="flex items-center text-white">
            {(index!==2 && index!==0) && (<Dot />)} 
            <span>{item.name}</span>
         </div>
            ))}
            </p>
          </p>
          <div className="hidden sm:flex mt-3">
            <p>{data?.first_air_date} - {data?.last_air_date}</p>
            <Dot />
            <p className="">Seasons: {data?.number_of_seasons}</p>
            <p className="ml-2">Episodes: {data?.number_of_episodes}</p>
            </div>
            <div className="hidden sm:flex">



            </div>
          <div className="sm:hidden text-md mb-2">
          <p>
            <strong>Creator:</strong>{" "}
            {Array.isArray(data.created_by) &&
            data.created_by.length > 0 &&
            data.created_by[0].name
              ? data.created_by[0].name
              : "Unknown"}
          </p>
         
        </div>
        <div className="flex items-center">
        <button className='hidden sm:flex mr-2 justify-center py-1 mt-3 bg-blue-600 items-center hover:bg-blue-800 px-2 rounded-md'
            onClick={() => handleNavigation1(1, 1)}
            >
            <Play className='size-6 fill-white p-1'/>
            <p className='font-semibold text-base'>Play S1 E1</p>
            </button>
        <button
          className='bg-white bg-opacity-15 hover:bg-opacity-25 text-white font-semibold py-1 mt-4 mb-1 px-2 rounded-lg flex items-center'
          onClick={(e) => addWatchList(e, data?.id)}
        >
          <Plus className='size-5' />
          <p className='ml-1'>Watch List</p>
        </button>
        </div>
        
        </div>

        
        
      </header>
    
      {imageload && (
         <div className="w-full flex mt-20 justify-center items-center">
         <p className='text-white '>Loading...</p>
       </div>
      )}

      {/* Seasons Section */}
      { !imageload && (
        <>
         <div className="mt-6">
        <h2 className="text-4xl font-semibold mb-6 text-white border-b-4 border-yellow-400 pb-2">
          Seasons
        </h2>

        <div className="space-y-3 max-w-2xl">
          {data?.seasons?.map((season) => (
            <div
              key={season.id}
              className="bg-gray-800 p-1 rounded-xl shadow-lg hover:shadow-2xl hover:bg-gray-900"
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
                    <button
                      key={`${season.id}-${episode}`}
                      onClick={() => handleNavigation(episode, season)}
                      className="px-3 py-2 bg-red-700 hover:bg-red-900 rounded-md text-white text-sm text-center"
                    >
                      Ep {episode}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Similar TV Shows */}
      <div className='text-white max-w-8xl max-w border-t-4 border-yellow-400 pt-2 mt-5 text-xl'><h3 className='font-bold'>Similar Tv shows</h3></div>
      <div className="grid grid-cols-2 max-w-8xl sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-2 sm:gap-3 mt-8 px-1 md:px-3">
        {datas?.slice(0, numitemsm).map((item, index) => (
          <Link
            key={item.id || index}
            to={'/tv/details' + `/?id=${item?.id}&name=${item?.name || item?.title}`}
            className="block bg-gray-800 p-1 rounded-lg shadow-md hover:scale-105 transition-transform"
            onClick={() => window.scroll(0,0)} // Add this onClick handler
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
      {numitemsm < datas?.slice(0, 10).length && (
        <div className="flex max-w-8xl justify-center items-center mt-6">
          <button
            onClick={() => setnumitemsm(prev => prev + 5)}
            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
          >
            Load More
          </button>
        </div>
      )}
        </>
      )}
      
    </div>
  );
};

export default TvPage;