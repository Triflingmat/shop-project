export interface User {
    id: number
    username: string
    password: string
    power: number
    phone: string
    address: string
    salt: string
}

export interface Goods {
    id: number
    name: string
    price: string
    is_on_sale: number
    goods_img: string
    category_id: number
    goods_desc: string
    stock: number
}

export interface Category {
    id: number
    name: string
}

export interface Order {
    id: number
    user_id: number
    state: number
    username: string
    phone: string
    address: string
    total_amount: string
    remark: string
    create_time: string
}

export interface Orderitem {
    id: number
    order_id: number
    goods_id: number
    goods_name: string
    price: string
    quantity: number
}

export interface AfterSales {
    id: number
    order_id: number
    goods_name: string
    type: number
    status: number
    refund_price: string
    reason: string
    admin_note: string
    creat_time: string
}

// 购物车单项
export interface CartItem {
    goods: Goods
    quantity: number
    selected: boolean
}

// 分页响应
export interface PageResult<T> {
    list: T[]
    total: number
}

// 通用接口响应
export interface ApiResponse<T = any> {
    code: number
    data: T
    msg: string
}
