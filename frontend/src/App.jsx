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
import WatchPage from "./pages/WatchPage"; 

function App() {

  const {user,isCheckingauth,authCheck} = userAuthStore();
  useEffect (()=> {
    authCheck();
  },[authCheck]);
  console.log("user auth: ",user);
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
    <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path='/signup' element ={!user ? <SignUpPage /> : <Navigate to={'/'}/>} />
      <Route path='/login' element ={!user ? <LoginPage /> : <Navigate to={'/'}/>} />
      <Route path='/chat' element ={user ? <ChatPage /> :  <Navigate to={'/'}/>} />
      <Route path="/watch" element = {user ? <WatchPage/> :  <Navigate to={'/'}/>} />
    </Routes>
    <Footer/>
    <Toaster/>
    </>
  );
}
export default App;
