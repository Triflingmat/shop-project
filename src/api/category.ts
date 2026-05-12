import { publicGet } from '@/utils/request'
import type { Category, PageResult } from '@/types'

/** 获取分类列表（公开，无需登录） */
export const getCategoryList = (params?: { pageNum?: number; pageSize?: number }) =>
    publicGet<PageResult<Category>>('/category/list', params)
