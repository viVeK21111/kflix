import React from 'react'
import Navbar from '../../components/Navbar';
import useGetTrendingContent from '../../hooks/useGetTrendingContent';
import { ORIGINAL_IMG_BASE_URL } from '../../utils/constants';
import {Link} from 'react-router-dom';
import {Play,Info} from 'lucide-react';
import {useContentStore} from '../../store/content'

export const HomeScreen = () => {
  const {trending,loading} = useGetTrendingContent();
  const {contentType} = useContentStore();
  console.log("trending "+trending);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-black">
        <p className="text-xl font-bold">Hold on tight... 🍿</p>
      </div>
    );
  }
  return (
      <div className='relative h-screen text-white'>
        <Navbar/>
         <img src= {ORIGINAL_IMG_BASE_URL+trending?.backdrop_path} alt='img' className='absolute top-0 left-0 w-full h-full object-cover -z-50'>
         </img>
         <div className='absolute top-0 left-0 w-full h-full bg-black/50 -z-50 aria-hidden:true'/>
         <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-32'>
         <div className='bg-gradient-to-b from-black/70 via-transparent to-transparent absolute w-full h-full top-0 left-0 -z-10' />

         <div className='max-w-2xl'>
          <h1 className='text-xl sm:text-xl lg:text-2xl xl:text-3xl mt-4  font-extrabold text-balance'>
            {trending?.title || trending?.name}
          </h1>
          <p className='mt-2 flex text-lg font-bold'>
          {trending?.release_date?.split("") || trending?.first_air_date.split('-')[0]} | {trending?.adult? "18+":"PG-13"}
          </p>
          
          
          {trending && trending?.overview  && ( <p className='mt-3 bg-slate-900 bg-opacity-70 p-2 rounded'> {trending?.overview.length > 250 ? trending?.overview.slice(0, 250) + "..." : trending?.overview} </p>)}
            
  
            <div className='flex mt-8'>
						<Link
							to={`/${contentType === 'movies' ? 'watch' : 'tv/details'}/?id=${trending?.id}&name=${trending?.name || trending?.title}`}
							className='bg-white hover:bg-white/80 text-black font-bold py-2 px-4 rounded mr-4 flex
							 items-center'
						>
							<Play className='size-6 mr-2 fill-black' />
							Play
						</Link>
						
					</div>

         </div>

         </div>
      </div>
    )
};

export default HomeScreen;