import type { Category } from '@/types';
import { get, post, put, del } from '@/utils/request';

// 获取分类列表
export async function getCategoryList(pageNum:number,pageSize:number) {
  return await get('/category/list',{pageNum,pageSize});
}

// 修改分类
export async function putCategoryData(category: Category) {
  return await put('/category/update', category)
}

// 新增分类
export async function postCategoryData(category: Category) {
  return await post('/category/add', category)
}

// 删除分类
export async function delCategoryData(id: number) {
  return await del(`/category/del/${id}`);
}

export default {
  getCategoryList,
  putCategoryData,
  postCategoryData,
  delCategoryData
}