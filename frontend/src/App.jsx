import { Route } from "react-router-dom";
import { Routes } from "react-router";
import Home from "./pages/Home";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/signup' element ={<SignUpPage />} />
      <Route path='/login' element ={<LoginPage />} />
    </Routes>
  )
}
export default App;
