import { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { DetailsStore } from '../store/tvdetails';
import { creditStore } from '../store/credits';
import { ORIGINAL_IMG_BASE_URL } from '../utils/constants';
import { SimilarStore } from '../store/SimilarStore';
import { addWatchStore } from '../store/watchStore';
import { Plus, Star, Play, Dot, Loader, CircleArrowLeft, House, TvMinimal, Menu, X } from 'lucide-react';
import AddToPlaylistModal from '../components/AddToPlaylistModal';
import axios from 'axios';

function WatchPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { getMoviedetails, data } = DetailsStore();
  const { getSimilarMovies, datas } = SimilarStore();
  const { datac, getCredits } = creditStore();
  const [bgColorClass, setBgColorClass] = useState(null);
  const [dir, setDir] = useState("");
  const [Loading, setLoading] = useState(true);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [directorId, setdirectorId] = useState(null);
  const [numitems, setnumitems] = useState(5);
  const [numitemsm, setnumitemsm] = useState(4);
  const [numitemscol, setnumitemscol] = useState(4);
  const Id = queryParams.get('id');
  const Name = queryParams.get('name');

  localStorage.setItem("numitems", 6);
  const { addWatch } = addWatchStore();

  const [imageload, setimageload] = useState(true);
  const [readov, setreadov] = useState(300);
  const [selectopen, setselectopen] = useState(false);
  const [releasedate, setreleasedate] = useState(null);
  const [trailerId, setTrailerId] = useState(null);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Collection state
  const [collectionData, setCollectionData] = useState(null);
  const [loadingCollection, setLoadingCollection] = useState(false);

  const imgRef = useRef(null);

  useEffect(() => {
    if (data && data?.release_date) {
      const rd = new Date(data?.release_date);
      setreleasedate(rd);
      console.log("future movie " + rd.getTime < new Date());
    }
  }, [data]);

  // Fetch collection data if belongs_to_collection exists
  useEffect(() => {
    const fetchCollection = async () => {
      if (data?.belongs_to_collection && data.belongs_to_collection.id) {
        setLoadingCollection(true);
        try {
          const response = await axios.get(`/api/v1/movies/collection/${data.belongs_to_collection.id}`);
          if (response.data.success) {
            console.log("collection",response.data.content);
            setCollectionData(response.data.content);
          }
        } catch (error) {
          console.error('Error fetching collection:', error);
        } finally {
          setLoadingCollection(false);
        }
      } else {
        setCollectionData(null);
      }
    };

    if (data) {
      fetchCollection();
    }
  }, [data]);

  useEffect(() => {
    const getTrailerId = async () => {
      const trailerId = await axios.get(`/api/v1/movies/trailers/${Id}`);
      const tid = trailerId?.data?.content.find((item) => item.type === "Trailer" && item.site === "YouTube") || trailerId?.data?.content.find((item) => item.type === "Teaser" && item.site === "YouTube");
      setTrailerId(tid?.key);
    }
    getTrailerId();
  }, [Id]);

  useEffect(() => {
    setLoading(true);
    setCollectionData(null);
    if (Id) {
      Promise.all([getMoviedetails(Id), getCredits(Id), getSimilarMovies(Id)]).then(() => {
        setLoading(false);
      });
      window.scrollTo(0, 0);
    }
    setnumitems(5);
    setnumitemsm(4);
    setnumitemscol(4);
  }, [Id, getMoviedetails]);

  function getDirector(crew) {
    const director = crew.find(person => (person.known_for_department === 'Directing' && (person.job === "Director" || person.job === 'Writer' || person.job === 'producer')) || person.job === 'Director');
    setdirectorId(director?.id);
    return director ? director.name : "Unknown";
  }

  useEffect(() => {
    if (datac) setDir(getDirector(datac.crew));
  }, [datac]);

  const addWatchList = async (e, id) => {
    e.preventDefault();
    console.log("id " + id);
    addWatch(id);
  }

  const handleSelectChange = (e) => {
    if (selectopen) {
      setselectopen(false);
    } else {
      setselectopen(true);
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setBgColorClass('bg-zinc-950');
      } else {
        setBgColorClass('bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`page min-h-screen ${bgColorClass} bg-zinc-950 overflow-auto`}>
      <div className=''>
        {(Loading || imageload) && (
          <div className="h-screen ">
            <div className="flex justify-center items-center bg-black h-full">
              <Loader className="animate-spin text-gray-500 w-10 h-10" />
            </div>
          </div>
        )}

        {!Loading && (
          <div className='relative '>
            <img ref={imgRef} src={`${ORIGINAL_IMG_BASE_URL}${data?.backdrop_path || data?.profile_path || data?.poster_path}`}
              className='w-full object-top object-cover h-full md:h-[86vh] shadow-2xl'
              onLoad={() => {
                setimageload(false);
              }}
            ></img>

            {showTrailerModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
                <div className="bg-black rounded-lg shadow-lg relative border border-gray-500 ">
                  <button
                    className="absolute right-0 px-1 text-2xl bg-black rounded-tr-lg rounded-bl-lg font-bold text-red-600"
                    onClick={() => { setShowTrailerModal(false) }}
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <div className="w-[100vw] max-w-4xl bg-black shadow-2xl overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${trailerId}`}
                      title={Name + "Official trailer"}
                      className="w-full aspect-video rounded"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>)
            }

            <div className="md:absolute inset-0 md:bg-gradient-to-t from-black/80 via-black/60 to-transparent"></div>
            <div className="md:absolute inset-0 md:bg-gradient-to-r from-black/40 to-transparent"></div>
            <div className="md:absolute text-white lg:max-w-3xl p-1 bottom-5 left-3">
              <div className='mt-3 sm:hidden ml-1'>
                <h1 className="text-xl md:text-2xl xl:text-3xl 2xl:text-3xl font-bold mb-3 text-white">
                  {data?.title}
                </h1>

                <div className='flex'>
                  <p className="flex gap-2 items-center bg-white bg-opacity-20 text-semibold rounded-md px-2 py-1">
                    {data?.adult ? "18+" : "PG-13"}
                  </p>
                  <div className='flex items-center'>
                    <p className="flex ml-2"><Star className='size-5 pt-1' />{data?.vote_average?.toFixed(1)} </p>
                    <p className='ml-5 flex'>
                      {data?.genres && data?.genres.slice(0, 2).map((item, index) => (
                        <div key={item.id} className="flex items-center text-white">
                          {(index !== 2 && index !== 0) && (<Dot />)}
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </p>
                  </div>
                </div>

                <div className='mt-3 flex items-center text-sm md:text-base'>
                  <p className=''> {data?.release_date?.split("")} </p>
                  <p className='flex'><Dot /></p>
                  <p className=''>{data?.runtime} min.</p>
                </div>

                {releasedate !== null && releasedate.getTime() < new Date().getTime() && (
                  <Link className='w-full justify-center' to={`/${'watch'}/?id=${Id}&name=${Name}`}>
                    <button className='flex w-full justify-center p-2 bg-red-600 items-center mt-3 hover:bg-red-800 rounded-md'>
                      <Play className='size-6 fill-white p-1' />
                      <p className='font-semibold text-lg'>Play</p>
                    </button>
                  </Link>
                )}
              </div>

              <div className='mx-2 md:mx-0 mt-3'>
                <h1 className="hidden sm:flex text-xl md:text-2xl xl:text-3xl 2xl:text-3xl font-bold mb-3 text-white">
                  {data?.title}
                </h1>
                <p className={`text-base mb-2 max-w pb-2`}>
                  {data?.overview.length < readov ? data?.overview : (
                    <>
                      {data?.overview.slice(0, readov)}
                      {readov < data?.overview.length && (
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
                    <p className="flex ml-2"><Star className='size-5 pt-1' />{data?.vote_average?.toFixed(1)} </p>
                    <p className='ml-5 flex'>
                      {data?.genres && data?.genres.slice(0, 3).map((item, index) => (
                        <div key={item.id} className="flex items-center text-white">
                          {(index !== 3 && index !== 0) && (<Dot />)}
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </p>
                  </div>
                </div>
                <div className='hidden sm:flex mt-3 items-center text-sm md:text-base'>
                  <p className=''> {data?.release_date?.split("")} </p>
                  <p className='flex'><Dot /></p>
                  <p className=''>{data?.runtime} min.</p>
                  {datac && (
                    <div className='text-white flex items-center ml-2'> Dir.
                      <Link to={dir != 'Unknown' ? '/person/details/?id=' + directorId + "&name=" + dir : `/watch/?id=${Id}&name=${Name}`} className='hover:underline hover:text-white'>
                        <p className=' font-semibold ml-2'> {dir} </p>
                      </Link>
                    </div>
                  )}
                </div>
                <div className='flex gap-2 items-center'>
                  <button
                    className={`sm:hidden bg-white bg-opacity-15 hover:bg-opacity-25 text-white font-semibold py-1 px-2 rounded-lg flex items-center`}
                    onClick={() => setShowPlaylistModal(true)}
                  >
                    <Plus className='size-5' />
                    <p className='ml-1'>Save</p>
                  </button>
                  <div className='sm:hidden flex items-center' onClick={() => { setShowTrailerModal(true) }}> <div className='flex items-center py-1 px-2 rounded-lg bg-slate-700 hover:bg-slate-600'><img className='h-5' src='/youtube.png'></img><p className='ml-1 text-sm font-semibold'>Trailer</p></div> </div>
                </div>

                {datac && (
                  <div className='text-white sm:hidden text-base w-full max-w-4xl mt-4'>
                    <p className='flex'>Director: <Link to={dir != 'Unknown' ? '/person/details/?id=' + directorId + "&name=" + dir : `/watch/?id=${Id}&name=${Name}`} className='hover:underline hover:text-white'>
                      <p className=' font-semibold ml-2'> {dir} </p>
                    </Link></p>
                    {dir === 'Christopher Nolan' && new Date(data?.release_date).getFullYear() >= 2008 && (
                      <p className='flex mt-2'>Filmed For <p className='ml-1 text-blue-600 hover:underline font-semibold'><Link target='_blank' to={`https://www.imax.com/en/in/movie/${data?.title.toLowerCase().trim().replace(/\s+/g, '-')}`}>IMAX</Link></p></p>
                    )}
                  </div>
                )}

                <div className='hidden sm:flex mt-4 gap-2 sm:mb-2 md:mb-0'>
                  {releasedate !== null && releasedate?.getTime() < new Date().getTime() && (
                    <Link className='flex justify-center' to={`/${'watch'}/?id=${Id}&name=${Name}`}>
                      <button className='flex bg-red-600 items-center hover:bg-red-800 px-2 rounded-md'>
                        <Play className='size-6 fill-white p-1' />
                        <p className='font-semibold'>Play</p>
                      </button>
                    </Link>
                  )}

                  <button
                    className={`bg-white bg-opacity-15 hover:bg-opacity-25 text-white font-semibold py-1 px-2 rounded-lg flex items-center`}
                    onClick={() => setShowPlaylistModal(true)}
                  >
                    <Plus className='size-5' />
                    <p className='ml-1'>Save</p>
                  </button>

                  <div className='flex items-center hover:cursor-pointer '
                    onClick={() => setShowTrailerModal(true)}>
                    <img className='h-7' src='/youtube.png'></img>
                    <p className='ml-1 font-semibold text-md hover:scale-105 transition-transform'>Trailer</p>
                  </div>

                  {dir === 'Christopher Nolan' && new Date(data?.release_date).getFullYear() >= 2008 && (
                    <p className='flex ml-3 items-center'>
                      Filmed For <p className='ml-1 text-blue-600 hover:underline font-semibold'>
                        <Link target='_blank' to={`https://www.imax.com/en/in/movie/${data?.title.toLowerCase().trim().replace(/\s+/g, '-')}`}>
                          IMAX
                        </Link>
                      </p>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!Loading && !imageload && (
        <div className='bg-black w-full mt-5 sm:mt-0'>
          {/* Cast Section */}
          <div className='flex text-white border-t border-white border-opacity-30 pl-3 pt-4 text-xl'><h3 className='font-bold'>Cast</h3></div>
          <div className="w-full grid grid-cols-2 pb-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-2 sm:px-5">
            {datac?.cast?.slice(0, numitems).map((item, index) => (
              <Link
                key={item.id || index}
                to={'/person/details' + `/?id=${item?.id}&name=${item?.name}`}
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
          {numitems < datac?.cast.slice(0, 10).length && (
            <div className="flex w-full justify-end mt-5 mb-3">
              <button
                onClick={() => setnumitems(prev => prev + 4)}
                className="px-2 py-1 mr-2 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 transition-all"
              >
                Load More
              </button>
            </div>
          )}
          {numitems >= 10 && (
            <div className="flex w-full justify-center max-w-8xl mt-6 mb-3">
              <button
                onClick={() => setnumitems(5)}
                className="px-2 py-1 text-base font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 hover:scale-105 transition-all"
              >
                Load Less
              </button>
            </div>
          )}

          {/* Collection Section */}
          {collectionData && collectionData.parts && collectionData.parts.length > 1 && (
            <>
              <div className='text-white w-full border-t-2 border-white border-opacity-30 pl-4 pt-5 text-xl'>
                <h3 className='font-bold'>{collectionData.name}</h3>
                {collectionData.overview && (
                  <p className='text-sm text-gray-400 mt-2 max-w-full'>{collectionData.overview}</p>
                )}
              </div>
              <div className="grid grid-cols-2 w-full sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-2 md:gap-3 my-5 px-2 md:px-3 ">
                {collectionData.parts
                  .sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
                  .slice(0, numitemscol)
                  .map((item, index) => (
                    (item?.backdrop_path || item?.poster_path) && (
                      <Link
                        key={item.id || index}
                        to={'/movie' + `/?id=${item?.id}&name=${item?.title}`}
                        className="block bg-gray-800 bg-opacity-60 rounded-lg shadow-md hover:bg-gray-800 "
                      >
                        <img
                          src={`${ORIGINAL_IMG_BASE_URL}${item?.backdrop_path || item?.poster_path}`}
                          className="w-full object-cover rounded-t-lg h-40 sm:h-48"
                          alt={item?.title}
                        />
                        <div className='p-2'>
                          <h3 className="text-sm sm:text-base font-bold text-white mt-2 truncate">
                            {item.title}
                          </h3>
                          <div>
                            <p className="text-xs flex items-center sm:text-sm text-gray-400">
                              {item.release_date?.split("-")[0]} | <Star size={13} className='mx-1' />{item.vote_average?.toFixed(1)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  ))}
              </div>
              {numitemscol < collectionData.parts.length && (
                <div className="flex w-full justify-end mt-6">
                  <button
                    onClick={() => setnumitemscol(prev => prev + 4)}
                    className="px-2 py-1 mb-3 mr-2 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 transition-all"
                  >
                    Load More
                  </button>
                </div>
              )}
              {numitemscol >= collectionData.parts.length && collectionData.parts.length > 4 && (
                <div className="flex w-full justify-center mt-6">
                  <button
                    onClick={() => setnumitemscol(4)}
                    className="px-2 py-1 mb-3 text-base font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 hover:scale-105 transition-all"
                  >
                    Load Less
                  </button>
                </div>
              )}
            </>
          )}

          {/* Similar Movies Section */}
          <div className='text-white w-full border-t-2 border-white border-opacity-30 pl-4 pt-5 text-xl'><h3 className='font-bold'>Similar Movies</h3></div>
          <div className="grid grid-cols-2 w-full sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-2 md:gap-3 mt-5 px-2 md:px-3 ">
            {datas?.slice(0, numitemsm).map((item, index) => (
              (item?.backdrop_path || item?.poster_path || item?.profile_path) &&
              (
                <Link
                  key={item.id || index}
                  to={'/movie' + `/?id=${item?.id}&name=${item?.name || item?.title}`}
                  className="block bg-gray-800 bg-opacity-60 rounded-lg shadow-md hover:bg-gray-800"
                >
                  <img
                    src={`${ORIGINAL_IMG_BASE_URL}${item?.backdrop_path || item?.poster_path || item?.profile_path}`}
                    className={`${(item?.backdrop_path || item?.profile_path) ? "w-full object-cover rounded-t-lg" : " object-cover rounded-t-lg h-28 sm:h-32 xl:h-44 w-full"}`}
                    alt={item?.title || item?.name}
                  />
                  <div className='p-2'>
                    <h3 className="text-sm sm:text-base font-bold text-white mt-2 truncate">
                      {item.title || item.name}
                    </h3>

                    <div>
                      <p className="text-xs flex items-center sm:text-sm text-gray-400">{item.release_date.split("-")[0]} | <Star size={13} className='mx-1' />{item.vote_average?.toFixed(1)} </p>
                    </div>
                  </div>
                </Link>
              )
            ))}
          </div>
          {numitemsm < datas?.slice(0, 10).length && (
            <div className="flex w-full justify-end mt-6">
              <button
                onClick={() => setnumitemsm(prev => prev + 4)}
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
                className="px-2 py-1 mb-3 text-base font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 hover:scale-105 transition-all"
              >
                Load Less
              </button>
            </div>
          )}
        </div>
      )}

      <AddToPlaylistModal
        isOpen={showPlaylistModal}
        onClose={() => setShowPlaylistModal(false)}
        item={{
          type: 'movie',
          id: data?.id,
          image: data?.poster_path,
          title: data?.title
        }}
      />
    </div>
  );
}

export default WatchPage;