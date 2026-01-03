import { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight,Loader } from "lucide-react";


const AuthScreen = () => {
    const navigate = useNavigate();
    const [Loading,setLoading] = useState(true);

    useEffect(() => {
      let isMounted = true;
  
      const hero = new Image();
      hero.src = "/hero.png";
  
      hero.onload = () => {
        if (isMounted) setLoading(false);
      };
  
      hero.onerror = () => {
        if (isMounted) setLoading(false); // fail-safe
      };
  
      return () => {
        isMounted = false;
      };
    }, []);

      if((Loading)) {
        return (
            <div className="h-screen ">
            <div className="flex justify-center items-center bg-black h-full">
            <Loader className="animate-spin text-gray-500 w-10 h-10"/>
            </div>
          </div>
        )
      }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        navigate("/signup");
    };

    return (
        <div className='relative '>
            {/* Navbar */}
            <div className="hero-bg">
            <div className='flex items-center justify-between p-2  max-w-full ml-2  md:ml-3'>
                
                <img src='/kflix3.png' alt='Netflix Logo' className='w-32 sm:w-36 h-22' /> 
               
                <Link to={"/login"} className='text-white bg-gray-600 bg-opacity-80 hover:bg-opacity-90 py-1 px-2 rounded'>
                    Sign In
                </Link>
            </div>

            {/* hero section */}
            <div className='h-screen flex flex-col pb-10 items-center justify-center text-center  text-white max-w-6xl mx-auto'>
                <h1 className='text-xl sm:text-2xl md:text-3xl font-bold mb-4'>Watch Movies, Tv shows, and More</h1>
 
                 
                    <button onClick={handleFormSubmit} className='bg-blue-600 hover:bg-blue-700 text-lg  md:text-xl px-2 md:px-4 lg:px-6 py-2  rounded flex justify-center items-center'>
                        Get Started
                        <ChevronRight className='size-6 pt-1 flex items-center justify-center md:size-7' />
                    </button>
              
            </div>
            </div>
           

            {/* separator */}
            <div className=' w-full bg-[#232323]' aria-hidden='true' />

            

            {/* separator */}
            <div className='h-1 w-full bg-[#232323]' aria-hidden='true' />

            {/* 2nd section */}
            
            <div className='py-5 bg-black text-white'>
                <div className='flex max-w-8xl mx-auto items-center justify-center md:flex-row flex-col-reverse px-5'>
                    {/* left side */}
                    <div className='flex relative mt-5 lg:mt-0 ml-0 md:ml-32 lg:ml-56 xl:ml-96 '>
                        <div className='relative'>
                        <video
                            className="rounded-3xl h-96"
                            playsInline
                            autoPlay={true}
                            muted
                            loop
                        >
                            <source src='/chatvideo.mp4' type='video/mp4' />
                        </video>
                            
                        </div>
                    </div>
                    {/* right side */}

                    <div className='flex-1 md:text-left text-center  md:ml-20 lg:mr-24 xl:mr-44'>
                        <h2 className='text-3xl md:text-4xl font-extrabold mb-4 text-balance'>
                            Chat with your Personal AI Assistant
                        </h2>
                        <p className='text-lg md:text-xl'>
                            Get personalized recommendations and assistance with your movie and show choices.
                        </p>
                    </div>
                </div>
            </div>

            {/* separator */}

            <div className='h-1 w-full bg-[#232323]' aria-hidden='true' />

            {/* 3rd section */}
            <div className='py-5 bg-black text-white'>
                <div className='flex max-w-6xl items-center justify-center md:flex-row flex-col px-4 mx-10 xl:mx-auto md:px-2'>
                    {/* left side */}
                    <div className='flex-1 text-center md:text-left'>
                        <h2 className='text-3xl md:text-4xl font-extrabold mb-4'>Watch everywhere</h2>
                        <p className='text-lg md:text-xl'>
                            Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV for completely free.
                        </p>
                    </div>

                    {/* right side */}
                    <div className='flex-1 relative overflow-hidden'>
                        <img src='/device-pile.png' alt='Device image' className='mt-4 z-20 relative' />
                        <video
                            className='absolute top-2 left-1/2 -translate-x-1/2  h-4/6 z-10
               max-w-[63%] 
              '
                            playsInline
                            autoPlay={true}
                            muted
                            loop
                        >
                            <source src='/video-devices.m4v' type='video/mp4' />
                        </video>
                    </div>
                </div>
            </div>

            <div className='h-1 w-full bg-[#232323]' aria-hidden='true' />

        </div>
    );
};
export default AuthScreen;