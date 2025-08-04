import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Eye, Film, Tv, Clock, List, MessageSquare, Settings, Loader, House, ChevronRight, ChevronLeft, UserCheck, User, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Monitor = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // For user listing and pagination
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  // Theme state
  const [darkMode, setDarkMode] = useState(false);
  
  const usersPerPage = 15;

  // Initialize theme from localStorage when component mounts
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) {
      setDarkMode(savedTheme === "true");
    } else {
      // Check for system preference if no saved theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Apply theme whenever darkMode changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  // Initialize currentPage from sessionStorage when component mounts
  useEffect(() => {
    const savedPage = sessionStorage.getItem("currentPage");
    if (savedPage) {
      const parsedPage = parseInt(savedPage);
      setCurrentPage(parsedPage);
    }
  }, []);

  // Update sessionStorage whenever currentPage changes
  useEffect(() => {
    sessionStorage.setItem("currentPage", currentPage.toString());
  }, [currentPage]);

  // Update pagination when search changes
    useEffect(() => {
      if(email.length>0) {
        const filteredUsers = getFilteredUsers();
      const calculatedTotalPages = Math.ceil(filteredUsers.length / usersPerPage);
      setTotalPages(calculatedTotalPages);
      
      // Reset to first page when search changes
      if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
        setCurrentPage(1);
      } else if (calculatedTotalPages === 0) {
        setCurrentPage(1);
      }
      else {
        if (sessionStorage.getItem("currentPage")) {
           setCurrentPage(parseInt(sessionStorage.getItem("currentPage")));
        }
      }
      }
      else {
        
        setTotalPages(Math.ceil((users.length / usersPerPage)));
      }
      
    }, [email, users]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setUsersLoading(true);
        const response = await axios.get('/api/v1/auth/admin/users');
        if (response.data.success) {
          setUsers(response.data.users);
          
          const calculatedTotalPages = Math.ceil(response.data.users.length / usersPerPage);
          setTotalPages(calculatedTotalPages);
          
          // Ensure currentPage is valid based on totalPages
          const savedPage = parseInt(sessionStorage.getItem("currentPage")) || 1;
          if (savedPage > calculatedTotalPages) {
            setCurrentPage(calculatedTotalPages || 1);
          }
        } else {
          setError(response.data.message || 'Failed to fetch users');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setUsersLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  // Pagination functions
  const nextPage = () => {
    if (currentPage < totalPages) {
      window.scrollTo(0, 0);
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  // Theme toggle function
  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  const getFilteredUsers = () => {
    if (!email.trim()) {
      return users;
    }
    return users.filter(user => 
      user.email.toLowerCase().includes(email.toLowerCase()) ||
      user.username.toLowerCase().includes(email.toLowerCase())
    );
  };

  // Get current users for pagination
  const getCurrentUsers = () => {
    const filteredUsers = getFilteredUsers();
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    if(email.length>0) {
      return filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    }
    else {
      return users.slice(indexOfFirstUser, indexOfLastUser);
    }
  };
  
  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || [];

  const isAdmin = (email) => {
    return adminEmails.includes(email);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (email.length > 0 && email.includes("@") && email.includes(".com")) {
      navigate(`/profile/admin/user?email=${email}`);
    }
    else {
      toast.error("Invalid email");
    }
  }
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} transition-colors duration-200`}>
      <header className={`flex w-full items-center ${darkMode ? 'bg-gray-800 bg-opacity-90' : 'bg-black bg-opacity-5'} transition-colors duration-200`}>
        <Link to={'/'} className='flex items-center ml-1'>
          <img src={darkMode ? `/kflix3.png` :`/pic4.png`} alt='kflix logo' className={ darkMode ?`w-30 sm:w-32 h-8 sm:h-14` : `w-30 sm:w-32 h-8 sm:h-10`} />
        </Link>
        <div className='ml-auto flex items-center p-2'>
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full mr-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors duration-200`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-white-300" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
          </button>
          
          <Link className={`hover:${darkMode ? 'bg-gray-700' : 'bg-black hover:bg-opacity-10'} p-2 text-base rounded-lg transition-colors duration-200`} to={'/profile'}>
            <p className={`flex items-center ${darkMode ? 'text-white' : 'text-black'}`}>
              <UserCheck className='h-5 w-4 sm:h-5 sm:w-5 mr-1 hover:scale-105 transition-transform'/>
              <p className='font-semibold'>Profile</p>
            </p>
          </Link>

          <Link className={`hover:${darkMode ? 'bg-gray-700' : 'bg-black hover:bg-opacity-10'} p-2 text-base rounded-lg transition-colors duration-200`} to={'/'}>
            <p className={`flex items-center ${darkMode ? 'text-white' : 'text-black'}`}>
              <House className='h-5 w-4 sm:h-5 sm:w-5 mr-1 hover:scale-105 transition-transform'/>
              <p className='font-semibold'>Home</p>
            </p>
          </Link>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto p-4">
        <div className={`${darkMode ? 'bg-gray-800 shadow-dark' : 'bg-white shadow-lg'} rounded-lg p-6 mb-6 transition-colors duration-200`}>
          <h1 className="text-2xl font-bold mb-6">Admin Monitoring Dashboard</h1>
          
          {/* User Search */}
          <div className="mb-8">
            <div className="flex gap-2 mb-4">
              <input 
                type="email"
                placeholder="Enter user email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`flex-1 w-16 md:w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-black'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
              />
              <button
                className="bg-blue-600 text-white px-2 sm:px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 transition-colors duration-200"
                onClick={(e) => onSubmit(e)}
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>
            
            {error && (
              <div className={`${darkMode ? 'bg-red-900 border-red-800 text-red-200' : 'bg-red-100 border-red-400 text-red-700'} border px-4 py-3 rounded mb-4 transition-colors duration-200`}>
                {error}
              </div>
            )}
          </div>
          
          {/* User Listing */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">All Users ({users.length})</h2>
            
            {usersLoading ? (
              <div className="flex justify-center py-8">
                <Loader className="animate-spin h-8 w-8 text-blue-600" />
              </div>
            ) : (
              <>
                <div className={`border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg overflow-auto transition-colors duration-200`}>
                  <table className={`min-w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-colors duration-200`}>
                    <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors duration-200`}>
                      <tr>
                        <th className={`py-3 px-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider transition-colors duration-200`}>Username</th>
                        <th className={`py-3 px-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider transition-colors duration-200`}>Email</th>
                        <th className={`py-3 px-4 text-center text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider transition-colors duration-200`}>Action</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} transition-colors duration-200`}>
                      {getCurrentUsers().length > 0 ? (
                        getCurrentUsers().map((user, index) => (
                          <tr key={index} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-200`}>
                            <td className="py-3 px-4 flex whitespace-nowrap">
                              {isAdmin(user.email) && (
                                <UserCheck className={`${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'} p-1 h-7 w-8 rounded-xl transition-colors duration-200`} />
                              )}
                              {!isAdmin(user.email) &&
                                <User className={`${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'} h-7 w-8 p-1 rounded-xl transition-colors duration-200`}/>
                              }
                              <div className="flex items-center ml-2">
                                <span className='font-semibold'>{user.username}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">{user.email}</td>
                            <td className="py-3 px-4 whitespace-nowrap text-center">
                              <Link
                                to={`user/?email=${user.email}`}
                                className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'} flex items-center justify-center gap-1 transition-colors duration-200`}
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className={`py-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-4">
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-md flex items-center gap-1 transition-colors duration-200 ${
                          currentPage === 1
                            ? darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Prev
                      </button>
                      <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-md flex items-center gap-1 transition-colors duration-200 ${
                          currentPage === totalPages
                            ? darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitor;