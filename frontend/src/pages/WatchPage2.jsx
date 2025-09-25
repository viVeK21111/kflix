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
  Clapperboard,
  ArrowLeft
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
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [loadingTrailers, setLoadingTrailers] = useState(false);
  const [trailerSources, setTrailerSources] = useState([]);

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
  const [showTip, setShowTip] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    setBgColorClass(isLightsOut ? 'bg-black' : 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900');
  }, [isLightsOut]);

  useEffect(() => {
    // Check if tip has been shown in this session
    const tipShown = sessionStorage.getItem('tip');
    
    // Detect Brave browser
    const isBrave = navigator.brave?.isBrave() || false;
    
    // Detect ad blocker
    const detectAdBlocker = () => {
      return new Promise((resolve) => {
        const testAd = document.createElement('div');
        testAd.innerHTML = '&nbsp;';
        testAd.className = 'adsbox';
        testAd.style.position = 'absolute';
        testAd.style.left = '-10000px';
        document.body.appendChild(testAd);
        
        setTimeout(() => {
          const isAdBlockerActive = testAd.offsetHeight === 0;
          document.body.removeChild(testAd);
          resolve(isAdBlockerActive);
        }, 100);
      });
    };

    const checkAndShowTip = async () => {
      const hasAdBlocker = await detectAdBlocker();
      
      // Show tip only if not Brave and no ad blocker detected
      if (!tipShown && !isBrave && !hasAdBlocker) {
        setShowTip(true);
        sessionStorage.setItem('tip', 'shown');
      }
    };

    checkAndShowTip();
  }, []);

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
        {/* Header with Mobile Menu */}
        <header className={bgColorClass!='bg-black'?`hidden sm:flex items-center bg-slate-900 bg-opacity-40 ${!Season ? 'py-0 sm:py-2' : 'py-0 sm:py-1'}`:`hidden sm:flex items-center bg-black ${!Season ? 'py-0 sm:py-2' : 'py-0 sm:py-1'}`}>
         
          
        
          {showTip && (
          <div className="hidden lg:flex 2xl:hidden md:top-1 z-50 mx-auto bg-black bg-opacity-80 text-white py-1 px-2 rounded-lg shadow-lg max-w-full">
            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
              
                  <p className="text-sm">Use <a href='https://brave.com/download/' className='text-blue-300' target='_blank'>Brave</a> browser or <a href="https://chromewebstore.google.com/detail/adblock-plus-free-ad-bloc/cfhdojbkjhnklbpkdaibdccddilifddb?hl=en-US" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">Ad blocker</a> for ad free experience</p>
                </div>
              <button 
                onClick={() => setShowTip(false)}
                className="ml-2 text-white  border-l pl-1 border-gray-800 hover:text-gray-200 text-lg font-bold"
                aria-label="Close tip"
              >
                ×
              </button>
            </div>
          </div>
        )}
    
          
          {/* Desktop Navigation */}
          <div className='hidden sm:flex ml-auto items-center p-2'>
            
            <Link to={Season ? `/tv/details/?id=${Id}&name=${Name}` :`/movie/?id=${Id}&name=${Name}` } className='flex items-center text-white text-sm md:text-base ml-3 mr-2 hover:scale-105 transition-transform'> 
              <p className='flex items-center bg-white bg-opacity-10 hover:bg-opacity-20 p-1 rounded-lg'> <ArrowLeft className='mr-1' size={22}/></p>
            </Link>
            <Link to='/history?tab=watch' className='flex items-center text-gray-400 transition-all duration-300 hover:scale-110 cursor-pointer text-sm bg-white bg-opacity-10 py-1 px-2 rounded-md'>
              <History />
            </Link>
          </div>
        </header>
        
        
          {/* Trailers Button */}
          <div className="absolute hidden xl:flex right-0  items-center  top-24 z-50 ml-3">
          <button
            className={(isLightsOut || Season) ? 'hidden' :  `flex py-2 2xl:py-1 px-3 bg-gray-800 items-center rounded-l-lg bg-opacity-100 hover:bg-gray-700 text-white font-semibold shadow-lg`} 
            onClick={handleOpenTrailerModal}
          >
           
            <Clapperboard size={21} className='flex  items-center  2xl:mr-1 h-4 ' />
            <p className='hidden 2xl:flex'>Trailers Trending</p>
          </button>
        </div>
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
              <div className='relative w-auto md:w-52'>
                <div
                  className="appearance-none rounded-lg bg-slate-800 hover:bg-slate-700 text-white px-2 md:px-3 py-2 cursor-pointer flex justify-between items-center min-w-[80px] md:min-w-0"
                  onClick={handleSelectChange}
                > 
                  <p className="hidden md:block">{sources[srcIndex].name}</p>
                  <p className="md:hidden whitespace-nowrap">{sources[srcIndex].name.split(' ')[0].trim()}</p>
                  <p className='pl-1'>{selectopen ? <ChevronUp className='h-5 pt-1 md:h-5 md:pt-0' /> : <ChevronDown className='h-5 pt-1 md:h-5 md:pt-0' />}</p>
                </div>

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
              <button className={`flex items-center ml-auto text-base px-2 py-1 rounded-md border-black ${text} bg-blue-900 hover:bg-blue-950`} onClick={Lightsout}>
                <Lightbulb size={21} color={text === 'text-white' ? 'white' : 'black'} />Lights off
              </button>
            </div>
          
            <h1 className={`flex flex-wrap mt-5 break-words items-center text-lg md:text-xl lg:text-2xl text-left gap-2 font-semibold ${text} mb-3`}>
               <span className='font-extralight break-words'>{Name}</span>
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
              <div className='text-white flex items-center w-full max-w-4xl mb-4'>
                <p className='flex font-extralight'> <p className='font-semibold mr-2'>Episode:</p> {datae.episodes[Episode-1]?.name} </p>
                <div className='hidden sm:flex ml-auto'>
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
            {Season && (
              <>
                <p className='sm:hidden text-white w-auto bg-black p-2 rounded-lg text-sm md:text-base font-thin'>{`S${Season} E${Episode}`}</p>
                <div className='flex sm:hidden sm:mt-3'>
                  {Episode > 1 && (
                    <Link to={`/watch/?id=${Id}&name=${Name}&season=${Season}&episode=${Episode-1}&tepisodes=${tEpisodes}`} className='text-white bg-white rounded-l-lg rounded-r-sm px-2 p-1 bg-opacity-10 hover:bg-opacity-15 mr-1'>
                      <p className='flex items-center'>Prev Ep<ChevronLeft className='ml-1' size={14}/></p>
                    </Link>
                  )}
                  {Episode < tEpisodes && (
                    <Link to={`/watch/?id=${Id}&name=${Name}&season=${Season}&episode=${Episode+1}&tepisodes=${tEpisodes}`} className='text-white p-1 px-2 rounded-r-lg rounded-l-sm bg-white bg-opacity-10 hover:bg-opacity-15'>
                      <p className='flex items-center'>Next Ep <ChevronRight className='ml-1' size={14}/></p>
                    </Link>
                  )}
                </div>
              </>
            )}
          
          </div>
          <p className={bgColorClass!=='bg-black' ? Season ? `flex  w-full max-w-5xl lg:max-w-4xl items-center bg-blue-800 lg:rounded-sm font-semibold text-gray-300 text-sm p-2 mt-6 lg:mb-3`: `flex bg-blue-800 text-gray-300  lg:rounded-sm font-semibold text-sm w-full max-w-5xl lg:max-w-4xl items-center p-2 mt-3 lg:m-3 lg:mt-6` : 'hidden'}>Switch to different sources if the current one gives an error.</p>
          {Loading ? (
            <p className='text-white font-semibold text-base justify-center mt-10'>Loading...!</p>
          ) : (
            <div className={bgColorClass!='bg-black'?`w-full mb-3 px-2 md:border-t md:border-gray-600`:`hidden`}> 
              <div className='pb-4 md:pb-0'>
                <div className={Season ? (datae?.episodes?.[Episode-1]?.overview.length>0 ? `text-left w-full flex justify-center items-center md:items-start md:justify-start flex-col md:flex-row mt-10`:`text-left w-full flex justify-center items-center flex-col md:flex-row mt-10` ):(datam?.overview?.length>0 ? `text-left w-full flex justify-center items-center md:items-start md:justify-start flex-col md:flex-row mt-10`: `text-left w-full flex items-center justify-center flex-col mt-10`)}>
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
                  <div className='text-sm md:text-base ml-1 sm:ml-1 md:ml-4 lg:ml-4 xl:ml-4'>
                    {!Season && <span className='hidden md:flex text-white mt-3 sm:mt-2 md:mt-2 lg:mt-2 xl:mt-2 w-full max-w-6xl'>{datam?.overview}</span>}
                    {Season && <span className='hidden md:flex text-white mt-3 sm:mt-2 md:mt-2 lg:mt-2 xl:mt-2 w-full max-w-6xl'>{datae?.episodes?.[Episode-1]?.overview}</span>}
                    {!Season && (
                      <button
                        className='hidden md:flex bg-gray-700 bg-opacity-85 hover:bg-gray-600 text-white text-sm font-semibold py-1 mt-5 mb-2 px-2 rounded items-center'
                        onClick={(e) => addWatchList(e, datam?.id)}
                      >
                        <Plus className='size-5' />
                        <p className='ml-1'>Watch Later</p>
                      </button>
                    )}
                    {Season && (
                      <button
                        className='hidden md:flex bg-gray-700 bg-opacity-85 hover:bg-gray-600 text-white text-sm font-semibold py-1 mt-5 mb-2 px-2 rounded items-center'
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
                      <p className="text-sm text-gray-300">{datam.release_date?.split("-")[0] || datam.first_air_date?.split("-")[0]} | Rating: <b> {datam?.vote_average?.toFixed(1)}</b> | {datam?.runtime} Min </p>
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