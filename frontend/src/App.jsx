import { Route,Navigate,Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import Footer from "./components/Footer";
import {Toaster} from 'react-hot-toast';
import { userAuthStore } from "./store/authUser";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import WatchPage2 from "./pages/WatchPage2"; 
import TvPage from "./pages/TvPage";
import SearchPage from './pages/SearchPage'
import ProfilePage from './pages/ProfilePage'
import PersonPage from './pages/PersonPage'
import WatchlistPage from "./pages/WatchlistPage";
import ContactPage from "./pages/ContactPage"
import ChangePassword from "./pages/ChangePassword";
import SearchHistory from "./pages/SearchHistory";
import ChatHistory from "./pages/ChatHistory";
import WatchHistory from "./pages/WatchHistory"
import MoviePage from "./pages/MoviePage";
import Terms from "./pages/Terms";
import {useLocation}  from  'react-router-dom';
import ForgotPassword from "./pages/ForgotPassword";
import ChangePasswordH from "./pages/ChangePasswordH";
import Monitor from "./pages/Monitor";
import UserMonitor from "./pages/UserMonitor";
import { Auth0Provider } from '@auth0/auth0-react';
import { auth0Config } from './auth0-config';
import CallbackPage from './pages/CallbackPage';

function FooterWithRouteCheck() {
  // Import useLocation here to ensure it's updated on every route change
  
  const location = useLocation();
  
  // Don't show footer on chat page
  if (location.pathname === '/chat') {
    return null;
  }
  
  return <Footer />;
}

function App() {
  const {user,isCheckingauth,authCheck} = userAuthStore();
  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || [];

   const isAdmin = () => {
    return adminEmails.includes(user?.email);
  };
  
  useEffect (()=> {
    authCheck();
  },[authCheck]);
  console.log("user auth: ",user);
  const isChatPage = location.pathname === '/chat';
  if(isCheckingauth) {
    return (
      <div className="h-screen ">
        <div className="flex justify-center items-center bg-black h-full">
        <Loader className="animate-spin text-red-600 w-10 h-10"/>
        </div>
      </div>
    )
  }
  return (
    <Auth0Provider {...auth0Config}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/signup' element ={!user ? <SignUpPage /> : <Navigate to={'/'}/>} />
        <Route path='/login' element ={!user ? <LoginPage /> : <Navigate to={'/'}/>} />
        <Route path='/chat' element ={user ? <ChatPage /> :  <Navigate to={'/'}/>} />
        <Route path="/movie" element = {user ? <MoviePage/> :  <Navigate to={'/'}/>} />
        <Route path="/watch" element = {user ? <WatchPage2/> :  <Navigate to={'/'}/>} />
        <Route path="/tv/details" element = {user ? <TvPage/> :  <Navigate to={'/'}/>} />
        <Route path="/person/details" element = {user ? <PersonPage/> :  <Navigate to={'/'}/>} />
        <Route path='/search' element = {user ? <SearchPage/> :  <Navigate to={'/'}/>} />
        <Route path='/profile' element = {user ? <ProfilePage/> : <Navigate to={'/'}/>} />
        <Route path='/watchlist' element = {user ? <WatchlistPage/> : <Navigate to={'/'}/>} />
        <Route path='/contactus' element = {user ? <ContactPage/> : <Navigate to={'/'}/>} />
        <Route path='/profile/changepassword' element = {user ? <ChangePassword/> : <Navigate to={'/'}/>} />
        <Route path='/profile/searchHistory' element = {user ? <SearchHistory/> : <Navigate to={'/'}/>} />
        <Route path='/profile/chatHistory' element = {user ? <ChatHistory/> : <Navigate to={'/'}/>} />
        <Route path='/profile/watchHistory' element = {user ? <WatchHistory/> : <Navigate to={'/'}/>} />
        <Route path='/profile/terms' element = {user ? <Terms/> : <Navigate to={'/'}/>} />
        <Route path='/forgotpassword' element = {!user ? <ForgotPassword/> : <Navigate to={'/'}/>} />
        <Route path='/changepassword' element = {<ChangePasswordH/>} />
        <Route path='/profile/admin' element = {isAdmin() ? <Monitor /> : <Navigate to={'/profile'}/>} />
        <Route path='/profile/admin/user' element = {isAdmin() ? <UserMonitor /> : <Navigate to={'/profile'}/>} />
        <Route path="/callback" element={<CallbackPage />} />
      </Routes>
      <FooterWithRouteCheck/>
      <Toaster/>
    </Auth0Provider>
  );
}
export default App;
