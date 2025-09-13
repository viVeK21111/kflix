import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AccountCheckStore } from "../store/accountcheck";
import { useEffect } from 'react';
import { Link } from 'react-router-dom'


export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  let {changeUser,setEmail1} = AccountCheckStore();
   useEffect(() => {
    changeUser(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('api/v1/auth/checkAccount', { email });
      
      if (response.data.success) {
        changeUser(true);
        setEmail1(email);
        setMessage('Account found. Redirecting to password reset...');
        // Wait a moment before redirecting to show the success message
        setTimeout(() => {
          navigate('/changepassword');
        }, 1500);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('Account not found. Please enter a valid email address.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" justify-center min-h-screen bg-gray-100 px-4 contact-bg">
        
            <div className="flex items-center justify-center pt-32">
                <div className="w-full max-w-md bg-black/70 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-white mb-6">Forgot Password</h2>
        
        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-black/70 text-white border border-gray-300 "
              placeholder="Enter your email"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Checking...' : 'Reset Password'}
          </button>
          
          <div className="text-sm font-semibold underline text-center mt-4">
            <a href="/login" className="text-gray-400 hover:text-gray-300">
              Back to Login
            </a>
          </div>
        </form>
      </div>
            </div>
    
    </div>
  );
}