import { useLocation } from 'react-router-dom';

function WatchPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const movieId = queryParams.get('id');
    // Optional: Handle missing or invalid ID

    if (!movieId) {
        return <div className="text-white text-center">Invalid video ID</div>;
      }
      return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
          {/* Video Container */}
          <div className="w-full max-w-4xl bg-black rounded-lg shadow-2xl overflow-hidden">
            {/* Video Player */}
            <iframe
              allowFullScreen
              scrolling="no"
              src={`https://vidsrc.dev/embed/movie/${movieId}`}
              className="w-full aspect-video"
            ></iframe>
          </div>
    
          {/* Additional Content (Optional) */}
          <div className="mt-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Now Playing</h1>
            <p className="text-gray-400">Enjoy your favorite movie in high quality!</p>
          </div>
        </div>
      );
    };
export default WatchPage;
