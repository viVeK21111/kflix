import {create} from 'zustand';

export const AccountCheckStore = create((set)=> ({
    user1:false,
    email: null,
    setEmail1 : (val) => {
        set({email:val})
    },
    changeUser : (val) => {
        set({user1:val})
    }
}));