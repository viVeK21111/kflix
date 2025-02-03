import { Route } from "react-router-dom";
import { Routes } from "react-router";
import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import Footer from "./components/Footer";

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path='/signup' element ={<SignUpPage />} />
      <Route path='/login' element ={<LoginPage />} />
      <Route path='/chat' element ={<ChatPage />} />
    </Routes>
    <Footer/>
    </>
  )
}
export default App;
