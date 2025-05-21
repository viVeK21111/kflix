import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from "react-hot-toast";
import { 
  Search, Eye, Film, Tv, Clock, List, MessageSquare, Settings,User,Info, Loader,ChevronDown, ChevronRight, Moon, 
  Sun,ArrowLeft,UserCheck
} from 'lucide-react';
import { ORIGINAL_IMG_BASE_URL } from "../utils/constants";
import { useLocation, Link } from 'react-router-dom';

export default function UserMonitor() {
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
   const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || [];

   const isAdmin = () => {
    return adminEmails.includes(email);
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const emailParam = queryParams.get('email');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (emailParam) {
      fetchUserData(emailParam);
      setEmail(emailParam);
    }
  }, [emailParam]);

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

  const handleDelete = async() =>{
    try {
        const response = await axios.delete('/api/v1/auth/deleteUserMail', {
        data: { email: email }
        });
    if (response.data.success) {
        toast.success("Account deleted");
        setTimeout(() => {
            window.location.reload();
        }, 500);
      } 
    }
    
    catch (error) {
        toast.error("something went wrong "+error.message);
    }
    
  }
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const fetchUserData = async (email) => {
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
    return date.toLocaleString('en-GB');
  };

  // Section card with consistent styling
  const SectionCard = ({ title, icon, children, count, isExpanded, toggleFn }) => {
    const Icon = icon;
    return (
      <div className={`border rounded-lg shadow-sm overflow-hidden transition-colors duration-200 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div 
          className={`flex items-center justify-between p-4 cursor-pointer transition-colors duration-200 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`} 
          onClick={toggleFn}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-blue-100'}`}>
              <Icon className={`h-5 w-5 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
            </div>
            <h2 className="text-lg font-semibold">{title} {count !== undefined && <span className={`ml-2 px-2 py-0.5 text-sm rounded-full ${darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 text-gray-700'}`}>{count}</span>}</h2>
          </div>
          <div className={`p-1 rounded-full transition-colors duration-200 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}>
            {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </div>
        </div>
        <div className={`transition-all duration-300 ${isExpanded ? 'max-h-full' : 'max-h-0 overflow-hidden'}`}>
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      {/* Header */}
      <header className={`transition-colors duration-200 p-4 ${darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'} sticky top-0 z-10 shadow-sm`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/profile/admin" className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Admin Panel</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors duration-200 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 pt-6">
        {/* Status and info bar */}
        <div className={`mb-6 p-4 rounded-lg shadow-sm transition-colors duration-200 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${darkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                <User className={`h-5 w-5 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
              </div>
              <div>
                <h1 className="text-xl font-bold">User Monitoring</h1>
                <p className={`text-sm transition-colors duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {userData ? `Viewing details for ${userData.username} (${userData.email})` : 'Enter an email to view user details'}
                </p>
              </div>
            </div>
            {loading && (
              <div className="flex items-center gap-2">
                <Loader className="animate-spin h-5 w-5 text-blue-500" />
                <span className="text-sm">Loading data...</span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {userData && (
          <div className="space-y-6">
            {/* Basic User Info */}
            <SectionCard 
              title="User Information" 
              icon={isAdmin() ? UserCheck : User} 
              isExpanded={true} 
              toggleFn={() => {}}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-4 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className="text-md font-medium mb-3">Account Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium transition-colors duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>User ID:</span>
                      <span className={`transition-colors duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-700'} font-mono text-sm px-2 py-1 rounded`}>{userData._id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium transition-colors duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Username:</span>
                      <span className={`transition-colors duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{userData.username}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium transition-colors duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Email:</span>
                      <span className={`transition-colors duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{userData.email}</span>
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className="text-md font-medium mb-3">Profile</h3>
                 
                   
                  <div className="flex items-center gap-4">
                    {userData.image ? (
                      <img 
                        src={userData.image} 
                        alt="Profile" 
                        className="h-16 w-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                        onError={(e) => {
                          e.target.onerror = null;
                        }}
                      />
                    ) : (
                      <div className={`h-16 w-16 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                        <User className="h-8 w-8 text-gray-500" />
                      </div>
                    )}
                   
                  </div>
                   {userData.created && (
                    <p className={`text-xs mt-2 transition-colors duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-600'} flex items-center gap-1`}>
                            <b>Created:</b> <p> {formatDate(userData.created)}</p>
                           
                    </p>
                  )}
                </div>
              </div>
            </SectionCard>
            
            {/* Watch History */}
            <SectionCard 
              title="Watch History" 
              icon={Clock} 
              count={userData.watchHistory?.length || 0}
              isExpanded={expandedSections.watchHistory}
              toggleFn={() => toggleSection('watchHistory')}
            >
              {userData.watchHistory?.length > 0 ? (
                <div className="space-y-4">
                  {userData.watchHistory.map((item, index) => (
                    <div key={index} className={`border rounded-md p-3 transition-colors duration-200 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                      <div className="flex items-start gap-3">
                        <img
                          src={`${ORIGINAL_IMG_BASE_URL}${item?.image}`}
                          alt={item.name || item.title}
                          className="w-16 h-24 object-cover rounded shadow-sm"
                          onError={(e) => {
                            e.target.onerror = null;
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm rounded-full px-2 py-0.5 ${darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'}`}>
                              {item.type === 'movie' ? (
                                <span className="flex items-center gap-1">
                                  <Film className="h-3 w-3" />
                                  Movie
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <Tv className="h-3 w-3" />
                                  TV Show
                                </span>
                              )}
                            </span>
                          </div>
                          <h3 className="font-medium mt-1 text-lg">{item.name || item.title}</h3>
                          {item.type === 'tv' && (
                            <p className={`text-sm transition-colors duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              S{item.season}.E{item.episode} - {item.title}
                            </p>
                          )}
                          <p className={`text-xs mt-2 transition-colors duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center gap-1`}>
                            <Clock className="h-3 w-3" />
                            {formatDate(item.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`p-6 text-center transition-colors duration-200 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                  <p className={`transition-colors duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No watch history found
                  </p>
                </div>
              )}
            </SectionCard>
            
            {/* Watch List */}
            <SectionCard 
              title="Watch List" 
              icon={List} 
              count={userData.watchList?.length || 0}
              isExpanded={expandedSections.watchList}
              toggleFn={() => toggleSection('watchList')}
            >
              {userData.watchList?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {userData.watchList.map((item, index) => (
                    <div key={index} className={`border rounded-md overflow-hidden shadow-sm transition-colors duration-200 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                      <div className="flex flex-col">
                        <img
                          src={`${ORIGINAL_IMG_BASE_URL}${item?.image}`}
                          alt={item.title}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                          }}
                        />
                        <div className="p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs rounded-full px-2 py-0.5 ${darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'}`}>
                              {item.type === 'movie' ? (
                                <span className="flex items-center gap-1">
                                  <Film className="h-3 w-3" />
                                  Movie
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <Tv className="h-3 w-3" />
                                  TV Show
                                </span>
                              )}
                            </span>
                          </div>
                          <p className={`text-sm font-semibold transition-colors duration-200 ${darkMode ? 'text-white' : 'text-black'}`}>
                            {item.title || item.name}
                          </p>
                          
                          {item.season && (
                            <div className={`text-sm mt-1 transition-colors duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              <span className='flex'>
                                S{item.season}.E{item.episode} - 
                                <span className="font-medium ml-1">{item.title}</span>
                              </span>
                            </div>
                          )}
                          
                          <p className={`text-xs mt-2 transition-colors duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            ID: {item.id}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`p-6 text-center transition-colors duration-200 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                  <p className={`transition-colors duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No items in watch list
                  </p>
                </div>
              )}
            </SectionCard>
            
            {/* Search History */}
            <SectionCard 
              title="Search History" 
              icon={Search} 
              count={userData.searchHistory?.length || 0}
              isExpanded={expandedSections.searchHistory}
              toggleFn={() => toggleSection('searchHistory')}
            >
              {userData.searchHistory?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {userData.searchHistory.map((item, index) => (
                    <div key={index} className={`border rounded-md overflow-hidden shadow-sm transition-colors duration-200 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                      <div className="flex flex-col">
                        <img
                          src={`${ORIGINAL_IMG_BASE_URL}${item?.image}`}
                          alt={item.title}
                          className="w-full h-40 object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                          }}
                        />
                        <div className="p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs rounded-full px-2 py-0.5 ${darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'}`}>
                              {item.type === 'movie' ? (
                                <span className="flex items-center gap-1">
                                  <Film className="h-3 w-3" />
                                  Movie
                                </span>
                              ) : (
                                item.type === 'tv' ? (
                                     <span className="flex items-center gap-1">
                                  <Tv className="h-3 w-3" />
                                  TV Show
                                </span>
                                ) : (
                                    <span className="flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        Person
                                    </span>
                                )
                                )}
                            </span>
                          </div>
                          <p className={`text-sm font-semibold transition-colors duration-200 ${darkMode ? 'text-white' : 'text-black'} line-clamp-1`}>
                            {item.title || item.name}
                          </p>
                          <p className={`text-xs mt-2 transition-colors duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            ID: {item.id}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`p-6 text-center transition-colors duration-200 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                  <p className={`transition-colors duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No search history found
                  </p>
                </div>
              )}
            </SectionCard>
            
            {/* Chat History */}
            <SectionCard 
              title="Chat History" 
              icon={MessageSquare} 
              count={userData.chatHistory?.length || 0}
              isExpanded={expandedSections.chatHistory}
              toggleFn={() => toggleSection('chatHistory')}
            >
              {userData.chatHistory?.length > 0 ? (
                <div className="space-y-4">
                  {userData.chatHistory.map((chat, index) => (
                    <div key={index} className={`border rounded-md p-4 transition-colors duration-200 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs rounded-full px-2 py-0.5 ${darkMode ? 'bg-purple-900 text-purple-100' : 'bg-purple-100 text-purple-800'}`}>
                            Query
                          </span>
                        </div>
                        <p className={`text-sm font-medium transition-colors duration-200 ${darkMode ? 'text-white' : 'text-black'}`}>
                          {chat.query}
                        </p>
                      </div>
                      
                      {chat.response && (
                        <div className="mt-3 border-t pt-3 border-gray-200 dark:border-gray-600">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs rounded-full px-2 py-0.5 ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>
                              Response
                            </span>
                          </div>
                          <p className={`text-sm transition-colors duration-200 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {chat.response.length > 150 ? 
                              <>
                                {chat.response.substring(0, 150)}
                                <span className="text-blue-500 cursor-pointer hover:underline ml-1">... show more</span>
                              </> : 
                              chat.response
                            }
                          </p>
                        </div>
                      )}
                      
                      {chat.date && (
                        <div className="mt-3 flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <p className={`text-xs transition-colors duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formatDate(chat.date)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`p-6 text-center transition-colors duration-200 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                  <p className={`transition-colors duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No chat history found
                  </p>
                </div>
              )}
            </SectionCard>
            {!isAdmin() && (
              <button onClick={handleDelete} className="mb-5 mt-5 md:mt-0 rounded-md text-white bg-red-600 hover:bg-red-700 p-2">
                            Delete Account
            </button>
            )}
            
          </div>
          
        )}
      </div>
      
     
    </div>
  );
}