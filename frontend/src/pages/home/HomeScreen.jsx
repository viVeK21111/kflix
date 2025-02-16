import React from 'react'
import Navbar from '../../components/Navbar';
import useGetTrendingContent from '../../hooks/useGetTrendingContent';
import { ORIGINAL_IMG_BASE_URL } from '../../utils/constants';
import {Link} from 'react-router-dom';
import {Play,Info} from 'lucide-react';
import {useContentStore} from '../../store/content'

export const HomeScreen = () => {
  const {trending} = useGetTrendingContent();
  const {contentType} = useContentStore();
  console.log("trending "+trending);
  return (
      <div className='relative h-screen text-white'>
        <Navbar/>
         <img src= {ORIGINAL_IMG_BASE_URL+trending?.backdrop_path} alt='img' className='absolute top-0 left-0 w-full h-full object-cover -z-50'>
         </img>
         <div className='absolute top-0 left-0 w-full h-full bg-black/50 -z-50 aria-hidden:true'/>
         <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-32'>
         <div className='bg-gradient-to-b from-black/70 via-transparent to-transparent absolute w-full h-full top-0 left-0 -z-10' />

         <div className='max-w-2xl'>
          <h1 className='mt-4 text-6xl font-extrabold text-balance'>
            {trending?.title || trending?.name}
          </h1>
          <p className='mt-2 flex text-lg font-bold'>
          {trending?.release_date?.split("") || trending?.first_air_date.split('-')[0]} | {trending?.adult? "18+":"PG-13"}
          </p>
          
          <p className='mt-3'>
          {trending && trending.overview 
            ? (trending?.overview.length > 250 ? trending?.overview.slice(0, 250) + "..." : trending?.overview)
            :"Loading..."}
            </p>
            <div className='flex mt-8'>
						<Link
							to={`/${contentType === 'movies' ? 'watch' : 'tv/details'}/?id=${trending?.id}&name=${trending?.name || trending?.title}`}
							className='bg-white hover:bg-white/80 text-black font-bold py-2 px-4 rounded mr-4 flex
							 items-center'
						>
							<Play className='size-6 mr-2 fill-black' />
							Play
						</Link>
						<Link
							to={`/search/?id=${trending?.id}&name=${trending?.name || trending?.title}`}
							className='bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded flex items-center'
						>
							<Info className='size-6 mr-2' />
							More Info
						</Link>
					</div>

         </div>

         </div>
      </div>
    )
};

export default HomeScreen;