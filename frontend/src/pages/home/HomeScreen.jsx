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
import { TvMinimalPlay,Clapperboard,Loader,Star,Clock,Plus,TvMinimal,Dot,ChevronLeft, ChevronRight } from "lucide-react";
import emailjs from 'emailjs-com';
import { userAuthStore } from '../../store/authUser';
import AddToPlaylistModal from '../../components/AddToPlaylistModal';

import axios from 'axios';

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

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);


    // New state for carousel functionality
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pcontent, setpcontent] = useState([]);
	const [pcontentLoading, setPcontentLoading] = useState(true);
  const sliderRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);
  
	const scrollLeft = () => {
		if (sliderRef.current) {
			sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: "smooth" });
		}
	};
	const scrollRight = () => {
		sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: "smooth" });
	};

  useEffect(() => {
		const getpdata = async() =>{
			try {
				setPcontentLoading(true);
				const pdata = await axios.get('/api/v1/search/person/popular'); 
				setpcontent(pdata?.data?.content.results);
			} catch (error) {
				console.error("Error fetching popular people:", error);
				setpcontent([]);
			} finally {
				setPcontentLoading(false);
			}
		}
		getpdata();
	},[])


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
            <Loader className="animate-spin text-gray-500 w-10 h-10"/>
            </div>
      </div>
    );
  }
  const genreMap = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
    878: "Science Fiction",
    10759: "Action & Adventure",
    10762: "Kids",
    10763: "News",
    10764: "Reality",
    10765: "Sci-Fi & Fantasy",
    10766: "Soap",
    10767: "Talk",
    10768: "War & Politics"

  };
  
  

  return (
    <>
      <div className='relative h-[70vh] md:h-[80vh] text-white'>
        <Navbar movieSectionRef={movieSectionRef}/>
      
        {/* End Trailer Modal */}
        {ImageLoad && (<div className='absolute top-0 left-0 flex w-full h-full items-center bg-black/90 justify-center shimmer -z-10'> <Loader className='animate-spin w-8 h-8'/> </div>)}
        
        <div className={`absolute top-0 left-0 w-full h-[70vh] md:h-[80vh] -z-50 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}/>
          <img 
            src={imageSrc} 
            alt='img' 
            className='absolute top-0 left-0 w-full h-[70vh] md:h-[80vh] object-cover -z-50' 
            onLoad={() => setImageLoad(false)}
          />

         <div className='absolute top-0 left-0 w-full h-[70vh] md:h-[80vh] bg-black/50 -z-50 aria-hidden:true'/>
         <div className='absolute top-0 left-0 w-full h-[70vh] md:h-[80vh] flex flex-col justify-center px-4'>
         <div className='absolute bg-gradient-to-b from-black/50 via-transparent to-black/80 w-full h-[70vh] md:h-[80vh] top-0 left-0 -z-10' />
         <div className='absolute bg-gradient-to-r from-black/40 via-transparent to-black/0 w-full h-[70vh] md:h-[80vh] top-0 left-0 -z-10' />


         <div className='absolute bottom-5 md:bottom-7 left-3 md:left-5 max-w-3xl'>
         <div className={`transition-all duration-500 transform ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              <div className="flex items-center justify-between mb-5">
                <p className='text-white-600 text-xl md:text-2xl animate-pulse'>Trending...</p>
              </div>
              
              <h1 className='text-xl sm:text-xl lg:text-2xl xl:text-3xl font-extrabold text-balance'>
                {currentTrending?.title || currentTrending?.name}
              </h1>
              
              <p className='flex mt-2 text-center text-base sm:text-base lg:text-lg xl:text-lg font-semibold text-balance'>
                <span className="ml-1 flex items-center">
                  <p className=''>{currentTrending?.vote_average?.toFixed(1)}</p>
                  <Star className='size-4 fill-white/20 ml-1 mr-4'/>
                </span>
                {currentTrending?.genre_ids && currentTrending?.genre_ids.slice(0,2).map((item, index) => (
                  <div key={item.id} className="flex items-center text-base text-white">
                    {(index!==2 && index!==0) && (<Dot />)} 
                    <span>{genreMap[item]}</span>
                  </div>
                ))}
              </p>
          
              {currentTrending && currentTrending?.overview && window.innerWidth >= 768 && (
                <p className='mt-2 max-w-2xl text-base bg-opacity-90 md:bg-opacity-70 lg:bg-opacity-70 xl:bg-opacity-70 p-1 rounded'> 
                  {currentTrending?.overview.length > 250 ? currentTrending?.overview.slice(0, 250) + "..." : currentTrending?.overview} 
                </p>
              )}
                
              <div className='flex items-center mt-3 space-x-2'>
                <Link
                  to={`/${contentType === 'movies' ? 'movie' : 'tv/details'}/?id=${currentTrending?.id}&name=${currentTrending?.name || currentTrending?.title}`}
                  className='bg-blue-600 hover:bg-blue-700 text-white font-semibold px-1 py-1 md:px-2 rounded-lg flex items-center transition-colors'
                >
                  {contentType === 'movies' && (
                    <div className='flex items-center'>
                      <Clapperboard className='size-6 p-1 flex items-center' />
                      <p className='font-semibold'>View</p>
                    </div>
                  )}
                  {contentType === 'tv' && (
                    <div className='flex items-center'>
                      <TvMinimal className='size-6 p-1 flex items-center' />
                      <p className='font-semibold'>View</p>
                    </div>
                  )}
                </Link>
                
                <button
                className={`bg-white bg-opacity-15 hover:bg-opacity-25 text-white font-semibold py-1 ml-2 px-2 rounded-lg flex items-center`}
                onClick={() => setShowPlaylistModal(true)}
              >
                <Plus className='size-5' />
                <p className='ml-1'>Save</p>
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


      <div
			className='bg-black text-white relative px-4 pb-6'
			onMouseEnter={() => setShowArrows(true)}
			onMouseLeave={() => setShowArrows(false)}
		>
			<h2 className='mb-4 text-2xl font-bold'>
				Popular People
			</h2>

			{pcontentLoading && (
				<div className='flex justify-center items-center bg-black h-full'>	
					<Loader className='animate-spin text-white w-8 h-8' />
				</div>
			)}
			
			<div className='flex space-x-4 overflow-x-scroll scrollbar-hide' ref={sliderRef}>
				{Array.isArray(pcontent) && pcontent?.map((item) => (
					<Link to={`/person/details/?id=${item?.id}&name=${item?.name}`} className='min-w-[180px] relative group' key={item.id}>
						<div className='rounded-lg overflow-hidden'>
							<img
								src={ORIGINAL_IMG_BASE_URL + (item.profile_path || item.backdrop_path)}
								alt='Person image'
								className='h-64 w-full transition-transform duration-300 rounded-xl border border-white border-opacity-60 ease-in-out group-hover:scale-125'
							/>
						</div>
						<p className='mt-2 text-center'>{item.name}</p>
					</Link>
				))}
			</div>

			{showArrows && (
				<>
					<button
						className='absolute top-1/2 -translate-y-1/2 left-5 md:left-24 flex items-center justify-center
            size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10
            '
						onClick={scrollLeft}
					>
						<ChevronLeft size={24} />
					</button>

					<button
						className='absolute top-1/2 -translate-y-1/2 right-5 md:right-24 flex items-center justify-center
            size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10
            '
						onClick={scrollRight}
					>
						<ChevronRight size={24} />
					</button>
				</>
			)}
		</div>
    <AddToPlaylistModal
        isOpen={showPlaylistModal}
        onClose={() => setShowPlaylistModal(false)}
        item={{
          type: contentType === 'movies'? 'movie' : 'tv',
          id: currentTrending?.id,
          image: currentTrending?.poster_path,
          title: contentType === 'movies'? currentTrending?.title : currentTrending?.name 
        }}
      />
      </>
      
    )
};

export default HomeScreen;