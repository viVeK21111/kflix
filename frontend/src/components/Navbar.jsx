import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import { userAuthStore } from '../store/authUser';
import {Search,LogOut,Menu} from 'lucide-react';
import { useContentStore } from '../store/content';

const Navbar = () => {
    const [isMobileMenuOpen,setisMobileMenuOpen] = useState(false);
    
    const toggleMobileMenu = () => {
        setisMobileMenuOpen(!isMobileMenuOpen);
    };
    const {user,logout}  = userAuthStore();
    const {setContentType} = useContentStore();

    return (
        <header className='max-w mx-auto flex flex-wrap items-center justify-between p-4 h-20'>
            <div className='flex items-center z-50'>
                <Link to='/'><img src='/kflix2.png' alt='logo' className='w-32 sm:w-40'></img></Link>
            </div>
            <div className='hidden sm:flex items-center ml-5 gap-4 mr-auto z-50'>
                <Link to='/' className='hover:underline' onClick={() => setContentType('movies')}>Movies</Link>
                <Link to='/' className='hover:underline' onClick={() => setContentType('tv')}>Tv shows</Link>
                <Link to='/chat' className='hover:underline'>Chat</Link>
            </div>
            <div className='flex gap-2 ml-auto items-center z-50'>
                <Link to='/search'>
                <Search className="size-6 cursor-pointer"/>
                </Link>
                <Link to={'/profile'}>  <img src = {user.image} alt='avatar' className='h-8 rounded cursor-pointer'/></Link>

                <div className='sm:hidden'>
                    <Menu className='size-6 cursor-pointer' onClick={toggleMobileMenu}/>
                </div>
               
            </div>
            {isMobileMenuOpen && (
                <div className='w-full sm:hidden mt-4 z-50 bg-black border rounded border-gray-800'>
                    <Link to='/' className='block hover:underline p-2' onClick={toggleMobileMenu}>Movies</Link>
                    <Link to='/' className='block hover:underline p-2' onClick={toggleMobileMenu}>Tv shows</Link>
                    <Link to='/chat' className='block hover:underline p-2' onClick={toggleMobileMenu}>Chat</Link>
                    <Link to='/history' className='block hover:underline p-2' onClick={toggleMobileMenu}>History</Link>
                </div>
            )}
        </header>
    );
}

export default Navbar;
