import type {Goods} from '@/types';
import { get, post, put, del } from '@/utils/request';

// 获取商品列表
export async function getGoodsData(pageNum:number,pageSize:number,mode:number) {
  return await get('/goods/list',{pageNum,pageSize,mode});
}

// 修改商品
export async function putGoodsData(goods: Goods) {
  return await put('/goods/update', goods)
}

// 新增商品
export async function postGoodsData(goods:Goods) {
  return await post('/goods/add', goods)
}
// 删除商品
export async function delGoodsData(id: number) {
  return await del(`/goods/del/${id}`);
}

export default {
  getGoodsData,
  putGoodsData,
  postGoodsData,
  delGoodsData
}