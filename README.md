# 后台商品管理系统前端

## 项目介绍

该项目品是一个基于 Vue 3 + TypeScript 开发的前端后台管理系统，用于管理商品、订单、用户和售后等业务功能。

## 技术栈

- **前端框架**：Vue 3 + TypeScript
- **构建工具**：Vite
- **状态管理**：Pinia
- **路由管理**：Vue Router
- **UI 组件库**：Element Plus
- **图表库**：ECharts
- **网络请求**：Axios
- **认证方式**：JWT Token

## 功能模块

### 1. 用户认证

- 登录功能
- 管理员管理
- 用户管理

### 2. 商品管理

- 商品分类管理
- 商品信息管理

### 3. 订单管理

- 订单列表
- 订单详情

### 4. 售后管理

- 售后申请处理

### 5. 个人中心

- 个人信息查看

## 项目结构

```
├── src/
│   ├── api/           # API 接口定义
│   │   ├── aftersale.ts     # 售后相关接口
│   │   ├── category.ts      # 分类相关接口
│   │   ├── goods.ts         # 商品相关接口
│   │   ├── login.ts         # 登录相关接口
│   │   ├── order.ts         # 订单相关接口
│   │   ├── order_item.ts    # 订单项相关接口
│   │   └── user.ts          # 用户相关接口
│   ├── assets/        # 静态资源
│   ├── components/    # 公共组件
│   ├── router/        # 路由配置
│   ├── stores/        # 状态管理
│   ├── types/         # TypeScript 类型定义
│   ├── utils/         # 工具函数
│   │   ├── crud.ts    # CRUD 操作工具
│   │   ├── request.ts # 网络请求配置
│   │   └── token.ts   # Token 处理工具
│   ├── views/         # 页面组件
│   │   ├── aftersale/     # 售后管理
│   │   ├── goods/         # 商品管理
│   │   ├── home/          # 首页
│   │   ├── login/         # 登录页面
│   │   ├── order/         # 订单管理
│   │   └── userAuth/      # 用户认证管理
│   ├── App.vue        # 根组件
│   └── main.ts        # 入口文件
```

## 后端项目地址

- 后端项目地址：`https://github.com/Triflingmat/shop`

## 后端 API 配置

项目默认后端 API 地址为 `http://localhost:8082/api`，可在 `src/utils/request.ts` 中修改：

```typescript
const VITE_API_URL = "http://localhost:8082";

const request = axios.create({
  baseURL: VITE_API_URL + "/api",
  timeout: 5000,
});
```

## 使用方法

1. 克隆项目到本地
2. 安装依赖
3. 启动后端项目
4. 运行项目
5. 访问 `http://localhost:5173` 查看项目效果

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
