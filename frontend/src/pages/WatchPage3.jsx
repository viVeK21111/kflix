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
  X,
  Plus,
  Clapperboard,
  ArrowLeft
} from 'lucide-react';
import { DetailsStore } from '../store/tvdetails';
import { creditStore } from '../store/credits';
import { useEffect } from 'react';
import { ORIGINAL_IMG_BASE_URL } from '../utils/constants';
import { addWatchStore } from '../store/watchStore';
import AddToPlaylistModal from '../components/AddToPlaylistModal';
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
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [loadingTrailers, setLoadingTrailers] = useState(false);
  const [trailerSources, setTrailerSources] = useState([]);

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlistItemData, setPlaylistItemData] = useState(null);

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

  const [srcIndex,setSrcIndex] = useState(() => {
    const savedIndex = sessionStorage.getItem('srcIndex');
    return savedIndex !== null ? Number(savedIndex) : 1;
  });
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

  const openPlaylistModal = (e) => {
    e.preventDefault();
    const itemData = {
      type: 'movie',
      id: datam?.id,
      image: datam?.poster_path || datam?.backdrop_path,
      title: datam?.title || datam?.name
    };
    setPlaylistItemData(itemData);
    setShowPlaylistModal(true);
  };
  const openEpisodePlaylistModal = (e) => {
    e.preventDefault();
    const itemData = {
      type: 'tv',
      id: parseInt(Id),
      image: datam?.seasons?.[Season]?.poster_path || datam?.poster_path || datam?.backdrop_path,
      title: datae?.episodes[Episode - 1]?.name,
      season: Season,
      episode: Episode,
      name: Name,
      totalEpisodes: tEpisodes
    };
    setPlaylistItemData(itemData);
    setShowPlaylistModal(true);
  };

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
      { name: "Source2 (rivestream)",description:"brave browser recommended", url: `https://rivestream.net/embed?type=movie&id=${Id}` },
      { name: "Source3 (Videasy)",description:"brave browser recommended", url: `https://player.videasy.net/movie/${Id}` },
      { name: "Source4 (vidlink)",description:"brave browser only", url: `https://vidlink.pro/movie/${Id}`},
      { name: "Source5 (111movies)", description:"brave browser recommended",url: `https://111movies.com/movie/${Id}` },
      { name: "Source6 (nontongo)", description:"brave browser only",url: `https://www.NontonGo.win/embed/movie/${Id}` },
      { name: "Source7 (pstream)", description:"adfree",url: `https://iframe.pstream.org/media/tmdb-movie-${Id}` },
     
    ];
  } else {
    sources = [
      { name: "Source1 (Filmu)",description:"adfree", url: `https://embed.filmu.fun/embed/tmdb-tv-${Id}/${Season}/${Episode}` },
      { name: "Source2 (rivestream)",description:"brave browser recommended" ,url: `https://rivestream.net/embed?type=tv&id=${Id}&season=${Season}&episode=${Episode}` },
      { name: "Source3 (Videasy)",description:"brave browser recommended", url: `https://player.videasy.net/tv/${Id}/${Season}/${Episode}` },
      { name: "Source4 (vidlink)",description:"brave browser only", url: `https://vidlink.pro/tv/${Id}/${Season}/${Episode}` },
      { name: "Source5 (111movies)", description:"brave browser recommended",url: `https://111movies.com/tv/${Id}/${Season}/${Episode}` },
      { name: "Source6 (nontong)", description:"brave browser only",url: `https://www.NontonGo.win/embed/tv/?id=${Id}&s=${Season}&e=${Episode}` },
      { name: "Source7 (pstream)", description:"adfree", url: `https://iframe.pstream.org/embed/tmdb-tv-${Id}/${Season}/${Episode}`},
    
    ];
  }
   
  const handleSourceChange = (e,index) => {
    e.preventDefault();
    setselectopen(false);
    setSrcIndex(Number(index)); // Change the source based on selection
    sessionStorage.setItem('srcIndex',index);
  };

  const handleSelectChange = (e) => {
    if(selectopen) {
      setselectopen(false);
    }
    else {
      setselectopen(true);
    }
  }

  // Fetch trending movie trailer when opening modal
  const handleOpenTrailerModal = async () => {
    setShowTrailerModal(true);
    setShowIframe(false);
    setSelectedTrailer(null);
    setLoadingTrailers(true);
    try {
      const res = await axios.get(`/api/v1/movies/trending`);
      const trending = res.data.content.slice(0,5);

      //console.log("trending "+trending)
      
        const tmap = await Promise.all(
          trending.map(async item => {
            const res = await axios.get(`/api/v1/movies/trailers/${item.id}`);
            const trailerList = res?.data?.content || [];
            const tid = trailerList.find(t => t.type === "Trailer" && t.site === "YouTube")
              || trailerList.find(t => t.type === "Teaser" && t.site === "YouTube");
            return {
              title: item.title || item.name,
              key: tid?.key || null
            };
          })
        );

        // Build sources array (only include entries with a valid YouTube key)
        const sources = tmap
          .filter(item => item.key)
          .map(item => ({
            name: `${item.title} Official Trailer`,
            src: `https://www.youtube.com/embed/${item.key}`,
          }));

        if (sources.length > 0) {
          setTrailerSources(sources);
        } else {
          setTrailerSources([
            {
              name: "No trailer fetched",
              src: "https://youtube.com/",
            },
          ]);
        }
    } catch (err) {
      setTrailerSources([
        {
          name: "No trailer fetched",
          src: "https://youtube.com/"
        }
      ]);
    }
    setLoadingTrailers(false);
  };

  if(Loading) {
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center bg-black h-full">
          <Loader className="animate-spin text-gray-500 w-10 h-10"/>
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
       
       
        {/* Trailer Modal */}
        {showTrailerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
            <div className="bg-black rounded-lg shadow-lg  relative border border-gray-500 ">
              <button
                  className="absolute right-0 px-1 text-2xl bg-black rounded-tr-lg rounded-bl-lg  font-bold text-red-600"
                onClick={() => { setShowTrailerModal(false); setShowIframe(false); setSelectedTrailer(null); }}
                aria-label="Close"
              >
                ×
              </button>
              {loadingTrailers ? (
                <div className="flex items-center  w-[20vw]  justify-center h-20 text-white text-lg">Loading trailers...</div>
              ) : !showIframe ? (
                <div className="flex flex-col gap-2 px-4 pt-5 pb-4">
                  <p className='text-white p-1'>Select Trailer</p>
                  {trailerSources.map((trailer, idx) => (
                    <button
                      key={idx}
                      className="block w-full text-left px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-black font-semibold"
                      onClick={() => { setSelectedTrailer(idx); setShowIframe(true); }}
                    >
                      {trailer.name}
                    </button>
                  ))}
                </div>
              ) : (
                <div className=" w-[90vw] max-w-5xl bg-black shadow-2xl overflow-hidden">
                  <iframe
                    src={trailerSources[selectedTrailer]?.src}
                    title={trailerSources[selectedTrailer]?.name}
                    className="w-full aspect-video rounded"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Overlay when menu is open */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleMobileMenu}
          ></div>
        )}

        
        
        {/* Rest of the component... */}
        <div className='flex flex-col'>
          <div className=''>
          <div className='flex flex-row'>

          <div className="w-full max-w-6xl overflow-hidden">
            {/* Video Player */}
            <iframe
              allowFullScreen
              src={sources[srcIndex].url}
              className="w-full aspect-video bg-black"
              onLoad={() => setIsLoading(false)} // Hide loader when iframe loads
            ></iframe>

            {isLoading && (
              <div className="w-full bg-black flex justify-center items-center">
                <p className='text-white'>Loading...🍿</p>
              </div>
            )}

             <div className=' flex bg-gray-950 rounded-b-lg w-full  items-center '>
                <div
                  className="appearance-none  bg-slate-900 hover:bg-slate-800 text-white px-2 md:px-3 py-2 cursor-pointer flex justify-between items-center min-w-[80px] md:min-w-0"
                  onClick={handleSelectChange}
                > 
                  <p className="hidden md:block">{sources[srcIndex].name}</p>
                  <p className="md:hidden whitespace-nowrap">{sources[srcIndex].name.split(' ')[0].trim()}</p>
                  <p className='pl-1'>{selectopen ? <ChevronUp className='h-5 pt-1 md:h-5 md:pt-0' /> : <ChevronDown className='h-5 pt-1 md:h-5 md:pt-0' />}</p>
                </div>

                <button className={`flex items-center ml-auto mr-2 text-base px-2 py-1 rounded-md border-black ${text} bg-blue-900 hover:bg-blue-950`} onClick={Lightsout}>
                <Lightbulb size={21} color={text === 'text-white' ? 'white' : 'black'} />
              </button>

                {/* Dropdown List */}
                {selectopen && (
                  <>
                    {/* Overlay */}
                    <div 
                      className="fixed inset-0 bg-black bg-opacity-80 z-50"
                      onClick={() => setselectopen(false)}
                    ></div>
                    
                    {/* Modal Dropdown */}
                    <div className="  fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[370px] md:w-[500px] max-h-[80vh] overflow-y-auto scrollbar-thin bg-black text-white rounded-lg z-50 border border-gray-600 shadow-2xl" style={{
                      scrollbarColor: 'rgb(26, 25, 25) rgb(0, 0, 0)'
                    }}>
                      {/* Header with close button */}
                      <div className=" justify-between items-center p-4 border-b border-gray-600">
                        <div className='flex '>
                        <h3 className="text-lg font-semibold">Select Source</h3>
                       
                       <button 
                         onClick={() => setselectopen(false)}
                         className="text-white flex ml-auto hover:text-gray-300 text-xl font-bold"
                         aria-label="Close"
                       >
                         ×
                       </button>
                        </div>
                       
                        <div className="lg:hidden 2xl:flex items-center justify-between">
                        <div className="flex items-center gap-1">
                      
                          <p className="text-sm text-gray-500">Use <a href='https://brave.com/download/' className='text-gray-400 hover:underline' target='_blank'>Brave</a> browser or <a href="https://chromewebstore.google.com/detail/adblock-plus-free-ad-bloc/cfhdojbkjhnklbpkdaibdccddilifddb?hl=en-US" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:underline">Ad blocker</a> for ad free experience</p>
                        </div>
                     
                        </div>
                      </div>
                      
                      
                      {/* Sources list */}
                      <div className="max-h-72 sm:max-h-64 overflow-y-auto">
                        {sources.map((source, index) => (
                          <div
                            key={index}
                            className={`flex w-full items-center justify-start p-3 border-b border-white border-opacity-10 cursor-pointer transition-colors ${
                              srcIndex === index 
                                ? 'bg-white bg-opacity-10 border-l-2 border-l-white' 
                                : 'hover:bg-white hover:bg-opacity-5'
                            }`}
                            onClick={(e) => handleSourceChange(e,index)}
                          >
                            <div>
                              <p className={`font-medium ${srcIndex === index ? 'text-white' : ''}`}>{source.name}</p>
                              <p className={`text-sm ${srcIndex === index ? 'text-gray-300' : 'text-gray-400'}`}>{source.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className='w-full sm:max-w-6xl justify-between items-center'>
            
            <h1 className={`flex flex-wrap mt-4 pl-2 pb-2 break-words items-center text-lg md:text-xl text-left gap-2 font-semibold ${text} `}>
               <span className='font-extralight break-words'>{Name}</span>
            </h1>
            
            {datac && !Season && (
              <div className='text-white text-sm md:text-base flex w-full p-2 mb-3'> Director:
                <Link to={dir!=='Unknown' ? '/person/details/?id=' + directorId + "&name=" + dir : `/watch/?id=${Id}&name=${Name}`} className='hover:underline hover:text-white'>
                  <p className='font-semibold ml-1'> {dir} </p>
                </Link>
              </div>
            )}
            <div className='lg:flex w-full'> 

            { Season && (
              <div className='flex'>
                <p className='flex font-extralight text-white p-2 '> <p className='font-semibold mr-2'>Episode:</p> {datae?.episodes[Episode-1]?.name} </p>
                <div className='hidden lg:flex xl:hidden items-start text-white w-auto mb-2 ml-2 bg-black p-2 rounded-lg text-sm md:text-base font-thin'><p>{`S${Season} E${Episode}`}</p></div>

              </div>

            )}

            {Season && (
              <div className='flex lg:ml-auto'>
              
              <div className=' mr-auto lg:hidden items-start text-white ml-2 bg-black p-2 rounded-lg text-sm md:text-base font-thin'><p>{`S${Season} E${Episode}`}</p></div>
                
                <div className='flex  ml-auto mr-2 lg:mr-0 items-center'>
                  {Episode > 1 && (
                    <Link to={`/watch/?id=${Id}&name=${Name}&season=${Season}&episode=${Episode-1}&tepisodes=${tEpisodes}`} className='text-white bg-white rounded-l-lg rounded-r-sm px-2 p-1 bg-opacity-10 hover:bg-opacity-15 mr-1'>
                      <p className='flex items-center'><ChevronLeft className='mr-1' size={14}/>Prev Ep</p>
                    </Link>
                  )}
                  {Episode < tEpisodes && (
                    <Link to={`/watch/?id=${Id}&name=${Name}&season=${Season}&episode=${Episode+1}&tepisodes=${tEpisodes}`} className='text-white p-1 px-2 rounded-r-lg rounded-l-sm bg-white bg-opacity-10 hover:bg-opacity-15'>
                      <p className='flex items-center'>Next Ep <ChevronRight className='ml-1' size={14}/></p>
                    </Link>
                  )}
                </div>
              
              </div>
            )}
           

            </div>
           
          
          </div>

            
          </div>

          <div className='flex-col justify-end mx-auto lg:pl-4'>
              
          {/* Desktop Navigation */}
          <div className='hidden xl:flex ml-auto justify-end items-center px-2 pt-4 pb-6'>
            
            <Link to={Season ? `/tv/details/?id=${Id}&name=${Name}` :`/movie/?id=${Id}&name=${Name}` } className='flex items-center text-white text-sm md:text-base ml-3 mr-2 hover:scale-105 transition-transform'> 
              <p className='flex items-center bg-white bg-opacity-10 hover:bg-opacity-20 p-1 rounded-lg'> <ArrowLeft className='mr-1' size={22}/></p>
            </Link>
            <Link to='/history?tab=watch' className='flex items-center text-gray-400 transition-all duration-300 hover:scale-110 cursor-pointer text-sm bg-white bg-opacity-10 py-1 px-2 rounded-md'>
              <History />
            </Link>
          </div>
        
          {/* Trailers Button */}
          <div className="absolute hidden xl:flex right-0 bottom-14  items-center z-50 ml-3">
          <button
            className={(isLightsOut || Season) ? 'hidden' :  `flex py-2 2xl:py-1 px-3 bg-gray-800 items-center rounded-l-lg bg-opacity-100 hover:bg-gray-700 text-white font-semibold shadow-lg`} 
            onClick={handleOpenTrailerModal}
          >
           
            <Clapperboard size={21} className='flex  items-center  2xl:mr-1 h-4 ' />
            <p className='hidden 2xl:flex'>Trailers Trending</p>
          </button>
        </div>
        

          {Loading ? (
                <p className='text-white font-semibold text-base justify-center mt-10'>Loading...!</p>
              ) : (
                <div className={bgColorClass!='bg-black'?`w-full hidden xl:flex md:border-gray-600`:`hidden`}>
                  <div className='pb-4 md:pb-0 max-w-sm'>
                    <div className='flex justify-center mb-4'>
                    <img
                        src={`${ORIGINAL_IMG_BASE_URL}${datam?.seasons?.[Season]?.poster_path || (datam?.poster_path || datam?.backdrop_path || datam?.profile_path)}`}
                        className="w-40 h-52 object-cover rounded-lg mb-5 md:mb-2 lg:mb-2 xl:mb-2"
                        alt={datam?.title || datam?.name}
                      />
                    </div>
                    { Season && (
                      <div className='flex'>
                        <div className='flex items-start text-white w-auto bg-black p-2 rounded-lg text-sm md:text-base font-thin'><p>{`S${Season} E${Episode}`}</p></div>
                      </div>
                    )}
                  
                    <div className={Season ? (datae?.episodes?.[Episode-1]?.overview.length>0 ? `text-left flex justify-center items-center md:items-start md:justify-start flex-col md:flex-row mt-2`:`text-left  flex justify-center items-center flex-col md:flex-row mt-2` ):(datam?.overview?.length>0 ? `text-left  flex justify-center items-center md:items-start md:justify-start flex-col md:flex-row mt-2`: `text-left  flex items-center justify-center flex-col mt-2`)}>
                    
                      <p className={!Season ? `md:hidden` : `mb-3 md:mt-2`}>
                        {(datam?.release_date) && (
                          <p className="text-sm text-gray-300">{datam.release_date?.split("-")[0] || datam.first_air_date?.split("-")[0]} | Rating: <b> {datam?.vote_average?.toFixed(1)}</b> | {datam?.adult ? "18+" : "PG-13"} </p>
                        )}
                      </p>
                      
                      <div className='text-sm md:text-base'>
                        {!Season && <span className='hidden md:flex text-white mt-3 sm:mt-2 md:mt-2 lg:mt-2 xl:mt-2 w-full max-w-6xl'>{datam?.overview}</span>}
                        {Season && <span className='hidden md:flex text-white mt-3 sm:mt-2 md:mt-2 lg:mt-2 xl:mt-2 w-full max-w-6xl'>{datae?.episodes?.[Episode-1]?.overview}</span>}

                      <div className={(!Season && datam?.overview.length>0) ? `hidden md:flex w-full my-4` : (datam?.overview?.length==0 ? `hidden md:flex justify-center w-full mt-2 mb-2`:`hidden`) }>
                      <p>
                        {(datam?.release_date || datam?.first_air_date) && (
                          <p className="text-sm text-gray-300">{datam.release_date?.split("-")[0] || datam.first_air_date?.split("-")[0]} | Rating: <b> {datam?.vote_average?.toFixed(1)}</b> | {datam?.runtime} Min </p>
                        )}
                      </p>
                      </div>

                      {!Season && (
                        <button
                          className='hidden md:flex bg-gray-700 bg-opacity-85 hover:bg-gray-600 text-white text-sm font-semibold py-1 my-4 px-2 rounded items-center'
                          onClick={openPlaylistModal}
                        >
                          <Plus className='size-5' />
                          <p className='ml-1'>Save</p>
                        </button>
                      )}
                      {Season && (
                        <button
                          className='hidden md:flex bg-gray-700 bg-opacity-85 hover:bg-gray-600 text-white text-sm font-semibold py-1 my-4 px-2 rounded items-center'
                          onClick={openEpisodePlaylistModal}
                        >
                          <Plus className='size-5' />
                          <p className='ml-1'>Save</p>
                        </button>
                      )}
                      </div>
                    </div>
                    
                    
                  </div>
                </div>
              )}
          </div>
          </div>
        
          
          
         
          <p className={bgColorClass!=='bg-black' ? Season ? `flex  w-full max-w-5xl lg:max-w-6xl items-center mb-5  lg:rounded-sm font-semibold text-gray-500 text-sm p-2 mt-6 `: `flex text-gray-500  lg:rounded-sm font-semibold text-sm w-full max-w-5xl mb-5 lg:max-w-6xl items-center p-2 mt-3 lg:mt-6` : 'hidden'}>Switch to different sources if the current one gives an error.</p>
          <div className='hidden xl:flex mx-2 mb-5'>
          <a
                href="https://discord.gg/P3rcqHwp9d"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm md:text-md gap-2 text-gray-400 hover:text-white transition-colors"
              >Join our community
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Discord
              </a>

          </div>
      </div>
          {Loading ? (
            <p className='text-white font-semibold text-base justify-center mt-10'>Loading...!</p>
          ) : (
            <div className={bgColorClass!='bg-black'?`w-full pb-3 md:bg-gray-900 xl:hidden px-2 `:`hidden`}>
              <div className='pb-4 md:pb-0'>
                <div className={Season ? (datae?.episodes?.[Episode-1]?.overview.length>0 ? `text-left w-full flex justify-center items-center md:items-start md:justify-start flex-col md:flex-row mt-3 md:mt-10`:`text-left w-full flex justify-center items-center flex-col md:flex-row mt-3 md:mt-10` ):(datam?.overview?.length>0 ? `text-left w-full flex justify-center items-center md:items-start md:justify-start flex-col md:flex-row mt-3 md:mt-10`: `text-left w-full flex items-center justify-center flex-col mt-3 md:mt-10`)}>
                  <img
                    src={`${ORIGINAL_IMG_BASE_URL}${datam?.seasons?.[Season]?.poster_path || (datam?.poster_path || datam?.backdrop_path || datam?.profile_path)}`}
                    className="w-56 sm:w-64 h-64 object-cover rounded-lg mb-5 md:mb-2 lg:mb-2 xl:mb-2"
                    alt={datam?.title || datam?.name}
                  />
                  <p className={!Season ? `md:hidden` : `mb-3 md:mt-2`}>
                    {(datam?.release_date) && (
                      <p className="text-sm text-gray-300">{datam.release_date?.split("-")[0] || datam.first_air_date?.split("-")[0]} | Rating: <b> {datam?.vote_average?.toFixed(1)}</b> | {datam?.runtime} Min </p>
                    )}
                  </p>
                  <div className='text-sm md:text-base md:ml-4 '>
                    {!Season && <span className='hidden md:flex text-white mt-3 sm:mt-2 md:mt-2 lg:mt-2 xl:mt-2 w-full max-w-6xl'>{datam?.overview}</span>}
                    {Season && <span className='hidden md:flex text-white mt-3 sm:mt-2 md:mt-2 lg:mt-2 xl:mt-2 w-full max-w-6xl'>{datae?.episodes?.[Episode-1]?.overview}</span>}
                    {!Season && (
                      <button
                        className='hidden md:flex bg-gray-700 bg-opacity-85 hover:bg-gray-600 text-white text-sm font-semibold py-1 mt-5 mb-2 px-2 rounded items-center'
                        onClick={openPlaylistModal}
                      >
                        <Plus className='size-5' />
                        <p className='ml-1'>Save</p>
                      </button>
                    )}
                    {Season && (
                      <button
                        className='hidden md:flex bg-gray-700 bg-opacity-85 hover:bg-gray-600 text-white text-sm font-semibold py-1 mt-5 mb-2 px-2 rounded items-center'
                        onClick={openEpisodePlaylistModal}
                      >
                        <Plus className='size-5' />
                        <p className='ml-1'>Save</p>
                      </button>
                    )}
                  </div>
                </div>
                <div className={(!Season && datam?.overview.length>0) ? `hidden md:flex w-full xl:pl-12 mt-2 mb-2` : (datam?.overview?.length==0 ? `hidden md:flex justify-center w-full mt-2 mb-2`:`hidden`) }>
                  <p>
                    {(datam?.release_date || datam?.first_air_date) && (
                      <p className="text-sm text-gray-300">{datam.release_date?.split("-")[0] || datam.first_air_date?.split("-")[0]} | Rating: <b> {datam?.vote_average?.toFixed(1)}</b> | {datam?.runtime} Min </p>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className='flex xl:hidden mx-2 my-5'>
          <a
                href="https://discord.gg/P3rcqHwp9d"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm md:text-md gap-2 text-gray-400 hover:text-white transition-colors"
              >Join our community
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Discord
              </a>

          </div>
      </div>
      {/* Add to Playlist Modal */}
      {showPlaylistModal && playlistItemData && (
        <AddToPlaylistModal
          isOpen={showPlaylistModal}
          onClose={() => {
            setShowPlaylistModal(false);
            setPlaylistItemData(null);
          }}
          item={playlistItemData}
        />
      )}
    </div>
  );
}

export default WatchPage;