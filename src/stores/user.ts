import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { login as loginApi } from '@/api/login'
import { registerUser, updateUser } from '@/api/user'
import { removeToken, getToken, isTokenExpired } from '@/utils/token'

export const useUserStore = defineStore('user', () => {
    // --- State ---
    const token = ref<string>('')
    const userInfo = ref<User | null>(null)

    // --- Getters ---
    const isLoggedIn = computed(() => !!token.value && !isTokenExpired())
    const username = computed(() => userInfo.value?.username || '')

    // --- Actions ---

    /** 登录 */
    const login = async (usernameStr: string, password: string) => {
        const {userData,restoken} = await loginApi(usernameStr, password)
        if(userData.power !== 3){
            throw new Error('请使用用户账号登录')
        }
        token.value = restoken
        userInfo.value = userData
        localStorage.setItem('token', restoken)
        localStorage.setItem('userInfo', JSON.stringify(userData))
    }

    /** 注册 */
    const register = async (userData: Partial<User>) => {
        await registerUser({ ...userData, power: 3 })
        return userData as User
    }

    /** 退出登录 */
    const logout = () => {
        token.value = ''
        userInfo.value = null
        removeToken()
    }

    /** 更新个人信息 */
    const updateProfile = async (data: Partial<User>) => {
        if (!userInfo.value) return
        const updated = { ...userInfo.value, ...data }
        await updateUser(updated)
        userInfo.value = updated
        localStorage.setItem('userInfo', JSON.stringify(updated))
    }

    /** 从 localStorage 恢复登录状态 */
    const loadUser = () => {
        const storedToken = getToken()
        const storedUser = localStorage.getItem('userInfo')
        if (storedToken && storedUser) {
            token.value = storedToken
            userInfo.value = JSON.parse(storedUser)
        }
    }

    return {
        token,
        userInfo,
        isLoggedIn,
        username,
        login,
        register,
        logout,
        updateProfile,
        loadUser,
    }
})
