import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight,Loader } from "lucide-react";


const AuthScreen = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [Loading,setLoading] = useState(true);
    const [Loading1,setLoading1] = useState(true);
      const logoImage = new Image();
      logoImage.src = '/hero.png';
      const logo = new Image();
      logo.src = '/kflix2.png';
      logoImage.onload = () => {
        setLoading(false);
      }
      logo.onload = () => {
        setLoading1(false);
      }
      if((Loading || Loading1)) {
        return (
            <div className="h-screen ">
            <div className="flex justify-center items-center bg-black h-full">
            <Loader className="animate-spin text-red-600 w-10 h-10"/>
            </div>
          </div>
        )
      }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        navigate("/signup?email=" + email);
    };

    return (
        <div className='hero-bg relative'>
            {/* Navbar */}
            <div className='flex items-center justify-between p-2  max-w-6xl ml-2  md:ml-3'>
                
                <img src='/kflix2.png' alt='Netflix Logo' className='w-52' /> 
               
                <Link to={"/login"} className='text-white bg-red-600 py-1 px-2 rounded'>
                    Sign In
                </Link>
            </div>

            {/* hero section */}
            <div className='h-screen flex flex-col items-center justify-center text-center  text-white max-w-6xl mx-auto'>
                <h1 className='text-2xl md:text-4xl font-bold mb-4'>Unlimited free movies, TV shows, and more</h1>
                <p className='hidden sm:flex text-base mb-4'>Watch anywhere at ease.</p>
                <p className='mb-4'>Ready to watch? Enter your email to create account.</p>

                <form className='flex flex-col md:flex-row gap-4 w-64 md:w-1/2 mb-20' onSubmit={handleFormSubmit}>
                    <input
                        type='email'
                        placeholder='Email address'
                        className='p-2 rounded flex-1 bg-black/80 border border-gray-700'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button className='bg-red-600 text-xl px-2 lg:px-6 py-1 md:py-2 rounded flex justify-center items-center'>
                        Get Started
                        <ChevronRight className='size-8 md:size-8' />
                    </button>
                </form>
            </div>

            {/* separator */}
            <div className='h-1 w-full bg-[#232323]' aria-hidden='true' />

            {/* 1st section */}
            <div className='py-5 bg-black text-white'>
                <div className='flex max-w-6xl  items-center justify-center md:flex-row flex-col px-4 mx-10 xl:mx-auto md:px-2'>
                    {/* left side */}
                    <div className='flex-1 text-center md:text-left'>
                        <h2 className='text-3xl md:text-4xl font-extrabold mb-4'>Enjoy your Movies and Tvshows</h2>
                        <p className='text-lg md:text-xl'>
                            For completely Free
                        </p>
                    </div>
                    {/* right side */}
                    <div className='flex-1 relative'>
                        <img src='/tv.png' alt='Tv image' className='mt-4 z-20 relative' />
                        <video
                            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1/2 z-10'
                            playsInline
                            autoPlay={true}
                            muted
                            loop
                        >
                            <source src='/hero-vid.m4v' type='video/mp4' />
                        </video>
                    </div>
                </div>
            </div>

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
                            Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.
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