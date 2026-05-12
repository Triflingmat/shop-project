import axios from 'axios'
import { parseToken } from '@/utils/token'
import type { User } from '@/types'

const BASE_URL = 'http://localhost:8082/api'

/**
 * 用户登录
 */
export const login = async (username: string, password: string) => {
    const res = await axios.post(BASE_URL + '/login', { username, password })

    if (res.data.code !== 200) {
        throw new Error(res.data.msg || '登录失败')
    }

    const token = res.data.data as string
    const userData = parseToken(token)?.claims as User

    return {
        restoken: token,
        userData,
    }
}
