import React, { useEffect,useState } from "react";
import { ProfileStore } from "../store/ProfileStore";
import { userAuthStore } from "../store/authUser";
import {Link} from 'react-router-dom';
import {Lock,Eye,History,Search,MessagesSquare,Link as LinkIcon,Tv,Mail,AlertTriangle,Loader,Github,ReceiptText,UserCheck,User,ChevronDown,ChevronRight,Coffee,CircleQuestionMark  } from "lucide-react";
import axios from 'axios';
import toast from "react-hot-toast";

export default function ProfilePage(){
  const { getdata, data,ClearHistory,ClearHistoryid } = ProfileStore();
  const {logout,user} = userAuthStore();
   const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || [];

   const isAdmin = () => {
    return adminEmails.includes(user?.email);
  };
  
  const [datalocal,setdatalocal] = useState(null);
  const [settingSelected,setsettingSelected] = useState("account"); // Default to account
  const [isEnabled, setIsEnabled] = useState(null);
  const [securitySelected,setsecuritySelected] = useState(null);
  const [deleted,setDeleted] = useState(false);
  const [del,setdel] = useState(false);
  const [loading,setloading] = useState(true);
  
  // Desktop accordion states for account subsections
  const [desktopExpanded, setDesktopExpanded] = useState({
    contentManagement: false,
    history: false
  });
  
  // Mobile accordion states
  const [mobileExpanded, setMobileExpanded] = useState({
    account: false,
    security: false,
    about: false,
    links: false,
    admin: false,
    FAQ: false,
  });

  useEffect(() => {
    if(!deleted && !del) {
      getdata().finally(() => setloading(false));
      localStorage.setItem("numitems",6);
    }
  }, [deleted, del]);

  useEffect(() => {
    setdatalocal(data);
  }, [data]);

  useEffect(() => {
    const getpref = async() => {
      const pref = await axios.get('/api/v1/user/getadultPreference');
    const datapref = pref.data.pref;
    setIsEnabled(datapref);
    }
    if(!deleted) getpref();
  },[])

  const handleSecuritydelete = () => {
    if(securitySelected==="delete") setsecuritySelected("");
    else setsecuritySelected("delete");
  }

  const toggleSwitch = async() => {
    setIsEnabled(prevState => !prevState);
    const resp = await axios.post('/api/v1/user/adultContent',{preference:!isEnabled});
    if(resp.data.success) {
      toast.success(resp.data.message);
    }
  };

  const handleDelete = async() =>{
    setdel(true);
    const response = await axios.delete('/api/v1/auth/deleteUser');
    if (response.data.success) {
      setDeleted(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      } 
  }

  // Desktop accordion toggle handler
  const toggleDesktopSection = (section) => {
    setDesktopExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Mobile accordion toggle handler
  const toggleMobileSection = (section) => {
    setMobileExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  const [openIndex, setOpenIndex] = useState(null);
  
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };


  const faqs = [
    {
      question: "What is KFlix?",
      answer: "KFlix is a streaming platform that allows you to discover and watch movies and TV shows. Browse through various categories, create watchlists, chat with Flix AI bot and enjoy your favorite content."
    },
    {
      question: "Site blocked on Airtel network or anyother",
      answer: (
        <>
          Change the DNS of your network in order to access the site.
          <br /><br />
          <strong>Mobile:</strong> Settings → Network & Internet → Advanced → Private DNS → Provide hostname → dns.google
          <br /><br />
          <strong>WiFi:</strong> Settings → WiFi → Tap info → Configure DNS → Change to manual → Add server → Add Google DNS: 8.8.8.8 and 8.8.4.4
        </>
      )
    },
    {
      question: "Movie or tv is not playing",
      answer: "Change to different sources available in order to play your content. Sometimes the respected server maynot work or blocked or busy."
    },
    {
      question: "Getting too many ads or redirects",
      answer: "Use brave browser or any adblocker like ublock or adblock plus to block all the ads and redirects."
    },
    {
      question: "Is KFlix free to use?",
      answer: "Yes, KFlix is completely free to use. You can browse, search, and watch content without any subscription fees."
    },
    {
      question: "What should I do if I forgot my password?",
      answer: "On the login page, click 'Forgot Password' and follow the instructions to reset your password via email. Or Goto Settings>Security>change password"
    },
    {
      question: "How can I report a bug or suggest a feature?",
      answer: "Join our Discord community or submit through contact us page"
    },
   
   
  ];

  if(deleted ) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-xl font-semibold bg-gray-900 text-white">
        <img className="w-32 sm:w-32 h-28" src='/kflix2.png'></img>
        <p>Sorry to see u go...</p>
      </div>
    )
  }
  if(loading) {
    return (
      <div className="h-screen ">
      <div className="flex justify-center items-center bg-black h-full">
      <Loader className="animate-spin text-white w-10 h-10"/>
      </div>
</div>
    )
  }

  // Sidebar navigation items
  const sidebarItems = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'about', label: 'About', icon: ReceiptText },
    { id: 'links', label: 'Links', icon: LinkIcon },
    { id: 'FAQ', label : 'FAQ', icon:CircleQuestionMark },
    ...(isAdmin() ? [{ id: 'admin', label: 'Admin', icon: UserCheck }] : [])
  ];

  // Content components
  const AccountContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Account Settings</h2>
      
      <div className="space-y-4">
        {/* Content Management Section */}
        <div className="bg-zinc-800 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleDesktopSection('contentManagement')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-700 transition-colors"
          >
            <h3 className="text-lg font-medium">Content Management</h3>
            {desktopExpanded.contentManagement ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
          </button>
          
          {desktopExpanded.contentManagement && (
            <div className="px-4 pb-4 pt-2">
              <div className="flex items-center justify-between">
                <span>Enable Adult content (NSFW)</span>
                <button 
                  onClick={toggleSwitch}
                  className="flex items-center"
                >
                  <div 
                    className={`relative w-12 h-6 transition-colors duration-200 ease-in-out rounded-full ${
                      isEnabled ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <div 
                      className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 ease-in-out transform ${
                        isEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* History Section */}
        <div className="bg-zinc-800 rounded-lg overflow-hidden">
          <Link
            to={'/history'}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-700 transition-colors"
          >
            <h3 className="text-lg font-medium">History</h3>
        
          </Link>
          
        
        </div>
      </div>
    </div>
  );

  const SecurityContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Security Settings</h2>
      
      <div className="space-y-4">
        <Link 
          to={'changepassword'} 
          className="block bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700 transition-colors"
        >
          <div className="flex items-center">
            <Lock className="mr-3" size={20}/>
            Change Password
          </div>
        </Link>

        <div className="bg-zinc-800 p-4 rounded-lg">
          <button 
            onClick={handleSecuritydelete} 
            className="flex items-center text-red-400 hover:text-red-300 transition-colors"
          >
            <AlertTriangle className="mr-2" size={18}/>
            Delete Account
          </button>
          
          {securitySelected === "delete" && (
            <div className="mt-4 bg-red-500 bg-opacity-10 p-4 rounded-lg border border-red-500 border-opacity-30">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-red-400 font-medium mb-2">This action cannot be undone</h4>
                  <p className="text-slate-300 text-sm mb-4">
                    All your account data, settings, and history will be permanently deleted.
                  </p>
                  <button 
                    onClick={handleDelete} 
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const AboutContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">About</h2>
      
      <div className="space-y-4">
        <Link to={'/'}> <img src="/kflix2.png" className="h-28 flex justify-center items-center mx-auto"/></Link>
        <Link 
          to={'/contactus'} 
          className="block bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700 transition-colors"
        >
          <div className="flex items-center">
            <Mail className="mr-3" size={20}/>
            Contact Us
          </div>
        </Link>
        
        <Link 
          to={'terms'} 
          className="block bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700 transition-colors"
        >
          <div className="flex items-center">
            <ReceiptText className="mr-3" size={20}/>
            Terms & Conditions
          </div>
        </Link>
        <p className="text-gray-400 text-sm">* This site doesn't store any movie or tv show content on its servers. All the content is streamed from
        third-party providers.</p>
      </div>
    </div>
  );

  const LinksContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">External Links</h2>
      
      <div className="space-y-4">
        <a
          href='https://github.com/viVeK21111/kflix' 
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700 transition-colors"
        >
          <div className="flex items-center">
            <Github className="mr-3" size={20}/>
            GitHub 
          </div>
        </a>
        
        <a 
          href="https://discord.com/invite/P3rcqHwp9d" 
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700 transition-colors"
        >
          <div className="flex items-center">
            <img src="/d1.png" className="h-4 w-5 mr-3" alt="Discord"/>
            Discord Community
          </div>
        </a>

        <a 
          href="https://buymeacoffee.com/vivekvito" 
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700 transition-colors"
        >
          <div className="flex items-center">
          <Coffee className='mr-3' size={20} />
            Buy me a coffee
          </div>
        </a>
      </div>
    </div>
  );

  const AdminContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Admin Panel</h2>
      
      <Link 
        to={'admin'} 
        className="block bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700 transition-colors"
      >
        <div className="flex items-center">
          <UserCheck className="mr-3" size={20}/>
          Admin Dashboard
        </div>
      </Link>
    </div>
  );

  const FAQContent = () => {
   
  
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
        
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-zinc-800 rounded-lg overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full p-4 text-left flex justify-between items-center hover:bg-zinc-700 transition-colors"
              >
                <span className="font-medium text-white pr-4">{faq.question}</span>
                <ChevronDown 
                  className={`flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  size={20}
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="p-4 pt-3 text-gray-300 border-t border-zinc-700">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
  
        <div className="bg-zinc-800 p-4 rounded-lg mt-6">
          <p className="text-gray-300">
            Can't find what you're looking for? Join our{' '}
            <a 
              href="https://discord.com/invite/P3rcqHwp9d" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Discord community
            </a>
        
            {' '}for more help.
          </p>
        </div>
      </div>
    );
  };

  // Render content based on selection
  const renderContent = () => {
    switch(settingSelected) {
      case 'account': return <AccountContent />;
      case 'security': return <SecurityContent />;
      case 'about': return <AboutContent />;
      case 'links': return <LinksContent />;
      case 'admin': return <AdminContent />;
      case 'FAQ' : return <FAQContent/>;
      default: return <AccountContent />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      {/* User Profile Section - unchanged */}
      <div className="flex bg-black p-6 shadow-md w-full py-10">
        <img
          src={datalocal?.image || "/a1.jpg"}
          alt="Profile"
          className="flex justify-center size-24 border-red-600 shadow-lg object-cover"
        />
        <div className="ml-4">
          <h1 className="text-2xl font-bold ">{datalocal?.username || "Unknown"}</h1>
          <p className="text-gray-400">{datalocal?.email || "No email available"}</p>
          <button onClick={logout} className='w-max-2xl mt-2 py-1 px-2 bg-white text-white bg-opacity-30 rounded-md font-semibold hover:bg-opacity-40'>Logout</button>  
        </div>
      </div>

      {/* Desktop Layout (md and above) */}
      <div className="hidden md:flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-zinc-800 border-r border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-xl font-semibold">Settings</h3>
          </div>
          
          <nav className="p-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setsettingSelected(item.id)}
                  className={`w-full flex items-center p-3 rounded-lg text-left transition-colors duration-200 ${
                    settingSelected === item.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-zinc-700 hover:text-white'
                  }`}
                >
                  <Icon className="mr-3" size={20}/>
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>

      {/* Mobile Layout (sm and below) */}
      <div className="md:hidden">
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-4">Settings</h3>
          
          <div className="space-y-2">
            {/* Account Section */}
            <div className="bg-zinc-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleMobileSection('account')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-700 transition-colors"
              >
                <div className="flex items-center">
                  <User className="mr-3" size={20}/>
                  Account
                </div>
                {mobileExpanded.account ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
              </button>
              
              {mobileExpanded.account && (
                <div className="p-4 pt-2 space-y-4">
                  <div className="bg-zinc-700 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Content Management</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Enable Adult content (NSFW)</span>
                      <button onClick={toggleSwitch} className="flex items-center">
                        <div className={`relative w-12 h-6 transition-colors duration-200 ease-in-out rounded-full ${isEnabled ? 'bg-blue-600' : 'bg-gray-600'}`}>
                          <div className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 ease-in-out transform ${isEnabled ? 'translate-x-6' : 'translate-x-0'}`}/>
                        </div>
                      </button>
                    </div>
                  </div>

                  <Link className="bg-zinc-700 flex p-4 rounded-lg hover:bg-zinc-600" to={'/history'}>
                    <p  className="font-medium">History</p>
                  </Link>
                </div>
              )}
            </div>

            {/* Security Section */}
            <div className="bg-zinc-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleMobileSection('security')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-700 transition-colors"
              >
                <div className="flex items-center">
                  <Lock className="mr-3" size={20}/>
                  Security
                </div>
                {mobileExpanded.security ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
              </button>
              
              {mobileExpanded.security && (
                <div className="p-4 pt-0 space-y-4">
                  <Link to={'changepassword'} className="block bg-zinc-700 p-3 mt-2 rounded-lg hover:bg-zinc-600 transition-colors">
                    <div className="flex items-center">
                      <Lock className="mr-3" size={18}/>
                      Change Password
                    </div>
                  </Link>

                  <div className="bg-zinc-700 p-3 rounded-lg">
                    <button onClick={handleSecuritydelete} className="flex items-center text-red-400 hover:text-red-300 transition-colors">
                      <AlertTriangle className="mr-2" size={18}/>
                      Delete Account
                    </button>
                    
                    {securitySelected === "delete" && (
                      <div className="mt-4 bg-red-500 bg-opacity-10 p-4 rounded-lg border border-red-500 border-opacity-30">
                        <div className="flex items-start gap-3">
                          <AlertTriangle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="text-red-400 font-medium mb-2">This action cannot be undone</h4>
                            <p className="text-slate-300 text-sm mb-4">
                              All your account data, settings, and history will be permanently deleted.
                            </p>
                            <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors">
                              Delete Account
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* About Section */}
            <div className="bg-zinc-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleMobileSection('about')}
                className="w-full flex items-center justify-between p-4  text-left hover:bg-zinc-700 transition-colors"
              >
                <div className="flex items-center">
                  <ReceiptText className="mr-3" size={20}/>
                  About
                </div>
                {mobileExpanded.about ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
              </button>
              
              {mobileExpanded.about && (
                <div className="p-4 pt-0 space-y-2">
                   <Link to={'/'}> <img src="/kflix2.png" className="h-20 flex justify-center items-center mx-auto"/></Link>
                   
                  <Link to={'/contactus'} className="block bg-zinc-700 p-3 mt-2 rounded-lg hover:bg-zinc-600 transition-colors">
                    <div className="flex items-center">
                      <Mail className="mr-3" size={18}/>
                      Contact Us
                    </div>
                  </Link>
                  <Link to={'terms'} className="block bg-zinc-700 p-3 rounded-lg hover:bg-zinc-600 transition-colors">
                    <div className="flex items-center">
                      <ReceiptText className="mr-3" size={18}/>
                      Terms & Conditions
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Links Section */}
            <div className="bg-zinc-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleMobileSection('links')}
                className="w-full flex items-center justify-between p-4  text-left hover:bg-zinc-700 transition-colors"
              >
                <div className="flex items-center">
                  <LinkIcon className="mr-3" size={20}/>
                  Links
                </div>
                {mobileExpanded.links ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
              </button>
              
              {mobileExpanded.links && (
                <div className="p-4 pt-0 space-y-2">
                  <a
                    href='https://github.com/viVeK21111/kflix' 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-zinc-700 p-3 mt-2 rounded-lg hover:bg-zinc-600 transition-colors"
                  >
                    <div className="flex items-center">
                      <Github className="mr-3" size={18}/>
                      GitHub
                    </div>
                  </a>
                  <a 
                    href="https://discord.com/invite/P3rcqHwp9d" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-zinc-700 p-3 rounded-lg hover:bg-zinc-600 transition-colors"
                  >
                    <div className="flex items-center">
                      <img src="/d1.png" className="h-4 w-5 mr-3" alt="Discord"/>
                      Discord Community
                    </div>
                  </a>

                  <a 
                    href="https://buymeacoffee.com/vivekvito" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-zinc-700 p-3 rounded-lg hover:bg-zinc-600 transition-colors"
                  >
                    <div className="flex items-center">
                    <Coffee className='mr-3' size={18} />
                      Buy me a coffee
                    </div>
                  </a>
                </div>
              )}
            </div>

             {/* FAQ Section */}
             <div className="bg-zinc-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleMobileSection('FAQ')}
                className="w-full flex items-center justify-between p-4  text-left hover:bg-zinc-700 transition-colors"
              >
                <div className="flex items-center">
                  <CircleQuestionMark className="mr-3" size={20}/>
                  FAQ
                </div>
                {mobileExpanded.FAQ ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
              </button>
              
              {mobileExpanded.FAQ && (
                <div className="space-y-6">
                <h2 className="text-2xl px-4 pt-4 font-semibold">Frequently Asked Questions</h2>
                
                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div 
                      key={index} 
                      className="bg-zinc-800 rounded-lg overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full p-4 text-left flex justify-between items-center hover:bg-zinc-700 transition-colors"
                      >
                        <span className="font-medium text-white pr-4">{faq.question}</span>
                        <ChevronDown 
                          className={`flex-shrink-0 transition-transform duration-200 ${
                            openIndex === index ? 'rotate-180' : ''
                          }`}
                          size={20}
                        />
                      </button>
                      
                      <div 
                        className={`overflow-hidden transition-all duration-200 ${
                          openIndex === index ? 'max-h-96' : 'max-h-0'
                        }`}
                      >
                        <div className="p-4 pt-3 text-gray-300 border-t border-zinc-700">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
          
                <div className="bg-zinc-800 p-4 rounded-lg mt-6">
                  <p className="text-gray-300">
                    Can't find what you're looking for? Join our{' '}
                    <a 
                      href="https://discord.com/invite/P3rcqHwp9d" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      Discord community
                    </a>
                
                    {' '}for more help.
                  </p>
                </div>
              </div>
              )}
            </div>

            {/* Admin Section - Only for admins */}
            {isAdmin() && (
              <div className="bg-zinc-800 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleMobileSection('admin')}
                  className="w-full flex items-center justify-between p-4  text-left hover:bg-zinc-700 transition-colors"
                >
                  <div className="flex items-center">
                    <UserCheck className="mr-3" size={20}/>
                    Admin
                  </div>
                  {mobileExpanded.admin ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
                </button>
                
                {mobileExpanded.admin && (
                  <div className="p-4 pt-0">
                    <Link to={'admin'} className="block bg-zinc-700 p-3 mt-2 rounded-lg hover:bg-zinc-600 transition-colors">
                      <div className="flex items-center">
                        <UserCheck className="mr-3" size={18}/>
                        Admin Dashboard
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};