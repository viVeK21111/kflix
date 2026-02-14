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
import WatchPage2 from "./pages/WatchPage3"; 
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
import HistoryPage from "./pages/HistoryPage"
import MoviePage from "./pages/MoviePage";
import Terms from "./pages/Terms";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePasswordH from "./pages/ChangePasswordH";
import Monitor from "./pages/Monitor";
import UserMonitor from "./pages/UserMonitor";
import FunPage from "./pages/FunPage";
import AdultPage from "./pages/AdultPage";
import BottomNavbar from "./components/BottomNavbar";
import AnimePage from "./pages/AnimePage";
import NotFoundPage from "./pages/NotFoundPage";
import FlappyFlix from "./pages/FlappyFlix";
import KdramaPage from "./pages/KdramaPage";
import DirectorsPage from "./pages/DirectorsPage";
import AnimationPage from "./pages/AnimationPage";
import GalleryShot from './pages/GalleryShot';
import UserGalleryImages from './pages/UserGalleryImages';
import GoatMovies from './pages/GoatMovies';
import GoatCategoryPage from './pages/GoatCategoryPage';
import MusicComPage from "./pages/MusicComPage";
import AspectRatiosPage from "./pages/AspectRatiosPage";
import HanimePage from "./pages/HanimePage";
import HanimeDetailPage from "./pages/HanimeDetailPage";
import HanimeTermsPage from "./pages/HanimeTermsPage";
import HanimeCollectionsPage from './pages/HanimeCollectionsPage';
import TopPage from "./pages/TopPage";
import AuthScreen from "./pages/home/AuthScreen";
import { useLocation } from 'react-router-dom';
import LoginRequired from './pages/LoginRequired';



const HIDE_NAVBAR_PATHS = ['/welcome', '/signup', '/login','/forgotpassword'];

function BottomNavbarReturn() {
  const location = useLocation();
  if (HIDE_NAVBAR_PATHS.includes(location.pathname)) {
    return null;
  }
  return <BottomNavbar />;
}


function App() {
  const location = useLocation();
  const {user,isCheckingauth,authCheck} = userAuthStore();
  const showBottomNavbar = !HIDE_NAVBAR_PATHS.includes(location.pathname);
  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || [];

   const isAdmin = () => {
    return adminEmails.includes(user?.email);
  };
  
  useEffect (()=> {
    authCheck();
  },[authCheck]);
  
  console.log("user auth: ",user);
  if(isCheckingauth) {
    return (
      <div className="h-screen">
        <div className="flex justify-center items-center bg-gray-900 h-full">
        <div className="absolute inset-0 md:bg-gradient-to-r bg-gradient-to-b from-black/50 via-black/20  to-transparent/50 "></div>

        <img src="/klogo1.png" className="h-36 z-50"/>
       
        </div>
      </div>
    )
  }
  return (
    <>

    <div className={showBottomNavbar ? `pb-16 sm:pb-0 sm:pl-20` : ``}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/welcome" element={<AuthScreen />} />
        <Route path='/signup' element ={!user ? <SignUpPage /> : <Navigate to={'/'}/>} />
        <Route path='/login' element ={!user ? <LoginPage /> : <Navigate to={'/'}/>} />
        <Route path='/chat' element ={user ? <ChatPage /> :  <LoginRequired />} />

        <Route path="/movie" element = { <MoviePage/> } />
        <Route path="/watch" element = { <WatchPage2/> } />
        <Route path="/tv/details" element = { <TvPage/> } />
        <Route path="/person/details" element = { <PersonPage/> } />
        <Route path='/search' element = { <SearchPage/> } />

        <Route path='/profile' element = {user ? <ProfilePage/> :  <LoginRequired />} />
        <Route path='/watchlist' element = {user ? <WatchlistPage/> :  <LoginRequired />} />
        <Route path='/contactus' element = {user ? <ContactPage/> :  <LoginRequired />} />
        <Route path='/profile/changepassword' element = {user ? <ChangePassword/> :  <LoginRequired />} />
        <Route path='/profile/searchHistory' element = {user ? <SearchHistory/> :  <LoginRequired />} />
        <Route path='/profile/chatHistory' element = {user ? <ChatHistory/> :  <LoginRequired />} />
        <Route path='/profile/watchHistory' element = {user ? <WatchHistory/> : <LoginRequired />} />
        <Route path='/history' element = {user ? <HistoryPage/> :  <LoginRequired />} />
        <Route path='/forgotpassword' element = {!user ? <ForgotPassword/> : <Navigate to={'/'}/>} />
        <Route path='/changepassword' element = {<ChangePasswordH/>} />
        <Route path='/profile/admin' element = {isAdmin() ? <Monitor /> : <Navigate to={'/profile'}/>} />
        <Route path='/profile/admin/user' element = {isAdmin() ? <UserMonitor /> : <Navigate to={'/profile'}/>} />

        <Route path='/anime' element = {<AnimePage /> } />
        <Route path='/animation' element = { <AnimationPage /> } />
        <Route path='/kdrama' element = { <KdramaPage /> } />

	      <Route path="/user/gallery-img" element={user ? <UserGalleryImages /> :   <LoginRequired />} />
        <Route path='/fun/flappy' element = {user ? <FlappyFlix /> :  <LoginRequired />} />

        <Route path="/genres" element={ <GoatMovies /> }/>
        <Route path="/genres/:category" element={ <GoatCategoryPage /> }/>
        <Route path='/profile/terms' element = { <Terms/> } />
        <Route path='/fun' element = {<FunPage />} />
        <Route path='/fun/adult' element = {<AdultPage /> } />
        <Route path='/greatest' element = {<TopPage /> } />
        <Route path="/gallery-shot" element={<GalleryShot />} />
        <Route path="/aspect-ratios" element={<AspectRatiosPage />} />
        <Route path="/hentocean" element={<HanimePage />} />
        <Route path="/hentocean/:slug" element={<HanimeDetailPage />} />
        <Route path="/hentocean/terms" element={<HanimeTermsPage />} />
        <Route path="/hentocean/collections" element={<HanimeCollectionsPage />} />
        <Route path="/hentocean/collections/:collectionSlug" element={<HanimeCollectionsPage />} />
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
    <BottomNavbarReturn/>
    <Toaster/>
    </>
  );
  
}
export default App;
