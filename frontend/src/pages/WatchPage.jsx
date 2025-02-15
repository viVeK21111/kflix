import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {Link} from 'react-router-dom';
import { Lightbulb } from 'lucide-react';

function WatchPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const movieId = queryParams.get('id');
  const movieName = queryParams.get('name');
  const [bgColorClass, setBgColorClass] = useState('bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900');
  const [text,setText] = useState('text-white');
    // Optional: Handle missing or invalid ID
   const Lightsout = (e) => {
    e.preventDefault();
      if(bgColorClass==='bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900') setBgColorClass('bg-black');
      else setBgColorClass('bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900');
      if(text==='text-white') setText('text-black');
      else setText('text-white');
   }
    if (!movieId) {
        return <div className="text-white text-center">Invalid video ID</div>;
      }
      return (
        <div className={`page min-h-screen ${bgColorClass} flex flex-col items-center justify-center p-4`}>
         <header className='flex items-center p-4'>
          <Link to={'/'} className='flex items-center'>
          <img src={'/kflix2.png'} alt='kflix logo' className='w-52' />
          </Link>
          </header>
          {/* Video Container */}
          <div className="w-full max-w-4xl bg-black rounded-lg shadow-2xl overflow-hidden">
            {/* Video Player */}
            <iframe
              allowFullScreen
              src={`https://vidsrc.dev/embed/movie/${movieId}`}
              className="w-full aspect-video"
            ></iframe>
          </div>
        
          
          {/* Additional Content (Optional) */}
          
          <div className='w-full max-w-4xl flex justify-between items-center'>
          <div className="mt-8 text-center">
            <h1 className={`text-2xl flex text-left font-semibold ${text} mb-3"`}>Now Playing: <p className='ml-2 font-extralight'>{movieName}</p></h1>
            <p className="mt-2 text-left text-gray-400">Enjoy your favorite movie in high quality!</p>
          </div>
          <button className={`flex mt-3 ml-72 p-2 rounded-md border-black ${text} bg-blue-950`} onClick={Lightsout}> <Lightbulb color={text==='text-white' ? 'white' : 'black'}/>Lights off</button>
          </div>
         
         
        </div>
      );
    };
export default WatchPage;
