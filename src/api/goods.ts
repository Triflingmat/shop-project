import { publicGet, get, post, put, del } from '@/utils/request'
import type { Goods, PageResult } from '@/types'

/** 获取商品列表（公开，支持按名称/分类搜索） */
export const getGoodsList = (params: {
    pageNum: number
    pageSize: number
    mode?: number       // category_id
    name?: string       // 模糊搜索名称
}) => publicGet<PageResult<Goods>>('/goods/list', params)

/** 获取单个商品详情（需登录） */
export const getGoodsDetail = (id: number) =>
    get<Goods>('/goods/detail/' + id)

/** 添加商品 */
export const addGoods = (data: Partial<Goods>) =>
    post<Goods>('/goods/add', data)

/** 更新商品 */
export const updateGoods = (data: Partial<Goods>) =>
    put<Goods>('/goods/update', data)

/** 删除商品 */
export const deleteGoods = (id: number) =>
    del(`/goods/del/${id}`)
