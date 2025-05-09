import React from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import {Loader,House,TvMinimal} from 'lucide-react';
import emailjs from 'emailjs-com';

const ContactPage = () => {
    const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [msgsent,setmsgsent] = useState(false);
  const [Loading,setLoading] = useState(true);

  const SECRET_KEY = import.meta.env.VITE_SECRET_EMAILJS;
  const SERVICE_KEY = import.meta.env.VITE_SERVIE_EMAILJS;
  const TEMPLATE_AUTO = import.meta.env.VITE_TEMPLATE_AUTO;
  const TEMPLATE_GET = import.meta.env.VITE_TEMPLATE_GET;

  useEffect(() => {
    window.scroll(0,0);
  })

  const logoImage = new Image();
  logoImage.src = '/hero.png';

  logoImage.onload = () => {
    setLoading(false);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/v1/contact/savemessage',formData);
      if ("message" in response.data) {
        toast.success(response.data.message)
        setmsgsent(true);
      }
      else {
        toast.success(response.data.error)
      }
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      const params = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message
    };
    

    emailjs.send(SERVICE_KEY, TEMPLATE_GET, params, SECRET_KEY);
    console.log('Email sent successfully!');

    const paramsa = {
      name: formData.name,
      email: formData.email,
  };
  emailjs.send(SERVICE_KEY, TEMPLATE_AUTO, paramsa, SECRET_KEY);
  console.log('auto reply Email sent successfully!');


     
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  if(Loading) {
    return (
      <div className="h-screen ">
      <div className="flex justify-center items-center bg-black h-full">
      <Loader className="animate-spin text-red-600 w-10 h-10"/>
      </div>
</div>
    )
  }

  return (
    <div className="relative contact-bg backdrop-blur justify-center items-center min-h-screen">
      <header className={`flex w-full items-center bg-black bg-opacity-50`}>
            <Link to={'/'} className='flex items-center ml-1'>
              <img src={'/kflix2.png'} alt='kflix logo' className='w-32 sm:w-36' />
            </Link>
              <div className='ml-auto flex items-center p-2 '>
                   
                <Link className='hover:bg-white hover:bg-opacity-5 text-base p-2 rounded-lg'  to={'/'}> <p className='flex items-center text-white '><House className='h-5 w-4 sm:h-5 sm:w-5 mr-1 hover:scale-105 transition-transform'/><p className='font-semibold '>Home</p></p></Link>
                <Link className='hover:bg-white hover:bg-opacity-5 text-base p-2 rounded-lg' to={'/watchlist'}> <p className='flex items-center text-white pl-1'><TvMinimal className='h-5 w-4 sm:h-5 sm:w-5 mr-1 hover:scale-105 transition-transform'/><p className='font-semibold'>Watchlist</p></p></Link>
              </div>
            
          </header>
      <div className='flex justify-center mt-10'>
      <div className="max-w-xl w-full m-3 md:m-0 bg-slate-800 bg-opacity-80 p-5 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold text-white mb-3 text-center">Contact Us</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="name" className="flex text-white font-medium">Name</label>
        <input 
            type="text" 
            name="name" 
            placeholder="Your Name" 
            value={formData.name} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded-md" 
            required 
        />

        <label htmlFor="email" className="flex text-white font-medium">Email</label>
        <input 
            type="email" 
            name="email" 
            placeholder="Your Email" 
            value={formData.email} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded-md" 
            required 
        />

        <label htmlFor="message" className="flex text-white font-medium">Message</label>
        <textarea 
            name="message" 
            placeholder="Your Message" 
            value={formData.message} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-300 rounded-md h-32" 
            required 
        />

        <button 
            type="submit" 
            className="w-full bg-red-600 text-white py-2 font-semibold rounded-md hover:bg-red-700"
        >
            Send
        </button>
    </form>
</div>
    </div>

    {msgsent && (
        <div className='flex justify-center p-5 mt-5 font-semibold text-white'>
            <p> We received your message and will get back to you soon..!</p>
        </div>
    )}
      </div>
   
  );
}

export default ContactPage