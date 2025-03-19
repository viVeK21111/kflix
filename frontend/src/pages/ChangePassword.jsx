import React, { useState } from 'react';
import { Key, Eye, EyeOff, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function ChangePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!password) {
        toast.error("password can't be empty")
        return;
    }
    if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
    }
    setIsSubmitting(true);
    setTimeout( async() => {
      setIsSubmitting(false);
      const response = await axios.post('/api/v1/auth/changePassword',{password:password})
      if(response.data.success){
        setSuccess(true);
      }
      else {
        toast.error(response.data.message);
      }
      
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
          <div className="bg-slate-700 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-600 rounded-lg shadow-lg">
                <Key size={22} className="text-white" />
              </div>
              <div>
                <h2 className="text-white text-xl font-semibold">Change Password</h2>
                <p className="text-slate-300 text-sm">Secure your account with a strong password</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">New Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password" 
                  className="w-full p-3 pl-4 pr-10 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">Confirm New Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password" 
                  className="w-full p-3 pl-4 pr-10 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            {success && (
              <div className="flex items-center gap-2 text-green-400 bg-green-400 bg-opacity-10 p-3 rounded-lg">
                <CheckCircle size={16} />
                <span className="text-sm">Password updated successfully!</span>
              </div>
            )}
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full p-3 rounded-lg font-medium text-white transition-all ${
                isSubmitting 
                  ? 'bg-red-600 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-red-600/20'
              }`}
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </button>
            
            <p className="text-xs text-center text-slate-400 pt-2">
              Make sure to use a unique password with at least 8 characters
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}