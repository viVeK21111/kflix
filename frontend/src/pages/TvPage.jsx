import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { DetailsStore } from "../store/tvdetails";
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { ChevronDownIcon, ChevronUpIcon,CircleArrowLeft,House,TvMinimal } from "lucide-react";
import { SimilarStore } from "../store/SimilarStore";
import { addWatchStore } from "../store/watchStore";
import { Plus, Star,Dot,Play,Loader } from "lucide-react";
import axios from "axios";

const TvPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const { datas, getSimilarTv } = SimilarStore();
  const { getTvdetails, data } = DetailsStore();
  const [loading, setLoading] = useState(true);
  const [openSeason, setOpenSeason] = useState(null);
  const [numitemsm, setnumitemsm] = useState(4);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageload, setimageload] = useState(true);
  const { addTv } = addWatchStore();
  const [scrollRestored, setScrollRestored] = useState(false);
  const [readov,setreadov] = useState(300);
  const [datae,setDatae] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null); 
  const navigate = useNavigate();
  const [seasonLoading, setSeasonLoading] = useState(true);

  useEffect( ()=> {
    if(openSeason===null || openSeason==="0" || sessionStorage.getItem("navigating_from_tv_page") === null) {
      window.scroll(0,0);
    } 
  },[])
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
      getSimilarTv(id)
    ]).finally(() => {
      setLoading(false);
    });
  }
  }, [id]);
  
  useEffect(() => {
    if(imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onLoad = () => {
        setTimeout(() => {
          setimageload(false);
        }, 1000);
       
      };
      img.onError = () => {
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
            <Loader className="animate-spin text-red-600 w-10 h-10"/>
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
      <header className={`md:absolute flex items-center bg-slate-900 md:bg-black md:bg-gradient-to-r from-black/50 via-transparent to-black/50 md:bg-opacity-60 z-10 w-full `}>
            <div  className='flex items-center ml-1'>
              <img src={'/kflix2.png'} alt='kflix logo' className='w-30 sm:w-32 h-12 sm:h-14' />
            </div>
              <div className='ml-auto flex items-center p-2 '>
                   
                <Link className='hover:bg-white hover:bg-opacity-5 text-sm sm:text-base p-2 rounded-lg'  to={'/'}> <p className='flex items-center text-white '><House className='h-5 w-4 sm:h-5 sm:w-5 mr-1 hover:scale-105 transition-transform'/><p className='font-semibold '>Home</p></p></Link>
                <Link className='hover:bg-white hover:bg-opacity-5 text-sm sm:text-base p-2 rounded-lg' to={'/watchlist'}> <p className='flex items-center text-white pl-1'><TvMinimal className='h-5 w-4 sm:h-5 sm:w-5 mr-1 hover:scale-105 transition-transform'/><p className='font-semibold'>Watchlist</p></p></Link>
              </div>
            
          </header>
        <img
          className="w-full md:h-[85vh] object-cover object-top shadow-2xl"
          src={imageSrc}
          alt="TV Show"
         onLoad = {() => setimageload(false)}
         onError = {() => setimageload(false)}
        />
        <div className="absolute top-4 right-4 flex items-center p-2 z-10 hover:scale-105 transition-transform">
        
      </div>

        <div className="md:absolute inset-0 md:bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
        <div className="md:absolute lg:max-w-3xl p-1 md:p-0 bottom-2 left-3 rounded-t-lg">
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
          <p className="hidden sm:flex items-center gap-2 mb-2">
            <p className="bg-white bg-opacity-15 p-1 rounded-lg flex items-center ">{data?.adult ? "18+" : "PG-13"}</p> <p className="flex"><Star className='size-5 pt-1' />{data?.vote_average}</p>
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
            <div className="hidden sm:flex">



            </div>
          <div className="sm:hidden pl-1 text-md mb-2">
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
          className='bg-white bg-opacity-15 hover:bg-opacity-25 text-white font-semibold py-1 mt-4 mb-1 px-2 ml-1 rounded-lg flex items-center'
          onClick={(e) => addWatchList(e, data?.id)}
        >
          <Plus className='size-5' />
          <p className='ml-1'>Watch List</p>
        </button>
        <div className="hidden sm:flex items-center mt-3 pl-3 text-md">
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
         <div className="mt-3 p-2">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white border-b border-white pb-2">
          Seasons
        </h2>

        <div className="space-y-3 max-w-2xl">
          {data?.seasons?.map((season) => (
            <div
              key={season.id}
              className="bg-sky-950 rounded-xl shadow-lg hover:shadow-2xl hover:bg-sky-900"
            >
              {/* Season Header */}
              <div
                className="flex items-center justify-between cursor-pointer"
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
                    className="w-16 h-20 object-cover rounded-tl-lg"
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
              {(seasonLoading && openSeason === season.season_number) && (
                <div className="flex justify-center items-center bg-gray-900 h-12">
                  <Loader className="animate-spin text-white w-5 h-5" />
                </div>
              )}

              {/* Episodes List (Dropdown) */}
              {openSeason === season.season_number  && selectedSeason === season.season_number && (
               <div className="flex flex-col items-start max-w-2xl">
                {datae?.episodes?.map((ep, index) => (
                 <button
                   key={`${season.id}-${index + 1}`}
                   onClick={() => handleNavigation(index + 1, season, datae.episodes.length)}
                   className="px-1 w-full py-2 bg-gray-900  hover:bg-gray-950 border-b border-white border-opacity-15 text-white text-sm"
                 >
                  {index+1} . {ep.name || `Episode ${index + 1}`}
                 </button>
               ))}
               </div>
            
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Similar TV Shows */}
      <div className='text-white max-w-8xl max-w border-t border-white mt-5  text-xl pl-4 pt-4'><h3 className='font-bold'>Similar Tv shows</h3></div>
      <div className="grid grid-cols-2 max-w-8xl sm:grid-cols-3 md:grid-cols-4  gap-2 sm:gap-3  mt-5 pb-3 px-2 md:px-3">
        {datas?.slice(0, numitemsm).map((item, index) => (
          (item?.backdrop_path || item?.poster_path || item?.profile_path) && (
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
              <p className="text-xs sm:text-sm text-gray-400">Popularity: {(item.popularity).toFixed(2)}</p>
            )}
          </Link>
          )
        ))}
      </div>
      {numitemsm < datas?.slice(0, 10).length && (
        <div className="flex max-w-8xl justify-center pb-2 items-center mt-6">
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