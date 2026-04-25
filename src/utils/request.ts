import axios from "axios";

const VITE_API_URL = "http://localhost:8082"

const request = axios.create({
    baseURL:VITE_API_URL + '/api',
    timeout:5000
})

request.interceptors.request.use(
(config) => {
    // 从本地获取 token
    const token = localStorage.getItem("token");
    console.log("获取到的token:", token);
    
    // 如果有 token，就自动放入请求头 Authorization
    if (token) {
        config.headers.Authorization = token;
        console.log("设置Authorization头:", token);
    }
    
    return config;
    },
    (error) => {
        console.log("请求发送失败", error)
        return Promise.reject(error)
    }
)
request.interceptors.response.use(
    (response)=>{
        return response.data
    },
    (error)=>{
        let msg = '网络请求异常'
        if(error.response){
            switch(error.response.status){
                case 400:msg='请求参数错误';break
                case 401: 
                    msg = '登录已过期，请重新登录';
                    // 401 清除 token 并跳登录
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                    break;
                case 404:msg='接口不存在';break
                case 500:msg='服务器错误';break
                default:msg=`请求错误${error.response.status}`
            }
        }else if(error.code === 'ECONNABORTED'){
                msg = '请求超时，请重试'
            }
        console.error(msg)
        return Promise.reject(msg)
        }
)

export default request

export const get = <T = any>(url: string, params?: object) => request.get<T>(url, { params }) as Promise<T>
export const post = <T = any>(url: string, data: object) => request.post<T>(url, data) as Promise<T>
export const put = <T = any>(url: string, data: object) => request.put<T>(url, data) as Promise<T>
export const del = <T = any>(url: string) => request.delete<T>(url) as Promise<T>