import { Link } from 'react-router-dom';
import { Lock, LogIn, UserPlus } from 'lucide-react';

const LoginRequired = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Lock Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-600 bg-opacity-20 p-6 rounded-full">
            <Lock className="w-16 h-16 text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Login Required
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-lg mb-8">
          You need to be logged in to access this content. Please sign in to continue.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link 
            to="/login"
            className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            <LogIn className="mr-2" size={20} />
            Sign In
          </Link>

          <Link 
            to="/signup"
            className="flex items-center justify-center w-full bg-white bg-opacity-10 hover:bg-opacity-20 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            <UserPlus className="mr-2" size={20} />
            Create Account
          </Link>

          <Link 
            to="/"
            className="block text-gray-400 hover:text-white mt-4 transition-colors duration-200"
          >
            Go back to Home
          </Link>
        </div>

      
      </div>
    </div>
  );
};

export default LoginRequired;