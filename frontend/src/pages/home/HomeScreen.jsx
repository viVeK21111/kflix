import React from 'react'
import Navbar from '../../components/Navbar';
import useGetTrendingContent from '../../hooks/useGetTrendingContent';
import { ORIGINAL_IMG_BASE_URL } from '../../utils/constants';
import {Link} from 'react-router-dom';
import {useContentStore} from '../../store/content'
import MovieSlider from '../../components/MovieSlider';
import { MOVIE_CATEGORIES, TV_CATEGORIES } from '../../utils/constants';
import { useState,useEffect,useRef } from 'react';
import {addWatchStore} from '../../store/watchStore';
import { TvMinimalPlay,Clapperboard,Loader,Star,Clock } from 'lucide-react';
import emailjs from 'emailjs-com';
import { userAuthStore } from '../../store/authUser';

export const HomeScreen = () => {
  const {user}  = userAuthStore();
  useEffect(() => {
  const SECRET_KEY = import.meta.env.VITE_SECRET_EMAILJS;
  const SERVICE_KEY = import.meta.env.VITE_SERVIE_EMAILJS;
  const TEMPLATE_AUTO = import.meta.env.VITE_TEMPLATE_AUTO;
  const params = new URLSearchParams(window.location.search);
  const gauthUser = params.get("authUser");
  if(gauthUser && gauthUser=="new") {
    try {
     
      const paramsa = {
        name: user.username,
        email: user.email,
    };
   emailjs.send(SERVICE_KEY, TEMPLATE_AUTO, paramsa, SECRET_KEY);
    console.log('auto reply Email sent successfully!');
    window.history.replaceState({}, document.title, window.location.pathname);
    }
    catch(error) {
        console.log("error sending welcome email "+error.message);
    }
  }
  else if(gauthUser=="old") {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
   
  },[])
 


  const {trending,loading} = useGetTrendingContent();
  const {contentType} = useContentStore();
  const [ImageLoad,setImageLoad] = useState(true);
  const movieSectionRef = useRef(null);
  const {addWatch,addTv} = addWatchStore();
  const [imageSrc, setImageSrc] = useState("");

    // New state for carousel functionality
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

     // Get current trending item
  const currentTrending = trending && trending.length > 0 ? trending[currentIndex] : null;

  useEffect(() => {
    if (!trending || trending.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % trending.length);
        setIsTransitioning(false);
      }, 300); // Transition duration
    }, 12000); // 8 seconds

    return () => clearInterval(interval);
  }, [trending]);
  
  useEffect( () => {
    sessionStorage.setItem("openseason",null);
  },[])
  useEffect( () => {
    sessionStorage.setItem("navigating_from_tv_page","false");
  },[])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setImageSrc(ORIGINAL_IMG_BASE_URL + (currentTrending?.poster_path || currentTrending?.backdrop_path || currentTrending?.profile_path));
      } else {
        setImageSrc(ORIGINAL_IMG_BASE_URL + (currentTrending?.backdrop_path || currentTrending?.poster_path || currentTrending?.profile_path));
      }
    };
  
    if (currentTrending) handleResize(); 
  
    window.addEventListener("resize", handleResize); // Listen for resize
    return () => window.removeEventListener("resize", handleResize); // Remove listener
  }, [currentTrending]); 

  useEffect(() => {
    setImageLoad(true);
      setImageSrc("");
  },[contentType]);

   // Reset current index when content type changes
   useEffect(() => {
    setCurrentIndex(0);
    setIsTransitioning(false);
  }, [contentType]);

  if (loading) {
    return (
      <div className="h-screen ">
            <div className="flex justify-center items-center bg-black h-full">
            <Loader className="animate-spin text-red-600 w-10 h-10"/>
            </div>
      </div>
    );
  }

  const addWatchList = async(e,id) => {
    e.preventDefault();
    console.log("id "+id);
    if(contentType === 'movies') addWatch(id);
    else if(contentType === 'tv') addTv(id);
  }
  

  return (
    <>
      <div className='relative h-[80vh] text-white'>
        <Navbar movieSectionRef={movieSectionRef}/>
      
        {/* End Trailer Modal */}
        {ImageLoad && (<div className='absolute top-0 left-0 flex w-full h-full items-center bg-black/90 justify-center shimmer -z-10'> <Loader className='animate-spin w-8 h-8'/> </div>)}
        
        <div className={`absolute top-0 left-0 w-full h-[80vh] -z-50 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}/>
          <img 
            src={imageSrc} 
            alt='img' 
            className='absolute top-0 left-0 w-full h-[80vh] object-cover -z-50' 
            onLoad={() => setImageLoad(false)}
          />

         <div className='absolute top-0 left-0 w-full h-[80vh] bg-black/50 -z-50 aria-hidden:true'/>
         <div className='absolute top-0 left-0 w-full h-[80vh] flex flex-col justify-center px-4'>
         <div className='absolute bg-gradient-to-b from-black/70 via-transparent to-black/80 w-full h-[80vh] top-0 left-0 -z-10' />

         <div className='absolute bottom-5 md:bottom-3 left-3 max-w-3xl'>
         <div className={`transition-all duration-500 transform ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              <div className="flex items-center justify-between mb-5">
                <p className='text-white-600 text-xl md:text-2xl animate-pulse'>Trending...</p>
                
              </div>
              
              <h1 className='text-xl sm:text-xl lg:text-2xl xl:text-3xl font-extrabold text-balance'>
                {currentTrending?.title || currentTrending?.name}
              </h1>
              
              <p className='flex mt-2 text-center text-base sm:text-base lg:text-lg xl:text-lg font-semibold text-balance'>
                {currentTrending?.release_date?.split("-")[0] || currentTrending?.first_air_date?.split('-')[0]} | 
                {currentTrending?.adult ? "18+" : "PG-13"} | 
                <span className="ml-1 flex items-center">
                  <Star className='size-5 lg:size-6 fill-white/20 pt-1'/> 
                  {currentTrending?.vote_average?.toFixed(1)}
                </span>
              </p>
          
              {currentTrending && currentTrending?.overview && window.innerWidth >= 768 && (
                <p className='mt-2 text-base bg-opacity-90 md:bg-opacity-70 lg:bg-opacity-70 xl:bg-opacity-70 p-1 rounded'> 
                  {currentTrending?.overview.length > 250 ? currentTrending?.overview.slice(0, 250) + "..." : currentTrending?.overview} 
                </p>
              )}
                
              <div className='flex items-center mt-3 space-x-2'>
                <Link
                  to={`/${contentType === 'movies' ? 'movie' : 'tv/details'}/?id=${currentTrending?.id}&name=${currentTrending?.name || currentTrending?.title}`}
                  className='bg-blue-600 hover:bg-blue-700 text-white font-semibold px-1 py-1 md:px-2 rounded flex items-center transition-colors'
                >
                  {contentType === 'movies' && (
                    <div className='flex items-center'>
                      <Clapperboard className='size-6 p-1' />
                      <p className='font-semibold'>View</p>
                    </div>
                  )}
                  {contentType === 'tv' && (
                    <div className='flex items-center'>
                      <TvMinimalPlay className='size-7 p-1' />
                      <p className='font-semibold'>Episodes</p>
                    </div>
                  )}
                </Link>
                
                <button
                  className='flex bg-slate-600 hover:bg-slate-700 rounded-lg bg-opacity-80 text-base text-white py-1 px-2 items-center transition-colors'
                  onClick={(e) => addWatchList(e, currentTrending?.id)}
                >
                  <Clock className='size-5' />
                  <p className='ml-1 font-semibold'>WatchLater</p>
                </button>
              </div>
            </div>
          

         </div>

         </div>
      </div>
      
      <div  ref={movieSectionRef} className="px-0 mx-0 flex flex-col gap-10 bg-black py-6 ">
        {contentType==="movies" ? 
        MOVIE_CATEGORIES.map((category) => <MovieSlider key={category} category={category} />)
        : TV_CATEGORIES.map((category) => <MovieSlider key={category} category={category} />)}
      </div>

      </>
    )
};

export default HomeScreen;