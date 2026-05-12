import { get, post } from '@/utils/request'
import type { Orderitem } from '@/types'

/** 获取订单商品明细 */
export const getOrderItems = (orderId: number) =>
    get<Orderitem[]>(`/order_item/list/${orderId}`)

/** 添加订单商品明细 */
export const addOrderItem = (data: Partial<Orderitem>) =>
    post<Orderitem>('/order_item/add', data)
