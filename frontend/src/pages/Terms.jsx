import React from 'react';
import { House } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="hidden sm:flex items-center justify-between bg-gray-800 px-4 py-3">
              <Link to="/" className="flex-shrink-0">
                <img src="/kflix3.png" alt="Kflix Logo" className="w-30 sm:w-32 h-12 sm:h-14" />
              </Link>
              
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-10">
        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">
          Terms & Information
        </h1>

        {/* Important Notice */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">Important Notice</h2>
          <p className="text-base text-gray-400">
            No movies or TV shows are stored on KFlix servers. All content is streamed directly from
            third-party providers.
          </p>
        </div>

        {/* Security Concerns */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">Security Concerns</h2>
          <p className="text-base text-gray-400">
            Third-party streamers cannot collect your data through our platform. However, we recommend
            using a privacy-focused browser like Brave or an adblocker for added safety. Avoid entering
            sensitive information on unfamiliar or suspicious websites.
          </p>
        </div>

        {/* Suggestions */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">Feedback & Suggestions</h2>
          <p className="text-base text-gray-400">
            We welcome your suggestions to improve KFlix. For any queries, please reach out via{' '}
            <Link to="/contactus" className="text-blue-400 hover:underline">
              Contact Us
            </Link>
            .
          </p>
            <Link 
          className="inline-flex items-center mt-2 text-gray-500 font-semibold rounded-lg"
            to={'https://discord.gg/P3rcqHwp9d'} target="_blank"
            >
          <p>Join our Discord for discussions</p><img src="/d2.png" className="ml-2 h-4 mx-auto"></img>
        </Link>
        </div>
      </div>
    </div>
  );
}