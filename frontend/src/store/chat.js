import {create} from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

export const chatStore = create((set)=> ({
    data:null,
    isLoading:true,
    contentType:null,
    datatext:null,
    getdata: async({query,history,aimodel})=> {
        set({isLoading:true})
        try {
            const response = await axios.post("/api/v1/chat/movie/llm",{query,history,aimodel});
            if(!(response.data.success)) {
                return toast.error(response.data.message);
            }
            if("nocontext" in response.data) {
                set({data:null,datatext:response.data.nocontext});
            }
            else {
                set({data:response.data.content,datatext:response.data.introText,isLoading:false});
                set({contentType:response.data.contentType});
            }
          

        } catch (error) {
            toast.error(error.response.data.message || "an error occured");
            set({data:null,isLoading:false});
        }
    },
    
}));
