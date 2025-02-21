import {create} from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

export const creditStore = create((set)=> ({
    datac:null,
    isLoading:true,
    getCredits: async(id)=> {
        set({isLoading:true})
        try {
            const response = await axios.get(`/api/v1/movies/credits/${id}`);
            set({datac:response.data.content,isLoading:false});

        } catch (error) {
            toast.error(error.response.data.message || "an error occured");
            set({data:null,isLoading:false});
        }
    },
}))
