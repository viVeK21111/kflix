import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Eye, Film, Tv, Clock, List, MessageSquare, Settings, Loader, House, ChevronRight, ChevronLeft,UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Monitor = () => {
  const [email, setEmail] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
 
  // For user listing and pagination
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  
  const usersPerPage = 15;

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

  // Get current users for pagination
  const getCurrentUsers = () => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    return users.slice(indexOfFirstUser, indexOfLastUser);
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className={`flex w-full items-center bg-black bg-opacity-5 `}>
                 <Link to={'/'} className='flex items-center ml-1'>
              <img src={'/pic4.png'} alt='kflix logo' className='w-30 sm:w-32 h-8 sm:h-10' />
            </Link>
                    <div className='ml-auto flex items-center p-2 '>
                      <Link className='hover:bg-black hover:bg-opacity-5 p-2 text-base rounded-lg' to={'/profile'}> <p className='flex items-center text-black pl-1'><UserCheck className='h-5 w-4 sm:h-5 sm:w-5 mr-1 hover:scale-105 transition-transform'/><p className='font-semibold'>Profile</p></p></Link>

                         
                      <Link className='hover:bg-black hover:bg-opacity-5 p-2 text-base rounded-lg'  to={'/'}> <p className='flex items-center text-black '><House className='h-5 w-4 sm:h-5 sm:w-5 mr-1 hover:scale-105 transition-transform'/><p className='font-semibold '>Home</p></p></Link>
                    </div>
                  
                </header>
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">Admin Monitoring Dashboard</h1>
          
          {/* User Search */}
          <div className="mb-8">
            <div className="flex gap-2 mb-4">
              <input
                type="email"
                placeholder="Enter user email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Link to={email.length > 0 ? `/profile/admin/user?email=${email}` : ``} className='ml-auto'>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? <Loader className="animate-spin h-4 w-4" /> : <Search className="h-4 w-4" />}
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </Link>
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
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
                <div className="border rounded-lg overflow-auto">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {getCurrentUsers().length > 0 ? (
                        getCurrentUsers().map((user, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className='font-semibold'>{user.username}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">{user.email}</td>
                            <td className="py-3 px-4 whitespace-nowrap text-center">
                              <Link
                                to={`user/?email=${user.email}`}
                                className="text-blue-600 hover:text-blue-900 flex items-center justify-center gap-1"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="py-4 text-center text-gray-500">
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
                    <div className="text-sm text-gray-500">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-md flex items-center gap-1 ${
                          currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Prev
                      </button>
                      <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-md flex items-center gap-1 ${
                          currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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