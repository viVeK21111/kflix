import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import { userAuthStore } from '../store/authUser';
import {Search,LogOut,Menu,X,TvMinimal,BotMessageSquare,Tv,Clapperboard } from 'lucide-react';
import { useContentStore } from '../store/content';

const Navbar = ({ movieSectionRef }) => {
    const [isMobileMenuOpen,setisMobileMenuOpen] = useState(false);
    
    const toggleMobileMenu = () => {
        setisMobileMenuOpen(!isMobileMenuOpen);
    };
    const {user}  = userAuthStore();
    const {contentType,setContentType} = useContentStore();

    const scrollToMovies = (type) => {
        setContentType(type);
        //setTimeout(() => {
          //movieSectionRef?.current?.scrollIntoView({ behavior: "smooth",block: "start" });
        //},500); 
      };

    return (
        <header className='max-w mx-auto flex flex-wrap items-center justify-between p-4 h-20'>
            <div className='flex items-center z-50'>
                <Link to='/'><img src='/kflix2.png' alt='logo' className='w-32 sm:w-32 h-14'></img></Link>
            </div>
            <div className='hidden md:flex items-center ml-5 gap-4 mr-auto z-50'>
                <button className={`hover:underline ${contentType==='movies'? 'underline':''}`} onClick={() => scrollToMovies('movies')}>Movies</button>
                <button className={`hover:underline ${contentType==='tv'? 'underline':""}`}onClick={() => scrollToMovies('tv')}>Tv shows</button>
                <Link to='/chat' className='hover:underline'>Flix Chat</Link>
                <Link to='/watchlist' className='hover:underline'>Watchlist</Link>
            </div>
            <div className='flex gap-2 ml-auto items-center z-50'>
            <Link className='flex ' to='/search'>
                <div className='flex bg-slate-500 rounded-3xl p-2 font-semibold text-base transition-all duration-400 hover:bg-slate-600 hover:scale-110'>
              
                <Search className="size-5 text-white cursor-pointer"/> 
               
                </div>
                </Link>
                {user && user.email ? (
                    <Link to={'/profile'}>  <img src = {user.image} alt='avatar' className='h-8 rounded transition-all duration-300 hover:scale-110 cursor-pointer'/></Link>
                ) : (
                    <button
                      onClick={() => window.location.href = `${import.meta.env.VITE_BACKEND_URL || ''}/api/v1/auth/google`}
                      className='py-2 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 flex items-center gap-2'
                      type='button'
                    >
                      <img src='/google-icon.png' alt='Google' className='h-5 w-5' />
                      Sign in with Google
                    </button>
                )}

                <div className='md:hidden'>
                    <Menu className='size-8 cursor-pointer bg-slate-700 p-1 rounded-lg transition-all duration-400 hover:scale-110' onClick={toggleMobileMenu}/>
                </div>
               
            </div>
           
               <div className={`fixed top-0 right-0 w-64 h-full bg-gray-800 z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
               <div className="flex justify-between items-center p-4 border-b border-gray-600">
                 <h2 className="text-white text-lg font-semibold">Menu</h2>
                 <button onClick={toggleMobileMenu} className="text-white">
                   <X size={24} />
                 </button>
                        </div>
               
                    <Link to='/' className='block p-3 border-b  border-slate-700 hover:bg-slate-600' onClick={ () => {
                    toggleMobileMenu
                    scrollToMovies('movies')
                    }}>
                             <p className='flex items-center text-white'>
                                    <Clapperboard className='h-6 w-5 mr-2'/>
                                    <p className='font-semibold'>Movies</p>
                                  </p>
                    </Link>
                    <Link to='/' className='block hover:bg-slate-600 p-3 border-b border-slate-700' onClick={() => {
                        toggleMobileMenu
                        scrollToMovies('tv')
                        }}>
                             <p className='flex items-center text-white'>
                                    <Tv className='h-6 w-5 mr-2'/>
                                    <p className='font-semibold'>Tv shows</p>
                                  </p>

                    </Link>
                    <Link to='/chat' className='block  p-3  hover:bg-slate-600 border-b  border-slate-700' onClick={toggleMobileMenu}>
                    <p className='flex items-center text-white'>
                                    <BotMessageSquare className='h-7 w-6 mr-2'/>
                                    <p className='font-semibold'>Flix Chat</p>
                                  </p>
                            </Link>
                    <Link to='/watchlist' className='block p-3 border-b hover:bg-slate-800  border-slate-700' onClick={toggleMobileMenu}>
                    <p className='flex items-center text-white'>
                                    <TvMinimal className='h-5 w-5 mr-3'/>
                                    <p className='font-semibold'>Watchlist</p>
                                  </p>
                    </Link>
                </div>
                
          
              {isMobileMenuOpen && (
                    <div 
                      className="fixed inset-0 bg-black bg-opacity-50 z-40"
                      onClick={toggleMobileMenu}
                    ></div>
                  )}
        </header>
    );
}

export default Navbar;
