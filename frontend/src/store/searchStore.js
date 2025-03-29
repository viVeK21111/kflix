import {create} from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

export const searchStore = create((set)=> ({
    data:null,
    isLoading:true,
    getTv: async(query)=> {
        set({isLoading:true})
        try {
            const response = await axios.get(`/api/v1/search/tv/${query}`);
            if("message" in response.data) {
                set({data:response.data.message,isLoading:false});
                //toast.success("no tv fetched");
                return;
            }
            set({data:response.data.content,isLoading:false});
            //toast.success("tv fetched success");

        } catch (error) {
            toast.error(error.response.data.message || "an error occured");
            set({data:null,isLoading:false});
        }
    },
    getMovie: async(query)=> {
        set({isLoading:true})
        try {
            const response = await axios.get(`/api/v1/search/movie/${query}`);
            if("message" in response.data) {
                set({data:response.data.message,isLoading:false});
                //toast.success("no movie fetched");
                return;
            }
            set({data:response.data.content,isLoading:false});
            

        } catch (error) {
            toast.error(error.response.data.message || "an error occured");
            set({data:null,isLoading:false});
        }
    },
    getPerson: async(query)=> {
        set({isLoading:true})
        try {
            const response = await axios.get(`/api/v1/search/people/${query}`);
            if("message" in response.data) {
                set({data:response.data.message,isLoading:false});
                //toast.success("no person fetched");
                return;
            }
            set({data:response.data.content,isLoading:false});
            //toast.success("person fetched success");

        } catch (error) {
            toast.error(error.response.data.message || "an error occured");
            set({data:null,isLoading:false});
            return;
        }
    },
}));
