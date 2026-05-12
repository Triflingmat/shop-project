import { get, post, put, del } from '@/utils/request'
import type { Order, PageResult } from '@/types'

/** 获取当前用户的订单列表 */
export const getMyOrderList = (params: {
    pageNum: number
    pageSize: number
    mode?: number
}) => get<PageResult<Order>>('/order/myList', params)

/** 创建订单 */
export const createOrder = (data: Partial<Order>) =>
    post<Order>('/order/add', data)

/** 更新订单（取消/确认收货等） */
export const updateOrder = (data: Partial<Order>) =>
    put<Order>('/order/update', data)

/** 删除订单 */
export const deleteOrder = (id: number) =>
    del(`/order/del/${id}`)
