import type {User} from '@/types';
import { get, post, put, del } from '@/utils/request';

// 获取用户列表
export async function getUserData(pageNum:number,pageSize:number,mode:number) {
  return await get('/user/list',{pageNum,pageSize,mode});
}

// 修改用户
export async function putUserData(user: User) {
  return await put('/user/update', user);
}

// 新增用户
export async function postUserData(user: User) {
  return await post('/user/add', user);
}

// 删除用户
export async function delUserData(id: number) {
  return await del(`/user/del/${id}`);
}

export default {
  getUserData,
  putUserData,
  postUserData,
  delUserData
}