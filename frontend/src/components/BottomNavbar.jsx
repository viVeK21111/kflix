import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Home, Search, Bot, User, Bookmark,Ellipsis, Clapperboard, TvMinimal,Menu ,X,Tv,Eclipse  } from 'lucide-react';
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
  const [isMobileMenuOpen,setisMobileMenuOpen] = useState(false);
    
    const toggleMobileMenu = () => {
        setisMobileMenuOpen(!isMobileMenuOpen);
    };


  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      icon: Bot,
      label: 'Flix chat',
      path: '/chat',
    },
    {
      icon: Bookmark,
      label: 'Watchlist',
      path: '/watchlist',
    },
    
  ];

  return (
    <nav className={`fixed bottom-0 right-0 left-0 sm:bottom-0 sm:right-auto sm:top-0 sm:left-0 bg-black sm:border-r sm:border-gray-800 border-gray-700 z-40 ${className}`}>
      <div className="flex sm:flex-col justify-around items-center h-16 px-7 sm:h-full sm:overflow-y-auto sm:pt-12 sm:pb-20 sm:gap-10 scrollbar-hide">
        {/* Custom scrollbar styles */}
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        <Link
              to={'/'}
              className={`group flex items-center justify-center flex-1 sm:flex-none h-full sm:h-auto transition-all duration-200 ${
                isActive('/')
                    ? 'text-gray-400 '
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Home
                  size={24}
                  className={`transition-all duration-200 stroke-3 ${
                    isActive('/') ? 'text-white' : ''
                  }`}
                />
                <span className="absolute text-sm hidden sm:group-hover:flex bg-black px-2 py-1 rounded-lg ml-24 items-center font-medium text-gray-400">Home</span>
        </Link>
        
        <Link
              to={'/search'}
              className={`group flex flex-col items-center justify-center flex-1 sm:flex-none h-full sm:h-auto transition-all duration-200 ${
                isActive('/search')
                    ? 'text-gray-400 '
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Search
                  size={24}
                  className={`transition-all duration-200 stroke-3 ${
                    isActive('/search') ? 'fill-white text-white' : ''
                  }`}
                />
                <span className="absolute text-sm hidden sm:group-hover:flex bg-black px-2 py-1 rounded-lg ml-24 items-center font-medium text-gray-400">Search</span>
        </Link>

        <Link
              to={'/'}
              onClick={() => scrollToMovies('movies')}
              className={`group hidden sm:flex flex-col items-center justify-center flex-1 sm:flex-none h-full sm:h-auto transition-all duration-200 text-gray-400 hover:text-white`}
                
              >
                <Clapperboard
                  size={23}
                  className={`transition-all duration-200 stroke-2`}
                />
                <span className="absolute text-sm hidden sm:group-hover:flex bg-black px-2 py-1 rounded-lg ml-24 items-center font-medium text-gray-400">Movies</span>
        </Link>

        <Link
              to={'/'}
              onClick={() => scrollToMovies('tv')}
              className={`group hidden sm:flex flex-col items-center justify-center flex-1 sm:flex-none h-full sm:h-auto transition-all duration-200 text-gray-400  hover:text-white`}
                
              >
                <TvMinimal
                  size={23}
                  className={`transition-all duration-200  stroke-2`}
                />
                <span className="absolute text-sm hidden sm:group-hover:flex bg-black px-2 py-1 rounded-lg ml-24 items-center font-medium text-gray-400">Tvshow</span>
        </Link>

        
        <Link
              to={'/anime'}
              className={`group hidden sm:flex flex-col items-center justify-center flex-1 sm:flex-none h-full sm:h-auto transition-all duration-200 ${
                isActive('/anime')
                    ? 'text-gray-400 '
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Eclipse 
                  size={23}
                  className={`transition-all duration-200 stroke-3 ${
                    isActive('/anime') ? 'text-white' : ''
                  }`}
                />
                <span className="absolute text-sm hidden sm:group-hover:flex bg-black px-2 py-1 rounded-lg ml-24 items-center font-medium text-gray-400">Anime</span>
          </Link>

          {navItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex flex-col items-center justify-center flex-1 sm:flex-none h-full sm:h-auto transition-all duration-200 ${
                  active
                    ? 'text-gray-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <IconComponent
                  size={24}
                  className={`transition-all duration-200 stroke-3 ${
                    active ? 'fill-white text-white' : ''
                  }`}
                />
                <span className="absolute text-sm  hidden sm:group-hover:flex items-center w-16 bg-black ml-28 rounded-lg py-1 text-gray-400 font-medium">{item.label}</span>
              </Link>
            );
          })}

          <Link
              to={'/profile'}
              className={`group hidden sm:flex flex-col items-center justify-center flex-1 sm:flex-none h-full sm:h-auto transition-all duration-200 ${
                isActive('/profile')
                    ? 'text-gray-400 '
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <User
                  size={24}
                  className={`transition-all duration-200 stroke-3 ${
                    isActive('/profile') ? 'fill-white text-white' : ''
                  }`}
                />
                <span className="absolute text-sm hidden sm:group-hover:flex bg-black px-2 py-1 rounded-lg ml-24 items-center font-medium text-gray-400">Profile</span>
          </Link>

                <div className='sm:hidden flex ml-5 mr-3 items-center z-50'>
                      <Menu className='size-8 cursor-pointer text-gray-400 p-1 rounded-lg transition-all duration-400 hover:scale-110' onClick={toggleMobileMenu}/>
              </div>

            <Link
              to={'/fun'}
              className={`group hidden sm:flex flex-col items-center justify-center flex-1 sm:flex-none h-full sm:h-auto transition-all duration-200 ${
                isActive('/fun')
                    ? 'text-gray-400 '
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Ellipsis
                  size={24}
                  className={`transition-all duration-200 stroke-3 ${
                    isActive('/fun') ? 'text-white' : ''
                  }`}
                />
                <span className="absolute text-sm hidden sm:group-hover:flex bg-black px-2 py-1 rounded-lg ml-20 items-center font-medium text-gray-400">Fun</span>
            </Link>

                
                <div className={`fixed bottom-20 right-0 w-72 rounded-l-lg h-58 bg-gray-800 z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                 <div className="flex justify-between items-center p-4 border-b border-gray-600">
                   <h2 className="text-white text-lg font-semibold">More</h2>
                   <button onClick={toggleMobileMenu} className="text-white">
                     <X size={24} />
                   </button>
                          </div>
                 
                      <Link className='flex p-3 text-white border-b border-gray-700 items-center hover:bg-gray-700' to={'/profile'} onClick={toggleMobileMenu}><User size={18} className=''/><p className='ml-2'>Profile</p></Link>
                      <Link to='/' className='block p-3 border-b  border-slate-700 hover:bg-slate-700' onClick={ () => {
                      toggleMobileMenu();
                      scrollToMovies('movies');
                      }}>
                               <p className='flex items-center text-white'>
                                      <Clapperboard className='h-5 w-4 mr-2'/>
                                      <p className=''>Movies</p>
                                    </p>
                      </Link>
                      <Link to='/' className='block hover:bg-slate-700 p-3 border-b border-slate-700' onClick={() => {
                          toggleMobileMenu();
                          scrollToMovies('tv');
                          }}>
                               <p className='flex items-center text-white'>
                                      <Tv className='h-5 w-4 mr-2'/>
                                      <p className=''>Tv shows</p>
                                    </p>

                      </Link>

                      <Link to='/anime' className='block hover:bg-slate-700 p-3 border-b border-slate-700' onClick={() => {
                          toggleMobileMenu();
                          }}>
                               <p className='flex items-center text-white'>
                                      <Eclipse className='h-5 w-4 mr-2'/>
                                      <p className=''>Anime</p>
                                    </p>

                      </Link>

                      <Link to='/fun' className='block p-3  hover:bg-slate-700  border-slate-700' onClick={toggleMobileMenu}>
                      <p className='flex items-center text-white'>
                        <Ellipsis className='mr-2 h-5 w-4' />
                                      <p className=''>Fun</p>
                                    </p>
                      </Link>
                  </div>
                  
            
                {isMobileMenuOpen && (
                      <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={toggleMobileMenu}
                      ></div>
                    )}

      </div>
    </nav>
  );
};

export default BottomNavbar;