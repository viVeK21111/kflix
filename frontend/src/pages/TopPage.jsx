import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Menu, Film, Clapperboard, Piano, Tv } from 'lucide-react';
import { userAuthStore } from "../store/authUser";
import { ORIGINAL_IMG_BASE_URL } from '../utils/constants';
import axios from 'axios';

const TopPage = () => {
  const user = userAuthStore((state) => state.user);
  const [activeSection, setActiveSection] = useState(sessionStorage.getItem("topSelect") || 'directors');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(() => {
    const stored = sessionStorage.getItem("displayCount");
    return stored ? parseInt(stored, 10) : 16;
  });
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  // Data configuration for all sections
  const sectionsData = {
    directors: {
      title: 'Greatest Directors',
      icon: <Clapperboard className='h-5'/>,
      list: [
        { name: "Martin Scorsese", id: "1032" },
        { name: "Alfred Hitchcock", id: "2636" },
        { name: "Stanley Kubrick", id: "240" },
        { name: "Akira Kurosawa", id: "5026" },
        { name: "Steven Spielberg", id: "488" },
        { name: "Quentin Tarantino", id: "138" },
        { name: "Francis Ford Coppola", id: "1776" },
        { name: "Christopher Nolan", id: "525" },
        { name: "Orson Welles", id: "40" },
        { name: "Federico Fellini", id: "4415" },
        { name: "Ingmar Bergman", id: "6648" },
        { name: "Billy Wilder", id: "3146" },
        { name: "David Fincher", id: "7467" },
        { name: "Wes Anderson", id: "5655" },
        { name: "Bong Joon Ho", id: "21684" },
        { name: "Hayao Miyazaki", id: "608" },
        { name: "Jean-Luc Godard", id: "3776" },
        { name: "Sergio Leone", id: "4385" },
        { name: "Ridley Scott", id: "578" },
        { name: "James Cameron", id: "2710" },
        { name: "Paul Thomas Anderson", id: "4762" },
        { name: "Andrei Tarkovsky", id: "8452" },
        { name: "Zhang Yimou", id: "607" },
        { name: "Pedro Almodóvar", id: "309" },
        { name: "Robert Bresson", id: "10346" },
        { name: "Abbas Kiarostami", id: "119294" },
        { name: "David Lynch", id: "5602" },
        { name: "Joel Coen", id: "1223" },
        { name: "Ethan Coen", id: "1224" },
        { name: "Yasujiro Ozu", id: "95501" },
        { name: "Satyajit Ray", id: "12160" },
        { name: "Luis Buñuel", id: "793" },
        { name: "Hirokazu Kore-eda", id: "25645" },
        { name: "Wong Kar-wai", id: "12453" },
        { name: "Darren Aronofsky", id: "6431" },
        { name: "Alejandro G. Iñárritu", id: "223" },
        { name: "Krzysztof Kieślowski", id: "1126" },
        { name: "Lars von Trier", id: "42" },
        { name: "Ken Loach", id: "15488" },
        { name: "Alfonso Cuarón", id: "11218" },
        { name: "Denis Villeneuve", id: "137427" },
        { name: "Jordan Peele", id: "291263" },
        { name: "Park Chan-wook", id: "2166" },
        { name: "Kim Ki-duk", id: "1188" },
        { name: "Lee Chang-dong", id: "96657" },
        { name: "Apichatpong Weerasethakul", id: "69759" },
        { name: "Hiroshi Teshigahara", id: "96801" },
        { name: "Béla Tarr", id: "85637" },
        { name: "Claire Denis", id: "9888" },
        { name: "Agnès Varda", id: "6817" },
        { name: "James Wan", id: "2127"},
        { name: "Ritwik Ghatak", id: "543652"},
        { name: "Guru Dutt", id: "125354"},
        { name: "K. Viswanath", id:"544978"}, 
        { name: "John Ford", id:"8500"},
        { name: "Sofia Coppola", id: "1769"}
      ]
    },
    musicCom: {
      title: 'Top Music Composers',
      icon: <Piano className='h-5'/>,
      list: [
        { name: "John Williams", id: "491" },
        { name: "Ennio Morricone", id: "1259" },
        { name: "Hans Zimmer", id: "947" },
        { name: "Bernard Herrmann", id: "1045" },
        { name: "Max Steiner", id: "3249" },
        { name: "Erich Wolfgang Korngold", id: "67429" },
        { name: "Nino Rota", id: "3098" },
        { name: "Alan Silvestri", id: "37" },
        { name: "James Horner", id: "1729" },
        { name: "Howard Shore", id: "117" },
        { name: "Alex North", id: "10536" },
        { name: "Miklós Rózsa", id: "7647" },
        { name: "Thomas Newman", id: "153" },
        { name: "Danny Elfman", id: "531" },
        { name: "Michael Giacchino", id: "15347" },
        { name: "Dimitri Tiomkin", id: "4082" },
        { name: "Elmer Bernstein", id: "7182" },
        { name: "Rachel Portman", id: "3562" },
        { name: "Clint Mansell", id: "6377" },
        { name: "Ludwig Göransson", id: "928158" },
        { name: "Ravi Shankar", id: "13745" },
        { name: "Ilaiyaraaja", id: "76888" },
        { name: "K. V. Mahadevan", id: "584606" },
        { name: "Rahul Dev Burman", id: "88141" },
        { name: "A.R. Rahman", id: "5288" },
        { name: "M.M. Keeravaani", id: "225318" }
      ]
    },
    actors: {
      title: 'Greatest Actors',
      icon: <Tv className='h-5'/>,
      list: [
        { name: "Marlon Brando", id: "3084" },
        { name: "Robert De Niro", id: "380" },
        { name: "Al Pacino", id: "1158" },
        { name: "Jack Nicholson", id: "514" },
        { name: "Daniel Day-Lewis", id: "11856" },
        { name: "Denzel Washington", id: "5292" },
        { name: "Tom Hanks", id: "31" },
        { name: "Anthony Hopkins", id: "4173" },
        { name: "Meryl Streep", id: "5064" },
        { name: "Katharine Hepburn", id: "6598" },
        { name: "Cate Blanchett", id: "112" },
        { name: "Humphrey Bogart", id: "4110" },
        { name: "Viola Davis", id: "19492" },
        { name: "Frances McDormand", id: "3910" },
        { name: "Leonardo DiCaprio", id: "6193" },
        { name: "Morgan Freeman", id: "192" },
        { name: "Joaquin Phoenix", id: "73421" },
        { name: "Matthew McConaughey", id: "10297" },
        { name: "Bette Davis", id: "3380" },
        { name: "Brad Pitt", id: "287" },
        { name: "Ingrid Bergman", id: "4111" },
        { name: "Christian Bale", id: "3894" },
        { name: "James Stewart", id: "854" },
        { name: "Toshiro Mifune", id: "7450" },
        { name: "Cary Grant", id: "2638" },
        { name: "Dustin Hoffman", id: "4483" },
        { name: "Julianne Moore", id: "1231" },
        { name: "Paul Newman", id: "3636" },
        { name: "Gene Hackman", id: "193" },
        { name: "Clint Eastwood", id: "190" },
        { name: "Harrison Ford", id: "3" },
        { name: "Tom Cruise", id: "500" },
        { name: "Michael Caine", id: "3895" },
        { name: "Kate Winslet", id: "204" },
        { name: "Johnny Depp", id: "85" },
        { name: "Philip Seymour Hoffman", id: "1233" },
        { name: "Judi Dench", id: "5309" },
        { name: "Sean Connery", id: "738" },
        { name: "Audrey Hepburn", id: "1932" },
        { name: "Henry Fonda", id: "4958" },
        { name: "Gregory Peck", id: "8487" },
        { name: "Michelle Yeoh", id: "1620" },
        { name: "Robin Williams", id: "2157" },
        { name: "Maggie Smith", id: "10978" },
        { name: "Olivia Colman", id: "39187" },
        { name: "James Dean", id: "2749" },
        { name: "Russell Crowe", id: "934" },
        { name: "Robert Duvall", id: "3087" },
        { name: "Jodie Foster", id: "1038" },
        { name: "Laurence Olivier", id: "3359" },
        { name: "Sidney Poitier", id: "16897" },
        { name: "Spencer Tracy", id: "12147" },
        { name: "Sigourney Weaver", id: "10205" },
        { name: "Gary Cooper", id: "4068" },
        { name: "Song Kang-ho", id: "20738" },
        { name: "Kirk Douglas", id: "2090" },
        { name: "Irrfan Khan", id: "76793" },
        { name: "Gong Li", id: "643" },
        { name: "Peter O'Toole", id: "11390" },
        { name: "Isabelle Huppert", id: "17882" },
        { name: "Glenn Close", id: "515" },
        { name: "Orson Welles", id: "40" },
        { name: "Choi Min-sik", id: "64880" },
        { name: "Amitabh Bachchan", id: "35780" },
        { name: "Elizabeth Taylor", id: "3635" },
        { name: "Burt Lancaster", id: "13784" },
        { name: "Penélope Cruz", id: "955" },
        { name: "James Cagney", id: "5788" },
        { name: "Cillian Murphy", id: "2037" },
        { name: "Jessica Lange", id: "4431" },
        { name: "Charlton Heston", id: "10017" },
        { name: "Vivien Leigh", id: "10538" },
        { name: "Christopher Reeve", id: "20006" },
        { name: "Sophia Loren", id: "16757" },
        { name: "Anjelica Huston", id: "5657" },
        { name: "Tatsuya Nakadai", id: "70131" },
        { name: "Grace Kelly", id: "4070" },
        { name: "Dilip Kumar", id: "229249" },
        { name: "Rajinikanth", id: "91555" },
        { name: "Kamal Haasan", id: "93193" },
        { name: "Aamir Khan", id: "52763" },
        { name: "Mohanlal", id: "82732" },
        { name: "N.T. Rama Rao (NTR)", id: "1003933" },
        { name: "Raj Kapoor", id: "87561" },
        { name: "Chiranjeevi", id: "147079" },
        { name: "Savitri", id: "1166378" },
        { name: "Shah Rukh Khan", id: "35742" },
        { name: "Sridevi", id: "109549" },
      ]
    }
  };

  // Create sections array from sectionsData
  const sections = Object.keys(sectionsData).map(key => ({
    id: key,
    title: sectionsData[key].title,
    icon: sectionsData[key].icon
  }));

  // Get current section data
  const currentSectionData = sectionsData[activeSection];
  const currentList = currentSectionData?.list || [];

  // Fetch people in batches
  const fetchPeopleBatch = async (startIndex, endIndex) => {
    const batch = currentList.slice(startIndex, endIndex);
    const peoplePromises = batch.map(async (person) => {
      try {
        const response = await axios.get(`/api/v1/search/person/${person.id}`);
        const data = response.data.content;
        return {
          ...person,
          profile_path: data.profile_path,
          fullData: data
        };
      } catch (error) {
        console.error(`Error fetching ${person.name}:`, error);
        return {
          ...person,
          profile_path: null,
          error: true
        };
      }
    });

    return Promise.all(peoplePromises);
  };

  const fetchPeople = async () => {
    try {
      setLoading(true);
      setPeople([]); // Clear previous data
      
      // Fetch initial batch
      const initialBatch = await fetchPeopleBatch(0, displayCount);
      setPeople(initialBatch);
      setLoading(false);

      // Fetch remaining in background
      if (displayCount < currentList.length) {
        const remainingBatch = await fetchPeopleBatch(displayCount, currentList.length);
        setPeople(prev => [...prev, ...remainingBatch]);
      }
    } catch (error) {
      console.error('Error fetching people:', error);
      setLoading(false);
    }
  };

  // Fetch people when section changes
  useEffect(() => {
    if (currentList.length > 0) {
      fetchPeople();
    }
  }, [activeSection]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    
    const newDisplayCount = Math.min(displayCount + 16, currentList.length);
    
    // If we don't have the data yet, fetch it
    if (people.length < newDisplayCount) {
      try {
        const additionalBatch = await fetchPeopleBatch(
          people.length, 
          newDisplayCount
        );
        setPeople(prev => [...prev, ...additionalBatch]);
      } catch (error) {
        console.error('Error loading more:', error);
      }
    }
    
    setDisplayCount(newDisplayCount);
    sessionStorage.setItem("displayCount", newDisplayCount.toString());
    setLoadingMore(false);
  };

  const handleSectionSelect = (sectionId) => {
    sessionStorage.setItem("topSelect", sectionId);
    setActiveSection(sectionId);
    setDisplayCount(16); // Reset display count
    sessionStorage.setItem("displayCount", "16");
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-slate-900 text-white">
      <div className="flex min-h-screen lg:h-screen">
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 right-0 z-40 w-72 bg-gray-800 bg-opacity-95 lg:bg-opacity-50 
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          min-h-screen p-4 border-r border-gray-700 overflow-y-scroll lg:overflow-y-auto bottom-14 sm:bottom-0
        `}>
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-xl font-bold text-white">Sections</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-white hover:bg-gray-700 rounded"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <h2 className="text-xl font-bold text-white mb-6 text-center hidden lg:block">Sections</h2>
          
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionSelect(section.id)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                  activeSection === section.id
                    ? 'bg-gray-700 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                <span className="font-medium">{section.title}</span>
              </button>
            ))}
           
            <Link
              to={'/aspect-ratios'}
              className="w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 hover:bg-blue-500"
            >
              <span className="text-lg"><Film className='h-5'/></span>
              <span className="font-medium">Film aspect</span>
            </Link>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen lg:overflow-y-auto" style={{scrollbarColor: 'rgb(53, 52, 52) transparent'}}>
          {/* Mobile Header */}

          <div className='flex-1'>
          <div className='flex'>
            <div className='flex lg:hidden justify-start mr-auto items-center ml-3 mt-2'>
              {!user && <Link to={'/'}><img src='/klogo1.png' className='h-14 md:h-16 p-1' alt="Logo" /></Link>}
            </div>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1 mx-4 mt-3 text-white hover:bg-gray-700 flex ml-auto rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <div className=" py-8 mb-10">
            <div className="flex relative justify-center items-center text-2xl lg:text-3xl  font-bold mb-8 ">
               {currentSectionData?.title || 'Page'}
              <div className='hidden lg:flex absolute px-2 right-0 ml-auto items-center'>
                {!user && <Link to={'/'}><img src='/klogo1.png' className='h-14 md:h-16 sm:p-1' alt="Logo" /></Link>}
              </div>
            </div>

            {/* People Grid */}
            <div className=" mx-auto space-y-3 max-w-full">
              <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5  gap-3 md:gap-6">
                      {people.slice(0, displayCount).map((person) => (
                        <Link
                          to={`/person/details/?id=${person.id}&name=${encodeURIComponent(person.name)}`}
                          key={person.id}
                          className="bg-gray-900 rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
                        >
                          <div className="bg-gray-700 relative overflow-hidden">
                            {person.profile_path ? (
                              <img
                                src={`${ORIGINAL_IMG_BASE_URL}${person.profile_path}`}
                                alt={person.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            
                            {/* Fallback for missing images */}
                            <div 
                              className="absolute inset-0 bg-gray-700 flex items-center justify-center text-gray-600"
                              style={{ display: person.profile_path ? 'none' : 'flex' }}
                            >
                              <span className="text-sm text-center px-2">No Image</span>
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-400 text-sm text-center leading-tight">
                              {person.name}
                            </h3>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Load More Button */}
                    {displayCount < currentList.length && (
                      <div className="text-center mt-8">
                        <button
                          onClick={handleLoadMore}
                          disabled={loadingMore}
                          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loadingMore ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Loading More...</span>
                            </div>
                          ) : (
                            `Load More (${currentList.length - displayCount} remaining)`
                          )}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          </div>
       
          <footer className="mt-12 pt-8 pb-6 border-t border-gray-800">
          <div className="text-center space-y-4">
            {/* Attribution */}
           

            {/* Links */}
            <div className="flex justify-center items-center gap-6 flex-wrap">
              <a
                href="https://discord.gg/P3rcqHwp9d"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm md:text-base text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Discord
              </a>
             

              <a
                href="/"
                className="text-gray-400 text-sm md:text-base hover:text-white transition-colors"
              >
                Home
              </a>
              <a
                href="/contactus"
                className="text-gray-400 text-sm md:text-base hover:text-white transition-colors"
              >
                Contact Us
              </a>
            </div>
            

         

            {/* Disclaimer */}
            <p className="text-gray-600 text-xs max-w-2xl mx-auto">
              This site does not host any content. All the content is embedded from external third party sources.
            </p>
          </div>
        </footer>
        </div>
      </div>
    </div>
  );
};

export default TopPage;