import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, ArrowLeft, AlertTriangle } from 'lucide-react';

const AdultPage = () => {
  
  const [showAgeGate, setShowAgeGate] = useState(false);

  useEffect(() => {
    const accepted = sessionStorage.getItem("ageGateAccepted");
    if (!accepted) {
      setShowAgeGate(true);
    }
  }, []);
  
  const handleAgeAccept = () => {
    sessionStorage.setItem("ageGateAccepted", "true");
    setShowAgeGate(false);
  };
  
  const handleAgeReject = () => {
    window.location.href = "/fun";
  };

  if(showAgeGate)  {
    return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-900 rounded-xl shadow-2xl border border-gray-700 p-6 text-center">
  
        <h2 className="text-2xl font-bold text-red-500 mb-3">
          🔞 Age Restricted Content
        </h2>
  
        <p className="text-gray-300 text-sm mb-4">
          This page contains <span className="text-white font-semibold">adult content</span>.
          It is intended only for viewers who are <span className="text-white font-semibold">18 years or older</span>.
        </p>
  
        <p className="text-gray-400 text-xs mb-6">
          By continuing, you confirm that you are legally allowed to view such content
          in your country.
        </p>
  
        <div className="flex gap-3">
          <button
            onClick={handleAgeReject}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition"
          >
            Leave
          </button>
  
          <button
            onClick={handleAgeAccept}
            className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg transition font-semibold"
          >
            I am 18+
          </button>
        </div>
      </div>
    </div>
  )}

 

 

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-slate-900 text-white">
     

      {/* Main Content */}
      <div className="px-4 py-8">
        <h1 className="text-3xl mx-auto font-bold text-center mb-8">NSFW Cams</h1>
        
        {/* Warning Note */}
        <div className="max-w-6xl mb-6">
          <div className="bg-red-900 bg-opacity-10 border border-gray-700 rounded-lg p-2">
            <div className="flex items-start gap-3">
              <div>
                <p className="text-red-400 text-sm font-base mb-1">CONTENT WARNING</p>
                <p className="text-gray-300 text-sm">
                  This content is strictly for adults only. Parental guidance is required. 
                  By accessing these links, you confirm that you are of legal age and consent to view adult content.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3 max-w-3xl">
          {/* Placeholder for future NSFW links */}
          <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
               onClick={() => window.open('http://bit.ly/45DBahm', '_blank', 'noopener,noreferrer')}>
            <div className="flex items-center justify-between text-lg font-semibold text-red-400 hover:text-red-300 transition-colors">
              <div className="flex items-center gap-3">
                <span>Chaturbate</span>
              </div>
              <ExternalLink className="h-5 w-5" />
            </div>
            <p className="text-gray-400 mt-2">Have fun</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
               onClick={() => window.open('https://bongacams11.com/track?c=825797', '_blank', 'noopener,noreferrer')}>
            <div className="flex items-center justify-between text-lg font-semibold text-red-400 hover:text-red-300 transition-colors">
              <div className="flex items-center gap-3">
                <span>Bonga cams</span>
              </div>
              <ExternalLink className="h-5 w-5" />
            </div>
            <p className="text-gray-400 mt-2">Relax</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
               onClick={() => window.open('https://cam4.com', '_blank', 'noopener,noreferrer')}>
            <div className="flex items-center justify-between text-lg font-semibold text-red-400 hover:text-red-300 transition-colors">
              <div className="flex items-center gap-3">
                <span>Cam4</span>
              </div>
              <ExternalLink className="h-5 w-5" />
            </div>
            <p className="text-gray-400 mt-2">Unlax</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
               onClick={() => window.open('https://www.livejasmin.com/', '_blank', 'noopener,noreferrer')}>
            <div className="flex items-center justify-between text-lg font-semibold text-red-400 hover:text-red-300 transition-colors">
              <div className="flex items-center gap-3">
                <span>LiveJasmin</span>
              </div>
              <ExternalLink className="h-5 w-5" />
            </div>
            <p className="text-gray-400 mt-2">Jasmin</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
               onClick={() => window.open('https://xham.live/', '_blank', 'noopener,noreferrer')}>
            <div className="flex items-center justify-between text-lg font-semibold text-red-400 hover:text-red-300 transition-colors">
              <div className="flex items-center gap-3">
                <span>Xham</span>
              </div>
              <ExternalLink className="h-5 w-5" />
            </div>
            <p className="text-gray-400 mt-2">Hamster</p>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default AdultPage; 