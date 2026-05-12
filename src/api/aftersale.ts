import { get, post, put } from '@/utils/request'
import type { AfterSales, PageResult } from '@/types'

/** 获取售后列表（管理员） */
export const getAftersaleList = (params: {
    pageNum: number
    pageSize: number
    type?: number
    status?: number
}) => get<PageResult<AfterSales>>('/aftersales/list', params)

/** 获取当前用户的售后列表 */
export const getMyAftersaleList = (params: {
    pageNum: number
    pageSize: number
    type?: number
    status?: number
}) => get<PageResult<AfterSales>>('/aftersales/myList', params)

/** 新增售后申请 */
export const addAftersale = (data: Partial<AfterSales>) =>
    post<AfterSales>('/aftersales/add', data)

/** 提交/更新售后申请 */
export const updateAftersale = (data: Partial<AfterSales>) =>
    put<AfterSales>('/aftersales/update', data)
