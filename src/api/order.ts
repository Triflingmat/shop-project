import type {Order} from '@/types';
import { get, post, put, del } from '@/utils/request';

// 获取商品列表
export async function getOrderData(pageNum:number,pageSize:number,mode:number) {
  return await get('/order/list',{pageNum,pageSize,mode});
}

// 修改商品
export async function putOrderData(order: Order) {
  return await put('/order/update', order)
}

// 新增商品
export async function postOrderData(order:Order) {
  return await post('/order/add', order)
}
// 删除商品
export async function delOrderData(id: number) {
  return await del(`/order/del/${id}`);
}

export default {
  getOrderData,
  putOrderData,
  postOrderData,
  delOrderData
}