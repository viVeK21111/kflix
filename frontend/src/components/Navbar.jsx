import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import { userAuthStore } from '../store/authUser';
import {Search,LogOut,Menu} from 'lucide-react';
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
                <Link to='/'><img src='/kflix2.png' alt='logo' className='w-32 sm:w-40'></img></Link>
            </div>
            <div className='hidden sm:flex items-center ml-5 gap-4 mr-auto z-50'>
                <button className={`hover:underline ${contentType==='movies'? 'underline':''}`} onClick={() => scrollToMovies('movies')}>Movies</button>
                <button className={`hover:underline ${contentType==='tv'? 'underline':""}`}onClick={() => scrollToMovies('tv')}>Tv shows</button>
                <Link to='/chat' className='hover:underline'>Chat</Link>
                <Link to='/watchlist' className='hover:underline'>Watchlist</Link>
            </div>
            <div className='flex gap-2 ml-auto items-center z-50'>
            <Link className='flex ' to='/search'>
                <div className='flex bg-slate-500 rounded-3xl p-2 font-semibold text-base transition-all duration-400 hover:bg-slate-600 hover:scale-110'>
              
                <Search className="size-5 text-white cursor-pointer"/> 
               
                </div>
                </Link>
                <Link to={'/profile'}>  <img src = {user.image} alt='avatar' className='h-8 rounded transition-all duration-300 hover:scale-110 cursor-pointer'/></Link>

                <div className='sm:hidden'>
                    <Menu className='size-8 cursor-pointer bg-slate-800 p-1 rounded-lg transition-all duration-400 hover:bg-slate-700 hover:scale-110' onClick={toggleMobileMenu}/>
                </div>
               
            </div>
            {isMobileMenuOpen && (
                <div  className='w-full sm:hidden mt-4 z-50 bg-slate-900 border rounded border-gray-800'>
                    <Link to='/' className='block p-2 hover:bg-slate-600' onClick={ () => {
                    toggleMobileMenu
                    scrollToMovies('movies')
                    }}>Movies</Link>
                    <Link to='/' className='block hover:bg-slate-600 p-2 border-t border-slate-700' onClick={() => {
                        toggleMobileMenu
                        scrollToMovies('tv')
                        }}>Tv shows</Link>
                    <Link to='/chat' className='block  p-2 border-t hover:bg-slate-600  border-slate-700' onClick={toggleMobileMenu}>Chat</Link>
                    <Link to='/watchlist' className='block p-2 border-t hover:bg-slate-600  border-slate-700' onClick={toggleMobileMenu}>Watchlist</Link>
                </div>
            )}
        </header>
    );
}

export default Navbar;
