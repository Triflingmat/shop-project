import { get, post, put, del } from '@/utils/request'

/** 后端购物车项 */
export interface BackendCartItem {
    id: number
    user_id: number
    goods_id: number
    goods_name: string
    goods_img: string
    price: string
    quantity: number
    checked: number
}

/** 获取购物车列表 */
export const getCartList = () =>
    get<BackendCartItem[]>('/cart/list')

/** 加入购物车 */
export const addToCart = (data: { goods_id: number; goods_name: string; goods_img: string; price: string; quantity: number }) =>
    post<string>('/cart/add', data)

/** 更新购物车项（数量/选中） */
export const updateCartItem = (data: { id: number; quantity: number; checked: number }) =>
    put<string>('/cart/update', data)

/** 全选/全不选 */
export const checkAllCart = (checked: number) =>
    put<string>('/cart/checkAll', { checked })

/** 删除购物车项 */
export const deleteCartItem = (id: number) =>
    del<string>(`/cart/del/${id}`)

/** 删除已选中（下单后调用） */
export const clearCheckedCart = () =>
    del<string>('/cart/clearChecked')

/** 清空购物车 */
export const clearCart = () =>
    del<string>('/cart/clear')
