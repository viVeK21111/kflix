import { Link } from 'react-router-dom'
import { useState } from 'react';
import { userAuthStore } from '../store/authUser';

const LoginPage = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const {signin} = userAuthStore();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    signin({email,password});
  }
  return (
    <div className='h-screen w-full hero-bg'>
      <header className='max-w-6xl mx-auto flex items-center justify-center p-4'>
        <Link to={'/'} className='flex items-center'>
        <img src={'/kflix2.png'} alt='logo' className='w-52' />
      
        </Link>
      </header>
      <div className='flex items-center justify-center mt-15 mx-3'>
        <div className='w-full max-w-md bg-black/70 shadow-md p-8 rounded-lg'>
          <h1 className='text-2xl text-white mb-4 font-bold text-center'>Sign In</h1>
          <form className='space-y-4' onSubmit={handleSubmit}>
            <div>
              <label htmlFor='email' className='text-sm text-white font-medium block'>Email</label>
              <input type='email' id='email' name='email' className='w-full p-2 border border-gray-300 rounded-md bg-transparent text-white mt-1' 
              placeholder='Enter your email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}/>
            </div>
                    
              <div>
              <label htmlFor='password' className='text-sm text-white font-medium block'>Password</label>
              <input type='password' id='password' name='password' className='w-full p-2 border border-gray-300 rounded-md bg-transparent text-white mt-1' 
              placeholder='Enter your password'
              value={password}
              onChange={(e)=> setPassword(e.target.value)}/>
            </div>
            <button type='submit' className='w-full py-2 px-4 bg-red-500 text-white rounded-md font-semibold hover:bg-red-700'>Sign In</button>  
          </form>
          <div className='flex m-3'>
            <div className='text-semibold flex text-white text-left mr-2'>Don't have an account?</div>
            <Link to={'/signup'} className='block text-left text-red-700 underline font-semibold'><spawn>Sign Up</spawn></Link>
            </div>
         
      </div>
    </div>
  </div>
  )
};

export default LoginPage;