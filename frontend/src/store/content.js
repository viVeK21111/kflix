import {create} from 'zustand';

export const useContentStore = create ((set) => ({

    contentType:"movies",
    setContentType: (type) => set({contentType:type}),

}))