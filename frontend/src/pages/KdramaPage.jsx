import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader } from "lucide-react";  
import { Link, useNavigate } from "react-router-dom";
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

const AnimePage = () => {
  const navigate = useNavigate();
  const [media, setMedia] = useState(sessionStorage.getItem("animeMedia") || "tv");
  const [active, setActive] = useState(sessionStorage.getItem("animeActive") || "popular");
  const [data, setData] = useState({ popular: [], topRated: [], onAir: [] });
  const [visibleCount, setVisibleCount] = useState({ popular: 12, topRated: 12, onAir: 12 });
  const [loading, setLoading] = useState({ popular: false, topRated: false, onAir: false });

  useEffect(() => {
    // load default (popular)
    fetchSection(sessionStorage.getItem("animeActive") || "popular");
  }, [media]); // Add media as dependency

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
    sessionStorage.setItem("animeActive", tab);
    if (data[tab].length === 0) fetchSection(tab);
  };

  const handleMediaChange = (newMedia) => {
    if (newMedia === media) return;
    
    setMedia(newMedia);
    sessionStorage.setItem("animeMedia", newMedia);
    
    // clear existing data and reset visible counts
    setData({ popular: [], topRated: [], onAir: [] });
    setVisibleCount({ popular: 12, topRated: 12, onAir: 12 });
    
   
  };

  const handleLoadMore = (section) => {
    setVisibleCount(prev => ({ ...prev, [section]: prev[section] + 6 }));
  };

  const goToTvDetails = (item) => {
    // navigate to details page with id and name in query (media-specific)
    const base = media === 'movies' ? '/movie' : '/tv/details';
    navigate(`${base}/?id=${item.id}&name=${encodeURIComponent(item.name || item.title)}`);
    window.scroll(0,0);
  };

  const renderGrid = (sectionKey) => {
    const list = data[sectionKey] || [];
    const visible = list.slice(0, visibleCount[sectionKey]);
    return (
      <>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 py-3">
          {visible.map((item) => (
            (item?.poster_path || item?.backdrop_path) && (
              <div key={item.id} className="cursor-pointer group transform transition duration-200 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl" onClick={() => goToTvDetails(item)}>
                <div className="overflow-hidden rounded-lg">
                  <img src={`${SMALL_IMG_BASE_URL}${item.poster_path || item.backdrop_path}`} alt={item.name || item.title} className="w-full h-56 object-cover rounded-lg transform transition-transform duration-200 group-hover:scale-105" />
                </div>
                <h3 className="text-sm font-semibold text-white mt-2 truncate group-hover:text-gray-100 transition-colors duration-200">{item.name || item.title}</h3>
              </div>
            )
          ))}
        </div>
        {visible.length < list.length && (
          <div className="flex justify-end px-4 pb-4">
            <button onClick={() => handleLoadMore(sectionKey)} className="px-3 py-1 bg-white bg-opacity-10 text-white rounded-md  hover:bg-opacity-30 ">Load More</button>
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
            className="py-1 px-2 md:px-3 md:py-2 text-sm md:text-base bg-slate-800 cursor-pointer text-white rounded-md border border-slate-600 focus:outline-none  transition duration-150"
          >
            <option className="text-sm md:text-base" value="tv">TV Shows</option>
            <option className="text-sm md:text-base" value="movies">Movies</option>
          </select>
        </div>

        <div className="flex gap-4 justify-start items-center mb-4">
          <button className={`px-2 py-1 text-sm md:text-base md:px-4 md:py-2 rounded-md  ${active==='popular' ? 'bg-blue-600 scale-105' : 'bg-white bg-opacity-10 hover:bg-opacity-30 '}`} onClick={() => handleTabClick('popular')}>Popular</button>
          <button className={`px-2 py-1 text-sm md:text-base md:px-4 md:py-2 rounded-md  ${active==='topRated' ? 'bg-blue-600 scale-105' : 'bg-white bg-opacity-10 hover:bg-opacity-30 '}`} onClick={() => handleTabClick('topRated')}>Top Rated</button>
          <button className={`px-2 py-1 text-sm md:text-base md:px-4 md:py-2 rounded-md  ${active==='onAir' ? 'bg-blue-600 scale-105' : 'bg-white bg-opacity-10 hover:bg-opacity-30 '}`} onClick={() => handleTabClick('onAir')}>Latest</button>
        </div>

        <div>
          {loading[active] && <div className="flex justify-center h-screen mt-20"><Loader className="animate-spin text-white w-7 h-7"/></div>}
          {!loading[active] && renderGrid(active)}
        </div>
      </div>
    </div>
  );
};

export default AnimePage;