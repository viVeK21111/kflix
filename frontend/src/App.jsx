import { Route } from "react-router-dom";
import { Routes } from "react-router";
import Home from "./pages/home/Home";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/signup' element ={<SignUpPage />} />
      <Route path='/login' element ={<LoginPage />} />
      <Route path='/chat' element ={<ChatPage />} />
    </Routes>
    <Footer/>
    </>
  )
}
export default App;
