import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, ArrowLeft, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdultPage = () => {
  const [adultPreference, setAdultPreference] = useState(false);
  const [showAdultWarning, setShowAdultWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check adult preference on component mount
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    const checkAdultPreference = async () => {
      try {
        const pref = await axios.get('/api/v1/user/getadultPreference');
        const datapref = pref.data.pref;
        setAdultPreference(datapref);
        
        if (!datapref) {
          setShowAdultWarning(true);
         // toast.error('Adult content preference is disabled. Please enable it in your profile settings.');
        }
      } catch (error) {
        console.error('Error fetching adult preference:', error);
        setShowAdultWarning(true);
      } finally {
        setIsLoading(false);
      }
    };
    checkAdultPreference();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Checking preferences...</p>
        </div>
      </div>
    );
  }

  if (!adultPreference) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-slate-900 text-white flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-400" />
            <h3 className="text-xl font-semibold text-white">Content Disabled</h3>
          </div>
          <p className="text-gray-300 mb-6">
            This content preference is currently disabled. To access NSFW content, please enable adult content in your profile settings.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/fun')}
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
            >
              Back to Fun
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-slate-900 text-white">
      {/* Header */}
      <header className="flex w-full items-center py-1 bg-black bg-opacity-10 pl-1">
        <Link to={'/'} className='mr-auto'>
          <img src={'/kflix3.png'} alt='Kflix Logo' className='w-30 sm:w-32 h-12 sm:h-14' />
        </Link>
        <Link to={'/fun'} className="flex items-center gap-2 mr-2 text-gray-300 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Fun</span>
        </Link>
      </header>

      {/* Main Content */}
      <div className="px-4 py-8">
        <h1 className="text-3xl mx-auto font-bold text-center mb-8">NSFW Content</h1>
        
        {/* Warning Note */}
        <div className="max-w-6xl mb-6">
          <div className="bg-red-900 bg-opacity-10 border border-gray-700 rounded-lg p-2">
            <div className="flex items-start gap-3">
              <div>
                <p className="text-red-400 text-sm font-base mb-1">CONTENT WARNING</p>
                <p className="text-gray-300 text-sm">
                  This content is strictly for adults only. Parental guidance is required. 
                  By accessing these links, you confirm that you are of legal age and consent to view adult content.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3 max-w-3xl">
          {/* Placeholder for future NSFW links */}
          <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
               onClick={() => window.open('http://bit.ly/45DBahm', '_blank', 'noopener,noreferrer')}>
            <div className="flex items-center justify-between text-lg font-semibold text-red-400 hover:text-red-300 transition-colors">
              <div className="flex items-center gap-3">
                <span>Chaturbate</span>
              </div>
              <ExternalLink className="h-5 w-5" />
            </div>
            <p className="text-gray-400 mt-2">Have fun</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
               onClick={() => window.open('https://bongacams11.com/track?c=825797', '_blank', 'noopener,noreferrer')}>
            <div className="flex items-center justify-between text-lg font-semibold text-red-400 hover:text-red-300 transition-colors">
              <div className="flex items-center gap-3">
                <span>Bonga cams</span>
              </div>
              <ExternalLink className="h-5 w-5" />
            </div>
            <p className="text-gray-400 mt-2">Relax</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
               onClick={() => window.open('https://cam4.com', '_blank', 'noopener,noreferrer')}>
            <div className="flex items-center justify-between text-lg font-semibold text-red-400 hover:text-red-300 transition-colors">
              <div className="flex items-center gap-3">
                <span>Cam4</span>
              </div>
              <ExternalLink className="h-5 w-5" />
            </div>
            <p className="text-gray-400 mt-2">Unlax</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
               onClick={() => window.open('https://www.livejasmin.com/', '_blank', 'noopener,noreferrer')}>
            <div className="flex items-center justify-between text-lg font-semibold text-red-400 hover:text-red-300 transition-colors">
              <div className="flex items-center gap-3">
                <span>LiveJasmin</span>
              </div>
              <ExternalLink className="h-5 w-5" />
            </div>
            <p className="text-gray-400 mt-2">jasmin</p>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default AdultPage; 