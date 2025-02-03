import AuthScreen from "./AuthScreen";
import HomeScreen from "./HomeScreen"


const HomePage = () => {
    const user = false;
 return (
     (user ? <HomeScreen/> : <AuthScreen/>)
 )
};

export default HomePage;