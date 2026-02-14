import { userAuthStore } from "../../store/authUser";
import AuthScreen from "./AuthScreen";
import HomeScreen from "./HomeScreen"


const HomePage = () => {
   // const {user} = userAuthStore();
   // {user ? <HomeScreen/> : <AuthScreen/>}
 return <div>
        {<HomeScreen/>}
    </div> 
 
};

export default HomePage;