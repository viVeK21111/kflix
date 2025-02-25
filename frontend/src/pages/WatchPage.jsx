import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {Link} from 'react-router-dom';
import { Lightbulb } from 'lucide-react';
import { DetailsStore } from '../store/tvdetails';
import { creditStore } from '../store/credits';
import { useEffect } from 'react';
import { ORIGINAL_IMG_BASE_URL } from '../utils/constants';

function WatchPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search)
  const {getMoviedetails,getTvdetails,data}  = DetailsStore();
  const {datac,getCredits} = creditStore();
  const [bgColorClass, setBgColorClass] = useState('bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900');
  const [text,setText] = useState('text-white');
  const [dir,setDir] = useState("");
  const [Loading,setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const Id = queryParams.get('id');
  const Name = queryParams.get('name');
  const Season = queryParams.get('season')
  const Episode = queryParams.get('episode')
  useEffect(() => {
    if(Season) {
      getTvdetails(Id).finally(()=> setLoading(false));
      window.scrollTo(0, 0);
    }
    else if (Id) {
      getMoviedetails(Id);
      getCredits(Id);
      Promise.all([getMoviedetails(Id), getCredits(Id)]).then(() => setLoading(false)); 
      window.scrollTo(0, 0);
    }
  }, [Id, getMoviedetails]);

  function getDirector(crew) {
    const director = crew.find(person => (person.known_for_department==='Directing' && (person.job === "Director" || person.job==='Writer' || person.job==='producer')) || person.job==='Director');
    return director ? director.name : "Unknown";
  }
 
  useEffect ( () => {
    if(datac) setDir(getDirector(datac.crew));
  },[datac])

  let src = ""
  if(!Season) {
    src = `https://vidsrc.dev/embed/movie/${Id}`
  }
  else {
   src = `https://vidsrc.dev/embed/tv/${Id}/${Season}/${Episode}`
  }
   const Lightsout = (e) => {
    e.preventDefault();
      if(bgColorClass==='bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900') setBgColorClass('bg-black');
      else setBgColorClass('bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900');
      if(text==='text-white') setText('text-black');
      else setText('text-white');
   }
    if (!Id) {
        return <div className="text-white text-center">Invalid video ID</div>;
      }
      return (
        <div className={`page min-h-screen ${bgColorClass} overflow-auto flex flex-col items-center p-4`}>
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
              src={src}
              className="w-full aspect-video"
              onLoad={() => setIsLoading(false)} // Hide loader when iframe loads
            ></iframe>

            {isLoading && (
              <div className="w-full flex justify-center items-center">
                <p className='text-white'>Loading...🍿</p>
              </div>
            )}
          </div>
        
          
          <div className='w-full max-w-4xl flex flex-wrap justify-between items-center'>
          <div className="mt-8 text-center">
            <h1 className={`lg:text-2xl text-left flex items-center gap-2 whitespace-nowrap font-semibold ${text} mb-3"`}>Now Playing: <span className='ml-2 font-extralight'>{Name} {Season ? `Season ${Season} Episode ${Episode}`: ""  }</span> </h1>
             
          </div>
          <button className={`flex mt-3 ml-auto p-2 rounded-md border-black ${text} bg-blue-950`} onClick={Lightsout}> <Lightbulb color={text==='text-white' ? 'white' : 'black'}/>Lights off</button>
          </div> 
          {Loading ? (
            <p className='text-white font-semibold text-base justify-center mt-10'>Loading...!</p>
          ):(
            <div className='w-full max-w-4xl'>
          {datac && (
            <div className='text-white flex w-full max-w-4xl mt-2'> Director: <p className='font-semibold ml-1'> {dir} </p></div>
          )}
          {bgColorClass!='bg-black' && (
            <div className='w-full max-w-4xl'> 
             <div className='text-left w-full flex flex-row max-w-4xl mt-10 items-start'>
             <img 
            src={`${ORIGINAL_IMG_BASE_URL}${ (data?.season && data?.seasons[Season]?.poster_path)|| data?.poster_path || data?.backdrop_path || data?.profile_path}`} 
            className="w-60 h-60 object-cover rounded-lg mb-2" 
             alt={data?.title || data?.name} />
          
            {!Season && <span className='text-white mt-2 ml-3 w-full max-w-4xl'>{data?.overview}</span>}
         
              </div>
        <div className='w-full max-w-4xl  mt-2'>
        {(data?.release_date || data?.first_air_date) && (
                <p className="text-sm text-gray-300">{data.release_date?.split("-")[0] || data.first_air_date?.split("-")[0]} | Rating: <b> {data?.vote_average}</b> | {data?.adult ? "18+" : "PG-13"} </p>
                )}
                <span className='text-white font-medium'>Genres: </span>
                {data?.genres && data?.genres.map((item,index) => (
                  <span className='gap-2 text-white' key={item.id}> {item.name} </span>
              ))}
        </div>
        </div>
          )}
          </div>
          )
          }
        </div>
      );
    };
export default WatchPage;
//<span className="mt-2 w-full text-left flex items-center whitespace-nowrap text-gray-400">Enjoy your favorite movie in high quality!</span>