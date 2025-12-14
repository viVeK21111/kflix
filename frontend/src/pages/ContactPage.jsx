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



     
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  if(Loading) {
    return (
      <div className="h-screen ">
      <div className="flex justify-center items-center bg-black h-full">
      <Loader className="animate-spin text-white w-10 h-10"/>
      </div>
</div>
    )
  }

  return (
    <div className="relative contact-bg backdrop-blur justify-center items-center min-h-screen">
      
      <div className="bg-black h-screen bg-opacity-60 p-5 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold text-white mb-10 text-center">Contact Us</h2>
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto bg-gray-800 p-5 rounded-lg">
        <label htmlFor="name" className="flex text-white font-medium">Name</label>
        <input 
            type="text" 
            name="name" 
            placeholder="Your Name" 
            value={formData.name} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-700 text-white rounded-md bg-slate-700 focus:outline-none focus:ring-0" 
            required 
        />

        <label htmlFor="email" className="flex text-white font-medium">Email</label>
        <input 
            type="email" 
            name="email" 
            placeholder="Your Email" 
            value={formData.email} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-700 text-white rounded-md bg-slate-700 focus:outline-none focus:ring-0" 
            required 
        />

        <label htmlFor="message" className="flex text-white font-medium">Message</label>
        <textarea 
            name="message" 
            placeholder="Your Message" 
            value={formData.message} 
            onChange={handleChange} 
            className="w-full p-2 border border-gray-700 text-white rounded-md bg-slate-700 h-32 focus:outline-none focus:ring-0" 
            required 
        />

        <button 
            type="submit" 
            className="flex w-20 mx-auto bg-blue-600 justify-center text-white py-2 font-semibold rounded-md hover:bg-blue-700"
        >
            Send
        </button>
         {msgsent && (
        <div className='flex justify-center  font-semibold text-white'>
            <p> We received your message and will get back to you soon..!</p>
        </div>
    )}
    </form>
    <div className='flex justify-center pt-7 pb-3'>
            <p className='text-white'>Join our</p>
         <Link 
          className="inline-flex items-center ml-2 text-white font-semibold rounded-lg shadow-lg"
            to={'https://discord.gg/P3rcqHwp9d'} target="_blank"
            >
      <img src="/d1.png" className="mr-2 h-4 mx-auto"></img><p>Discord</p>
        </Link>
        </div>
    </div>
    

 
    

   
      </div>
   
  );
}

export default ContactPage