import { useState, useEffect } from 'react';
import { ORIGINAL_IMG_BASE_URL } from '../utils/constants';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MusicComPage = () => {
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayCount, setDisplayCount] = useState(() => {
    const stored = sessionStorage.getItem("displayCount");
    return stored ? parseInt(stored, 10) : 16;
  });
  const [loadingMore, setLoadingMore] = useState(false);

  // List of director IDs and names (50 directors)
  const directorsList = [
    { name: "John Williams", id: "491" },
    { name: "Ennio Morricone", id: "1259" },
    { name: "Hans Zimmer", id: "947" },
    { name: "Bernard Herrmann", id: "1045" },
    { name: "Max Steiner", id: "3249" },
    { name: "Erich Wolfgang Korngold", id: "67429" },
    { name: "Nino Rota", id: "3098" },
    { name: "Alan Silvestri", id: "37" },
    { name: "James Horner", id: "1729" },
    { name: "Howard Shore", id: "117" },
    { name: "Alex North", id: "10536" },
    { name: "Miklós Rózsa", id: "7647" },
    { name: "Thomas Newman", id: "153" },
    { name: "Danny Elfman", id: "531" },
    { name: "Michael Giacchino", id: "15347" },
    { name: "Dimitri Tiomkin", id: "4082" },
    { name: "Elmer Bernstein", id: "7182" },
    { name: "Rachel Portman", id: "3562" },
    { name: "Clint Mansell", id: "6377" },
    { name: "Ludwig Göransson", id: "928158" },
    { name: "Ravi Shankar", id: "13745" },
    { name: "Ilaiyaraaja", id: "76888" },
    { name: "K. V. Mahadevan", id: "584606" },
    { name: "Rahul Dev Burman", id: "88141" },
    { name: "A.R. Rahman", id: "5288" },
    { name: "M.M. Keeravaani", id: "225318" }
    
  ];

  // Fetch directors in batches for better performance
  const fetchDirectorsBatch = async (startIndex, endIndex) => {
    const batch = directorsList.slice(startIndex, endIndex);
    const directorPromises = batch.map(async (director) => {
      try {
        const response = await axios.get(`/api/v1/search/person/${director.id}`);
        const data = response.data.content;
        return {
          ...director,
          profile_path: data.profile_path,
          fullData: data
        };
      } catch (error) {
        console.error(`Error fetching ${director.name}:`, error);
        return {
          ...director,
          profile_path: null,
          error: true
        };
      }
    });

    return Promise.all(directorPromises);
  };

  const fetchDirectors = async () => {
    try {
      setLoading(true);
      
      // First, fetch the initial batch to display immediately
      const initialBatch = await fetchDirectorsBatch(0, displayCount);
      setDirectors(initialBatch);
      setLoading(false);

      // Then fetch the remaining directors in the background
      if (displayCount < directorsList.length) {
        const remainingBatch = await fetchDirectorsBatch(displayCount, directorsList.length);
        setDirectors(prev => [...prev, ...remainingBatch]);
      }
    } catch (error) {
      setError('Failed to fetch directors');
      console.error('Error fetching directors:', error);
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    
    const newDisplayCount = Math.min(displayCount + 16, directorsList.length);
    
    // If we don't have the directors data yet, fetch them
    if (directors.length < newDisplayCount) {
      try {
        const additionalBatch = await fetchDirectorsBatch(
          directors.length, 
          newDisplayCount
        );
        setDirectors(prev => [...prev, ...additionalBatch]);
      } catch (error) {
        console.error('Error loading more directors:', error);
      }
    }
    
    setDisplayCount(newDisplayCount);
    // Fix: Save the NEW display count to sessionStorage
    sessionStorage.setItem("displayCount", newDisplayCount.toString());
    setLoadingMore(false);
  };


  useEffect(() => {
    fetchDirectors();
  }, []);

  // Save displayCount to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("displayCount", displayCount.toString());
  }, [displayCount]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800 py-8">
        <div className="max-w-lg md:max-w-3xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-300 mb-8 text-center">Top Music Composers</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: displayCount }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-900 rounded-lg aspect-[3/4] mb-3"></div>
                <div className="bg-gray-900 h-4 rounded mb-2"></div>
                <div className="bg-gray-900 h-3 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-700 py-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-300 mb-4">Top Music Composers</h1>
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 py-8">
      <div className="max-w-lg md:max-w-3xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-300 mb-10 text-center">Top Music Composers</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {directors?.slice(0, displayCount).map((director) => (
            <Link
              to = {`/person/details/?id=${director.id}&name=${encodeURIComponent(director.name)}`}
              key={director.id}
              className="bg-gray-900 rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
            >
              <div className=" bg-gray-700 relative overflow-hidden">
                {director.profile_path ? (
                  <img
                    src={`${ORIGINAL_IMG_BASE_URL}${director.profile_path}`}
                    alt={director.name}
                    className="w-64 h-80 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                
                {/* Fallback for missing images */}
                <div 
                  className="absolute inset-0 bg-gray-700 flex items-center justify-center text-gray-600"
                  style={{ display: director.profile_path ? 'none' : 'flex' }}
                >
                  <span className="text-sm text-center px-2">No Image</span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-400 text-sm text-center leading-tight">
                  {director.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        {displayCount < directorsList.length && (
          <div className="text-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Loading More...</span>
                </div>
              ) : (
                `Load More (${directorsList.length - displayCount} remaining)`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicComPage;