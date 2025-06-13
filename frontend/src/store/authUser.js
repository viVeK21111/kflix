import {create} from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

export const userAuthStore = create((set)=> ({
    user:null,
    isSigningUp:false,
    isCheckingauth:true,
    isSigningIn:false,
    isLoggingOut:false,
    signup: async(credentails)=> {
        set({isSigningUp:true})
        try {
            const response = await axios.post("/api/v1/auth/signup",credentails);
            set({user:response.data.user,isSigningUp:false})
            toast.success("account created successfully")
        } catch (error) {
            toast.error(error.response.data.message || "an error occured");
            set({isSigningUp:false,user:null})
        }
    },
    signin: async(credentails) => {
        set({isSigningIn:true})
        try {
            const response = await axios.post('/api/v1/auth/signin',credentails);
            set({user:response.data.user,isSigningIn:true})
            toast.success(response.data.message || "Sign in successfully")
        } catch (error) {
            toast.error(error.response.data.message || "an error occured");
            set({isSigningIn:false,user:null})
        }
    },
    logout: async() => {
        set({ isLoggingOut: true });
		try {
			await axios.post("/api/v1/auth/logout");
			set({ user: null, isLoggingOut: false });
			toast.success("Logged out successfully");
		} catch (error) {
			set({ isLoggingOut: false });
			toast.error(error.response.data.message || "Logout failed");
		}
    },
    authCheck: async() => {
        set({isCheckingauth:true})
        try {
            const response = await axios.get('/api/v1/auth/authcheck');
            set({user:response.data.user,isCheckingauth:false});
        } catch (error) {
            set({isCheckingauth:false,user:null});
        }
    }
}));
