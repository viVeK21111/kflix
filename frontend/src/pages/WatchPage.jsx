import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {Link} from 'react-router-dom';
import { Lightbulb } from 'lucide-react';
import { DetailsStore } from '../store/tvdetails';
import { creditStore } from '../store/credits';
import { useEffect } from 'react';
import { ORIGINAL_IMG_BASE_URL } from '../utils/constants';
import { SimilarStore } from '../store/SimilarStore';
import { addWatchStore } from '../store/watchStore';
import { Clock,Star,Play } from 'lucide-react';


function WatchPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search)
  const {getMoviedetails,getTvdetails,data}  = DetailsStore();
  const {getSimilarMovies,datas} = SimilarStore();
  const {datac,getCredits} = creditStore();
  const [bgColorClass, setBgColorClass] = useState(window.innerWidth < 768 ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900' : "bg-slate-950");
  const [text,setText] = useState('text-white');
  const [dir,setDir] = useState("");
  const [Loading,setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [directorId, setdirectorId] = useState(null);
  const [numitems,setnumitems] = useState(5);
  const [numitemsm,setnumitemsm] = useState(4);
  const Id = queryParams.get('id');
  const Name = queryParams.get('name');
  const Season = queryParams.get('season')
  const Episode = queryParams.get('episode')
  localStorage.setItem("numitems",6);
  const {addWatch} = addWatchStore();
  const [isplay,setisplay] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);
  const [imageload,setimageload] = useState(true);

  useEffect(() => {
    setisplay(false);
    setLoading(true)
    if(Season) {
      getTvdetails(Id).finally(()=> setLoading(false));
      window.scrollTo(0, 0);
    }
    else if (Id) {
      getMoviedetails(Id);
      getCredits(Id);
      Promise.all([getMoviedetails(Id), getCredits(Id),getSimilarMovies(Id)]).then(() => setLoading(false)); 
      window.scrollTo(0, 0);

    }
    setnumitems(5);
    setnumitemsm(4);
  }, [Id, getMoviedetails]);

  function getDirector(crew) {
    const director = crew.find(person => (person.known_for_department==='Directing' && (person.job === "Director" || person.job==='Writer' || person.job==='producer')) || person.job==='Director');
    setdirectorId(director.id);
    return director ? director.name : "Unknown";
  }
 
  useEffect ( () => {
    if(datac) setDir(getDirector(datac.crew));
  },[datac])

  const addWatchList = async(e,id) => {
    e.preventDefault();
    console.log("id "+id);
    addWatch(id);
  }


   const Lightsout = (e) => {
    e.preventDefault();
      if(bgColorClass==='bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900' || bgColorClass=== 'bg-slate-950') setBgColorClass('bg-black');
      else setBgColorClass(window.innerWidth < 768 ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900' : "bg-slate-950");
      if(text==='text-white') setText('text-black');
      else setText('text-white');
   }
   let sources;
   if(!Season) {
    sources = [
      { name: "Source1 (Filmu)", url: `https://embed.filmu.fun/media/tmdb-movie-${Id}` },
      { name: "Source2 (Vidbinge)", url: `https://vidsrc.dev/embed/movie/${Id}?autoplay=0` },
      
    ];
   }
   else {
    sources = [
      { name: "Source1 (Filmu)", url: `https://embed.filmu.fun/embed/tmdb-tv-${Id}/${Season}/${Episode}` },
      { name: "Source2 (Vidbinge)", url: `https://vidsrc.dev/embed/tv/${Id}/${Season}/${Episode}` },
     
    ];
   }
  
  const handleSourceChange = (e) => {
    setSrcIndex(Number(e.target.value)); // Change the source based on selection
  };
    if (!Id) {
        return <div className="text-white text-center">Invalid video ID</div>;
      }
      return (
        <div className={`page min-h-screen ${bgColorClass} overflow-auto`}>
    <div className='p-3 md:p-0 '>
    {(isplay || Season) && (
      <header className='flex items-center justify-center p-4'>
      <Link to={'/'} className='flex items-center'>
        <img src={'/kflix2.png'} alt='kflix logo' className='w-52' />
      </Link>
    </header>
    )}
     
      {Loading &&  (
        <div className="w-full flex mt-20 justify-center items-center">
        <p className='text-white '>Loading...</p>
      </div>
      )}

      { !isplay && !Loading && !Season && (
        <div className='relative'>
          <img src={`${ORIGINAL_IMG_BASE_URL}${data?.backdrop_path || data?.profile_path}`}
          className='w-full object-top object-cover h-full md:h-[85vh]  shadow-2xl'
          onLoad={() => setimageload(false)}
          ></img>
          <div className="md:absolute inset-0 md:bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
          <div className="md:absolute text-white lg:max-w-3xl  bottom-5 left-3">
        <h1 className="text-xl md:text-2xl xl:text-3xl 2xl:text-3xl font-bold mb-4 mt-3 text-yellow-500">
            {data?.title}
          </h1>
          <p className="text-sm md:text-base mb-2 max-w pb-3 ">{data?.overview.length<300 ? data?.overview : data?.overview.slice(0,300)+". . ."}</p>
          <p className='mb-1 text-sm md:text-base'> {data?.release_date?.split("")} </p>
          <p className="flex gap-2">
          {data?.adult ? "18+" : "PG-13"} | <p className="flex"><Star className='size-5 pt-1'/>{data?.vote_average}  
      
            <button className='flex ml-3 bg-red-600 items-center hover:bg-red-800 px-2 rounded-md'
            onClick={() => setisplay(true)}
            >
            <Play className='size-6 fill-white p-1'/>
            <p className='font-semibold'>Play</p>
            </button>
             <button
              className='bg-blue-700 hover:bg-blue-800 text-white text-sm py-1 ml-2 px-2 rounded-lg  flex
              items-center'
              onClick={(e) => addWatchList(e,data?.id)}
            >
          <Clock className='size-5' />
            <p className='ml-1'>Watch Later</p>
            </button>
            
          </p> 
        </p>
        </div>
        </div>
      )}

    
      {/* Video Container */}
      {(isplay || Season) &&  (
        
        <div className='flex flex-col items-center'>
        <div className="w-full max-w-3xl lg:max-w-4xl bg-black rounded-lg shadow-2xl overflow-hidden">
        {/* Video Player */}
        <iframe
          allowFullScreen
          src={sources[srcIndex].url}
          className="w-full aspect-video"
          onLoad={() => setIsLoading(false)} // Hide loader when iframe loads
        ></iframe>

        {isLoading && (
          <div className="w-full flex justify-center items-center">
            <p className='text-white'>Loading...🍿</p>
          </div>
        )}
        <div>
        <select
          className="bg-gray-800 text-xs md:text-sm lg:text-md text-white px-1 py-1 rounded-md"
          value={srcIndex}
          onChange={handleSourceChange}
        >
          {sources.map((server, index) => (
            <option key={index} value={index}>
              {server.name}
            </option>
          ))}
        </select>
      </div>
      </div>
     

      <div className='w-full max-w-4xl sm:flex sm:px-1 flex-wrap justify-between items-center'>
      <button className={`flex mt-3 items-center ml-auto sm:hidden text-sm md:text-base px-2 p-1 md:p-2 rounded-md border-black ${text} bg-blue-950`} onClick={Lightsout}>
          <Lightbulb size={21} color={text === 'text-white' ? 'white' : 'black'} />Lights off
        </button>
        <div className="mt-8 text-center">
          <h1 className={`flex items-center lg:text-2xl md:text-xl text-left  gap-2 whitespace-nowrap font-semibold ${text} mb-3`}>
            Now Playing: <span className='font-extralight'>{Name} {Season ? `Season ${Season} Episode ${Episode}` : ""}</span>
          </h1>
        </div>
        <button className={`hidden sm:flex mt-3 ml-auto text-sm md:text-base px-2 p-1 md:p-2 rounded-md border-black ${text} bg-blue-950`} onClick={Lightsout}>
          <Lightbulb size={21} color={text === 'text-white' ? 'white' : 'black'} />Lights off
        </button>
      </div>

      {Loading ? (
        <p className='text-white font-semibold text-base justify-center mt-10'>Loading...!</p>
      ) : (
        <div className='w-full max-w-4xl sm:px-1'>
          {datac && !Season && (
            <div className='text-white flex w-full max-w-4xl mt-2'> Director:
              <Link to={'/person/details/?id=' + directorId + "&name=" + dir} className='hover:underline hover:text-white'>
                <p className='font-semibold ml-1'> {dir} </p>
              </Link>
            </div>
          )}
          {Season && data?.created_by[0] && (
            <div className='text-white flex w-full max-w-4xl mt-2'> Created by:
              <Link to={'/person/details/?id=' + data?.created_by[0].id + "&name=" + data?.created_by[0].name} className='hover:underline hover:text-white'>
                <p className='font-semibold ml-1'> {data.created_by[0].name} </p>
              </Link>
            </div>
          )}
          {bgColorClass !== 'bg-black' && (
            <div className='w-full max-w-4xl'>
              <div className='text-left w-full flex flex-col sm:flex-col md:flex-row xl:flex-row lg:flex-row max-w-4xl mt-10 items-start'>
                <img
                  src={`${ORIGINAL_IMG_BASE_URL}${(data?.season && data?.seasons[Season]?.poster_path) || data?.poster_path || data?.backdrop_path || data?.profile_path}`}
                  className="w-60 h-60 object-cover rounded-lg mb-5 md:mb-2 lg:mb-2 xl:mb-2"
                  alt={data?.title || data?.name}
                />
                <div className='text-sm md:text-base ml-1 sm:ml-1 md:ml-4 lg:ml-4 xl:ml-4'>
                  {!Season && <span className='text-white mt-3 sm:mt-2 md:mt-2 lg:mt-2 xl:mt-2 w-full max-w-4xl'>{data?.overview}</span>}
                  {!Season && (
                    <button
                      className='bg-red-600 hover:bg-red-800 text-white font-semibold py-1 mt-5 mb-2 px-2 rounded flex items-center'
                      onClick={(e) => addWatchList(e, data?.id)}
                    >
                      <Clock className='size-5' />
                      <p className='ml-1'>Watch Later</p>
                    </button>
                  )}
                </div>
              </div>
              <div className='w-full max-w-4xl mt-2'>
            {(data?.release_date || data?.first_air_date) && (
              <p className="text-sm text-gray-300">{data.release_date?.split("-")[0] || data.first_air_date?.split("-")[0]} | Rating: <b> {data?.vote_average}</b> | {data?.adult ? "18+" : "PG-13"} </p>
            )}
            <span className='text-white font-medium'>Genres: </span>
            {data?.genres && data?.genres.map((item, index) => (
              <span className='gap-2 text-white' key={item.id}> {item.name} </span>
            ))}
          </div>

            </div>
          )}
         
        </div>
      )}
      </div>
    )}
    </div>
        
        {bgColorClass!='bg-black'  && !data?.seasons && !Loading && !imageload && (
          <div className='bg-black w-full mt-5'>
                <div className='flex text-white border-t-2 border-yellow-500 p-1 text-xl'><h3 className='font-bold'>Cast</h3></div>
                  <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-1 sm:px-5">
                  {datac?.cast.slice(0,numitems).map((item, index) => (
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
                {numitems < datac?.cast.slice(0,10).length && (
          <div className="flex w-full justify-end mt-5 mb-3">
            <button
              onClick={() => setnumitems(prev => prev + 4)} // Show 4 more items
              className="px-2 py-1 mr-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
            >
              Load More
            </button>
          </div>
        )}
         {numitems >= 10 && (
        <div className="flex w-full justify-center max-w-8xl mt-6">
          <button
            onClick={() => setnumitems(5)}
            className="px-2 py-1 text-base font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 hover:scale-105 transition-all"
          >
            Load Less
          </button>
        </div>
      )}
        <div className='text-white w-full  border-t-2 border-yellow-500 p-1 mt-3 text-xl'><h3 className='font-bold'>Similar Movies</h3></div>
        <div className="grid grid-cols-2 w-full sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6 mt-8 px-4 sm:px-5">
                  {datas?.slice(0,numitemsm).map((item, index) => (
                    <Link 
                      key={item.id || index} 
                      to={'/watch/'+`/?id=${item?.id}&name=${item?.name || item?.title}`}
                      className="block bg-gray-800 bg-opacity-60 p-2 rounded-lg shadow-md hover:scale-105 transition-transform"
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
                        <p className="text-xs sm:text-sm text-gray-400">Popularity: {item.popularity}</p>
                      )}
                    </Link>
                  ))}
                </div>
                {numitemsm < datas?.slice(0,10).length && (
          <div className="flex w-full justify-end  mt-6">
            <button
              onClick={() => setnumitemsm(prev => prev + 4)} // Show 6 more items
              className="px-2 py-1 mb-3 mr-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
            >
              Load More
            </button>
          </div>
        )}
        {numitemsm >= 10 && (
        <div className="flex w-full justify-center mt-6">
          <button
            onClick={() => setnumitemsm(4)}
            className="px-2 py-1 mb-2 text-base font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 hover:scale-105 transition-all"
          >
            Load Less
          </button>
        </div>
      )}
        </div>
        )}
        
        </div>
      );
}
export default WatchPage;
//<span className="mt-2 w-full text-left flex items-center whitespace-nowrap text-gray-400">Enjoy your favorite movie in high quality!</span>