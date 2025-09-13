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
        <header className='w-full flex flex-wrap items-center  p-4 h-20'>
            <div className='flex w-full justify-start sm:justify-end items-center  z-50'>
                <Link to='/'><img src='/kflix3.png' alt='logo' className='w-32 sm:w-32 h-14'></img></Link>
            </div>
           
            
           
        </header>
    );
}

export default Navbar;
