import axios from 'axios'

const VITE_API_URL = 'http://localhost:8082'

// ========== 认证请求实例（需要登录的接口使用） ==========
const request = axios.create({
    baseURL: VITE_API_URL + '/api',
    timeout: 5000,
})

request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = token
        }
        return config
    },
    (error) => {
        console.error('请求发送失败:', error)
        return Promise.reject(error)
    }
)

request.interceptors.response.use(
    // 后端返回 { code, msg, data: T }，解包到 data 实体层
    (response) => response.data.data ?? response.data,
    (error) => {
        let msg = '网络请求异常'
        if (error.response) {
            switch (error.response.status) {
                case 400: msg = '请求参数错误'; break
                case 401:
                    msg = '登录已过期，请重新登录'
                    localStorage.removeItem('token')
                    localStorage.removeItem('userInfo')
                    break
                case 404: msg = '接口不存在'; break
                case 500: msg = '服务器错误'; break
                default:  msg = `请求错误 ${error.response.status}`
            }
        } else if (error.code === 'ECONNABORTED') {
            msg = '请求超时，请重试'
        }
        console.error(msg)
        return Promise.reject(new Error(msg))
    }
)

// ========== 公开请求实例（无需登录的接口使用） ==========
const publicRequest = axios.create({
    baseURL: VITE_API_URL + '/api',
    timeout: 5000,
})

publicRequest.interceptors.response.use(
    // 后端返回 { code, data: { list, total }, msg }，解包到 data 层
    (response) => response.data.data ?? response.data,
    (error) => {
        // 公开接口遇到 401 时不报警，静默返回空数据
        if (error.response?.status === 401) {
            return Promise.resolve({ list: [], total: 0 })
        }
        if (error.response?.status === 400) {
            return Promise.reject(new Error(error.response.data?.msg || '请求参数错误'))
        }
        if (error.code === 'ECONNABORTED') {
            return Promise.reject(new Error('请求超时，请重试'))
        }
        return Promise.reject(new Error('网络请求异常'))
    }
)

export default request
export { publicRequest }

// 便捷方法
export const get = <T = any>(url: string, params?: object) =>
    request.get<T>(url, { params }) as Promise<T>
export const post = <T = any>(url: string, data?: object) =>
    request.post<T>(url, data) as Promise<T>
export const put = <T = any>(url: string, data?: object) =>
    request.put<T>(url, data) as Promise<T>
export const del = <T = any>(url: string) =>
    request.delete<T>(url) as Promise<T>

// 公开便捷方法
export const publicGet = <T = any>(url: string, params?: object) =>
    publicRequest.get<T>(url, { params }) as Promise<T>
export const publicPost = <T = any>(url: string, data?: object) =>
    publicRequest.post<T>(url, data) as Promise<T>
