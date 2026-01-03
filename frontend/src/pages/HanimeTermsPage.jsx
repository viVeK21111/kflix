import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, AlertCircle, ExternalLink, FileText, Scale } from 'lucide-react';

const HanimeTermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/hentocean')}
          className="flex items-center gap-2 mb-6 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Library
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Service & Policies</h1>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          
       

          {/* Copyright & DMCA */}
          <section className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold">Copyright & DMCA</h2>
            </div>
            <div className="space-y-3 text-gray-300">
              <p>
                We respect intellectual property rights and comply with the Digital Millennium Copyright Act (DMCA).
              </p>
              <p>
                If you believe that your copyrighted work has been displayed on this platform in a way that constitutes copyright infringement, please contact us immediately with:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>A description of the copyrighted work</li>
                <li>The URL where the content appears</li>
                <li>Your contact information</li>
                <li>A statement of good faith belief</li>
                <li>Your electronic or physical signature</li>
              </ul>
              <p className="text-sm bg-yellow-900/30 border-l-4 border-yellow-500 p-3 rounded">
                <strong>Note:</strong> Since we do not host content, we will promptly remove links to infringing material and may forward your complaint to the source provider (HentaiOcean).
              </p>
            </div>
          </section>

          {/* Privacy Policy */}
          <section className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold">Privacy Policy</h2>
            </div>
            <div className="space-y-3 text-gray-300">
              <p>
                We are committed to protecting your privacy and handling your data responsibly.
              </p>
              
              <h3 className="text-xl font-semibold text-white mt-4">Information We Collect</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Session data (search queries, filter preferences) stored locally in your browser</li>
                <li>No personal information is collected or stored on our servers</li>
                <li>No tracking cookies or analytics beyond basic usage statistics</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4">How We Use Your Data</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Session storage is used only to improve your browsing experience</li>
                <li>Search history and preferences remain on your device</li>
                <li>We do not sell, share, or distribute any user data</li>
              </ul>

            
            </div>
          </section>

          {/* Age Restriction */}
          <section className="bg-gray-800 rounded-lg p-6 border-2 border-red-500">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold">Age Restriction & Content Warning</h2>
            </div>
            <div className="space-y-3 text-gray-300">
              <p className="text-red-400 font-semibold text-lg">
                ⚠️ This platform contains adult content and is intended for users 18 years of age or older.
              </p>
              <p>
                By accessing this platform, you confirm that:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You are at least 18 years old (or the age of majority in your jurisdiction)</li>
                <li>You are not offended by adult-oriented content</li>
                <li>Viewing such content is legal in your location</li>
                <li>You will not allow minors to access this platform</li>
              </ul>
              <p className="text-sm text-gray-400 italic">
                We take age verification seriously and encourage responsible viewing.
              </p>
            </div>
          </section>


          {/* Disclaimer */}
          <section className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-orange-400" />
              <h2 className="text-2xl font-bold">Disclaimer</h2>
            </div>
            <div className="space-y-3 text-gray-300">
              <p>
                This platform is provided "as is" without any warranties, express or implied. We make no guarantees about:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The accuracy, completeness, or timeliness of content</li>
                <li>The availability or uptime of the service</li>
                <li>The functionality of embedded videos from external sources</li>
                <li>The safety or legality of external content</li>
              </ul>
             
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-6 border-2 border-blue-500">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <div className="space-y-3 text-gray-300">
              <p>
                If you have questions, concerns, or complaints regarding these terms, privacy practices, or copyright issues, please contact us:
              </p>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <span className="font-semibold">Email:</span>
                  <a href="mailto:vivekvemula74@gmail.com" target='_blank' className="text-blue-400 hover:text-blue-300">
                    vivekvemula74@gmail.com
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold">Discord:</span>
                  <a 
                    href="https://discord.gg/P3rcqHwp9d" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Join our Discord server
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold">Contact Form:</span>
                  <a href="/contactus" className="text-blue-400 hover:text-blue-300">
                    Contact Us Page
                  </a>
                </p>
              </div>
              <p className="text-sm text-gray-400 italic mt-4">
                We aim to respond to all inquiries within 48 hours.
              </p>
            </div>
          </section>

        
          {/* Acceptance */}
          <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-6 text-center">
            <p className="text-lg text-gray-200">
              By using this platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and Privacy Policy.
            </p>
          </div>

        </div>

      
      </div>
    </div>
  );
};

export default HanimeTermsPage;