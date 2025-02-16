import {create} from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

export const tvDetailsStore = create((set)=> ({
    data:null,
    isLoading:true,
    getdetails: async(id)=> {
        set({isLoading:true})
        try {
            const response = await axios.get(`/api/v1/tv/details/${id}`);
            set({data:response.data.content,isLoading:false});

        } catch (error) {
            toast.error(error.response.data.message || "an error occured");
            set({data:null,isLoading:false});
        }
    },
    
}));
