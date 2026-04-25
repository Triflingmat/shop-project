import type { afterSales } from '@/types';
import { get,put } from '@/utils/request';


export async function getAfterSalesList(pageNum:number,pageSize:number,type:number|null,status:number|null) {
  return await get('/aftersales/list',{pageNum,pageSize,type,status});
}


export async function putAfterSalesData(afterSales: afterSales) {
  return await put('/aftersales/update', afterSales)
}

export default {
  getAfterSalesList,
  putAfterSalesData,
}