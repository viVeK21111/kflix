import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Loader, ChevronLeft, ChevronRight,AlertTriangle } from 'lucide-react';
import { userAuthStore } from "../store/authUser";
import axios from 'axios';

const HanimePage = () => {
  const navigate = useNavigate();
  const user = userAuthStore((state) => state.user);
  
  // Initialize from session storage
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(() => 
    sessionStorage.getItem('hanime_searchQuery') || ''
  );
  const [selectedCategory, setSelectedCategory] = useState(() => 
    sessionStorage.getItem('hanime_selectedCategory') || ''
  );
 
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => 
    parseInt(sessionStorage.getItem('hanime_currentPage') || '1')
  );
  const [metadataCache, setMetadataCache] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('hanime_metadataCache') || '{}');
    } catch {
      return {};
    }
  });
  const [searchResultsCache, setSearchResultsCache] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('hanime_searchCache') || '{}');
    } catch {
      return {};
    }
  });
  const [searchedUpTo, setSearchedUpTo] = useState(() => 
    parseInt(sessionStorage.getItem('hanime_searchedUpTo') || '0')
  );
  const [allSearchComplete, setAllSearchComplete] = useState(() => 
    sessionStorage.getItem('hanime_allSearchComplete') === 'true'
  );
  const [filterLoading, setFilterLoading] = useState(false);
  const [categorySearchedUpTo, setCategorySearchedUpTo] = useState(() => 
    parseInt(sessionStorage.getItem('hanime_categorySearchedUpTo') || '0')
  );
  const [allCategoryComplete, setAllCategoryComplete] = useState(() => 
    sessionStorage.getItem('hanime_allCategoryComplete') === 'true'
  );

  
  
  const ITEMS_PER_PAGE = 20;
  const RSS_URL = '/api/v1/hanime/rss';
  const API_URL = '/api/v1/hanime/metadata';
  const MAX_METADATA_CACHE = 400; // Limit metadata cache to 400 items
  const MAX_SEARCH_CACHE = 5; // Keep only last 5 search queries
  // Save filtered items to session storage
  useEffect(() => {
    if (filteredItems.length > 0) {
      // Only save slugs to reduce storage size
      const itemsToSave = filteredItems.map(item => ({
        slug: item.slug,
        title: item.title,
        thumbnail: item.thumbnail,
        pubDate: item.pubDate,
        embedUrl: item.embedUrl,
        guid: item.guid
      }));
      sessionStorage.setItem('hanime_filteredItems', JSON.stringify(itemsToSave));
    }
  }, [filteredItems]);

  const [showAgeGate, setShowAgeGate] = useState(false);

useEffect(() => {
  const accepted = sessionStorage.getItem("ageGateAccepted");
  if (!accepted) {
    setShowAgeGate(true);
  }
}, []);

const handleAgeAccept = () => {
  sessionStorage.setItem("ageGateAccepted", "true");
  setShowAgeGate(false);
};

const handleAgeReject = () => {
  window.location.href = "/fun";
};

  // Save to session storage whenever state changes
 
  
  
  useEffect(() => {
    sessionStorage.setItem('hanime_searchQuery', searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    sessionStorage.setItem('hanime_selectedCategory', selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    sessionStorage.setItem('hanime_currentPage', currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    sessionStorage.setItem('hanime_searchedUpTo', searchedUpTo.toString());
  }, [searchedUpTo]);

  useEffect(() => {
    sessionStorage.setItem('hanime_allSearchComplete', allSearchComplete.toString());
  }, [allSearchComplete]);

  useEffect(() => {
    sessionStorage.setItem('hanime_categorySearchedUpTo', categorySearchedUpTo.toString());
  }, [categorySearchedUpTo]);

  useEffect(() => {
    sessionStorage.setItem('hanime_allCategoryComplete', allCategoryComplete.toString());
  }, [allCategoryComplete]);


  
 

  // Smart metadata cache management with size limit
  useEffect(() => {
    const cacheKeys = Object.keys(metadataCache);
    
    // If cache exceeds limit, remove oldest entries (FIFO)
    if (cacheKeys.length > MAX_METADATA_CACHE) {
      const keysToRemove = cacheKeys.slice(0, cacheKeys.length - MAX_METADATA_CACHE);
      const newCache = { ...metadataCache };
      keysToRemove.forEach(key => delete newCache[key]);
      setMetadataCache(newCache);
      sessionStorage.setItem('hanime_metadataCache', JSON.stringify(newCache));
    } else {
      sessionStorage.setItem('hanime_metadataCache', JSON.stringify(metadataCache));
    }
  }, [metadataCache]);

  // Search cache management - keep only last 5 queries
  useEffect(() => {
    const cacheKeys = Object.keys(searchResultsCache);
    
    if (cacheKeys.length > MAX_SEARCH_CACHE) {
      // Keep only the most recent queries
      const recentKeys = cacheKeys.slice(-MAX_SEARCH_CACHE);
      const newCache = {};
      recentKeys.forEach(key => {
        newCache[key] = searchResultsCache[key];
      });
      setSearchResultsCache(newCache);
      sessionStorage.setItem('hanime_searchCache', JSON.stringify(newCache));
    } else {
      sessionStorage.setItem('hanime_searchCache', JSON.stringify(searchResultsCache));
    }
  }, [searchResultsCache]);

  useEffect(() => {
    const saved = sessionStorage.getItem('hanime_filteredItems');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setFilteredItems(parsed);
        }
      } catch {}
    }
  }, []);

  // Restore filtered items on mount if there was a previous search/filter
  useEffect(() => {
    if (items.length === 0) return;
  
    // 🔒 If filteredItems already restored, DO NOTHING
    if (filteredItems.length > 0) return;
  
    if (searchQuery) {
      performSearch(searchQuery);
    } else {
      setFilteredItems(items);
    }
  }, [items.length]);

 

  const AVAILABLE_GENRES = [
    '3D',
    'Ahegao',
    'Anal',
    'Animal Ears',
    'Big Boobs',
    'Blowjob',
    'Boobjob',
    'Comedy',
    'Cosplay',
    'Creampie',
    'Dark Skin',
    'Facial',
    'Fantasy',
    'Footjob',
    'Futanari',
    'Gangbang',
    'Handjob',
    'Harem',
    'Incest',
    'Lactation',
    'Maid',
    'Masturbation',
    'Milf',
    'Mind Break',
    'NTR',
    'Nurse',
    'Orgy',
    'POV',
    'Pregnant',
    'Public Sex',
    'Rape',
    'Rimjob',
    'Scat',
    'School Girl',
    'Softcore',
    'Shoutacon',
    'Swimsuit',
    'Teacher',
    'Tentacles',
    'Toys',
    'Tsundere',
    'Ugly Bastard',
    'Uncensored',
    'Vanilla',
    'Virgin',
    'X-Ray',
    'Yaoi',
    'Yuri',
  ].sort();

  // Extract slug from link
  const extractSlug = (link) => {
    const match = link.match(/\/watch\/([^\/]+)/);
    return match ? match[1] : null;
  };

  // Parse RSS XML
  const parseRSS = async () => {
    try {
      setLoading(true);
      const response = await axios.get(RSS_URL);
      const parser = new DOMParser();
      const xml = parser.parseFromString(response.data, 'text/xml');
      const itemNodes = xml.querySelectorAll('item');
      
      const parsedItems = Array.from(itemNodes).map(item => {
        const link = item.querySelector('link')?.textContent;
        const slug = extractSlug(link);
        
        return {
          guid: item.querySelector('guid')?.textContent,
          title: item.querySelector('title')?.textContent,
          link: link,
          slug: slug,
          description: item.querySelector('description')?.textContent,
          pubDate: item.querySelector('pubDate')?.textContent,
          embedUrl: item.querySelector('embedUrl')?.textContent,
          thumbnail: item.querySelector('thumbnail')?.getAttribute('url'),
        };
      });
      
      setItems(parsedItems);
      if (!sessionStorage.getItem('hanime_filteredItems')) {
        setFilteredItems(parsedItems);
      }
     
      setLoading(false);
    } catch (error) {
      console.error('Error fetching RSS:', error);
      setLoading(false);
    }
  };

  // Fetch metadata for a specific slug (with smart caching)
  const fetchMetadata = async (slug) => {
    if (metadataCache[slug]) {
      return metadataCache[slug];
    }
    
    try {
      const response = await axios.get(`${API_URL}/${slug}`);
      const metadata = {
        info: response.data.info?.[0] || {},
        genres: response.data.genres?.map(g => g.genre) || []
      };
      
      // Add to cache with smart limit management
      setMetadataCache(prev => {
        const newCache = { ...prev };
        const keys = Object.keys(newCache);
        
        // If adding this would exceed limit, remove oldest
        if (keys.length >= MAX_METADATA_CACHE) {
          delete newCache[keys[0]];
        }
        
        newCache[slug] = metadata;
        return newCache;
      });
      
      return metadata;
    } catch (error) {
      console.error(`Error fetching metadata for ${slug}:`, error);
      return null;
    }
  };

  // Filter by category (single selection) with pagination support
  const filterByCategory = async (category, continueFilter = false) => {
    if (!category) {
      setFilteredItems(items);
      setCategorySearchedUpTo(0);
      setAllCategoryComplete(false);
      return;
    }
    
    setFilterLoading(true);
    const BATCH_SIZE = 100;
    const INITIAL_STOP_THRESHOLD = 40;
    const CONTINUE_BATCH_COUNT = 3;
    
    // Get existing matches if continuing, otherwise start fresh
    let filtered = continueFilter && filteredItems.length > 0 
      ? [...filteredItems] 
      : [];
    
    let startIndex = continueFilter ? categorySearchedUpTo : 0;
    let processedCount = startIndex;
    let batchesProcessed = 0;
    
    for (let i = startIndex; i < items.length; i += BATCH_SIZE) {
      const batch = items.slice(i, i + BATCH_SIZE);
      const metadataPromises = batch.map(item => fetchMetadata(item.slug));
      const metadataResults = await Promise.all(metadataPromises);
      
      batch.forEach((item, index) => {
        const metadata = metadataResults[index];
        if (metadata?.genres?.includes(category)) {
          // Avoid duplicates
          if (!filtered.find(f => f.slug === item.slug)) {
            filtered.push(item);
          }
        }
      });
      
      processedCount += batch.length;
      batchesProcessed++;
      
      setFilteredItems([...filtered]);
      setCategorySearchedUpTo(processedCount);
      
      console.log(`Filtered ${processedCount}/${items.length} items, found ${filtered.length} matches for category: ${category}`);
      
      // Smart stopping
      if (!continueFilter) {
        if (filtered.length >= INITIAL_STOP_THRESHOLD && processedCount >= 200) {
          console.log(`Initial filter stop: Found ${filtered.length} results after ${processedCount} items`);
          break;
        }
      } else {
        if (batchesProcessed >= CONTINUE_BATCH_COUNT) {
          console.log(`Continue filter: Processed ${CONTINUE_BATCH_COUNT} more batches`);
          break;
        }
      }
    }
    
    const allComplete = processedCount >= items.length;
    setAllCategoryComplete(allComplete);
    setFilterLoading(false);
    
    if (!continueFilter) {
      setCurrentPage(1);
    }
  };

  // Advanced text matching - handles multiple words, variations, spaces
  const matchesQuery = (text, query) => {
    if (!text || !query) return false;
    
    const textLower = text.toLowerCase().replace(/\s+/g, ''); // Remove all spaces
    const queryLower = query.toLowerCase();
    
    // Split query into words
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 0);
    
    // Check if text contains query as-is (with spaces)
    if (text.toLowerCase().includes(queryLower)) return true;
    
    // Check if text contains query without spaces (e.g., "step mom" matches "stepmom")
    const queryNoSpaces = queryLower.replace(/\s+/g, '');
    if (textLower.includes(queryNoSpaces)) return true;
    
    // Check if all individual words exist in text (order doesn't matter)
    const allWordsMatch = queryWords.every(word => {
      const wordNoSpaces = word.replace(/\s+/g, '');
      return textLower.includes(wordNoSpaces) || text.toLowerCase().includes(word);
    });
    
    return allWordsMatch;
  };

  // Smart search with description matching (searches ALL items' descriptions via API)
  const performSearch = async (query, continueSearch = false) => {
    if (!query.trim()) {
      setFilteredItems(items);
      setSearchResultsCache({});
      setSearchedUpTo(0);
      setAllSearchComplete(false);
      return;
    }
    
    const searchLower = query.toLowerCase();
    
    // If not continuing and we have cached results, return them
    if (!continueSearch && searchResultsCache[searchLower]) {
      setFilteredItems(searchResultsCache[searchLower].results);
      setSearchedUpTo(searchResultsCache[searchLower].searchedUpTo);
      setAllSearchComplete(searchResultsCache[searchLower].allComplete);
      return;
    }
    
    setSearchLoading(true);
    
    // Strategy: Fetch metadata in batches and search descriptions
    const BATCH_SIZE = 100;
    const INITIAL_STOP_THRESHOLD = 40; // Stop after finding 40 results initially
    const CONTINUE_BATCH_COUNT = 3; // Search 3 more batches when continuing
    
    // Get existing matches if continuing, otherwise start fresh
    let matches = continueSearch && searchResultsCache[searchLower] 
      ? [...searchResultsCache[searchLower].results] 
      : [];
    
    let startIndex = continueSearch ? searchedUpTo : 0;
    let processedCount = startIndex;
    let batchesProcessed = 0;
    
    for (let i = startIndex; i < items.length; i += BATCH_SIZE) {
      const batch = items.slice(i, i + BATCH_SIZE);
      
      // Fetch metadata for this batch
      const metadataPromises = batch.map(item => fetchMetadata(item.slug));
      const metadataResults = await Promise.all(metadataPromises);
      
      // Check each item's title and description with advanced matching
      batch.forEach((item, index) => {
        const metadata = metadataResults[index];
        const titleMatch = matchesQuery(item.title, searchLower);
        const descMatch = matchesQuery(metadata?.info?.description, searchLower);
        
        if (titleMatch || descMatch) {
          // Avoid duplicates
          if (!matches.find(m => m.slug === item.slug)) {
            matches.push(item);
          }
        }
      });
      
      processedCount += batch.length;
      batchesProcessed++;
      
      // Update UI progressively
      setFilteredItems([...matches]);
      setSearchedUpTo(processedCount);
      
      console.log(`Searched ${processedCount}/${items.length} items, found ${matches.length} matches`);
      
      // Smart stopping logic
      if (!continueSearch) {
        // Initial search: stop if we have enough results
        if (matches.length >= INITIAL_STOP_THRESHOLD && processedCount >= 200) {
          console.log(`Initial search stop: Found ${matches.length} results after ${processedCount} items`);
          break;
        }
      } else {
        // Continuing search: process a few more batches
        if (batchesProcessed >= CONTINUE_BATCH_COUNT) {
          console.log(`Continue search: Processed ${CONTINUE_BATCH_COUNT} more batches`);
          break;
        }
      }
    }
    
    const allComplete = processedCount >= items.length;
    setAllSearchComplete(allComplete);
    
    // Cache the search results with metadata
    setSearchResultsCache(prev => ({
      ...prev,
      [searchLower]: {
        results: matches,
        searchedUpTo: processedCount,
        allComplete: allComplete
      }
    }));
    
    setSearchLoading(false);
    
    // DON'T reset page if continuing
    if (!continueSearch) {
      setCurrentPage(1);
    }
    
    console.log(`Search complete: ${matches.length} results from ${processedCount} items searched`);
  };

  // Handle category selection
  const handleCategoryClick = (genre) => {
    setSelectedCategory(genre);
    setShowCategoryDropdown(false);
    setSearchQuery(''); // Clear search when filtering by category
    filterByCategory(genre);
  };

  useEffect(() => {
    parseRSS();
  }, []);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setSelectedCategory(''); // Clear category filter when searching
    setSearchResultsCache({}); // Clear old cache to force fresh search
    setSearchedUpTo(0);
    setAllSearchComplete(false);
    performSearch(searchQuery);
  };

  const handleReset = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setFilteredItems(items);
    setCurrentPage(1);
    setSearchResultsCache({});
    setSearchedUpTo(0);
    setAllSearchComplete(false);
    setCategorySearchedUpTo(0);
    setAllCategoryComplete(false);
    
    // Clear session storage
    sessionStorage.removeItem('hanime_searchQuery');
    sessionStorage.removeItem('hanime_selectedCategory');
    sessionStorage.removeItem('hanime_currentPage');
    sessionStorage.removeItem('hanime_searchedUpTo');
    sessionStorage.removeItem('hanime_allSearchComplete');
    sessionStorage.removeItem('hanime_categorySearchedUpTo');
    sessionStorage.removeItem('hanime_allCategoryComplete');
    sessionStorage.removeItem('hanime_searchCache');
  };

  // Handle pagination - continue search/filter if needed
  const handlePageChange = (newPage) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(newPage);
    
    // Check if we need more results (user going to a page that needs more data)
    const resultsNeeded = newPage * ITEMS_PER_PAGE;
    const hasEnoughResults = filteredItems.length >= resultsNeeded;
    
    // For search
    if (searchQuery && !hasEnoughResults && !allSearchComplete && !searchLoading) {
      console.log(`Need more search results for page ${newPage}, continuing search...`);
      performSearch(searchQuery, true); // Continue search WITHOUT resetting page
    }
    
    // For category filter
    if (selectedCategory && !hasEnoughResults && !allCategoryComplete && !filterLoading) {
      console.log(`Need more filter results for page ${newPage}, continuing filter...`);
      filterByCategory(selectedCategory, true); // Continue filter WITHOUT resetting page
    }
  };

  if(showAgeGate)  {
    return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900 rounded-xl shadow-2xl border border-gray-700 p-6 text-center">
  
        <h2 className="text-2xl font-bold text-red-500 mb-3">
          🔞 Age Restricted Content
        </h2>
  
        <p className="text-gray-300 text-sm mb-4">
          This page contains <span className="text-white font-semibold">adult content</span>.
          It is intended only for viewers who are <span className="text-white font-semibold">18 years or older</span>.
        </p>
  
        <p className="text-gray-400 text-xs mb-6">
          By continuing, you confirm that you are legally allowed to view such content
          in your country.
        </p>
  
        <div className="flex gap-3">
          <button
            onClick={handleAgeReject}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition"
          >
            Leave
          </button>
  
          <button
            onClick={handleAgeAccept}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg transition font-semibold"
          >
            I am 18+
          </button>
        </div>
      </div>
    </div>
  )}
 
 

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-white w-10 h-10 mx-auto mb-4" />
          <p className="text-gray-400">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
        <div className='sm:flex mb-5 gap-2 items-center'>
          <div className='flex items-center'>
          {!user && <Link to={'/'}><img src='/klogo1.png' className='h-14 md:h-16 p-2'></img></Link>}
          <h1 className="text-2xl md:text-4xl font-bold ">Hentocean </h1>
          </div>
     
        <div className='flex gap-2 sm:ml-auto mt-3 md:mt-0'>
        <Link
            to="/hentocean/collections"
            className="px-2 md:px-4 py-2 md:py-3 text-sm md:text-base  bg-gray-800 border border-gray-700 hover:bg-gray-700 rounded-lg  transition-colors flex items-center "
          >
            <svg className="flex mb-1 md:mb-0 mr-1 w-5 h-4 items-center md:h-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Collections
          </Link>
       {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 ">

          {/* Category Filter */}
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className={`px-2 md:px-4 py-2 md:py-3 rounded-lg border flex items-center gap-2 min-w-[150px] ${
                selectedCategory 
                  ? 'bg-blue-600 border-blue-600' 
                  : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
              }`}
            >
              <Filter className="w-5 h-4 md:h-5" />
              <span className="capitalize text-sm md:text-base">
                {selectedCategory || 'Genre'}
              </span>
            </button>
            
            {showCategoryDropdown && (
              <div className="absolute top-full mt-2 right-0 bg-gray-800 border border-gray-700 rounded-lg p-2 z-10 min-w-[200px] max-h-[400px] overflow-y-auto shadow-xl">
                {AVAILABLE_GENRES.map(genre => (
                  <button
                    key={genre}
                    onClick={() => handleCategoryClick(genre)}
                    className={`w-full text-left px-4 py-2 rounded hover:bg-gray-700 transition-colors capitalize ${
                      selectedCategory === genre ? 'bg-blue-600 text-white' : 'text-gray-300'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            )}
          </div>

        
        </div>
        </div>
       

        </div>
        
        {/* Search Bar */}
        <div className='flex gap-2 mb-5'>
        <form onSubmit={handleSearch} className="flex-1 ">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter any keyword..."
                className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 text-white"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-blue-800 bg-blue-700 rounded"
                disabled={searchLoading}
              >
                {searchLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
 
            {/* Reset Button */}
            {(selectedCategory || searchQuery) && (
            <button
              onClick={handleReset}
              className="px-4 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
       
       

        {/* Results Info */}
        <div className="mb-4 text-gray-400 flex flex-wrap items-center gap-2">
          <span>
              <p className="text-gray-400 ">
              Page {currentPage} of {totalPages}
            </p>
    
          </span>
          {(searchLoading || filterLoading) && (
            <span className="flex items-center gap-2 text-blue-400">
              <Loader className="w-4 h-4 animate-spin" />
              {searchLoading && 'Searching data...'}
              {filterLoading && 'Filtering by category...'}
            </span>
          )}

         
          {selectedCategory && (
            <span className="px-3 py-1 bg-blue-600 rounded-full text-sm capitalize">
              Category: {selectedCategory}
            </span>
          )}
          {searchQuery && (
            <span className="px-3 py-1 bg-green-600 text-black rounded-full text-sm">
              Search: "{searchQuery}"
            </span>
          )}
        </div>

       
        {/* Content Grid */}
        <div className={"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8"}>
          {paginatedItems.map((item) => (
            <Link
              key={item.guid}
              to={`/hentocean/${item.slug}`}
              className="group"
            >
              <div className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all">
                <div className="aspect-[3/4] relative">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-400">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(item.pubDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredItems.length === 0 && !loading && !searchLoading && !filterLoading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-2">No results found</p>
            {searchQuery && (
              <p className="text-gray-500 mb-4">
                Try different keywords or check your spelling
              </p>
            )}
            {selectedCategory && (
              <p className="text-gray-500 mb-4">
                No items found in this category
              </p>
            )}
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {searchQuery || selectedCategory ? 'Clear Filters' : 'Reset'}
            </button>
          </div>
        )}

      {/* Pagination */}
      {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 flex-wrap">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dynamic page numbers */}
            {(() => {
              const pages = [];
              const maxVisible = 7;
              
              if (totalPages <= maxVisible) {
                // Show all pages if total is small
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                // Always show first page
                pages.push(1);
                
                if (currentPage > 6) {
                  pages.push('...');
                }
                
                // Show pages around current page
                const start = Math.max(2, currentPage - 1);
                const end = Math.min(totalPages - 1, currentPage + 2);
                
                for (let i = start; i <= end; i++) {
                  pages.push(i);
                }
                
                if (currentPage < totalPages - 2) {
                  pages.push('...');
                }
                
                // Always show last page
                pages.push(totalPages);
              }
              
              return pages.map((page, index) => {
                if (page === '...') {
                  return (
                    <span key={`ellipsis-${index}`} className="text-gray-500 px-2">
                      ...
                    </span>
                  );
                }
                
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                );
              });
            })()}

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
         {/* Footer */}
        
      </div>
      <footer className="mt-12 pt-8 pb-6 border-t border-gray-800">
          <div className="text-center space-y-4">
            {/* Attribution */}
           

            {/* Links */}
            <div className="flex justify-center items-center gap-6 flex-wrap">
              <a
                href="https://discord.gg/P3rcqHwp9d"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm md:text-base text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Discord
              </a>
              <a
                href="/hentocean/terms"
                className="text-gray-400 text-sm md:text-base hover:text-white transition-colors"
              >
                Terms
              </a>

              <a
                href="/"
                className="text-gray-400 text-sm md:text-base hover:text-white transition-colors"
              >
                Home
              </a>
              <a
                href="/contactus"
                className="text-gray-400 text-sm md:text-base hover:text-white transition-colors"
              >
                Contact Us
              </a>
            </div>
            

         

            {/* Disclaimer */}
            <p className="text-gray-600 text-xs max-w-2xl mx-auto">
              This site does not host any content. All videos are embedded from external third party sources.
            </p>
          </div>
        </footer>
    </div>
  );
};

export default HanimePage;