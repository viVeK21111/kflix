import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, Play, X, Globe,Satellite,Rabbit,Tv,Plane, AlertTriangle,Droplet,Video } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const FunPage = () => {
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [videoId, setVideoId] = useState(""); // You'll provide the YouTube ID later
  const [adultPreference, setAdultPreference] = useState(false);
  const [showAdultWarning, setShowAdultWarning] = useState(false);
  const navigate = useNavigate();

  const handleISSLive = () => {
    // You'll provide the YouTube video ID here
    setVideoId('xRPjKQtRXR8');
    setShowVideoPlayer(true);
  };
const handleLAXLive = () => {
  setVideoId('MjD3gnNFYUo');
  setShowVideoPlayer(true);
}

  const closeVideoPlayer = () => {
    setShowVideoPlayer(false);
    setVideoId('');
  };

  // Fetch adult preference on component mount
  useEffect(() => {
    const getAdultPreference = async () => {
      try {
        const pref = await axios.get('/api/v1/user/getadultPreference');
        const datapref = pref.data.pref;
        setAdultPreference(datapref);
      } catch (error) {
        console.error('Error fetching adult preference:', error);
      }
    };
    getAdultPreference();
  }, []);

  const handleNSFWCams = () => {
    if (adultPreference) {
      navigate('/fun/adult');
    } else {
      setShowAdultWarning(true);
      //toast.error('Adult content preference is disabled. Please enable it in your profile settings.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900  to-slate-900 text-white">
      {/* Header */}
      <header className="flex w-full items-center py-1 bg-black bg-opacity-10 pl-1">
        <Link to={'/'} className='mr-auto'>
          <img src={'/kflix3.png'} alt='Kflix Logo' className='w-30 sm:w-32 h-12 sm:h-14' />
          
        </Link>

      </header>

      {/* Main Content */}
      <div className=" px-4 py-8">
        <h1 className="text-3xl mx-auto font-bold text-center mb-8">Explore Live Feed</h1>
        
        <div className="space-y-3 max-w-3xl">
          {/* IPTV Link */}
          <div 
            className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
            onClick={() => window.open('https://www.rivestream.app/iptv', '_blank', 'noopener,noreferrer')}
          >
            <div className="flex items-center justify-between text-lg font-semibold text-blue-400 hover:text-blue-300 transition-colors">
              <div className="flex items-center gap-3">
                <Tv className="h-6 w-6" />
                <span>IPTV Services</span>
              </div>
              <ExternalLink className="h-5 w-5" />
            </div>
            <p className="text-gray-400 mt-2">Access live TV channels powered by Rive stream (Use Brave Browser)</p>
          </div>

          {/* ISS Live */}
          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer" onClick={handleISSLive}>
            <div className="flex items-center justify-between text-lg font-semibold text-green-500 hover:text-green-400 transition-colors">
              <div className="flex items-center gap-3">
                <Satellite  className="h-6 w-6" />
                <span>ISS Live</span>
              </div>
              <Play className="h-5 w-5" />
            </div>
            <p className="text-gray-400 mt-2">Watch live feed from the International Space Station by <a href='https://www.youtube.com/@afartv' className='hover:text-blue-400 text-gray-300' target='_blank'>afarTV</a> </p>
            <p className='text-gray-400'><b>Fact:</b> Speed of iss is 28000 kmph and it takes approximately 90 min to complete one revolution around the earth.</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer" 
          onClick={() => window.open('https://www.mangolinkcam.com/index.html', '_blank', 'noopener,noreferrer')}>
            <div className="flex items-center justify-between text-lg font-semibold text-yellow-700 hover:text-yellow-600 transition-colors">
              <div className="flex items-center gap-3">
                <Rabbit  className="h-6 w-6" />
                <span>Live streaming Animal Webcams</span>
              </div>
              <ExternalLink className="h-5 w-5" />
            </div>
            <p className="text-gray-400 mt-2">Watch the live cams from zoos, national parks, oceans and beaches of all species including Mammals, Birds, Aquatic and etc.. Powered by mangolinkcam</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer" 
          onClick={() => window.open('https://worldcams.tv/beaches/', '_blank', 'noopener,noreferrer')}>
            <div className="flex items-center justify-between text-lg font-semibold text-yellow-100 hover:text-yellow-200 transition-colors">
              <div className="flex items-center gap-3">
                <img src={'/beach.png'}  className="h-7 w-7" />
                <span>Beaches Live webcams</span>
              </div>
              <ExternalLink className="h-5 w-5" />
            </div>
            <p className="text-gray-400 mt-2">Watch the live cams from beaches across the world powered by worldcams.tv</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer" 
          onClick={() => window.open('https://www.openoceans.org/web-cams', '_blank', 'noopener,noreferrer')}>
            <div className="flex items-center justify-between text-lg font-semibold text-blue-100 hover:text-blue-200 transition-colors">
              <div className="flex items-center gap-3">
                <img src={'/wave.png'}  className="h-7 w-7" />
                <span>Oceans Live webcams</span>
              </div>
              <ExternalLink className="h-5 w-5" />
            </div>
            <p className="text-gray-400 mt-2">Watch the live cams from best view ocean points powered by openoceans.org</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer" 
          onClick={() => window.open('https://worldcams.tv/', '_blank', 'noopener,noreferrer')}>
            <div className="flex items-center justify-between text-lg font-semibold text-gray-300 hover:text-gray-400 transition-colors">
              <div className="flex items-center gap-3">
                <Globe  className="h-6 w-6" />
                <span>World Cam</span>
              </div>
              <ExternalLink className="h-5 w-5" />
            </div>
            <p className="text-gray-400 mt-2">Watch the live cams from around the world including Airports, Beaches, Mountains, Ships, Trains, Cities, Traffic, Bars and etc.. powered by <a href='worldcams.tv' className=' text-gray-300 hover:text-blue-400' target='_blank'>worldcams.tv</a> </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer" 
          onClick={() => window.open('https://www.montereybayaquarium.org/animals/live-cams', '_blank', 'noopener,noreferrer')}>
            <div className="flex items-center justify-between text-lg font-semibold text-blue-500 hover:text-blue-400 transition-colors">
              <div className="flex items-center">
                <img src={'fish.png'}  className="h-8 w-10" />
                <span>Monterey Bay Aquarium Live cams</span>
              </div>
              <ExternalLink className="h-5 w-5" />
            </div>
            <p className="text-gray-400 mt-2">Watch the live cams from monterey bay Aquarium,CA which shows different marine species</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer" 
          onClick={() => window.open('https://zoo.sandiegozoo.org/live-cameras', '_blank', 'noopener,noreferrer')}>
            <div className="flex items-center justify-between text-lg font-semibold text-lime-400 hover:text-lime-300 transition-colors">
              <div className="flex items-center gap-3">
                <img src={"/panda.png"}  className="h-6 w-6" />
                <span>San Diego Zoo Live cam</span>
              </div>
              <ExternalLink className="h-5 w-5" />
            </div>
            <p className="text-gray-400 mt-2">Watch the live cams from San Diego Zoo,CA</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer" 
          onClick={() => window.open('https://worldcams.tv/aquariums/', '_blank', 'noopener,noreferrer')}>
            <div className="flex items-center justify-between text-lg font-semibold text-blue-400 hover:text-blue-300 transition-colors">
              <div className="flex items-center gap-2">
                <img src={"/shark.png"}  className="h-10 w-9" />
                <span>Aquariums Live cam</span>
              </div>
              <ExternalLink className="h-5 w-5" />
            </div>
            <p className="text-gray-400 mt-1">Watch the live cams of various Aquariums around the world powered by worldcams.tv</p>
          </div>

          {/* NSFW Cams */}
          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer" 
          onClick={handleNSFWCams}>
            <div className="flex items-center justify-between text-lg font-semibold text-gray-400 hover:text-gray-300 transition-colors">
              <div className="flex items-center gap-1">
                <Droplet  className="h-6 w-6" />
                <span> NSFW Cams</span>
              </div>
              <ExternalLink className="h-5 w-5" />
            </div>
            <p className="text-gray-400 mt-2 ml-1">PG-17</p>
          </div>

        </div>
      </div>
      <div className=" px-4 py-8">
        <h1 className="text-3xl mx-auto font-bold text-center mb-8">Explore Documentaries</h1>
        <div className="space-y-3 max-w-3xl">

        <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer" 
          onClick={() => window.open('https://watchdocumentaries.com/', '_blank', 'noopener,noreferrer')}>
            <div className="flex items-center justify-between text-lg font-semibold text-gray-300 hover:text-gray-200 transition-colors">
              <div className="flex items-center gap-2">
                <Video className="h-7 w-8" />
                <img src='/watchdoc.png' className='w-52'/>
              </div>
              <ExternalLink className="h-5 w-5" />
            </div>
            <p className="text-gray-400 mt-1">Watch the Documentaries from various categories like Biography, Business, Politics, History, Health, Nature, Crime, Science and etc.. powered by watchdocumentaries.com</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer" 
          onClick={() => window.open('https://www.youtube.com/playlist?list=PLivjPDlt6ApSiD2mk9Ngp-5dZ9CDDn72O', '_blank', 'noopener,noreferrer')}>
            <div className="flex items-center justify-between text-lg font-semibold text-gray-200 hover:text-gray-300 transition-colors">
              <div className="flex items-center gap-2">
                <img src={"/natgeo.png"}  className="h-10 w-9" />
                <span>NatGeo Documentaries</span>
              </div>
              <ExternalLink className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-gray-400 mt-1">Watch National Geographic full episodes - including Hostile Planet, Lost Cities with Albert Lin, To Catch a Smuggler, Drain the Oceans, and more.</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer" 
          onClick={() => window.open('https://topdocumentaryfilms.com/', '_blank', 'noopener,noreferrer')}>
            <div className="flex items-center justify-between text-lg font-semibold transition-colors">
              <div className="flex items-center gap-2">
                <Video className="h-7 w-8 text-blue-500" />
                <span className='flex'><p className='text-gray-300'>DOCUMENTARY</p><p className='text-blue-400'>FILMS</p></span>
              </div>
              <ExternalLink className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-gray-400 mt-1">Watch free Documentaries online powered by topdocumentaryfilms.com</p>
          </div>

          </div>
          <p className='mt-16 ml-5 text-gray-300'> Want to give suggestions? Contact through <a href='https://discord.gg/P3rcqHwp9d' className='text-blue-400' target='_blank'>Discord</a> or <a href='/contactus' className='text-blue-400' target='_blank'>Contact us</a></p>

      </div>

      {/* Video Player Modal */}
      {showVideoPlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-5xl">
            <button
              onClick={closeVideoPlayer}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="h-8 w-8" />
            </button>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="ISS Live"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Adult Warning Modal */}
      {showAdultWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-400" />
              <h3 className="text-xl font-semibold text-white">Content Disabled</h3>
            </div>
            <p className="text-gray-300 mb-6">
              This content preference is currently disabled. To access NSFW content, please enable adult content in your profile settings.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAdultWarning(false)}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
              >
                Close
              </button>
              <Link
                to="/profile"
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition-colors text-center"
              >
                Go to Profile
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FunPage; 