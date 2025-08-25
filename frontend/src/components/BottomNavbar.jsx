import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Bot, User, Bookmark,Ellipsis, Clapperboard, TvMinimal  } from 'lucide-react';
import { useContentStore } from '../store/content';

const BottomNavbar = ({ className = "" }) => {
  const location = useLocation();
  const {contentType,setContentType} = useContentStore();
  const scrollToMovies = (type) => {
    setContentType(type);
    //setTimeout(() => {
      //movieSectionRef?.current?.scrollIntoView({ behavior: "smooth",block: "start" });
    //},500); 
  };


  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      icon: Bot,
      label: 'Chat',
      path: '/chat',
    },
    {
      icon: Bookmark,
      label: 'Watchlist',
      path: '/watchlist',
    },
    {
      icon: User,
      label: 'Profile',
      path: '/profile',
    },
  ];

  return (
    <nav className={`fixed bottom-0 right-0 left-0 sm:bottom-0 sm:right-auto sm:top-0 sm:left-0 bg-black sm:border-r sm:border-gray-800 border-gray-700 z-40 ${className}`}>
      <div className="flex sm:flex-col sm:gap-5 sm:pt-5  justify-around items-center h-16 px-4">
      <Link
            to={'/'}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
              isActive('/')
                  ? 'text-gray-400 '
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Home
                size={24}
                className={`transition-all duration-200 ${
                  isActive('/') ? 'stroke-2' : 'stroke-1'
                }`}
              />
              <span className="text-xs mt-1 font-medium">Home</span>
      </Link>
      <Link
            to={'/search'}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
              isActive('/search')
                  ? 'text-gray-400 '
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Search
                size={24}
                className={`transition-all duration-200 ${
                  isActive('/search') ? 'stroke-2' : 'stroke-1'
                }`}
              />
              <span className="text-xs mt-1 font-medium">search</span>
      </Link>

      <Link
            to={'/'}
            onClick={() => scrollToMovies('movies')}
            className={`hidden sm:flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 text-gray-400 hover:text-white`}
              
            >
              <Clapperboard
                size={24}
                className={`transition-all duration-200 stroke-1`}
              />
              <span className="text-xs mt-1 font-medium">Movies</span>
      </Link>

      <Link
            to={'/'}
            onClick={() => scrollToMovies('tv')}
            className={`hidden sm:flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 text-gray-400  hover:text-white`}
              
            >
              <TvMinimal
                size={24}
                className={`transition-all duration-200  stroke-1`}
              />
              <span className="text-xs mt-1 font-medium">Tv show</span>
      </Link>

        {navItems.map((item) => {
          const IconComponent = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                active
                  ? 'text-gray-400 '
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <IconComponent
                size={24}
                className={`transition-all duration-200 ${
                  active ? 'stroke-2' : 'stroke-1'
                }`}
              />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}

          <Link
            to={'/fun'}
            className={`hidden sm:flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
              isActive('/fun')
                  ? 'text-gray-400 '
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Ellipsis
                size={24}
                className={`transition-all duration-200 ${
                  isActive('/fun') ? 'stroke-2' : 'stroke-1'
                }`}
              />
              <span className="text-xs mt-1 font-medium">More</span>
      </Link>

      </div>
    </nav>
  );
};

export default BottomNavbar; 