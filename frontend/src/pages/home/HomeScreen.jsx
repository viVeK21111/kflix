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

  useEffect( () => {
    sessionStorage.setItem("openseason",null);
  },[])
  useEffect( () => {
    sessionStorage.setItem("navigating_from_tv_page","false");
  },[])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setImageSrc(ORIGINAL_IMG_BASE_URL + (trending?.poster_path || trending?.backdrop_path || trending?.profile_path));
      } else {
        setImageSrc(ORIGINAL_IMG_BASE_URL + (trending?.backdrop_path || trending?.poster_path || trending?.profile_path));
      }
    };
  
    if (trending) handleResize(); 
  
    window.addEventListener("resize", handleResize); // Listen for resize
    return () => window.removeEventListener("resize", handleResize); // Remove listener
  }, [trending]); 

  useEffect(() => {
    setImageLoad(true);
      setImageSrc("");
  },[contentType]);

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
        
        <div className="absolute top-0 left-0 w-full h-full bg-black/20 -z-40" />
          <img 
            src={imageSrc} 
            alt='img' 
            className='absolute top-0 left-0 w-full h-[80vh] object-cover -z-50' 
            onLoad={() => setImageLoad(false)}
          />

         <div className='absolute top-0 left-0 w-full h-[80vh] bg-black/50 -z-50 aria-hidden:true'/>
         <div className='absolute top-0 left-0 w-full h-[80vh] flex flex-col justify-center px-4'>
         <div className='absolute bg-gradient-to-b from-black/70 via-transparent to-black/80 w-full h-[80vh] top-0 left-0 -z-10' />

         <div className='absolute bottom-12 md:bottom-12 left-3 max-w-3xl'>
          <div> <p className='text-white-600 text-xl md:text-2xl md:mt-15 mb-5 animate-pulse'>Trending...</p> </div>
          <h1 className='text-xl sm:text-xl lg:text-2xl xl:text-3xl md:mt-20 font-extrabold text-balance'>
            {trending?.title || trending?.name}
          </h1>
          <p className='flex mt-2 text-center text-base sm:text-base lg:text-lg xl:text-lg font-semibold text-balance'>
          {trending?.release_date?.split("") || trending?.first_air_date.split('-')[0]} | {trending?.adult? "18+":"PG-13"} | <p className="ml-1 flex"><Star className='size-5 lg:size-6 fill-white/20 pt-1'/> {trending?.vote_average} </p>
          </p>
      
          
          {trending && trending?.overview && window.innerWidth >= 768 && ( <p className='mt-2 text-base bg-opacity-90 md:bg-opacity-70 lg:bg-opacity-70 xl:bg-opacity-70 p-1 rounded'> {trending?.overview.length > 250 ? trending?.overview.slice(0, 250) + "..." : trending?.overview} </p>)}
            
  
            <div className='absolute flex items-center mt-3'>
						<Link
							to={`/${contentType === 'movies' ? 'movie' : 'tv/details'}/?id=${trending?.id}&name=${trending?.name || trending?.title}`}
							className='bg-blue-600 hover:bg-blue-700 text-white font-semibold px-1 py-1 md:px-2 rounded  flex
							 items-center'
						>
              {contentType==='movies' && (<div className='flex'>
              <Clapperboard className='size-6  p-1' />
              <p className='font-semibold'>View</p>
						 </div>)
              }
              {contentType==='tv' && (<div className='flex'>
              <TvMinimalPlay className='size-7 p-1' />
              <p className='font-semibold'>Episodes</p>
						 </div>)
              }
						</Link>
            <button
							className='flex bg-slate-600 hover:bg-slate-700 rounded-lg bg-opacity-80 text-base text-white ml-2 py-1 px-2
							 items-center'
               onClick={(e) => addWatchList(e,trending?.id)}
						>
							<Clock className='size-5' />
              <p className='ml-1 font-semibold'>WatchLater</p>
						</button>
						
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