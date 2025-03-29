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
import { Plus,Star,Play,Dot,ChevronDown,ChevronUp,Loader } from 'lucide-react';
import axios from 'axios';

function WatchPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search)
  const {getMoviedetails,getTvdetails,data}  = DetailsStore();
  const {getSimilarMovies,datas} = SimilarStore();
  const {datac,getCredits} = creditStore();
  const [bgColorClass, setBgColorClass] = useState(null);
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
  const [imageload,setimageload] = useState(true);
  const [readov,setreadov] = useState(300);
  const [srcIndex,setSrcIndex] = useState(0);
  const [selectopen,setselectopen] = useState(false);
  const [isLightsOut, setIsLightsOut] = useState(false);
  const [datae,setDatae] = useState(null);
  const [releasedate,setreleasedate] = useState(null);

   useEffect (()=> {
    if(data && data?.release_date) {
      const rd = new Date(data?.release_date);
      setreleasedate(rd);
      console.log("future movie "+rd.getTime < new Date());
    } 
  },[data])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && !isplay && !Season) {
          setBgColorClass(isLightsOut ? 'bg-black' : 'bg-zinc-950');
      } else {
          setBgColorClass(isLightsOut ? 'bg-black' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900');
      }
  };
 

  // Initial check
  handleResize();

  // Add event listener
  window.addEventListener('resize', handleResize);

  // Cleanup to avoid memory leaks
  return () => window.removeEventListener('resize', handleResize);
  }, [isplay,Season,isLightsOut])

 useEffect(() => {
  const getepisodes = async() => {
    const seasonep = {"Id":Id,"Season":Season};
    const response = await axios.post("/api/v1/tv/episodes",seasonep);
    setDatae(response.data.content);
  }
  if(Season) getepisodes();
 },[])

  useEffect(() => {
    setisplay(false);
    setLoading(true);
    if(Season) {
      getTvdetails(Id).finally(()=> {
      setLoading(false);
      });
      window.scrollTo(0, 0);
    }
    else if (Id) {
      Promise.all([getMoviedetails(Id), getCredits(Id),getSimilarMovies(Id)]).then(() => {
      setLoading(false);
     
      }
      
      ); 
      window.scrollTo(0, 0);
    
    }
    setnumitems(5);
    setnumitemsm(4);
  }, [Id, getMoviedetails]);

  function getDirector(crew) {
    const director = crew.find(person => (person.known_for_department==='Directing' && (person.job === "Director" || person.job==='Writer' || person.job==='producer')) || person.job==='Director');
    setdirectorId(director?.id);
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
    setIsLightsOut((prev) => !prev); 
    setBgColorClass((prev) => prev === 'bg-black' ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900' : 'bg-black');
    setText((prev) => prev === 'text-white' ? 'text-black' : 'text-white');
   }
   let sources;
   if(!Season) {
    sources = [
      { name: "Source1 (Filmu)",description:"adfree", url: `https://embed.filmu.fun/media/tmdb-movie-${Id}` },
      { name: "Source2 (pstream)", description:"adfree",url: `https://iframe.pstream.org/media/tmdb-movie-${Id}` },
      { name: "Source3 (Vidbinge)",description:"brave browser recommended", url: `https://vidsrc.dev/embed/movie/${Id}?autoplay=0` },
      { name: "Source4 (rive)",description:"brave browser recommended", url: `https://rivestream.net/embed?type=movie&id=${Id}` },
      { name: "Source5 (embed.su)",description:"brave browser only", url: `https://embed.su/embed/movie/${Id}` },
      
    ];
   }
   else {
    sources = [
      { name: "Source1 (Filmu)",description:"adfree", url: `https://embed.filmu.fun/embed/tmdb-tv-${Id}/${Season}/${Episode}` },
      { name: "Source2 (pstream)", description:"adfree", url: `https://iframe.pstream.org/embed/tmdb-tv-${Id}/${Season}/${Episode}`},
      { name: "Source3 (Vidbinge)",description:"brave browser recommended", url: `https://vidsrc.dev/embed/tv/${Id}/${Season}/${Episode}` },
      { name: "Source4 (rive)",description:"brave browser recommended" ,url: `https://rivestream.net/embed?type=tv&id=${Id}&season=${Season}&episode=${Episode}` },
      { name: "Source5 (embed.su)",description:"brave browser only", url: `https://embed.su/embed/tv/${Id}/${Season}/${Episode}` },
     
    ];
   }
   
  const handleSourceChange = (e,index) => {
    e.preventDefault();
    setselectopen(false);
    setSrcIndex(Number(index)); // Change the source based on selection
  };
  const handleSelectChange = (e) => {
    if(selectopen) {
      setselectopen(false);
    }
    else {
      setselectopen(true);
    }
  }
    if (!Id) {
        return <div className="text-white text-center">Invalid video ID</div>;
      }
      return (
        <div className={`page min-h-screen ${bgColorClass} overflow-auto`}>
    <div className=''>
    {(isplay || Season) && (
      <header className='flex items-center justify-center p-4'>
      <Link to={'/'} className='flex items-center'>
        <img src={'/kflix2.png'} alt='kflix logo' className='w-52' />
      </Link>
    </header>
    )}
     
      {(Loading || imageload) && !Season &&  (
        <div className="h-screen ">
        <div className="flex justify-center items-center bg-black h-full">
        <Loader className="animate-spin text-red-600 w-10 h-10"/>
        </div>
      </div>
      )}

      { !isplay && !Loading && !Season && (
        <div className='relative'>
          <img src={`${ORIGINAL_IMG_BASE_URL}${data?.backdrop_path || data?.profile_path || data?.poster_path}`}
          className='w-full object-top object-cover h-full md:h-[85vh]  shadow-2xl'
          onLoad={() => setimageload(false)}
          ></img>
          <div className="md:absolute inset-0 md:bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
          <div className="md:absolute text-white lg:max-w-3xl p-1  bottom-5 left-3">
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
         
          <div className='mt-3 flex items-center  text-sm md:text-base'>
          <p className=''> {data?.release_date?.split("")} </p>
          <p className='flex'><Dot /></p>
          <p className=''>{data?.runtime} min.</p>
          </div>
          
          { releasedate!==null && releasedate.getTime() < new Date().getTime() && 
          (
              <button className='flex w-full justify-center p-2 bg-red-600 items-center mt-3 hover:bg-red-800 px-2 rounded-md'
              onClick={() => setisplay(true)}
              >
              <Play className='size-6 fill-white p-1'/>
              <p className='font-semibold text-lg'>Play</p>
              </button>
          )

          }
        
           
        </div>
        
        <div className='mx-2 md:mx-0'>
        <h1 className="text-xl md:text-2xl xl:text-3xl 2xl:text-3xl font-bold mb-2 mt-3 text-white">
            {data?.title}
          </h1>
          <p className={(window.innerWidth < 768 && data?.overview.length>readov) ? `text-base mb-2 max-w pb-2` : `text-sm md:text-base mb-2 max-w pb-2` }>
            {data?.overview.length < readov ? data?.overview : ( 
              <> 
            {data?.overview.slice(0, readov)}
            {readov<data?.overview.length && (
               <button className="hover:underline text-white text-wheat-600" onClick={() => setreadov(data?.overview.length)}>...Read more</button> 
            )}
            </>
          )}
          </p>
          <div className='hidden sm:flex'>
            <p className="flex gap-2 items-center bg-white bg-opacity-20 text-semibold rounded-md px-2 py-1">
                  {data?.adult ? "18+" : "PG-13"} 
          </p>
          <div className='flex items-center'>
          <p className="flex ml-2"><Star className='size-5 pt-1'/>{data?.vote_average}  </p>
          <p className='ml-5 flex'>
          {data?.genres && data?.genres.slice(0,3).map((item, index) => (
          <div key={item.id} className="flex items-center text-white">
            {(index!==3 && index!==0) && (<Dot />)} 
            <span>{item.name}</span>
         </div>
         
            ))}
          </p>
          </div>
            </div>
            <div className='hidden sm:flex mt-3  items-center  text-sm md:text-base'>
          <p className=''> {data?.release_date?.split("")} </p>
          <p className='flex'><Dot /></p>
          <p className=''>{data?.runtime} min.</p>
          {datac && !Season && (
            <div className='text-white flex items-center ml-2'> Dir.
              <Link to={'/person/details/?id=' + directorId + "&name=" + dir} className='hover:underline hover:text-white'>
                <p className=' font-semibold ml-2'> {dir} </p>
              </Link>
            </div>
          )}
          </div>
          <button
              className='sm:hidden bg-white bg-opacity-15 hover:bg-opacity-25 text-white font-semibold py-1 px-2 rounded-lg flex items-center'
              onClick={(e) => addWatchList(e, data?.id)}
              >
              <Plus className='size-5' />
            <p >Watch List</p>
              </button>
              {datac && !Season && (
            <div className='text-white sm:hidden text-base flex w-full max-w-4xl mt-4'> Director:
              <Link to={'/person/details/?id=' + directorId + "&name=" + dir} className='hover:underline hover:text-white'>
                <p className=' font-semibold ml-2'> {dir} </p>
              </Link>
            </div>
          )}
          
        
        <div className='hidden sm:flex mt-4'>
          {releasedate!==null && releasedate?.getTime() < new Date().getTime() && (
             <button className='flex bg-red-600 items-center hover:bg-red-800 px-2 rounded-md'
             onClick={() => setisplay(true)}
             >
             <Play className='size-6 fill-white p-1'/>
             <p className='font-semibold'>Play</p>
             </button>
          )}
       
              <button
                       className='bg-white bg-opacity-15 hover:bg-opacity-25 text-white font-semibold py-1 ml-2 px-2 rounded-lg flex items-center'
                       onClick={(e) => addWatchList(e, data?.id)}
                     >
                       <Plus className='size-5' />
                       <p className='ml-1'>Watch List</p>
              </button>
        </div>
        </div>
        
        
            
        </div>
        </div>
      )}

    
      {/* Video Container */}
      {(isplay || Season) &&  (
        
        <div className='flex flex-col items-center p-2 lg:p-0'>
        <div className="w-full max-w-4xl bg-black rounded-lg shadow-2xl overflow-hidden">
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
       
      </div>
      
     

      <div className='w-full max-w-4xl sm:flex sm:px-1 flex-wrap justify-between items-center'>
      <div className='flex w-full max-w-4xl items-center mt-2'>
      <div className='relative w-48'>
      
      <div
        className="appearance-none bg-slate-800 hover:bg-slate-700  text-white px-3 py-2 rounded-t-md cursor-pointer flex justify-between items-center"
        onClick={handleSelectChange}
      > 
        
        <p>{sources[srcIndex].name}</p>
        <p>{selectopen ? <ChevronUp /> : <ChevronDown />}</p>
        
      </div>

      {/* Dropdown List */}
      {selectopen && (
        <div className="absolute  w-full bg-slate-900  text-white rounded-b-md z-10">
          {sources.map((source, index) => (
            <div
              key={index}
              className="flex w-full items-center justify-start p-2 border-b border-white border-opacity-10 cursor-pointer hover:bg-slate-700"
              onClick={(e) => handleSourceChange(e,index)}
            >
              <div>
              <p className="">{source.name}</p>
              <p className="text-base text-gray-400">{source.description}</p>
              </div>
              
            </div>
          ))}
        </div>
      )}
      </div>
        <button className={`flex items-center ml-auto text-sm md:text-base px-2 p-1 md:p-2 rounded-md border-black ${text} bg-blue-900 hover:bg-blue-950`} onClick={Lightsout}>
          <Lightbulb size={21} color={text === 'text-white' ? 'white' : 'black'} />Lights off
        </button>
      </div>
     
        <div className="mt-5 text-center px-1 lg:px-0">
          <h1 className={`flex items-center lg:text-2xl md:text-xl text-left  gap-2 whitespace-nowrap font-semibold ${text} mb-3`}>
            Now Playing: <span className='font-extralight'>{Name} </span>
          </h1>
          { Season && (
          <p className='flex text-white text-sm md:text-base font-mono max-w-4xl'>{`Season ${Season} Episode ${Episode}`}</p>
          )
          }
        </div>
       
      </div>

      {Loading ? (
        <p className='text-white font-semibold text-base justify-center mt-10'>Loading...!</p>
      ) : (
        <div className='w-full max-w-4xl px-1'>
          {datac && !Season && (
            <div className='text-white flex w-full max-w-4xl mt-1 mb-1'> Director:
              <Link to={'/person/details/?id=' + directorId + "&name=" + dir} className='hover:underline hover:text-white'>
                <p className='font-semibold ml-1'> {dir} </p>
              </Link>
            </div>
          )}
          {Season && datae?.episodes && (
            <div className='text-white flex w-full max-w-4xl mt-2'> Name:
                <p className='font-semibold ml-1'> {datae.episodes[Episode-1]?.name} </p>
            </div>
          )}
          {bgColorClass !== 'bg-black' && (
            <div className='w-full max-w-4xl'>
              <div className={`text-left w-full flex justify-center items-center md:items-start md:justify-start flex-col md:flex-row max-w-4xl mt-10` }>
                <img
                  src={`${ORIGINAL_IMG_BASE_URL}${data?.seasons?.[Season]?.poster_path || (data?.poster_path || data?.backdrop_path || data?.profile_path)}`}
                  className="w-72 h-64 object-cover rounded-lg mb-5 md:mb-2 lg:mb-2 xl:mb-2"
                  alt={data?.title || data?.name}
                />
                <p className={!Season ? `md:hidden` : `mb-3 md:mt-2`}>
                {(data?.release_date) && (
                    <p className="text-sm text-gray-300">{data.release_date?.split("-")[0] || data.first_air_date?.split("-")[0]} | Rating: <b> {data?.vote_average}</b> | {data?.adult ? "18+" : "PG-13"} </p>
                  )}
                </p>
                <div className='text-sm md:text-base ml-1 sm:ml-1 md:ml-4 lg:ml-4 xl:ml-4'>
                  {!Season && <span className='hidden md:flex text-white mt-3 sm:mt-2 md:mt-2 lg:mt-2 xl:mt-2 w-full max-w-4xl'>{data?.overview}</span>}
                  {Season && <span className='hidden md:flex text-white mt-3 sm:mt-2 md:mt-2 lg:mt-2 xl:mt-2 w-full max-w-4xl'>{datae?.episodes?.[Episode-1]?.overview}</span>}
                  {!Season && (
                    <button
                      className='bg-red-600 bg-opacity-85 hover:bg-red-800 text-white font-semibold py-1 mt-5 mb-2 px-2 rounded flex items-center'
                      onClick={(e) => addWatchList(e, data?.id)}
                    >
                      <Plus className='size-5' />
                      <p className='ml-1'>Watch Later</p>
                    </button>
                  )}
                </div>
              </div>
              <div className={!Season ? `hidden md:flex w-full max-w-4xl mt-2 mb-2` : `hidden` }>
                <p>
                {(data?.release_date || data?.first_air_date) && (
                    <p className="text-sm text-gray-300">{data.release_date?.split("-")[0] || data.first_air_date?.split("-")[0]} | Rating: <b> {data?.vote_average}</b> | {data?.adult ? "18+" : "PG-13"} </p>
                  )}
                </p>
            </div>

            </div>
          )}
         
        </div>
      )}
      </div>
    )}
    </div>
        
        {bgColorClass!=='bg-black'  && !data?.seasons && !Loading && !imageload && (
          <div className='bg-black w-full mt-5'>
                <div className='flex text-white border-t-2 border-white border-opacity-30 pl-3 pt-5 text-xl'><h3 className='font-bold'>Cast</h3></div>
                  <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-1 sm:px-5">
                  {datac?.cast?.slice(0,numitems).map((item, index) => (
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
              className="px-2 py-1 mr-2 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 transition-all"
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
        <div className='text-white w-full  border-t-2 border-white border-opacity-30 pl-3 pt-5 text-xl'><h3 className='font-bold'>Similar Movies</h3></div>
        <div className="grid grid-cols-2 w-full sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-2 md:gap-3 mt-5 px-2 md:px-3">
                  {datas?.slice(0,numitemsm).map((item, index) => (
                    (item?.backdrop_path || item?.poster_path || item?.profile_path) &&
                      (
                        <Link 
                        key={item.id || index} 
                        to={'/watch/'+`/?id=${item?.id}&name=${item?.name || item?.title}`}
                        className="block bg-gray-800 bg-opacity-60 p-1 rounded-lg shadow-md hover:scale-105 transition-transform"
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
                {numitemsm < datas?.slice(0,10).length && (
          <div className="flex w-full justify-end  mt-6">
            <button
              onClick={() => setnumitemsm(prev => prev + 4)} // Show 6 more items
              className="px-2 py-1 mb-3 mr-2 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 transition-all"
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