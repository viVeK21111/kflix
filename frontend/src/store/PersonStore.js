import {create} from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

export const PersonStore = create((set)=> ({
    data:null,
    datac:null,
    isLoading:true,
    getPersonDetails: async(id) => {
        try {
            const response = await axios.get(`/api/v1/search/person/${id}`);
            if("message" in response.data) {
                set({data:response.data.message,isLoading:false});
                toast.success(response.data.message);
                return;
            }
            set({data:response.data.content,isLoading:false});
            return;

        } catch (error) {
            toast.error(error.response.data.message || "an error occured");
            set({data:null,isLoading:false});
            return;
        }
    },
    getPersonCredits: async(id) => {
        try {
            const response = await axios.get(`/api/v1/search/person/credits/${id}`);
            if("message" in response.data) {
                set({datac:response.data.message,isLoading:false});
                toast.success(response.data.message);
                return;
            }
            set({datac:response.data.content,isLoading:false});
            return;

        } catch (error) {
            toast.error(error.response.data.message || "an error occured");
            set({data:null,isLoading:false});
            return;
        }
    },
}))