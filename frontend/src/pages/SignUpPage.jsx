import { Link } from 'react-router-dom'
import { useState } from 'react';
import { userAuthStore } from '../store/authUser';
import { Eye, EyeOff } from 'lucide-react';


const SignUpPage = () => {
  const {searchParams} = new URL(document.location)
  const emailval = searchParams.get("email");
  const [email,setEmail] = useState(emailval || "");
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const {signup} = userAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup({email,username,password});
    
  }

  return (
    <div className='h-screen w-full contact-bg'>
      <header className='max-w-6xl mx-auto flex items-center justify-center p-4'>
        <Link to={'/'} className='flex items-center'>
        <img src={'/kflix3.png'} alt='logo' className='w-52' />
        
        </Link>
      </header>
      <div className='flex items-center justify-center mx-3'>
        <div className='w-full max-w-md bg-black/70 shadow-md p-8 rounded-lg'>
          <h1 className='text-2xl text-white mb-4 font-bold text-center'>Sign Up</h1>
          <form className='space-y-4' onSubmit={handleSubmit}>
            <div>
              <label htmlFor='email' className='text-sm text-white font-medium block'>Email</label>
              <input type='email' id='email' name='email' className='w-full p-2 border border-gray-300 rounded-md bg-transparent text-white mt-1' 
              placeholder='Enter your email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div>
            <label htmlFor='username' className='text-sm text-white font-medium block'>Username</label>
              <input type='text' id='username' name='username' className='w-full p-2 border border-gray-300 rounded-md bg-transparent text-white mt-1' 
              placeholder='Enter your username'
              value={username}
              onChange={(e)=> setUsername(e.target.value)}/>
              </div>            
              <div>
              <label htmlFor='password' className='text-sm text-white font-medium block'>Password</label>
              <div className='flex items-center relative'> 
              <input type={showPassword ? "text" : "password"} id='password' name='password' className=' w-full p-2 border border-gray-300 rounded-md bg-transparent text-white mt-1' 
              placeholder='Enter your password'
              value={password}
              onChange={(e)=> setPassword(e.target.value)}/>
            <button
              type="button"
              className="absolute right-0 items-center px-3 text-gray-400 hover:text-white"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
              </div>
            </div>
            <button type='submit' className='w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold'>Sign Up</button>  
          </form>
          <div><p className="text-white text-center p-1">or</p></div>

          <button
            onClick={() => window.location.href = `${import.meta.env.VITE_BACKEND_URL || ''}/api/v1/auth/google`}
            className='w-full py-2 px-4 rounded-md font-base  bg-gray-800 text-white hover:bg-gray-700   flex items-center justify-center gap-2'
            type='button'
          >
            <img src='/google-icon.png' alt='Google' className='h-5 w-5' />
            Sign up with Google
          </button>
          {/*<div className='text-center text-white text-sm m-3'>By signing up, you agree to our Terms, Data Policy and Cookies Policy.</div>  */} 
            <div className='flex mt-4'>
            <div className='text-semibold flex text-white text-left mr-2'>Already signed up?</div>
            <Link to={'/login'} className='block text-left text-blue-400 underline font-semibold'> <spawn>Sign In</spawn></Link>
            </div>
      </div>
    </div>
  </div>
  )
};

export default SignUpPage;