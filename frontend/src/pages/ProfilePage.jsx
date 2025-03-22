import React, { useEffect,useState } from "react";
import { ProfileStore } from "../store/ProfileStore";
import { userAuthStore } from "../store/authUser";
import {Link} from 'react-router-dom';
import {Lock,Eye,History,Search,MessagesSquare,Tv,Mail,AlertTriangle } from "lucide-react";
import axios from 'axios';
import toast from "react-hot-toast";

export default function ProfilePage(){
  const { getdata, data,ClearHistory,ClearHistoryid } = ProfileStore();
  const {logout} = userAuthStore();
  
  const [datalocal,setdatalocal] = useState(null);
  const [settingSelected,setsettingSelected] = useState(null);
  const [isEnabled, setIsEnabled] = useState(null);
  const [securitySelected,setsecuritySelected] = useState(null);
  const [deleted,setDeleted] = useState(false);
  const [del,setdel] = useState(false);
  const [loading,setloading] = useState(true);
  useEffect(() => {
    if(!deleted && !del) {
      getdata().finally(() => setloading(false));
      setdatalocal(data);
      localStorage.setItem("numitems",6);
    }
  }, [data]);

  useEffect(() => {
    const getpref = async() => {
      const pref = await axios.get('/api/v1/user/getadultPreference');
    const datapref = pref.data.pref;
    setIsEnabled(datapref);
    }
    if(!deleted) getpref();
  },[])

  
 
  const handlesSecurity = () => {
      if(settingSelected==="security") setsettingSelected("");
      else setsettingSelected("security");
  }
  const handleContent = () => {
    if(settingSelected==="content") setsettingSelected("");
    else setsettingSelected("content");
  }
  const handleHistory = () => {
    if(settingSelected==="history") setsettingSelected("");
    else setsettingSelected("history");
  }
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
    const response = await axios.get('/api/v1/auth/deleteUser');
    if (response.data.success) {
      setDeleted(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      } 
    
  }
  if(deleted ) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-xl font-semibold bg-gray-900 text-white">
        <img className="w-64" src='/kflix2.png'></img>
        <p>Sorry to see u go...</p>
      </div>
    )
  }
  if(loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-xl font-semibold bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    )
  }
  return (
    
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
  
      {/* User Profile Section */}
      <div className="flex bg-black p-6 rounded-t-lg shadow-md w-full py-10">
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
      <div className="w-full bg-zinc-900">
      <div className="px-3 py-5">
        <p className="text-xl">Settings</p>
      </div>
      <div className="flex flex-col w-full items-star">
        <div>
        <button onClick={handlesSecurity} className="flex pl-3 py-2 w-full  border-t border-b border-white border-opacity-15 hover:bg-slate-700"><Lock size={20} /> <p className="ml-2">Security</p></button>
         {settingSelected==="security" && (
              <div className="flex flex-col bg-black">
                <Link to={'changepassword'} className="flex pl-3 py-2 w-full  border-b border-white border-opacity-15 hover:bg-slate-800">Change password</Link>
                <button onClick={handleSecuritydelete} className="flex pl-3 py-2 w-full items-center  border-b border-white border-opacity-15 hover:bg-slate-800">Delete Account <p className="ml-2"><Lock color="red" size={18}/></p></button>
                {securitySelected === "delete" && (
                  <div className="flex">
                      <div className="w-full md:flex  items-start gap-3 bg-red-500 bg-opacity-10 p-4 rounded-lg border border-red-500 border-opacity-30">
                       <div>
                       <div className="flex">
                        <AlertTriangle size={20} className="text-red-500 mt-0.5" />
                         <h4 className="text-red-400 ml-2 font-medium mb-1">This action cannot be undone</h4>
                       </div>
                       <p className="text-slate-300 text-sm">
                            All your account data, settings, and history will be permanently deleted. 
                        </p>
                       </div>
                    <button onClick={handleDelete} className="ml-auto mt-5 md:mt-0 rounded-md bg-red-600 p-2">
                            Delete Account
                  </button>
                    </div>
                          
                  </div>
                 
                        )} 
              </div>
         )} 
        </div>
        <div>
        <button onClick={handleContent} className="flex pl-3 py-2 w-full  border-b border-white border-opacity-15 hover:bg-slate-700"><Eye size={20}/><p className="ml-2">Content Management</p></button>
        {settingSelected==="content" && (
              <div className="flex flex-col bg-black">
            <button 
           onClick={toggleSwitch}
           className="flex items-center justify-between pl-3 py-2 w-full border-b border-white border-opacity-15 hover:bg-slate-800"
            >
              <span>Enable Adult content (NSFW)</span>
              <div className="mr-3 flex items-center">
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
              </div>
           </button>              
      </div>
         )} 
        </div>
        <div>
        <button onClick={handleHistory} className="flex pl-3 py-2 w-full  border-b border-white border-opacity-15 hover:bg-slate-700"><History size={20}/><p className="ml-2">History</p></button>
        {settingSelected==="history" && (
              <div className="flex flex-col bg-black">
                <Link to={'searchHistory'} className="flex pl-3 py-2 w-full items-center border-b border-white border-opacity-15 hover:bg-slate-800"><p className="mr-2"><Search size={18}/></p>Search History </Link>
                <Link to={'chatHistory'} className="flex pl-3 py-2 w-full items-center border-b border-white border-opacity-15 hover:bg-slate-800"><p className="mr-2"><MessagesSquare size={18}/></p>chat History </Link>
                <Link to={'watchHistory'} className="flex pl-3 py-2 w-full items-center border-b border-white border-opacity-15 hover:bg-slate-800"><p className="mr-2"><Tv  size={18}/></p>Watch History </Link>
              </div>
         )} 
        </div>
        <div className="flex flex-col">
        <Link to={'/contactus'} className="flex pl-3 py-2 w-full items-center border-b border-white border-opacity-15 hover:bg-slate-700"><Mail size={18}/><p className="ml-2">Contact Us</p></Link>
        </div>
      </div>
      </div>
      

      
    </div>
  );
};


