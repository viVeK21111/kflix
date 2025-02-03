import { Link } from 'react-router-dom'
import { useState } from 'react';

const SignUpPage = () => {
  const [email,setEmail] = useState('');
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email,username,password);
    
  }
  return (
    <div className='h-screen w-full hero-bg'>
      <header className='max-w-6xl mx-auto flex items-center justify-center p-4'>
        <Link to={'/'} className='flex items-center'>
        <img src={'/kflix2.png'} alt='logo' className='w-52' />
        
        </Link>
      </header>
      <div className='flex items-center justify-center mt-20 mx-3'>
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
              <input type='password' id='password' name='password' className='w-full p-2 border border-gray-300 rounded-md bg-transparent text-white mt-1' 
              placeholder='Enter your password'
              value={password}
              onChange={(e)=> setPassword(e.target.value)}/>
            </div>
            <button type='submit' className='w-full py-2 px-4 bg-red-500 text-white rounded-md font-semibold hover:bg-red-700'>Sign Up</button>  
          </form>
          <div className='text-center text-white text-sm m-3'>By signing up, you agree to our Terms, Data Policy and Cookies Policy.</div>
            <div className='flex'>
            <div className='text-semibold flex text-white text-left mr-2'>Already signed up?</div>
            <Link to={'/login'} className='block text-left text-red-700 underline font-semibold'>Sign In</Link>
            </div>
      </div>
    </div>
  </div>
  )
};

export default SignUpPage;