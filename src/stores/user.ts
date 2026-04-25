import { defineStore } from "pinia"
import {computed, ref} from 'vue'
import type {User} from "@/types"


export const useUserStore = defineStore('user',()=>{
    const userInfo = ref<User|null>(null)
    const isLogin = computed(()=>!!userInfo.value)
    const power = computed(()=>userInfo.value?.power)
    const token = ref<string>('')


    const login = (userData:any,tokenString:string)=>{
        token.value = tokenString
        userInfo.value = userData.claims as User
        localStorage.setItem('token',tokenString)
        localStorage.setItem('userInfo',JSON.stringify(userData.claims))
    }

    const logout = ()=>{
        userInfo.value = null;
        token.value = '';
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
    }

    const loadUser = ()=>{
        const localToken = localStorage.getItem('token');
        const localUser = localStorage.getItem('userInfo');
        if(localToken && localUser){
            token.value = localToken;
            userInfo.value = JSON.parse(localUser);
        }
    }
    return {
        userInfo,
        token,
        isLogin,
        power,
        login,
        logout,
        loadUser
    }
}
)