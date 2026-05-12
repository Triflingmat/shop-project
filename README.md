# 🛒 shop-project

一个基于 **Vue 3 + TypeScript + Element Plus** 构建的前端商城系统，涵盖商品浏览、购物车、订单管理及售后等完整电商流程。

## 技术栈

| 类别      | 技术                      |
| --------- | ------------------------- |
| 框架      | Vue 3.5 (Composition API) |
| 语言      | TypeScript 6.0            |
| 构建工具  | Vite 8                    |
| UI 组件库 | Element Plus 2.14         |
| 状态管理  | Pinia 3                   |
| 路由      | Vue Router 5              |
| HTTP 请求 | Axios 1.16                |
| 图标      | @element-plus/icons-vue   |

## 功能模块

- **首页** — Banner 展示、热销推荐、商品分类导航
- **商品** — 分类筛选、关键词搜索、分页浏览、商品详情
- **用户** — 登录 / 注册、JWT 认证、个人资料编辑、修改密码
- **购物车** — 添加商品、数量调整、本地持久化
- **订单** — 订单确认、订单列表（状态 Tab 切换）、订单详情（步骤条）
- **售后** — 申请售后、售后列表、售后详情

## 项目结构

```
src/
├── api/                  # API 接口层
│   ├── login.ts          # 登录接口
│   ├── user.ts           # 用户 CRUD
│   ├── goods.ts          # 商品 CRUD
│   ├── category.ts       # 分类查询
│   ├── cart.ts           # 购物车
│   ├── order.ts          # 订单 CRUD
│   ├── order_item.ts     # 订单明细
│   └── aftersale.ts      # 售后
├── types/index.ts        # 数据类型定义
├── utils/
│   ├── request.ts        # Axios 封装（拦截器 / Token）
│   └── token.ts          # JWT 解析与过期检测
├── stores/               # Pinia 状态管理
│   ├── user.ts           # 用户状态
│   ├── cart.ts           # 购物车（localStorage 持久化）
│   └── category.ts       # 分类状态
├── router/index.ts       # 路由配置 + 导航守卫
├── components/           # 公共组件
│   ├── GoodsCard.vue     # 商品卡片
│   ├── OrderCard.vue     # 订单卡片
│   └── QuantitySelector.vue  # 数量选择器
└── views/                # 页面视图
    ├── Layout.vue        # 前台布局
    ├── home/             # 首页
    ├── login/            # 登录
    ├── register/         # 注册
    ├── goods/            # 商品列表 / 详情
    ├── cart/             # 购物车
    ├── order/            # 订单确认 / 列表 / 详情
    ├── user/             # 个人中心
    └── aftersale/        # 售后申请 / 列表 / 详情
```

## 快速开始

### 环境要求

- **Node.js** >= 20.19 或 >= 22.12
- 包管理器 npm / pnpm / yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

默认访问地址：`http://localhost:5173`

### 构建生产版本

```bash
npm run build
```

### 预览构建产物

```bash
npm run preview
```

## 路由一览

| 路径                | 页面     | 权限   |
| ------------------- | -------- | ------ |
| `/home`             | 首页     | 公开   |
| `/goods/list`       | 商品列表 | 公开   |
| `/goods/detail/:id` | 商品详情 | 需登录 |
| `/cart`             | 购物车   | 需登录 |
| `/order/confirm`    | 确认订单 | 需登录 |
| `/order/list`       | 我的订单 | 需登录 |
| `/order/detail/:id` | 订单详情 | 需登录 |
| `/user/profile`     | 个人中心 | 需登录 |
| `/aftersale/apply`  | 申请售后 | 需登录 |
| `/aftersale/list`   | 售后列表 | 需登录 |
| `/aftersale/detail` | 售后详情 | 需登录 |
| `/login`            | 登录     | 公开   |
| `/register`         | 注册     | 公开   |

## License

MIT
