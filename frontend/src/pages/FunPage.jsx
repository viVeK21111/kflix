import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, Play, X, Globe,Satellite,Rabbit,Tv,Plane, AlertTriangle,Droplet,Video, Menu, X as CloseIcon,Gamepad2,Newspaper } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const FunPage = () => {
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [videoId, setVideoId] = useState(""); // You'll provide the YouTube ID later
  const [adultPreference, setAdultPreference] = useState(false);
  const [showAdultWarning, setShowAdultWarning] = useState(false);
  const [activeSection, setActiveSection] = useState(sessionStorage.getItem("funSelect") || 'live-feed'); // Default to live feed
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile sidebar toggle
  const navigate = useNavigate();
  const [GameLink,setGameLink] = useState('');
  const [showGamePlayer,setShowGamePlayer] = useState(false);

  useEffect(() => {
    window.scroll(0,0);
  })

  // Define sections for the index bar
  const sections = [
    { id: 'live-feed', title: 'Live Feed', icon: <Tv className='h-5'/> },
    { id: 'documentaries', title: 'Documentaries', icon: <Video className=''/> },
    { id:'games',title:'Games',icon: <Gamepad2 className='h-5'/>},
    { id: 'news',title: "News" , icon : <Newspaper className='h-5' />}

    // Add more sections here as needed
    // { id: 'section3', title: 'New Section', icon: '🔧' },
  ];

  const handleISSLive = () => {
    // You'll provide the YouTube video ID here
    setVideoId('xRPjKQtRXR8');
    setShowVideoPlayer(true);
  };


  const closeVideoPlayer = () => {
    setShowVideoPlayer(false);
    setVideoId('');
  };

  // Close sidebar when section is selected on mobile
  const handleSectionSelect = (sectionId) => {
    sessionStorage.setItem("funSelect",sectionId);
    setActiveSection(sectionId);
    setSidebarOpen(false); // Close sidebar on mobile after selection
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

  const handleGame = (Link) => {
    setGameLink(Link);
    setShowGamePlayer(true);
  }
  const closeGamePlayer = () => {
    setShowGamePlayer(false);
    setGameLink('');
  }

  const handleNSFWCams = () => {
    if (adultPreference) {
      navigate('/fun/adult');
    } else {
      setShowAdultWarning(true);
      //toast.error('Adult content preference is disabled. Please enable it in your profile settings.');
    }
  };

  // Render content based on active section
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'live-feed':
        return (
          <div className="space-y-3 max-w-3xl">
            {/* IPTV Link */}
            <div 
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
              onClick={() => window.open('https://www.rivestream.app/iptv', '_blank', 'noopener,noreferrer')}
            >
              <div className="flex items-center justify-between text-lg font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                <div className="flex items-center gap-3">
                  <Tv className="h-6 w-6" />
                  <span>IPTV Live</span>
                </div>
                <ExternalLink className="h-5 w-5" />
              </div>
              <p className="text-gray-400 mt-2">Access live TV channels powered by rivestream (Use Brave Browser)</p>
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

             {/* IPTV Link */}
             <div 
              className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
              onClick={() => window.open('https://thedaddy.top/24-7-channels.php', '_blank', 'noopener,noreferrer')}
            >
              <div className="flex items-center justify-between text-lg font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                <div className="flex items-center gap-3">
                  <Tv className="h-6 w-6" />
                  <span>IPTV Live</span>
                </div>
                <ExternalLink className="h-5 w-5" />
              </div>
              <p className="text-gray-400 mt-2">Access live 24/7 sports and entertainment channels powered by daddylivehd (Use Brave Browser)</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer" 
            onClick={() => window.open('https://www.mangolinkcam.com/index.html', '_blank', 'noopener,noreferrer')}>
              <div className="flex items-center justify-between text-lg font-semibold text-amber-600 hover:text-amber-500 transition-colors">
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
              <div className="flex items-center justify-between text-lg font-semibold text-gray-300 hover:text-gray-100 transition-colors">
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
        );

      case 'documentaries':
        return (
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
            onClick={() => window.open('https://www.youtube.com/playlist?list=PLdXIHLhslM0mQnprBRjD3NuIBrvlO-dJ9', '_blank', 'noopener,noreferrer')}>
              <div className="flex items-center justify-between text-lg font-semibold transition-colors">
                <div className="flex items-center gap-2">
                  <Video className="h-7 w-8 text-green-600" />
                  <span className='flex'><p className='text-gray-300'>Nature Documentaries</p></span>
                </div>
                <ExternalLink className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-gray-400 mt-1">Watch curated playist of extraordinary nature documentaries</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer" 
            onClick={() => window.open('https://www.youtube.com/playlist?list=PLeCPQtbuJaPsD-TBP4QqBAHCJttYd4ABw', '_blank', 'noopener,noreferrer')}>
              <div className="flex items-center justify-between text-lg font-semibold transition-colors">
                <div className="flex items-center gap-2">
                  <Video className="h-7 w-8 text-blue-500" />
                  <span className='flex'><p className='text-gray-300'>Best Ocean Documentaries</p></span>
                </div>
                <ExternalLink className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-gray-400 mt-1">Watch the best ocean Documentaries powered by FreeDocumentaryNature</p>
            </div>

          </div>
        );
        case  'games':
        return (
          <div className="space-y-3 max-w-3xl">
            
            <Link className="bg-gray-800 flex rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer" 
              to={'flappy'}>
              <div className="flex items-center justify-between text-lg font-semibold text-gray-300 hover:text-gray-200 transition-colors">
                <div className="flex items-center gap-2">
                <p>Flappy Flix</p>
                </div>
               
              </div>
            </Link>

            <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer" 
              onClick={() => handleGame('https://www.onlinegames.io/games/2022/unity/highway-traffic/index.html')}>
              <div className="flex items-center justify-between text-lg font-semibold text-gray-300 hover:text-gray-200 transition-colors">
                <div className="flex items-center gap-2">
                <p>Highway Traffic (Embed mode)</p>
                </div>
              
              </div>
              <p className="text-gray-400 mt-1">Powered by onlinegames.io</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer" 
              onClick={() => handleGame('https://cloud.onlinegames.io/games/2021/1/jeep-driver/index-og.html')}>
              <div className="flex items-center justify-between text-lg font-semibold text-gray-300 hover:text-gray-200 transition-colors">
                <div className="flex items-center gap-2">
                <p>Jeep driver (Embed mode)</p>
                </div>
              
              </div>
              <p className="text-gray-400 mt-1">Powered by onlinegames.io</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer" 
              onClick={() => handleGame('https://www.onlinegames.io/games/2023/q2/dinosaur-game/index.html')}>
              <div className="flex items-center justify-between text-lg font-semibold text-gray-300 hover:text-gray-200 transition-colors">
                <div className="flex items-center gap-2">
                <p>Dinosaur jump (Embed mode)</p>
                </div>
              
              </div>
              <p className="text-gray-400 mt-1">Powered by onlinegames.io</p>
            </div>
            
            

            <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer" 
              onClick={() => window.open('https://poki.com/', '_blank', 'noopener,noreferrer')}>
              <div className="flex items-center justify-between text-lg font-semibold text-gray-300 hover:text-gray-200 transition-colors">
                <div className="flex items-center gap-2">
                <p>Poki games</p>
                </div>
                <ExternalLink className="h-5 w-5" />
              </div>
              <p className="text-gray-400 mt-1">Free online games at poki - Play Now! 1000+ games. Works on desktop, tablet, and mobile.</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer" 
              onClick={() => window.open('https://www.crazygames.com/', '_blank', 'noopener,noreferrer')}>
              <div className="flex items-center justify-between text-lg font-semibold text-gray-300 hover:text-gray-200 transition-colors">
                <div className="flex items-center gap-2">
                <p>crazygames</p>
                </div>
                <ExternalLink className="h-5 w-5" />
              </div>
              <p className="text-gray-400 mt-1">Free online games. 4000+ browser games across genres like action, puzzle, driving, and .io games. Supports local and online multiplayer.</p>
            </div>

            
            


          </div>
        );

        case  'news':
        return (
          <div className="space-y-3 max-w-3xl">
            
            

            <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer" 
              onClick={() => window.open('https://www.hollywoodreporter.com/c/movies//', '_blank', 'noopener,noreferrer')}>
              <div className="flex items-center justify-between text-lg font-semibold text-gray-300 hover:text-gray-200 transition-colors">
                <div className="flex items-center gap-2">
                <img src='/hollywoodr.png' className='h-14'/>
                </div>
                <ExternalLink className="h-5 w-5" />
              </div>
              <p className="text-gray-400 mt-3">Industry-grade updates, legacy features, and breaking news.</p>
            </div>

           
            <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer" 
              onClick={() => window.open('https://deadline.com/v/film/', '_blank', 'noopener,noreferrer')}>
              <div className="flex items-center justify-between text-lg font-semibold text-gray-300 hover:text-gray-200 transition-colors">
                <div className="flex items-center gap-2">
                <img src='/deadline.png' className='h-8'/>
                </div>
                <ExternalLink className="h-5 w-5" />
              </div>
              <p className="text-gray-400 mt-3">Industry-grade news, perfect for serious cinephiles.</p>
            </div>


            <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer" 
              onClick={() => window.open('https://collider.com/', '_blank', 'noopener,noreferrer')}>
              <div className="flex items-center justify-between text-lg font-semibold text-gray-300 hover:text-gray-200 transition-colors">
                <div className="flex items-center gap-2">
                <img src='/collider.png' className='h-12' />
                </div>
                <ExternalLink className="h-5 w-5" />
              </div>
              <p className="text-gray-400 mt-3">Deep dives into trailers, reviews, interviews, and upcoming releases. Great for cinephiles.</p>
            </div>

            
            <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer" 
              onClick={() => window.open('https://www.indiatoday.in/movies', '_blank', 'noopener,noreferrer')}>
              <div className="flex items-center justify-between text-lg font-semibold text-gray-300 hover:text-gray-200 transition-colors">
                <div className="flex items-center gap-2">
                <img src='/india_today.png' className='h-8'/>
                </div>
                <ExternalLink className="h-5 w-5" />
              </div>
              <p className="text-gray-400 mt-3">Get latest bollywood news from India.</p>
            </div>
            

          </div>
        );

      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900  to-slate-900 text-white">
      {/* Header */}
      

      {/* Main Content with Side Index Bar */}
      <div className="flex min-h-screen lg:h-screen">
        {/* Side Index Bar - Hidden on mobile by default */}
        <div className={`
          fixed lg:static inset-y-0 right-0 z-40 w-72 bg-gray-800 bg-opacity-95 lg:bg-opacity-50 
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          lg:min-h-screen p-4 border-r border-gray-700 lg:overflow-y-auto
        `}>
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-xl font-bold text-white">Sections</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-white hover:bg-gray-700 rounded"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
          
          <h2 className="text-xl font-bold text-white mb-6 text-center hidden lg:block">Sections</h2>
          
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionSelect(section.id)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  activeSection === section.id
                    ? 'bg-gray-700 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                <span className="font-medium">{section.title}</span>
              </button>
            ))}
          </div>
          
          {/* Contact info at bottom of sidebar */}
          <div className="mt-8 p-4 bg-gray-700 bg-opacity-50 rounded-lg">
            <p className='text-sm text-gray-300 mb-2'>Want to give suggestions?</p>
            <div className="space-y-2">
              <a href='https://discord.gg/P3rcqHwp9d' className='block text-blue-400 hover:text-blue-300 text-sm transition-colors' target='_blank'>Discord</a>
              <a href='/contactus' className='block text-blue-400 hover:text-blue-300 text-sm transition-colors' target='_blank'>Contact us</a>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        

        {/* Main Content Area - Scrollable */}
        <div className="flex-1 min-h-screen lg:overflow-y-auto" style={{scrollbarColor: 'rgb(53, 52, 52) transparent'}}>
           
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-1 mx-4 mt-3 text-white hover:bg-gray-700  flex ml-auto rounded-lg transition-colors"
        >
          {sidebarOpen ? <CloseIcon className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

          <div className="px-4 lg:px-16 py-8 mb-10">
            <h1 className="text-2xl lg:text-3xl font-bold pl-2 mb-8">
              Explore {sections.find(s => s.id === activeSection)?.title || 'Fun Page'}
            </h1>
            
            {renderSectionContent()}
          </div>
        </div>
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
     {showGamePlayer && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-5xl">
            <button
              onClick={closeGamePlayer}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="h-8 w-8" />
            </button>

            <button
              onClick={() => {
                const iframe = document.querySelector("#gameIframe");
                if (iframe.requestFullscreen) {
                  iframe.requestFullscreen();
                } else if (iframe.webkitRequestFullscreen) {
                  iframe.webkitRequestFullscreen();
                } else if (iframe.mozRequestFullScreen) {
                  iframe.mozRequestFullScreen();
                } else if (iframe.msRequestFullscreen) {
                  iframe.msRequestFullscreen();
                }
              }}
              className="absolute -top-10 left-0 text-white hover:text-gray-300 transition-colors z-10"
            >
             Full screen ⛶ 
            </button>

            {/* Game Iframe */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                id="gameIframe"
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src={GameLink}
                title="Game Player"
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