import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Eye, Film, Tv, Clock, List, MessageSquare, Settings, Loader, ChevronDown, ChevronRight, Moon, Sun } from 'lucide-react';
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";

export default function Monitor() {
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    watchHistory: false,
    watchList: false,
    searchHistory: false,
    chatHistory: false
  });

  // Effect to initialize dark mode from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setDarkMode(true);
    }
  }, []);

  // Effect to apply dark mode classes to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference to localStorage
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const fetchUserData = async () => {
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.post(`/api/v1/auth/admin/mail`, { email: email });
      if (response.data.success) {
        setUserData(response.data.user);
      } else {
        setError(response.data.message || 'Failed to fetch user data');
        setUserData(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Account not found');
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className={`min-h-screen p-4 transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <div className="max-w-7xl mx-auto">
        <div className={`rounded-lg shadow-lg p-6 mb-6 transition-colors duration-200 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Admin Monitoring Dashboard</h1>
            
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors duration-200 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
          
          <div className="flex gap-2 mb-6">
            <input
              type="email"
              placeholder="Enter user email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
            />
            <button
              onClick={fetchUserData}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? <Loader className="animate-spin h-4 w-4" /> : <Search className="h-4 w-4" />}
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {userData && (
            <div className="space-y-6">
              {/* Basic User Info */}
              <div className={`p-4 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h2 className="text-xl font-semibold mb-4">User Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">User ID:</span>
                    <span className={`transition-colors duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{userData._id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Username:</span>
                    <span className={`transition-colors duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{userData.username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Email:</span>
                    <span className={`transition-colors duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{userData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Profile Image:</span>
                   
                    {userData.image && (
                      <img 
                        src={userData.image} 
                        alt="Profile" 
                        className="h-8 w-8 rounded-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
              
              {/* User Preferences */}
              <div className={`p-4 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">User Preferences</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Adult Content:</span>
                    <span className={`px-2 py-1 rounded ${userData.Preferences?.adult ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {userData.Preferences?.adult ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Watch History */}
              <div className={`p-4 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <h2 className="text-xl font-semibold">Watch History ({userData.watchHistory?.length || 0})</h2>
                  </div>
                  <button 
                    onClick={() => toggleSection('watchHistory')}
                    className={`p-1 rounded-full transition-colors duration-200 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  >
                    {expandedSections.watchHistory ? 
                      <ChevronDown className="h-5 w-5" /> : 
                      <ChevronRight className="h-5 w-5" />
                    }
                  </button>
                </div>
                
                {expandedSections.watchHistory && userData.watchHistory?.length > 0 ? (
                  <div className="space-y-4">
                    {userData.watchHistory.map((item, index) => (
                      <div key={index} className={`border rounded-md p-3 transition-colors duration-200 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-start gap-3">
                          <img
                            src={`${ORIGINAL_IMG_BASE_URL}${item?.image}`}
                            alt={item.name || item.title}
                            className="w-16 h-24 object-cover rounded"
                            onError={(e) => {
                              e.target.onerror = null;
                            }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {item.type === 'movie' ? <Film className="h-4 w-4" /> : <Tv className="h-4 w-4" />}
                              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                {item.type}
                              </span>
                            </div>
                            <h3 className="font-medium mt-1">{item.name || item.title}</h3>
                            {item.type === 'tv' && (
                              <p className={`text-sm transition-colors duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Season {item.season}, Episode {item.episode} - {item.title}
                              </p>
                            )}
                            <p className={`text-xs mt-1 transition-colors duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              Watched on: {formatDate(item.date)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`transition-colors duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {expandedSections.watchHistory 
                      ? "No watch history found" 
                      : "Click the arrow to view watch history"}
                  </p>
                )}
              </div>
              
              {/* Watch List */}
              <div className={`p-4 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <List className="h-5 w-5" />
                    <h2 className="text-xl font-semibold">Watch List ({userData.watchList?.length || 0})</h2>
                  </div>
                  <button 
                    onClick={() => toggleSection('watchList')}
                    className={`p-1 rounded-full transition-colors duration-200 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  >
                    {expandedSections.watchList ? 
                      <ChevronDown className="h-5 w-5" /> : 
                      <ChevronRight className="h-5 w-5" />
                    }
                  </button>
                </div>
                
                {expandedSections.watchList && userData.watchList?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {userData.watchList.map((item, index) => (
                      <div key={index} className={`border rounded-md p-3 transition-colors duration-200 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
                        <div className="flex flex-col items-center">
                          <img
                            src={`${ORIGINAL_IMG_BASE_URL}${item?.image}`}
                            alt={item.title}
                            className="w-32 h-48 object-cover rounded mb-2"
                            onError={(e) => {
                              e.target.onerror = null;
                            }}
                          />
                          <div className="flex items-center gap-2 mt-1">
                            {item.type === 'movie' ? <Film className="h-4 w-4" /> : <Tv className="h-4 w-4" />}
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              {item.type}
                            </span>
                          </div>
                          <p className={`text-sm font-semibold mt-1 transition-colors duration-200 ${darkMode ? 'text-white' : 'text-black'}`}>
                            {item.title || item.name}
                          </p>
                          
                          {item.season && (
                            <div className={`text-sm transition-colors duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              <span className='flex'>
                                S{item.season}.E{item.episode} - 
                                <h4 className="font-medium text-center ml-1">{item.title}</h4>
                              </span>
                            </div>
                          )}
                          
                          <p className={`text-xs mt-1 transition-colors duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            ID: {item.id}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`transition-colors duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {expandedSections.watchList 
                      ? "No items in watch list" 
                      : "Click the arrow to view watch list"}
                  </p>
                )}
              </div>
              
              {/* Search History */}
              <div className={`p-4 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    <h2 className="text-xl font-semibold">Search History ({userData.searchHistory?.length || 0})</h2>
                  </div>
                  <button 
                    onClick={() => toggleSection('searchHistory')}
                    className={`p-1 rounded-full transition-colors duration-200 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  >
                    {expandedSections.searchHistory ? 
                      <ChevronDown className="h-5 w-5" /> : 
                      <ChevronRight className="h-5 w-5" />
                    }
                  </button>
                </div>
                
                {expandedSections.searchHistory && userData.searchHistory?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userData.searchHistory.map((item, index) => (
                      <div key={index} className={`border rounded-md p-3 transition-colors duration-200 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
                        <div className="flex flex-col items-center">
                          <img
                            src={`${ORIGINAL_IMG_BASE_URL}${item?.image}`}
                            alt={item.title}
                            className="w-32 h-48 object-cover rounded mb-2"
                            onError={(e) => {
                              e.target.onerror = null;
                            }}
                          />
                          <div className="flex items-center gap-2 mt-1">
                            {item.type === 'movie' ? <Film className="h-4 w-4" /> : <Tv className="h-4 w-4" />}
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              {item.type}
                            </span>
                          </div>
                          
                          <p className={`text-sm font-semibold mt-1 transition-colors duration-200 ${darkMode ? 'text-white' : 'text-black'}`}>
                            {item.title || item.name}
                          </p>
                          
                          <p className={`text-xs mt-1 transition-colors duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            ID: {item.id}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`transition-colors duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {expandedSections.searchHistory 
                      ? "No search history found" 
                      : "Click the arrow to view search history"}
                  </p>
                )}
              </div>
              
              {/* Chat History */}
              <div className={`p-4 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    <h2 className="text-xl font-semibold">Chat History ({userData.chatHistory?.length || 0})</h2>
                  </div>
                  <button 
                    onClick={() => toggleSection('chatHistory')}
                    className={`p-1 rounded-full transition-colors duration-200 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  >
                    {expandedSections.chatHistory ? 
                      <ChevronDown className="h-5 w-5" /> : 
                      <ChevronRight className="h-5 w-5" />
                    }
                  </button>
                </div>
                
                {expandedSections.chatHistory && userData.chatHistory?.length > 0 ? (
                  <div className="space-y-4">
                    {userData.chatHistory.map((chat, index) => (
                      <div key={index} className={`border rounded-md p-3 transition-colors duration-200 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                            Query
                          </span>
                          <span className="text-sm font-medium">{chat.query}</span>
                        </div>
                        {chat.response && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                                Response
                              </span>
                            </div>
                            <p className={`text-sm line-clamp-3 transition-colors duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {chat.response.substring(0, 150)}
                              {chat.response.length > 150 ? '...' : ''}
                            </p>
                          </div>
                        )}
                        {chat.date && (
                          <p className={`text-xs mt-2 transition-colors duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatDate(chat.date)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`transition-colors duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {expandedSections.chatHistory 
                      ? "No chat history found" 
                      : "Click the arrow to view chat history"}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}