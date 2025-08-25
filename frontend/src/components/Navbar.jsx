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
        <header className='w-full flex flex-wrap items-center justify-between p-4 h-20'>
            <div className=' items-center z-50'>
                <Link to='/'><img src='/kflix3.png' alt='logo' className='w-32 sm:w-32 h-14'></img></Link>
            </div>
           
            <div className='flex gap-2 ml-auto items-center z-50'>
                <div className='sm:hidden'>
                    <Menu className='size-8 cursor-pointer bg-slate-700 p-1 rounded-lg transition-all duration-400 hover:scale-110' onClick={toggleMobileMenu}/>
                </div>
               
            </div>
           
               <div className={`fixed top-20 right-0 w-72 rounded-lg h-58 bg-gray-800 z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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
                    
                   

                    <Link to='/fun' className='block p-3  hover:bg-slate-700  border-slate-700' onClick={toggleMobileMenu}>
                    <p className='flex items-center text-white'>
                            
                                    <p className='font-semibold'>More...</p>
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
