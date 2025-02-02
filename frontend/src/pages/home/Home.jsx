import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='hero-bg h-screen'>
      <header className='max-w-6xl mx-auto flex items-center justify-center p-4'>
        <div className='flex items-center'>
          <img src='/klogo.png' alt='logo' className='w-24' />
          <h1 className='text-red-700 font-bold text-7xl'>Flix</h1>
        </div>
      </header>
      <div className='flex items-center justify-center mt-20 mx-3'>
        <div className='w-full max-w-md bg-black/70 shadow-md p-8 rounded-lg'>
          <h1 className='text-2xl text-white mb-4 font-bold text-center'>Welcome to Flix</h1>
          <p className='text-white text-center'>Flix is a platform where you can watch your favorite movies and TV shows.</p>
          <div className='flex justify-center mt-4'>
            <Link to={'/signup'}>
            <button className='py-2 px-4 bg-red-500 text-white rounded-md font-semibold hover:bg-red-700'>Get Started
            </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;