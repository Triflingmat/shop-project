export interface User{
    id:number
    username: string
    password: string
    power: number
    phone: string
    address: string
    salt: string
}

export interface Goods{
    id:number//ID
    name:string//名称
    price:string// 价格
    is_on_sale:number//是否上架0/1
    goods_img:string//图片地址
    category_id:number//分类
    goods_desc:string//描述
    stock:number//库存
}

export interface Category{
    id:number
    name:string
}

export interface Order{
    id:number;
    user_id:number;
    state:number;
    username:string;
    phone:string;
    address:string;
    total_amount:string;
    remark:string;
    create_time:string;
}

export interface Orderitem{
    id:number
    order_id:number
    goods_id:number
    goods_name:string
    price:string
    quantity:number
}

export interface ChartData{
    name:string
    value:number
}

export interface afterSales{
    id:number
    order_id:number
    goods_name:string
    type:number
    status:number
    refund_price:string
    reason:string
    admin_note:string
    creat_time:string
}