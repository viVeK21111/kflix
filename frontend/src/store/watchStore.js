import {create} from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

export const addWatchStore = create((set)=> ({
    addWatch: async(id)=> {
        set({isLoading:true})
        try {
            const response = await axios.get(`/api/v1/movies/addWatch/${id}`);
            toast.success(response.data.message);
            return;

        } catch (error) {
            toast.error(error.response.data.message || "an error occured");
            set({datas:null,isLoading:false});
        }
    },
}));