import {create} from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

export const userAuthStore = create((set)=> ({
    user:null,
    isSigningUp:false,
    isCheckingauth:true,
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
    login: async() => {},
    logout: async() => {},
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
