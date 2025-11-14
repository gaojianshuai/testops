# DevOps平台 - 一站式测试开发平台

一个功能完整的DevOps平台，支持日常开发协同、测试、自动化性能、集成、部署、管理和代码库等功能。

## 功能特性

### 核心功能模块

1. **首页** - 项目概览和快速入口
2. **管理** - 项目管理
3. **协作** - 团队协作和沟通
4. **代码库** - 代码仓库管理
5. **集成** - 第三方工具集成（GitHub、GitLab、Jenkins、Docker等）
6. **测试** - 完整的测试管理功能
   - 测试概况
   - 测试方案
   - 用例设计
   - 测试执行
   - 测试报告
   - 测试进度
   - 历史报告
   - UI测试（支持Selenium、Playwright、Cypress）
   - 接口测试
   - JMETER性能测试
7. **制品** - 构建产物管理
8. **部署** - 自动化部署管理
9. **设置** - 系统设置

## 技术栈

### 前端
- React 18
- TypeScript
- Ant Design 5
- React Router 6
- Vite
- Axios

### 后端
- Node.js
- Express
- TypeScript
- CORS

## 快速开始

### 安装依赖

```bash
# 安装所有依赖（根目录、前端、后端）
npm run install:all
```

或者分别安装：

```bash
# 根目录
npm install

# 前端
cd client
npm install

# 后端
cd server
npm install
```

### 启动开发服务器

```bash
# 同时启动前端和后端
npm run dev
```

或者分别启动：

```bash
# 启动前端（端口3000）
npm run dev:client

# 启动后端（端口3001）
npm run dev:server
```

### 构建生产版本

```bash
cd client
npm run build
```

## 项目结构

```
.
├── client/                 # 前端应用
│   ├── src/
│   │   ├── components/    # 组件
│   │   ├── pages/         # 页面
│   │   ├── api/           # API接口
│   │   └── ...
│   └── ...
├── server/                 # 后端服务
│   ├── src/
│   │   ├── routes/        # 路由
│   │   ├── services/      # 服务层
│   │   └── ...
│   └── ...
└── ...
```

## API接口

### 测试方案 API

- `GET /api/test-plans` - 获取测试方案列表
- `GET /api/test-plans/:id` - 获取单个测试方案
- `POST /api/test-plans` - 创建测试方案
- `PUT /api/test-plans/:id` - 更新测试方案
- `DELETE /api/test-plans/:id` - 删除测试方案

## 开发说明

### 添加新功能

1. 在前端 `client/src/pages/` 创建新页面
2. 在 `client/src/App.tsx` 添加路由
3. 在 `client/src/components/Layout/MainLayout.tsx` 添加菜单项
4. 在后端 `server/src/routes/` 创建新路由
5. 在 `server/src/services/` 创建对应服务

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT

