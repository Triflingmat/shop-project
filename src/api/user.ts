import axios from 'axios'
import { get, post, put, del } from '@/utils/request'
import type { User, PageResult } from '@/types'

const BASE_URL = 'http://triflingmat.icu:8082/api'

/** 获取用户列表 */
export const getUserList = (params: { pageNum: number; pageSize: number; mode?: number }) =>
    get<PageResult<User>>('/user/list', params)

/** 用户注册（公开接口，使用原始 axios，无需认证） */
export const registerUser = (data: Partial<User>) =>
    axios.post(BASE_URL + '/register', data).then((res) => {
        if (res.data.code !== 200) {
            throw new Error(res.data.msg || '注册失败')
        }
        return res.data
    })

/** 更新用户信息 */
export const updateUser = (data: Partial<User>) =>
    put<User>('/user/update', data)

/** 删除用户 */
export const deleteUser = (id: number) =>
    del(`/user/del/${id}`)
