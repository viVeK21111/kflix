import React from 'react'
import Navbar from '../../components/Navbar';
import useGetTrendingContent from '../../hooks/useGetTrendingContent';
import { ORIGINAL_IMG_BASE_URL } from '../../utils/constants';
import {Link} from 'react-router-dom';
import {Play,Info} from 'lucide-react';
import {useContentStore} from '../../store/content'
import MovieSlider from '../../components/MovieSlider';
import { MOVIE_CATEGORIES, TV_CATEGORIES } from '../../utils/constants';
import { useState,useEffect,useRef } from 'react';
import { Clock } from 'lucide-react';
import {addWatchStore} from '../../store/watchStore';

export const HomeScreen = () => {
  const {trending,loading} = useGetTrendingContent();
  const {contentType} = useContentStore();
  const [ImageLoad,setImageLoad] = useState(true);
  const movieSectionRef = useRef(null);
  const {addWatch} = addWatchStore();

  useEffect(() => {
    setImageLoad(true);
  },[contentType]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-black">
        <p className="text-xl font-bold">Hold on tight... 🍿</p>
      </div>
    );
  }

  const addWatchList = async(e,id) => {
    e.preventDefault();
    console.log("id "+id);
    addWatch(id);
  }

  return (
    <>
      <div className='relative h-screen text-white'>
        <Navbar movieSectionRef={movieSectionRef}/>
        {ImageLoad && (<div className='absolute top-0 left-0 flex w-full h-full text-white items-center bg-black/70 justify-center shimmer -z-10'> Loading...</div>)}
         <img src= {ORIGINAL_IMG_BASE_URL+trending?.backdrop_path} alt='img' className='absolute top-0 left-0 w-full h-full object-cover -z-50'
          onLoad={() => setImageLoad(false)}
         >
         </img>
         <div className='absolute top-0 left-0 w-full h-full bg-black/50 -z-50 aria-hidden:true'/>
         <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-8'>
         <div className='bg-gradient-to-b from-black/70 via-transparent to-transparent absolute w-full h-full top-0 left-0 -z-10' />

         <div className='max-w-2xl'>
          <div> <p className='text-white-600 text-2xl mt-64 animate-pulse'>Trending...</p> </div>
          <h1 className='text-xl sm:text-xl lg:text-2xl xl:text-3xl mt-20 font-extrabold text-balance'>
            {trending?.title || trending?.name}
          </h1>
          <p className='mt-2 flex text-lg font-bold'>
          {trending?.release_date?.split("") || trending?.first_air_date.split('-')[0]} | {trending?.adult? "18+":"PG-13"}
          </p>
          
          
          {trending && trending?.overview  && ( <p className='mt-4 bg-slate-900 bg-opacity-70 p-1 rounded'> {trending?.overview.length > 250 ? trending?.overview.slice(0, 250) + "..." : trending?.overview} </p>)}
            
  
            <div className='flex mt-8'>
						<Link
							to={`/${contentType === 'movies' ? 'watch' : 'tv/details'}/?id=${trending?.id}&name=${trending?.name || trending?.title}`}
							className='bg-red-600 hover:bg-red/800 text-white font-bold py-2 px-2 rounded  flex
							 items-center'
						>
							<Play className='size-5  fill-white' />
							Play
						</Link>
            <button
							className='bg-white hover:bg-white/80 text-black font-bold py-2 ml-2 px-2 rounded  flex
							 items-center'
               onClick={(e) => addWatchList(e,trending?.id)}
						>
							<Clock className='size-5' />
              <p className='ml-1'>Watch Later</p>
						</button>
						
					</div>

         </div>

         </div>
      </div>
      <div  ref={movieSectionRef} className="flex flex-col gap-10 bg-black py-10">
        {contentType==="movies" ? 
        MOVIE_CATEGORIES.map((category) => <MovieSlider key={category} category={category} />)
        : TV_CATEGORIES.map((category) => <MovieSlider key={category} category={category} />)}
      </div>

      </>
    )
};

export default HomeScreen;