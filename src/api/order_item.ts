import type {Orderitem} from '@/types';
import { get, post, put, del } from '@/utils/request';

// 获取商品列表
export async function getOrderitemData(id:number) {
  return await get(`/order_item/list/${id}`);
}

// 修改商品
export async function putOrderitemData(order: Orderitem) {
  return await put('/order_item/update', order)
}

// 新增商品
export async function postOrderitemData(order:Orderitem) {
  return await post('/order_item/add', order)
}
// 删除商品
export async function delOrderitemData(id: number) {
  return await del(`/order/del_item/${id}`);
}

export default {
  getOrderitemData,
  putOrderitemData,
  postOrderitemData,
  delOrderitemData
}