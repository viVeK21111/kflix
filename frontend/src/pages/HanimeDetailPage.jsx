import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Loader, Tag } from 'lucide-react';
import axios from 'axios';

const HanimeDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [rssData, setRssData] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const RSS_URL = '/api/v1/hanime/rss'; // Proxied through backend
  const API_URL = '/api/v1/hanime/metadata'; // Proxied through backend

  // Fetch data from RSS feed
  const fetchRSSData = async () => {
    try {
      const response = await axios.get(RSS_URL);
      const parser = new DOMParser();
      const xml = parser.parseFromString(response.data, 'text/xml');
      const itemNodes = xml.querySelectorAll('item');
      
      for (let item of itemNodes) {
        const link = item.querySelector('link')?.textContent;
        const itemSlug = link?.match(/\/watch\/([^\/]+)/)?.[1];
        
        if (itemSlug === slug) {
          setRssData({
            guid: item.querySelector('guid')?.textContent,
            title: item.querySelector('title')?.textContent,
            link: link,
            description: item.querySelector('description')?.textContent,
            pubDate: item.querySelector('pubDate')?.textContent,
            embedUrl: item.querySelector('embedUrl')?.textContent,
            thumbnail: item.querySelector('thumbnail')?.getAttribute('url'),
          });
          break;
        }
      }
    } catch (error) {
      console.error('Error fetching RSS:', error);
      setError('Failed to load content');
    }
  };


  // Fetch metadata from API
  const fetchMetadata = async () => {
    try {
      const response = await axios.get(`${API_URL}/${slug}`);
      setMetadata({
        info: response.data.info?.[0] || {},
        genres: response.data.genres?.map(g => g.genre) || []
      });
    } catch (error) {
      console.error('Error fetching metadata:', error);
      setError('Failed to load metadata');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  },[])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchRSSData(), fetchMetadata()]);
      setLoading(false);
    };
    
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader className="animate-spin text-white w-10 h-10" />
      </div>
    );
  }

  if (error || !rssData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error || 'Content not found'}</p>
          <button
            onClick={() => navigate('/hentocean')}
            className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto md:py-2">
      

        {/* Title */}
        

        {/* Video Player */}
        <div className="mb-6 md:px-4">
          <div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={rssData.embedUrl+'?logo=https://www.kflix.site/klogo1.png'}
              className="absolute top-0 left-0 w-full h-full md:rounded-lg"
              frameBorder="0"
              marginWidth='0'
              marginHeight='0'
              scrolling='no'
              allowFullScreen
           
              allow="autoplay; fullscreen;"
            />
          </div>
        </div>
        <h1 className="text-lg px-2 md:px-4 md:text-xl lg:text-2xl font-bold md:mb-8">{rssData.title}</h1>
        {/* Info Section */}
        <div className="grid px-2 md:px-4 gap-6 mb-8 md:grid-cols-[280px_1fr] items-start">
  
  {/* Thumbnail */}
  <div className="flex justify-center md:justify-start">
    <img
      src={rssData.thumbnail}
      alt={rssData.title}
      className="hidden md:flex w-54 md:w-58 h-64 md:h-80 rounded-lg shadow-lg object-cover"
    />
  </div>

  {/* Details */}
  <div className="space-y-4">

    {/* Release Date */}
    {metadata?.info?.releasedate && (
      <div className="flex text-sm md:text-base items-center gap-2 text-gray-300">
        <Calendar className="w-5 h-5" />
        <span className="font-semibold">Release:</span>
        <span>
          {new Date(metadata.info.releasedate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>
    )}

    {/* Upload Date */}
    {metadata?.info?.uploaddate && (
      <div className="flex text-sm md:text-base items-center gap-2 text-gray-300">
        <Calendar className="w-5 h-5" />
        <span className="font-semibold">Uploaded:</span>
        <span>
          {new Date(metadata.info.uploaddate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>
    )}

    {/* Genres */}
    {metadata?.genres?.length > 0 && (
      <div>
        <span className="font-semibold text-gray-300">Genres:</span>
        <div className="flex flex-wrap gap-2 mt-2">
          {metadata.genres.map((genre, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-600 rounded-full text-sm capitalize"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Description */}
    <div>
      <h2 className="text-lg md:text-xl font-bold mb-2">Description</h2>
      <p className="text-gray-300 leading-relaxed">
        {metadata?.info?.description || rssData.description || 'No description available.'}
      </p>
    </div>

    {/* Series */}
    {metadata?.info?.series && (
      <div>
        <h3 className="text-lg font-semibold">Series</h3>
        <p className="text-gray-300">{metadata.info.series}</p>
      </div>
    )}

    {/* Status */}
    {metadata?.info?.status !== undefined && (
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-300">Status:</span>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            metadata.info.status === 1 ? 'bg-green-600' : 'bg-gray-600'
          }`}
        >
          {metadata.info.status === 1 ? 'Active' : 'Inactive'}
        </span>
      </div>
    )}
    <p className='text-yellow-400'>Use Brave browser or adblocker to minimize the adds and popups</p>
    <div className="flex justify-center md:justify-start">
    <img
      src={rssData.thumbnail}
      alt={rssData.title}
      className="md:hidden w-54 mt-2 md:w-58 h-64 md:h-80 rounded-lg shadow-lg object-cover"
    />
  </div>
  </div>
</div>

      
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

export default HanimeDetailPage;