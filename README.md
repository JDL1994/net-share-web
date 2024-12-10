# 内部培训管理系统

这是一个基于Next.js 14开发的内部培训管理系统，用于管理和组织内部培训活动。

## 功能特点

- 培训日历展示
- 培训信息管理（添加、编辑、删除）
- 参与人员管理
- 培训材料管理
- 响应式设计，支持多设备访问

## 技术栈

- Next.js 14
- TypeScript
- Tailwind CSS
- Server Actions
- Server Components

## 开始使用

1. 克隆项目
```bash
git clone [你的仓库地址]
```

2. 安装依赖
```bash
npm install
```

3. 运行开发服务器
```bash
npm run dev
```

4. 在浏览器中访问 `http://localhost:3000` 或 `http://[本地IP]:3000`

## 项目结构

```
src/
  ├── app/
  │   ├── (pages)/
  │   │   ├── calendar/     # 培训日历页面
  │   │   └── training/     # 培训列表页面
  │   ├── api/             # API路由和数据存储
  │   ├── components/      # 共享组件
  │   └── layout.tsx       # 全局布局
  ├── types/              # TypeScript类型定义
  └── utils/              # 工具函数
```

## 开发指南

- 所有培训数据存储在 `src/app/api/db/trainings.json` 文件中
- 使用Server Actions进行数据操作
- 页面采用服务器端组件优先的策略
- 使用TypeScript确保类型安全

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request
