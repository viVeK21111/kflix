import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { DetailsStore } from "../store/tvdetails";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { ChevronDownIcon, ChevronUpIcon,CircleArrowLeft,House,TvMinimal,Menu,X } from "lucide-react";
import { SimilarStore } from "../store/SimilarStore";
import { addWatchStore } from "../store/watchStore";
import { creditStore } from "../store/credits";
import { Plus, Star, Dot, Play, Loader } from "lucide-react";
import axios from "axios";

const TvPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const { datas, getSimilarTv } = SimilarStore();
  const { getTvdetails, data } = DetailsStore();
  const { datac, getTvCredits } = creditStore();
  const [loading, setLoading] = useState(true);
  const [openSeason, setOpenSeason] = useState(null);
  const [numitemsm, setnumitemsm] = useState(4);
  const [numitems, setnumitems] = useState(5);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageload, setimageload] = useState(true);
  const { addTv } = addWatchStore();
  const [scrollRestored, setScrollRestored] = useState(false);
  const [readov,setreadov] = useState(300);
  const [datae,setDatae] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null); 
  const navigate = useNavigate();
  const [seasonLoading, setSeasonLoading] = useState(true);
  const [trailerId, setTrailerId] = useState(null);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect( ()=> {
    if(openSeason===null || openSeason==="0" || sessionStorage.getItem("navigating_from_tv_page") === null) {
      window.scroll(0,0);
    } 
  },[])

  useEffect(() => {
    const getTrailerId = async() => {
      try {
        const trailerId = await axios.get(`/api/v1/tv/trailers/${id}`);
        const tid = trailerId?.data?.content.find((item) => item.type === "Trailer" && item.site === "YouTube") || trailerId?.data?.content.find((item) => item.type === "Teaser" && item.site === "YouTube");
        setTrailerId(tid?.key);
      } catch (error) {
        console.error("Error fetching trailer:", error);
        setTrailerId(null);
      }
    }
    if (id) {
      getTrailerId();
    }
  }, [id]);
  const getEpisode = async(Season) => {
        if(selectedSeason!=Season) setSeasonLoading(true);
        else {
          setSeasonLoading(false);
        }
     
      try {
       
      const seasonep = {"Id":id,"Season":Season};
      const response = await axios.post("/api/v1/tv/episodes",seasonep);
      setDatae(response.data.content)

      }
      catch (error) {
        console.error("Error fetching episodes:",error);
        setDatae(null);
      }
      
    finally {
      setSeasonLoading(false)
      setSelectedSeason(Season);
    }
   }


   
  // Save scroll position before navigating away
  const saveScrollPosition = () => {
    sessionStorage.setItem("navigating_from_tv_page", "true");
    sessionStorage.setItem("tv_page_scroll_position", window.scrollY.toString());
  };

  const handleNavigation = (episode, season,tepisodes) => {
    saveScrollPosition();
    navigate(`/watch/?id=${data?.id}&name=${data?.name}&season=${season.season_number}&episode=${episode}&tepisodes=${tepisodes}`);
  };
  const handleNavigation1 = async(episode,season) => {
    saveScrollPosition();
    sessionStorage.setItem("openseason", season);
    try {
      setSeasonLoading(true);
      const seasonep = {"Id":id,"Season":season};
      const response = await axios.post("/api/v1/tv/episodes",seasonep);
      navigate(`/watch/?id=${data?.id}&name=${data?.name}&season=${season}&episode=${episode}&tepisodes=${response?.data?.content?.episodes?.length}`);
    }
   finally{
      setSelectedSeason(season);
      setOpenSeason(season);
      setSeasonLoading(false)
    }
    
  }

  useEffect(() => {
    const storedSeason = sessionStorage.getItem("openseason");
    // Fix the condition check
    if (storedSeason !== null && storedSeason !== "0" && storedSeason !== 0) {
      getEpisode(parseInt(storedSeason));
      setOpenSeason(parseInt(storedSeason));
      setSelectedSeason(parseInt(storedSeason));
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
    setimageload(true);
    setSeasonLoading(true);
    if(id) {
    Promise.all([
      getTvdetails(id),
      getSimilarTv(id),
      getTvCredits(id)
    ]).finally(() => {
      setLoading(false);
    });
  }
  }, [id]);
  
  useEffect(() => {
    if(imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        setTimeout(() => {
          setimageload(false);
        }, 1000);
       
      };
      img.onerror = () => {
        setTimeout(() => {
          setimageload(false);
        }, 1000);
        
      };
    }
  },[imageSrc]);

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
    //sessionStorage.setItem("selectedseason",selectedSeason)
  };

  if ((loading || imageload)) {
  
    return (
      
      <div className="h-screen ">
            <div className="flex justify-center items-center bg-black h-full">
            <Loader className="animate-spin text-gray-500 w-10 h-10"/>
            </div>
      </div>
    );
  }

  const addWatchList = async (e, id) => {
    e.preventDefault();
    addTv(id);
  };

 
  return (
    <div className="text-white bg-slate-900 min-h-screen">
      <header className="relative">
     
        <img
          className="w-full md:h-[85vh] object-cover object-top shadow-2xl"
          src={imageSrc}
          alt="TV Show"
         onLoad = {() => setimageload(false)}
         onError = {() => setimageload(false)}
        />
        
        

      {showTrailerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <div className="bg-black rounded-lg shadow-lg relative border border-gray-500">
            <button
              className="absolute right-0 px-1 text-2xl bg-black rounded-tr-lg rounded-bl-lg font-bold text-red-600"
              onClick={() => { setShowTrailerModal(false) }}
              aria-label="Close"
            >
              ×
            </button>
            <div className="w-[100vw] max-w-4xl bg-black shadow-2xl overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${trailerId}`}
                title={data?.name + " Official trailer"}
                className="w-full aspect-video rounded"
                allow="autoplay; fullscreen"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

        <div className="md:absolute inset-0 md:bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
        <div className="md:absolute inset-0 md:bg-gradient-to-r from-black/50  to-transparent"></div>
        <div className="md:absolute lg:max-w-3xl p-1 sm:p-2 md:p-0 bottom-2 left-3 rounded-t-lg">
        <div className=' sm:hidden ml-1'>
        <h3 className="flex text-xl my-3 font-bold text-white">{data?.name}</h3>
            <div className='flex'>
            <p className="flex gap-2 items-center bg-white bg-opacity-20 text-semibold rounded-md px-2 py-1">
                  {data?.adult ? "18+" : "PG-13"} 
          </p>
          <div className='flex items-center'>
          <p className="flex ml-2"><Star className='size-5 pt-1'/>{data?.vote_average?.toFixed(1)}  </p>
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
          <h1 className="hidden sm:flex text-xl px-1 md:text-2xl xl:text-3xl font-bold mb-3 mt-3 text-white">
            {data?.name}
          </h1>
          <p className={`px-1 text-base mb-2 max-w pb-2 pt-3 sm:pt-0` }>
            {data?.overview.length < readov ? data?.overview : ( 
              <> 
            {data?.overview.slice(0, readov)}
            {readov<data?.overview.length && (
               <button className="hover:underline text-white text-wheat-600" onClick={() => setreadov(data?.overview.length)}>...Read more</button> 
            )}
            </>
          )}
          </p>
          <p className="hidden sm:flex items-center gap-2 mb-2">
            <p className="bg-white bg-opacity-15 p-1 rounded-lg flex items-center ">{data?.adult ? "18+" : "PG-13"}</p> <p className="flex"><Star className='size-5 pt-1' />{data?.vote_average?.toFixed(1)}</p>
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
            <p className="flex"><p className="font-semibold mr-1">Seasons:</p> {data?.number_of_seasons}</p>
            <p className="ml-2 flex"><p className="font-semibold mr-1">Episodes:</p>  {data?.number_of_episodes}</p>
          
            </div>

            <div className="md:hidden flex items-center my-3 ml-2 sm:ml-0">
            <button
          className='flex bg-white bg-opacity-15 hover:bg-opacity-25 text-white font-semibold py-1 px-2 rounded-lg items-center'
          onClick={(e) => addWatchList(e, data?.id)}
        >
          <Plus className='size-4 md:size-5' />
          <p className='ml-1'>List</p>
        </button>
        {trailerId && (
              <div className='flex items-center py-1 px-2 rounded-lg hover:bg-opacity-20 bg-white bg-opacity-10 ml-2 hover:cursor-pointer ' onClick={() => setShowTrailerModal(true)}>
                <img className='h-5 items-center md:h-6' src='/youtube.png' alt='YouTube'></img>
                <p className='ml-1 items-center font-semibold text-md'>Trailer</p>
              </div>
            )}
            </div>
            
          <div className="sm:hidden pl-2 text-md my-2">
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
        <button className='hidden sm:flex mr-2 justify-center py-1 mt-2 md:mt-3 mb-2 md:mb-0 bg-blue-600 items-center hover:bg-blue-800 px-2 rounded-md'
            onClick={() => handleNavigation1(1, 1)}
            >
            <Play className='size-6 fill-white p-1'/>
            <p className='font-semibold text-base'>Play S1 E1</p>
            </button>
        
        <div className="hidden md:flex px-1 gap-2 items-center">
        <button
          className='flex items-center  bg-white bg-opacity-15 hover:bg-opacity-25 text-white font-semibold py-1 mt-4 mb-1 px-2 rounded-lg'
          onClick={(e) => addWatchList(e, data?.id)}
        >
          <Plus className='size-5' />
          <p className='ml-1'>List</p>
        </button>
        {trailerId && (
              <div className='flex items-center pt-3  hover:cursor-pointer hover:scale-105 transition-transform' onClick={() => setShowTrailerModal(true)}>
                <img className='h-6' src='/youtube.png' alt='YouTube'></img>
                <p className='ml-1 font-semibold items-center text-md'>Trailer</p>
              </div>
            )}
        </div>
       
        <div className="hidden sm:flex items-center mt-2 md:mt-3 pl-1 pr-1 text-md mb-2 md:mb-0">
          <p>
            <strong>Creator:</strong>{" "}
            {Array.isArray(data.created_by) &&
            data.created_by.length > 0 &&
            data.created_by[0].name
              ? data.created_by[0].name
              : "Unknown"}
          </p>
         
        </div>
       
            
        </div>
        
        </div>

        
        
      </header>
    
     

      {/* Seasons Section */}
      { !imageload && (
        <>
         <div className=" p-2 pb-5 bg-black ">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white ">
          Seasons
        </h2>

        <div className="space-y-4 max-w-4xl">
          {data?.seasons?.map((season) => (
            <div
              key={season.id}
              className="bg-gray-800 bg-opacity-70 rounded-xl shadow-lg hover:shadow-2xl hover:bg-sky-950 transition-all duration-300"
            >
              {/* Season Header */}
              <div
                className="flex items-center justify-between cursor-pointer p-4"
                onClick={() => {toggleSeason(season.season_number);
                  getEpisode(season.season_number);
                }}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      season.poster_path
                        ? `${ORIGINAL_IMG_BASE_URL}${season.poster_path}`
                        : `${ORIGINAL_IMG_BASE_URL}${data?.poster_path}`
                    }
                    alt={season?.name}
                    className="w-20 h-24 object-cover rounded-lg"
                  />
                  <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-white">{season?.name}</h3>
                    <div className="flex items-center gap-4 text-gray-300 text-sm mt-1">
                      <span>{season?.episode_count} Episodes</span>
                      {season?.air_date && (
                        <span>• {new Date(season.air_date).getFullYear()}</span>
                      )}
                    </div>
                    {season?.overview && openSeason === season.season_number && (
                      <p className="text-gray-400 text-sm mt-2 max-w-md line-clamp-2">
                        {season.overview}
                      </p>
                    )}
                  </div>
                </div>

                {/* Toggle Arrow */}
                {openSeason === season.season_number ? (
                  <ChevronUpIcon className="text-white w-6 h-6" />
                ) : (
                  <ChevronDownIcon className="text-white w-6 h-6" />
                )}
              </div>
              {(seasonLoading && openSeason === season.season_number) && (
                <div className="flex justify-center items-center bg-gray-900 h-12">
                  <Loader className="animate-spin text-white w-5 h-5" />
                </div>
              )}

              {/* Episodes List (Dropdown) */}
              {openSeason === season.season_number  && selectedSeason === season.season_number && (
               <div className="flex flex-col items-start max-w-full">
                {datae?.episodes?.map((ep, index) => (
                 <div
                   key={`${season.id}-${index + 1}`}
                   className="w-full border-b border-gray-700 last:border-b-0"
                 >
                   <button
                     onClick={() => handleNavigation(index + 1, season, datae.episodes.length)}
                     className="w-full px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white text-left transition-colors duration-200"
                   >
                     <div className="flex items-start gap-4">
                       <div className="flex-shrink-0">
                         <div className="w-16 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                           <span className="text-sm font-bold">{index + 1}</span>
                         </div>
                       </div>
                       <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2 mb-1">
                           <h4 className="text-base font-semibold text-white truncate">
                             {ep.name || `Episode ${index + 1}`}
                           </h4>
                           {ep.air_date && (
                             <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                               {new Date(ep.air_date).toLocaleDateString()}
                             </span>
                           )}
                         </div>
                         <div className="flex items-center gap-4 text-xs text-gray-400">
                           {ep.runtime && (
                             <span>{ep.runtime} min</span>
                           )}
                           {ep.vote_average && (
                             <span className="flex items-center gap-1">
                               <Star className="w-3 h-3" />
                               {ep.vote_average.toFixed(1)}
                             </span>
                           )}
                         </div>
                       </div>
                       <div className="flex-shrink-0">
                         <Play className="w-5 h-5 text-gray-400" />
                       </div>
                     </div>
                   </button>
                 </div>
               ))}
               </div>
            
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Cast Section */}
      {!loading && !imageload && (
        <div className='bg-black w-full sm:mt-0'>
          <div className='flex text-white border-t border-white border-opacity-30 pl-3 pt-4 text-xl'>
            <h3 className='font-bold'>Cast</h3>
          </div>
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-2 py-2 sm:px-5">
            {datac?.cast?.slice(0, numitems).map((item, index) => (
              <Link
                key={item.id || index} 
                to={'/person/details'+`/?id=${item?.id}&name=${item?.name}`}
                className="flex flex-col items-center bg-opacity-60 shadow-md hover:scale-105 transition-transform"
              >
                <img 
                  src={`${ORIGINAL_IMG_BASE_URL}${item?.backdrop_path || item?.poster_path || item?.profile_path}`} 
                  className="object-cover size-36 md:size-48 aspect-square rounded-full" 
                  alt={item?.title || item?.name} 
                />
                <h3 className=" text-sm sm:text-base font-bold text-white mt-2 truncate">
                  {item.title || item.name}
                </h3>
                
                {item?.character && (
                  <p className="text-xs sm:text-sm text-gray-400">character: {item.character}</p>
                )}
              </Link>
            ))}
          </div>
          {numitems < datac?.cast?.slice(0, 10).length && (
            <div className="flex w-full justify-end mt-5 pb-3">
              <button
                onClick={() => setnumitems(prev => prev + 4)}
                className="px-2 py-1 mr-2 bg-white bg-opacity-10 text-white font-semibold rounded-lg hover:bg-opacity-20 transition-all"
              >
                Load More
              </button>
            </div>
          )}
          {numitems >= 10 && (
            <div className="flex w-full justify-center max-w-8xl mt-5 pb-3">
              <button
                onClick={() => setnumitems(5)}
                className="px-2 py-1 text-base font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 hover:scale-105 transition-all"
              >
                Load Less
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Similar TV Shows */}
      <div className='text-white max-w-8xl max-w border-t border-gray-600 bg-black  text-xl p-4'><h3 className='font-bold'>Similar Tv shows</h3></div>
             <div className="grid grid-cols-2 max-w-8xl sm:grid-cols-3 md:grid-cols-4 bg-black  gap-2 sm:gap-3  pb-3 px-2 md:px-3">
          {datas?.slice(0, numitemsm).map((item, index) => (
            (item?.backdrop_path || item?.poster_path || item?.profile_path) && (
            <Link
              key={item.id || index}
              to={'/tv/details' + `/?id=${item?.id}&name=${item?.name || item?.title}`}
              className="block bg-gray-800 bg-opacity-60  p-2 rounded-lg shadow-md hover:scale-105 transition-transform"
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
                <p className="text-xs sm:text-sm text-gray-400">Popularity: {(item.popularity).toFixed(2)}</p>
              )}
            </Link>
            )
          ))}
       </div>
       {numitemsm < datas?.slice(0, 10).length && (
         <div className="flex justify-end bg-black pb-3 px-2 md:px-3">
           <button
             onClick={() => setnumitemsm(prev => prev + 4)}
             className="px-2 py-1 bg-white bg-opacity-10 hover:bg-opacity-20 text-white font-semibold rounded-lg transition-all"
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