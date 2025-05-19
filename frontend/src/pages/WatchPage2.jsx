import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {Link} from 'react-router-dom';
import { 
  Lightbulb, 
  CircleArrowLeft, 
  House,
  TvMinimal,
  ChevronDown,
  ChevronUp,
  Loader,
  ChevronLeft,
  ChevronRight,
  History,
  Menu,
  X,
  Plus,
} from 'lucide-react';
import { DetailsStore } from '../store/tvdetails';
import { creditStore } from '../store/credits';
import { useEffect } from 'react';
import { ORIGINAL_IMG_BASE_URL } from '../utils/constants';
import { addWatchStore } from '../store/watchStore';
import axios from 'axios';

function WatchPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search)
  
  const {datac,getCredits} = creditStore();
  
  const [datam, setdatam] = useState(null);
  const [bgColorClass, setBgColorClass] = useState(null);
  const [text,setText] = useState('text-white');
  const [dir,setDir] = useState("");
  const [Loading,setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [directorId, setdirectorId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const Id = queryParams.get('id');
  const Name = queryParams.get('name');
  let Season = queryParams.get('season');
  if(Season) Season = parseInt(Season);
  let Episode = queryParams.get('episode');
  if(Episode) Episode = parseInt(Episode);
  let tEpisodes = queryParams.get('tepisodes');
  if(tEpisodes) tEpisodes = parseInt(tEpisodes);
  localStorage.setItem("numitems",6);
  const {addWatch,addEpisode} = addWatchStore();

  const [srcIndex,setSrcIndex] = useState(0);
  const [selectopen,setselectopen] = useState(false);
  const [isLightsOut, setIsLightsOut] = useState(false);
  const [datae,setDatae] = useState(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    setBgColorClass(isLightsOut ? 'bg-black' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900');
  }, [isLightsOut]);

  useEffect(() => {
    const getepisodes = async() => {
      const seasonep = {"Id":Id,"Season":Season};
      const response = await axios.post("/api/v1/tv/episodes",seasonep);
      setDatae(response.data.content);
    }
  
    if(Season) getepisodes();
  
  },[Id]);

  useEffect(() => {
    let isMounted = true; // Prevent race conditions

    const addToHistory = async () => {
      try {
        if (!Season && datam && isMounted) {
          await axios.post("/api/v1/watch/addWatchMovie", {
            id: datam.id,
            poster_path: datam.poster_path,
            backdrop_path: datam.backdrop_path,
            title: datam.title || datam.name,
          });
        } else if (Season && Episode && Name && datae && isMounted) {
          await axios.post(
            `/api/v1/watch/addWatchTv/${Id}/${Season}/${Name}/${datae?.episodes.length}`,
            datae?.episodes[Episode - 1]
          );
        }
      } catch (error) {
        console.error("Error adding to watch history:", error.message);
      }
    };

    addToHistory();

    return () => {
      isMounted = false; // Cleanup to prevent updates after unmount
    };
  },[Id,Season,Episode,datam,datae]);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
    if(Season) {
      const response = await axios.get(`/api/v1/tv/details/${Id}`);
      setdatam(response.data.content);
      setLoading(false);
     
    }
    else if (Id) {
      const response = await axios.get(`/api/v1/movies/details/${Id}`);
      getCredits(Id);
      setdatam(response.data.content);
      setLoading(false);
    }
  }
    fetchData();
    window.scrollTo(0, 0);

  }, [Id]);

  function getDirector(crew) {
    const director = crew.find(person => (person.known_for_department==='Directing' && (person.job === "Director" || person.job==='Writer' || person.job==='producer')) || person.job==='Director');
    setdirectorId(director?.id);
    return director ? director.name : "Unknown";
  }
 
  useEffect(() => {
    if(datac) setDir(getDirector(datac.crew));
  },[datac])

  const addWatchList = async(e,id) => {
    e.preventDefault();
    console.log("id "+id);
    addWatch(id);
  }
  const addWatchEpisode = async(e) => {
    e.preventDefault();
    const data = {
      id:Id,
      season:Season,
      episode:Episode,
      name:Name,
      totalEpisodes:tEpisodes,
      poster_path: datam?.seasons?.[Season]?.poster_path || (datam?.poster_path || datam?.profile_path || datam?.backdrop_path),
      title: datae?.episodes[Episode - 1]?.name,
    };
    addEpisode(data); 
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
  } else {
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

  if(Loading) {
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center bg-black h-full">
          <Loader className="animate-spin text-red-600 w-10 h-10"/>
        </div>
      </div>
    )
  }

  if (!Id) {
    return <div className="flix items-center text-white bg-slate-900 justify-center text-center">No Movie/tv found</div>;
  }

  return (
    <div className={`page min-h-screen ${bgColorClass} overflow-auto`}>
      <div className=''>
        {/* Header with Mobile Menu */}
        <header className={bgColorClass!='bg-black'?`flex items-center bg-slate-900 bg-opacity-40 ${!Season ? 'py-0 sm:py-2' : 'py-0 sm:py-1'}`:`flex items-center bg-black ${!Season ? 'py-0 sm:py-2' : 'py-0 sm:py-1'}`}>
          <Link to={'/'} className='flex items-center ml-1'>
            <img src={'/kflix2.png'} alt='kflix logo' className='w-30 sm:w-32 h-12 sm:h-14' />
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            className='ml-auto md:hidden p-2 text-white mr-2'
            onClick={toggleMobileMenu}
          >
            <Menu size={24} />
          </button>
          
          {/* Desktop Navigation */}
          <div className='hidden md:flex ml-auto items-center p-2'>
            <Link className='hover:bg-slate-800 p-2 rounded-lg text-base' to={'/'}>
              <p className='flex items-center text-white'>
                <House className='h-5 w-4 sm:h-5 sm:w-5 mr-1 hover:scale-105 transition-transform'/>
                <p className='font-semibold'>Home</p>
              </p>
            </Link>
            <Link className='hover:bg-slate-800 p-2 rounded-lg text-base' to={'/watchlist'}>
              <p className='flex items-center text-white pl-1'>
                <TvMinimal className='h-5 w-4 sm:h-5 sm:w-5 mr-1 hover:scale-105 transition-transform'/>
                <p className='font-semibold'>Watchlist</p>
              </p>
            </Link>
            <Link to={Season ? `/tv/details/?id=${Id}&name=${Name}` :`/movie/?id=${Id}&name=${Name}` } className='flex items-center text-white text-sm md:text-base ml-3 mr-2 hover:scale-105 transition-transform'> 
              <p className='flex items-center'> <CircleArrowLeft className='mr-1' size={22}/></p>
            </Link>
            <Link to='/profile/watchHistory' className='flex items-center text-gray-400 transition-all duration-300 hover:scale-110 cursor-pointer text-sm bg-white bg-opacity-10 py-1 px-2 rounded-md'>
              <History />
            </Link>
          </div>
        </header>
        
        {/* Mobile Menu Sidebar */}
        <div className={`fixed top-0 right-0 w-64 h-full bg-gray-800 z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center p-4 border-b border-gray-600">
            <h2 className="text-white text-lg font-semibold">Menu</h2>
            <button onClick={toggleMobileMenu} className="text-white">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex flex-col ">
            <Link onClick={toggleMobileMenu} className='hover:bg-slate-700 border-b border-gray-700 p-4 text-base' to={'/'}>
              <p className='flex items-center text-white'>
                <House className='h-5 w-5 mr-3'/>
                <p className='font-semibold'>Home</p>
              </p>
            </Link>
            <Link onClick={toggleMobileMenu} className='hover:bg-slate-700 p-4 border-b border-gray-700 text-base' to={'/watchlist'}>
              <p className='flex items-center text-white'>
                <TvMinimal className='h-5 w-5 mr-3'/>
                <p className='font-semibold'>Watchlist</p>
              </p>
            </Link>
            <Link onClick={toggleMobileMenu} to={Season ? `/tv/details/?id=${Id}&name=${Name}` :`/movie/?id=${Id}&name=${Name}`} className='hover:bg-slate-700 p-4 border-b border-gray-700 text-base'>
              <p className='flex items-center text-white'>
                <CircleArrowLeft className='h-5 w-5 mr-3'/>
                <p className='font-semibold'>Back to Details</p>
              </p>
            </Link>
            <Link onClick={toggleMobileMenu} to='/profile/watchHistory' className='hover:bg-slate-700  border-b border-gray-700 p-4 text-base'>
              <p className='flex items-center text-white'>
                <History className='h-5 w-5 mr-3'/>
                <p className='font-semibold'>Watch History</p>
              </p>
            </Link>
          </div>
        </div>
        
        {/* Overlay when menu is open */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleMobileMenu}
          ></div>
        )}
        
        {/* Rest of the component... */}
        <div className='flex flex-col items-center'>
          <div className="w-full max-w-4xl bg-black shadow-2xl overflow-hidden">
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
          
          <div className='flex w-full sm:max-w-4xl flex-wrap justify-between p-2 lg:p-0 items-center'>
            <div className='flex w-full max-w-4xl items-center mt-2'>
              <div className='relative w-48'>
                <div
                  className="appearance-none rounded-lg bg-slate-800 hover:bg-slate-700 text-white px-2 md:px-3 py-2 cursor-pointer flex justify-between items-center"
                  onClick={handleSelectChange}
                > 
                  <p>{sources[srcIndex].name}</p>
                  <p>{selectopen ? <ChevronUp /> : <ChevronDown />}</p>
                </div>

                {/* Dropdown List */}
                {selectopen && (
                  <div className="absolute w-full bg-gray-800 text-white rounded-md z-10">
                    {sources.map((source, index) => (
                      <div
                        key={index}
                        className="flex w-full items-center justify-start p-1 sm:p-2 border-b border-white border-opacity-10 cursor-pointer hover:bg-slate-700"
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
              <button className={`flex items-center ml-auto text-base px-2 py-1 rounded-md border-black ${text} bg-blue-900 hover:bg-blue-950`} onClick={Lightsout}>
                <Lightbulb size={21} color={text === 'text-white' ? 'white' : 'black'} />Lights off
              </button>
            </div>
          
            <h1 className={`flex flex-wrap mt-5 break-words items-center text-lg md:text-xl lg:text-2xl text-left gap-2 font-semibold ${text} mb-3`}>
              Now Playing: <span className='font-extralight break-words'>{Name}</span>
            </h1>
            
            {datac && !Season && (
              <div className='text-white text-sm md:text-base flex w-full mt-1 mb-3'> Director:
                <Link to={dir!=='Unknown' ? '/person/details/?id=' + directorId + "&name=" + dir : `/watch/?id=${Id}&name=${Name}`} className='hover:underline hover:text-white'>
                  <p className='font-semibold ml-1'> {dir} </p>
                </Link>
              </div>
            )}
            { Season && (
              <p className='hidden sm:flex text-white w-auto bg-black p-2 rounded-lg text-sm md:text-base font-thin'>{`S${Season} E${Episode}`}</p>
            )}
            {Season && datae?.episodes && (
              <div className='text-white sm:mt-2 flex items-center w-full max-w-4xl mb-4'>
                <p className='flex font-extralight mt-2'> <p className='font-semibold mr-2'>Name:</p> {datae.episodes[Episode-1]?.name} </p>
                <div className='hidden sm:flex ml-auto'>
                  {Episode > 1 && (
                    <Link to={`/watch/?id=${Id}&name=${Name}&season=${Season}&episode=${Episode-1}&tepisodes=${tEpisodes}`} className='text-white bg-white rounded-lg px-2 p-1 bg-opacity-10 hover:bg-opacity-15 mr-2'>
                      <p className='flex items-center'>Prev Ep<ChevronLeft className='ml-1' size={14}/></p>
                    </Link>
                  )}
                  {Episode < tEpisodes && (
                    <Link to={`/watch/?id=${Id}&name=${Name}&season=${Season}&episode=${Episode+1}&tepisodes=${tEpisodes}`} className='text-white p-1 px-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-15'>
                      <p className='flex items-center'>Next Ep <ChevronRight className='ml-1' size={14}/></p>
                    </Link>
                  )}
                </div>
              </div>
            )}
            {Season && (
              <>
                <p className='sm:hidden text-white w-auto bg-black p-2 rounded-lg text-sm md:text-base font-thin'>{`S${Season} E${Episode}`}</p>
                <div className='flex sm:hidden sm:mt-3'>
                  {Episode > 1 && (
                    <Link to={`/watch/?id=${Id}&name=${Name}&season=${Season}&episode=${Episode-1}&tepisodes=${tEpisodes}`} className='text-white bg-white rounded-lg px-2 p-1 bg-opacity-10 hover:bg-opacity-15 mr-2'>
                      <p className='flex items-center'>Prev Ep<ChevronLeft className='ml-1' size={14}/></p>
                    </Link>
                  )}
                  {Episode < tEpisodes && (
                    <Link to={`/watch/?id=${Id}&name=${Name}&season=${Season}&episode=${Episode+1}&tepisodes=${tEpisodes}`} className='text-white p-1 px-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-15'>
                      <p className='flex items-center'>Next Ep <ChevronRight className='ml-1' size={14}/></p>
                    </Link>
                  )}
                </div>
              </>
            )}
            <p className={bgColorClass!=='bg-black' ? `text-gray-400 text-sm flex pt-5 md:pt-2 md:pb-3` : 'hidden'}><p className='mr-1 font-semibold'>Tip:</p>Switch to different sources if the current one fails.</p>
          </div>

          {Loading ? (
            <p className='text-white font-semibold text-base justify-center mt-10'>Loading...!</p>
          ) : (
            <div className={bgColorClass!='bg-black'?`w-full mb-3 px-2 md:border-t md:border-gray-600`:`hidden`}>
              <div className=''>
                <div className={Season ? (datae?.episodes?.[Episode-1]?.overview.length>0 ? `text-left w-full flex justify-center items-center md:items-start md:justify-start flex-col md:flex-row mt-10`:`text-left w-full flex justify-center items-center flex-col md:flex-row mt-10` ):(datam?.overview?.length>0 ? `text-left w-full flex justify-center items-center md:items-start md:justify-start flex-col md:flex-row mt-10`: `text-left w-full flex items-center justify-center flex-col mt-10`)}>
                  <img
                    src={`${ORIGINAL_IMG_BASE_URL}${datam?.seasons?.[Season]?.poster_path || (datam?.poster_path || datam?.backdrop_path || datam?.profile_path)}`}
                    className="w-64 sm:w-80 h-52 sm:h-64 object-cover rounded-lg mb-5 md:mb-2 lg:mb-2 xl:mb-2"
                    alt={datam?.title || datam?.name}
                  />
                  <p className={!Season ? `md:hidden` : `mb-3 md:mt-2`}>
                    {(datam?.release_date) && (
                      <p className="text-sm text-gray-300">{datam.release_date?.split("-")[0] || datam.first_air_date?.split("-")[0]} | Rating: <b> {datam?.vote_average}</b> | {datam?.adult ? "18+" : "PG-13"} </p>
                    )}
                  </p>
                  <div className='text-sm md:text-base ml-1 sm:ml-1 md:ml-4 lg:ml-4 xl:ml-4'>
                    {!Season && <span className='hidden md:flex text-white mt-3 sm:mt-2 md:mt-2 lg:mt-2 xl:mt-2 w-full max-w-6xl'>{datam?.overview}</span>}
                    {Season && <span className='hidden md:flex text-white mt-3 sm:mt-2 md:mt-2 lg:mt-2 xl:mt-2 w-full max-w-6xl'>{datae?.episodes?.[Episode-1]?.overview}</span>}
                    {!Season && (
                      <button
                        className='bg-red-600 bg-opacity-85 hover:bg-red-800 text-white font-semibold py-1 mt-5 mb-2 px-2 rounded flex items-center'
                        onClick={(e) => addWatchList(e, datam?.id)}
                      >
                        <Plus className='size-5' />
                        <p className='ml-1'>Watch Later</p>
                      </button>
                    )}
                    {Season && (
                      <button
                        className='bg-red-600 bg-opacity-85 hover:bg-red-800 text-white font-semibold py-1 mt-5 mb-2 px-2 rounded flex items-center'
                        onClick={(e) => addWatchEpisode(e)}
                      >
                        <Plus className='size-5' />
                        <p className='ml-1'>Watch Later</p>
                      </button>
                    )}
                  </div>
                </div>
                <div className={(!Season && datam?.overview.length>0) ? `hidden md:flex w-full xl:pl-12 mt-2 mb-2` : (datam?.overview?.length==0 ? `hidden md:flex justify-center w-full mt-2 mb-2`:`hidden`) }>
                  <p>
                    {(datam?.release_date || datam?.first_air_date) && (
                      <p className="text-sm text-gray-300">{datam.release_date?.split("-")[0] || datam.first_air_date?.split("-")[0]} | Rating: <b> {datam?.vote_average}</b> | {datam?.adult ? "18+" : "PG-13"} </p>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WatchPage;