import React, { useEffect, useMemo, useState } from "react";
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
  return `/api/v1/${media}/anime/${sect}`;
};

const ITEMS_PER_PAGE = 12;

const AnimationPage = () => {
  const navigate = useNavigate();

  /* -------------------- STATE -------------------- */

  const [media, setMedia] = useState(
    () => sessionStorage.getItem("animeMedia") || "movies"
  );
  const [active, setActive] = useState(
    () => sessionStorage.getItem("animeActive") || "popular"
  );
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = sessionStorage.getItem("animeCurrentPage");
    return saved ? parseInt(saved, 10) : 1;
  });

  const [data, setData] = useState({
    popular: [],
    topRated: [],
    onAir: [],
  });

  const [loading, setLoading] = useState({
    popular: false,
    topRated: false,
    onAir: false,
  });

  /* -------------------- SESSION STORAGE -------------------- */

  useEffect(() => {
    sessionStorage.setItem("animeMedia", media);
  }, [media]);

  useEffect(() => {
    sessionStorage.setItem("animeActive", active);
  }, [active]);

  useEffect(() => {
    sessionStorage.setItem("animeCurrentPage", currentPage.toString());
  }, [currentPage]);

  /* -------------------- FETCH DATA -------------------- */

  useEffect(() => {
    fetchSection(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media]);

  const fetchSection = async (section) => {
    if (loading[section]) return;

    setLoading((prev) => ({ ...prev, [section]: true }));

    try {
      const res = await axios.get(getEndpoint(media, section));
      const content = res?.data?.content || res?.data || [];

      setData((prev) => ({
        ...prev,
        [section]: Array.isArray(content) ? content : [],
      }));
    } catch (err) {
      console.error("Error fetching animation:", err);
    } finally {
      setLoading((prev) => ({ ...prev, [section]: false }));
    }
  };

  

  /* -------------------- HANDLERS -------------------- */

  const handleTabClick = (tab) => {
    setActive(tab);
    setCurrentPage(1);

    if (data[tab].length === 0) {
      fetchSection(tab);
    }
  };

  const handleMediaChange = (newMedia) => {
    if (newMedia === media) return;

    setMedia(newMedia);
    setCurrentPage(1);
    setData({ popular: [], topRated: [], onAir: [] });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToTvDetails = (item) => {
    const base = media === "movies" ? "/movie" : "/tv/details";
    navigate(
      `${base}/?id=${item.id}&name=${encodeURIComponent(
        item.name || item.title
      )}`
    );
    window.scrollTo(0, 0);
  };

  /* -------------------- PAGINATION LOGIC -------------------- */

  const activeList = data[active] || [];
  const totalPages = Math.ceil(activeList.length / ITEMS_PER_PAGE);

  const safePage = Math.min(currentPage, totalPages || 1);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const visibleItems = useMemo(() => {
    return activeList.slice(startIndex, endIndex);
  }, [activeList, startIndex, endIndex]);

  /* -------------------- GRID -------------------- */
  const getPageNumbers = (current, total) => {
    const pages = [];
  
    // Always show first page
    pages.push(1);
  
    // Show left ellipsis if needed
    if (current > 3) {
      pages.push("...");
    }
  
    // Pages around current
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
  
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  
    // Show right ellipsis if needed
    if (current < total - 2) {
      pages.push("...");
    }
  
    // Always show last page (if more than 1)
    if (total > 1) {
      pages.push(total);
    }
  
    return pages;
  };
  

  const renderGrid = () => {
    return (
      <>
        {/* FORCE REMOUNT PER PAGE */}
        <div key={`${media}-${active}-${safePage}`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 py-3">
            {visibleItems.map(
              (item) =>
                (item.poster_path || item.backdrop_path) && (
                  <div
                    key={`${media}-${active}-${item.id}`}
                    className="cursor-pointer group transition hover:scale-105 p-1"
                    onClick={() => goToTvDetails(item)}
                  >
                    <div className="overflow-hidden rounded-lg">
                      <img
                        src={`${SMALL_IMG_BASE_URL}${
                          item.poster_path || item.backdrop_path
                        }`}
                        alt={item.name || item.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="text-sm font-semibold mt-2 truncate">
                      {item.name || item.title}
                    </h3>
                  </div>
                )
            )}
          </div>
        </div>

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 py-6 select-none">
    
    {/* PREVIOUS */}
    <button
      onClick={() => handlePageChange(safePage - 1)}
      disabled={safePage === 1}
      className="px-3 py-1 bg-white/10 rounded hover:bg-white/30 disabled:opacity-30"
    >
      &lt;
    </button>

    {/* PAGE NUMBERS */}
    {getPageNumbers(safePage, totalPages).map((p, idx) => {
      if (p === "start-ellipsis" || p === "end-ellipsis") {
        return (
          <span key={idx} className="px-2 text-gray-400">
            ...
          </span>
        );
      }

      return (
        <button
          key={p}
          onClick={() => handlePageChange(p)}
          className={`px-3 py-1 rounded transition ${
            p === safePage
              ? "bg-blue-600 text-white"
              : "bg-white/10 hover:bg-white/30"
          }`}
        >
          {p}
        </button>
      );
    })}

    {/* NEXT */}
    <button
      onClick={() => handlePageChange(safePage + 1)}
      disabled={safePage === totalPages}
      className="px-3 py-1 bg-white/10 rounded hover:bg-white/30 disabled:opacity-30"
    >
      &gt;
    </button>
  </div>
)}


        <div className="text-center text-sm text-gray-400 pb-4">
          Page {safePage} of {totalPages || 1}
        </div>
      </>
    );
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-full md:mx-4 xl:mx-20 p-4 relative">
      <div className="flex pb-5 font-semibold text-xl md:text-2xl"><h2>Anime</h2></div>
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

        <div className="flex gap-4 mb-4 text-sm md:text-base">
          {["popular", "topRated", "onAir"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`md:px-4 py-2 px-2 rounded-md ${
                active === tab
                  ? "bg-blue-600"
                  : "bg-white/10 hover:bg-white/30"
              }`}
            >
              {tab === "onAir"
                ? "Latest"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading[active] ? (
          <div className="flex justify-center mt-20">
            <Loader className="animate-spin w-7 h-7" />
          </div>
        ) : (
          renderGrid()
        )}
      </div>
    </div>
  );
};

export default AnimationPage;
