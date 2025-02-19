import {create} from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

export const ProfileStore = create((set)=> ({
    data:null,
    isLoading:true,
    contentType:null,
    getdata: async()=> {
        set({isLoading:true})
        try {
            const response = await axios.get("/api/v1/user/profile");
            set({data:response.data.user,isLoading:false});
            set({contentType:response.data.contentType});
            toast.success("success");

        } catch (error) {
            toast.error(error.response.data.message || "an error occured");
            set({data:null,isLoading:false});
        }
    },
    ClearHistory:async()=> {
        set({isLoading:true})
        try {
            const response = await axios.get(`/api/v1/search/clearhistory`);
            console.log(response.data.message);
            toast.success("success");

        } catch (error) {
            toast.error(error.response.data.message || "an error occured");
            set({data:null,isLoading:false});
        }
    },
    ClearHistoryid:async(id)=> {
        set({isLoading:true})
        try {
            const response = await axios.get(`/api/v1/search/removehistory/${id}`);
            console.log(response.data.message);
            toast.success("success");

        } catch (error) {
            toast.error(error.response.data.message || "an error occured");
            set({data:null,isLoading:false});
        }
    },
}));
