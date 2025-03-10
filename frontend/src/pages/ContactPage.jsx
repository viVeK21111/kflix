import React from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const ContactPage = () => {
    const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [msgsent,setmsgsent] = useState(false);

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
     
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="relative contact-bg backdrop-blur justify-center items-center min-h-screen">
    <header className="w-full max-w-6xl flex mx-auto justify-center items-center p-4">
        <Link to={'/'}>
          <img src={'/kflix2.png'} alt='Kflix Logo' className='w-40 sm:w-52' />
        </Link>
      </header>
      <div className='flex justify-center mt-10'>
      <div className="max-w-xl m-3 md:m-0 bg-slate-800 bg-opacity-80 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-white mb-4 text-center">Contact Us</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          className="w-full p-2 border rounded-md h-32"
          required
        />
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
        >
          Send
        </button>
      </form>
    </div>
    </div>

    {msgsent && (
        <div className='flex justify-center  p-1 mt-7 font-semibold text-white'>
            <p> We received your message and will get back to you soon..!</p>
        </div>
    )}
      </div>
   
  );
}

export default ContactPage