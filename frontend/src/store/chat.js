import {create} from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

export const chatStore = create((set)=> ({
    data:null,
    isLoading:true,
    getdata: async(query)=> {
        set({isLoading:true})
        try {
            const response = await axios.post("/api/v1/chat/movie/llm",query);
            set({data:response.data.content,isLoading:false});
            toast.success("success");

        } catch (error) {
            toast.error(error.response.data.message || "an error occured");
            set({data:null,isLoading:false});
        }
    },
    
}));
