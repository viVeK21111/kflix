import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Loader, ArrowLeft, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { userAuthStore } from "../store/authUser";
import axios from 'axios';

const HanimeCollectionsPage = () => {
  const { collectionSlug } = useParams();
  const user = userAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [loading,setLoading] = useState(null);
  const [collections, setCollections] = useState([]);
  const [currentCollection, setCurrentCollection] = useState(null);


  const [currentPage, setCurrentPage] = useState( parseInt(sessionStorage.getItem('collection_currentPage') || '1'));

  const RSS_URL = '/api/v1/hanime/rss';
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [collectionSlug]);
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
 

  // Extract slug from link
  const extractSlug = (link) => {
    const match = link.match(/\/watch\/([^\/]+)/);
    return match ? match[1] : null;
  };

  // Get base name from slug (remove numbers and hyphens at end)
  const getBaseName = (slug) => {
    // Remove episode numbers like "-1", "-2", "-episode-1", etc.
    return slug.replace(/-(\d+)$/, '').replace(/-episode-\d+$/, '');
  };

  // Group items into collections
  const groupCollections = (items) => {
    const collectionMap = {};

    items.forEach(item => {
      const baseName = getBaseName(item.slug);
      
      if (!collectionMap[baseName]) {
        collectionMap[baseName] = {
          baseName,
          displayName: item.title.replace(/\s+\d+$/, ''), // Remove trailing numbers
          items: [],
          thumbnail: item.thumbnail,
          latestDate: item.pubDate
        };
      }

      collectionMap[baseName].items.push(item);
      
      // Update latest date
      if (new Date(item.pubDate) > new Date(collectionMap[baseName].latestDate)) {
        collectionMap[baseName].latestDate = item.pubDate;
      }
    });

    // Filter: Only keep collections with 2+ episodes
    return Object.values(collectionMap)
      .filter(col => col.items.length >= 2)
      .map(col => ({
        ...col,
        items: col.items.sort((a, b) => {
          // Sort by episode number
          const aNum = parseInt(a.slug.match(/-(\d+)$/)?.[1] || '0');
          const bNum = parseInt(b.slug.match(/-(\d+)$/)?.[1] || '0');
          return aNum - bNum;
        })
      }))
      .sort((a, b) => new Date(b.latestDate) - new Date(a.latestDate));
  };

  // Parse RSS and create collections
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

      const grouped = groupCollections(parsedItems);
      setCollections(grouped);

      // If viewing specific collection, set it
      if (collectionSlug) {
        const found = grouped.find(c => c.baseName === collectionSlug);
        setCurrentCollection(found || null);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching RSS:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    
      parseRSS();
    
  }, [collectionSlug]);

  useEffect(() => {
    sessionStorage.setItem('collection_currentPage', currentPage.toString());
  }, [currentPage]);

  if ((loading )) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-white w-10 h-10 mx-auto mb-4" />
          <p className="text-gray-400">
            {'Loading collections...'}
          </p>
        </div>
      </div>
    );
  }

  // View specific collection
  if (collectionSlug && currentCollection) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/hentocean/collections')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Collections
          </button>

          <h1 className="text-4xl font-bold mb-2">{currentCollection.displayName}</h1>
          <p className="text-gray-400 mb-8">
            {currentCollection.items.length} Episodes
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {currentCollection.items.map((item, index) => (
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
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                      EP {index + 1}
                    </div>
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
        </div>
      </div>
    );
  }

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

  // View all collections
  const totalPages = Math.ceil(collections.length / ITEMS_PER_PAGE);
  const paginatedCollections = collections.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className='flex items-center'>
          {!user && <Link to={'/'}><img src='/klogo1.png' className='h-14 md:h-16 p-2'></img></Link>}
          <h1 className="text-2xl md:text-3xl font-bold">Collections</h1>
          </div>
         
          <button
            onClick={() => navigate('/hentocean')}
            className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            Back to Main
          </button>
        </div>

        <p className="text-gray-400 mb-6">
          {collections.length} collections found • Page {currentPage} of {totalPages}
        </p>

        {collections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No collections found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
              {paginatedCollections.map((collection) => (
                <Link
                  key={collection.baseName}
                  to={`/hentocean/collections/${collection.baseName}`}
                  className="group"
                >
                  <div className="bg-gray-800 rounded-lg overflow-hidden  hover:bg-gray-700 transition-all">
                    <div className="aspect-[3/4] relative">
                      <img
                        src={collection.thumbnail}
                        alt={collection.displayName}
                        className="w-full h-full object-cover "
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="flex items-center justify-between">
                          <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                            {collection.items.length} EPs
                          </span>
                          <Play className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm line-clamp-2">
                        {collection.displayName}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Latest: {new Date(collection.latestDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

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
                    
                    if (currentPage > 3) {
                      pages.push('...');
                    }
                    
                    // Show pages around current page
                    const start = Math.max(2, currentPage - 1);
                    const end = Math.min(totalPages - 1, currentPage + 1);
                    
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
          </>
        )}
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

export default HanimeCollectionsPage;