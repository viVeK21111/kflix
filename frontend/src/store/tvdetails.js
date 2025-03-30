import {create} from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

export const DetailsStore = create((set)=> ({
    data:null,
    isLoading:true,
    getTvdetails: async(id)=> {
        set({isLoading:true})
        try {
            const response = await axios.get(`/api/v1/tv/details/${id}`);
            set({data:response.data.content,isLoading:false});

        } catch (error) {
           // toast.error(error.response.data.message || "an error occured");
            set({data:null,isLoading:false});
        }
    },
    getMoviedetails: async(id)=> {
        set({isLoading:true})
        try {
            const response = await axios.get(`/api/v1/movies/details/${id}`);
            set({data:response.data.content,isLoading:false});

        } catch (error) {
           // toast.error(error.response.data.message || "an error occured");
            set({data:null,isLoading:false});
        }
    },
    getMovieDetail: async(id)=> {
        set({isLoading:true})
        try {
            const response = await axios.get(`/api/v1/movies/details/${id}`);
            console.log("movie detail succuessfull");
            return response.data.content;

        } catch (error) {
           // toast.error(error.response.data.message || "an error occured");
            return null;
        }
    },
    
}));
