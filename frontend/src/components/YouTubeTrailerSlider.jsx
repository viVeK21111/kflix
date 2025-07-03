import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const YouTubeTrailerSlider = ({ trailers }) => {
  const sliderRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: 'smooth' });
    }
  };
  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: 'smooth' });
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <div className="flex space-x-4 overflow-x-scroll scrollbar-hide" ref={sliderRef}>
        {trailers.map((trailer) => (
          <a
            key={trailer.id.videoId}
            href={`https://www.youtube.com/watch?v=${trailer.id.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-[250px] relative group"
            title={trailer.snippet.title}
          >
            <div className="rounded-lg overflow-hidden">
              <img
                src={trailer.snippet.thumbnails.medium.url}
                alt={trailer.snippet.title}
                className="h-36 w-full transition-transform duration-300 rounded-xl border border-white border-opacity-60 ease-in-out group-hover:scale-110"
              />
            </div>
            <p className="mt-2 text-center text-white text-base font-semibold line-clamp-2">
              {trailer.snippet.title}
            </p>
          </a>
        ))}
      </div>
      {showArrows && (
        <>
          <button
            className="absolute top-1/2 -translate-y-1/2 left-2 flex items-center justify-center size-10 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10"
            onClick={scrollLeft}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="absolute top-1/2 -translate-y-1/2 right-2 flex items-center justify-center size-10 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10"
            onClick={scrollRight}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  );
};

export default YouTubeTrailerSlider; 