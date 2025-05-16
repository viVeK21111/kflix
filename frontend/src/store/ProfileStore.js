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

        } catch (error) {
          //  toast.error(error.message || "an error occured");
            set({data:null,isLoading:false});
        }
    },
    ClearHistory:async()=> {
        set({isLoading:true})
        try {
            const response = await axios.delete(`/api/v1/search/clearhistory`);
            console.log(response.data.message);
            toast.success("success");

        } catch (error) {
           // toast.error(error.response.data.message || "an error occured");
            set({data:null,isLoading:false});
        }
    },
    ClearHistoryid:async(id)=> {
        set({isLoading:true})
        try {
            const response = await axios.delete(`/api/v1/search/removehistory/${id}`);
            console.log(response.data.message);
            toast.success("success");

        } catch (error) {
           // toast.error(error.response.data.message || "an error occured");
            set({data:null,isLoading:false});
        }
    },
    ClearWatchHistoryMovie:async(id,date)=> {
        set({isLoading:true})
        try {
            const response = await axios.delete(`/api/v1/watch/removeMovieWatch/${id}/${date}`);
            console.log(response.data.message);
            if(response.data.success) {
                toast.success("success");
            }
            else{
                toast.error("something went wrong");
            }

        } catch (error) {
           // toast.error(error.response.data.message || "an error occured");
            set({data:null,isLoading:false});
        }
    },
    ClearWatchHistoryTv:async(id,date,season,episode)=> {
        set({isLoading:true})
        try {
            const response = await axios.delete(`/api/v1/watch/removeTvWatch/${id}/${date}/${season}/${episode}`);
            console.log(response.data.message);
            if(response.data.success) {
                toast.success("success");
            }
            else{
                toast.error("something went wrong");
            }

        } catch (error) {
            //toast.error(error.response.data.message || "an error occured");
            set({data:null,isLoading:false});
        }
    },
    ClearHistoryquery:async(query)=> {
        set({isLoading:true})
        try {
            const response = await axios.delete(`/api/v1/search/removehistoryquery/${query}`);
            console.log(response.data.message);
            if(response.data.success) {
                toast.success("success");
            }
            else {
                toast.error("something went wrong");
            }

        } catch (error) {
            //toast.error(error.response.data.message || "an error occured");
            set({data:null,isLoading:false});
        }
    },
    ClearWatchHistory:async(query)=> {
        set({isLoading:true})
        try {
            const response = await axios.delete(`/api/v1/watch/clearWatchHistory`);
            console.log(response.data.message);
            if(response.data.success) {
                toast.success("success");
            }
            else {
                toast.error("something went wrong");
            }

        } catch (error) {
            //toast.error(error.response.data.message || "an error occured");
            set({data:null,isLoading:false});
        }
    },
}));
