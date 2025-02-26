import {create} from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

export const SimilarStore = create((set)=> ({
    datas:null,
    isLoading:true,
    getSimilarMovies: async(id)=> {
        set({isLoading:true})
        try {
            const response = await axios.get(`/api/v1/movies/similar/${id}`);
            if("message" in response.data) {
                set({datas:response.data.message,isLoading:false});
                toast.success("no tv fetched");
                return;
            }
            set({datas:response.data.content,isLoading:false});

        } catch (error) {
            toast.error(error.response.data.message || "an error occured");
            set({datas:null,isLoading:false});
        }
    },
}));