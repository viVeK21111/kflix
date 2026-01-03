import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader, ChevronLeft, ChevronRight } from "lucide-react";  
import { useNavigate } from "react-router-dom";
import { SMALL_IMG_BASE_URL } from "../utils/constants";

const endpointMap = {
  popular: "popular",
  topRated: "top-rated",
  onAir: "on-air",
};

const getEndpoint = (media, sectionKey) => {
  const sect = endpointMap[sectionKey];
  return `/api/v1/${media}/kdrama/${sect}`;
};

const ITEMS_PER_PAGE = 12;

const AnimePage = () => {
  const navigate = useNavigate();
  
  // Initialize state from sessionStorage
  const [media, setMedia] = useState(() => sessionStorage.getItem("animeMedia") || "movies");
  const [active, setActive] = useState(() => sessionStorage.getItem("animeActive") || "popular");
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = sessionStorage.getItem("animeCurrentPage");
    return savedPage ? parseInt(savedPage) : 1;
  });
  
  const [data, setData] = useState({ popular: [], topRated: [], onAir: [] });
  const [loading, setLoading] = useState({ popular: false, topRated: false, onAir: false });

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("animeMedia", media);
  }, [media]);

  useEffect(() => {
    sessionStorage.setItem("animeActive", active);
  }, [active]);

  useEffect(() => {
    sessionStorage.setItem("animeCurrentPage", currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    // Fetch the active section when component mounts or media changes
    fetchSection(active);
  }, [media]);

  const fetchSection = async (section) => {
    if (loading[section]) return;
    setLoading(prev => ({ ...prev, [section]: true }));
    try {
      const res = await axios.get(getEndpoint(media, section));
      if (res?.data?.success) {
        setData(prev => ({ ...prev, [section]: res.data.content }));
      } else if (res?.data) {
        setData(prev => ({ ...prev, [section]: res.data }));
      }
    } catch (err) {
      console.error("Error fetching anime section", section, err);
    } finally {
      setLoading(prev => ({ ...prev, [section]: false }));
    }
  };

  const handleTabClick = (tab) => {
    setActive(tab);
    setCurrentPage(1); // Reset to page 1 when changing sections
    if (data[tab].length === 0) fetchSection(tab);
  };

  const handleMediaChange = (newMedia) => {
    if (newMedia === media) return;
    
    setMedia(newMedia);
    setCurrentPage(1); // Reset to page 1 when changing media type
    
    // Clear existing data
    setData({ popular: [], topRated: [], onAir: [] });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToTvDetails = (item) => {
    const base = media === 'movies' ? '/movie' : '/tv/details';
    navigate(`${base}/?id=${item.id}&name=${encodeURIComponent(item.name || item.title)}`);
    window.scroll(0, 0);
  };

  const renderGrid = (sectionKey) => {
    const list = data[sectionKey] || [];
    const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const visible = list.slice(startIndex, endIndex);

    return (
      <>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 py-3">
          {visible.map((item) => (
            (item?.poster_path || item?.backdrop_path) && (
              <div 
                key={item.id} 
                className="cursor-pointer group transform transition duration-200 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl p-1" 
                onClick={() => goToTvDetails(item)}
              >
                <div className="overflow-hidden rounded-lg">
                  <img 
                    src={`${SMALL_IMG_BASE_URL}${item.poster_path || item.backdrop_path}`} 
                    alt={item.name || item.title} 
                    className="w-full h-56 object-cover rounded-lg transform transition-transform duration-200 group-hover:scale-105" 
                  />
                </div>
                <h3 className="text-sm font-semibold text-white mt-2 truncate group-hover:text-gray-100 transition-colors duration-200">
                  {item.name || item.title}
                </h3>
              </div>
            )
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 py-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 bg-white bg-opacity-10 text-white rounded-md hover:bg-opacity-30 disabled:opacity-30 disabled:cursor-not-allowed transition duration-150"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-1">
              {/* Generate page buttons */}
              {(() => {
                const pages = [];

                // Always show first page if not in range
                if (currentPage > 2) {
                  pages.push(
                    <button
                      key={1}
                      onClick={() => handlePageChange(1)}
                      className="px-3 py-1 bg-white bg-opacity-10 text-white rounded-md hover:bg-opacity-30 transition duration-150"
                    >
                      1
                    </button>
                  );
                  // Show ellipsis if there's a gap
                  if (currentPage > 3) {
                    pages.push(<span key="ellipsis-start" className="px-2 py-1 text-gray-400">...</span>);
                  }
                }

                // Show pages around current page
                const startPage = Math.max(1, currentPage - 1);
                const endPage = Math.min(totalPages, currentPage + 1);

                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`px-3 py-1 rounded-md transition duration-150 ${
                        currentPage === i
                          ? 'bg-blue-600 text-white'
                          : 'bg-white bg-opacity-10 text-white hover:bg-opacity-30'
                      }`}
                    >
                      {i}
                    </button>
                  );
                }

                // Always show last page if not in range
                if (currentPage < totalPages - 1) {
                  // Show ellipsis if there's a gap
                  if (currentPage < totalPages - 2) {
                    pages.push(<span key="ellipsis-end" className="px-2 py-1 text-gray-400">...</span>);
                  }
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => handlePageChange(totalPages)}
                      className="px-3 py-1 bg-white bg-opacity-10 text-white rounded-md hover:bg-opacity-30 transition duration-150"
                    >
                      {totalPages}
                    </button>
                  );
                }

                return pages;
              })()}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 bg-white bg-opacity-10 text-white rounded-md hover:bg-opacity-30 disabled:opacity-30 disabled:cursor-not-allowed transition duration-150"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Page info */}
        {totalPages > 0 && (
          <div className="text-center text-sm text-gray-400 pb-4">
            Page {currentPage} of {totalPages} 
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto p-4 relative">
      <div className="flex pb-5 font-semibold text-xl md:text-2xl"><h2>K-Drama</h2></div>
        
        <div className="absolute top-4 right-4">
          <select 
            value={media} 
            onChange={(e) => handleMediaChange(e.target.value)}
            className="py-1 px-2 md:px-3 md:py-2 text-sm md:text-base bg-slate-800 cursor-pointer text-white rounded-md border border-slate-600 focus:outline-none transition duration-150"
          >
            <option className="text-sm md:text-base" value="tv">TV Shows</option>
            <option className="text-sm md:text-base" value="movies">Movies</option>
          </select>
        </div>

        <div className="flex gap-4 justify-start items-center mb-4">
          <button 
            className={`px-2 py-1 text-sm md:text-base md:px-4 md:py-2 rounded-md ${
              active === 'popular' ? 'bg-blue-600 scale-105' : 'bg-white bg-opacity-10 hover:bg-opacity-30'
            }`} 
            onClick={() => handleTabClick('popular')}
          >
            Popular
          </button>
          <button 
            className={`px-2 py-1 text-sm md:text-base md:px-4 md:py-2 rounded-md ${
              active === 'topRated' ? 'bg-blue-600 scale-105' : 'bg-white bg-opacity-10 hover:bg-opacity-30'
            }`} 
            onClick={() => handleTabClick('topRated')}
          >
            Top Rated
          </button>
          <button 
            className={`px-2 py-1 text-sm md:text-base md:px-4 md:py-2 rounded-md ${
              active === 'onAir' ? 'bg-blue-600 scale-105' : 'bg-white bg-opacity-10 hover:bg-opacity-30'
            }`} 
            onClick={() => handleTabClick('onAir')}
          >
            Latest
          </button>
        </div>

        <div>
          {loading[active] && (
            <div className="flex justify-center h-screen mt-20">
              <Loader className="animate-spin text-white w-7 h-7" />
            </div>
          )}
          {!loading[active] && renderGrid(active)}
        </div>
      </div>
    </div>
  );
};

export default AnimePage;