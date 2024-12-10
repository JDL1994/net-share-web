'use client';

import { useState } from 'react';

const tools = [
  {
    category: '开发工具',
    items: [
      {
        id: 1,
        name: '代码仓库',
        description: '团队代码版本控制系统，基于GitLab搭建',
        url: '#',
        icon: '🗄️',
      },
      {
        id: 2,
        name: 'CI/CD平台',
        description: '自动化构建和部署平台，支持多环境发布',
        url: '#',
        icon: '🔄',
      },
      {
        id: 3,
        name: '接口文档',
        description: 'API文档管理平台，支持在线调试',
        url: '#',
        icon: '📚',
      },
    ],
  },
  {
    category: '协作平台',
    items: [
      {
        id: 4,
        name: '项目管理',
        description: '任务跟踪和项目进度管理工具',
        url: '#',
        icon: '📊',
      },
      {
        id: 5,
        name: '知识库',
        description: '团队文档和知识管理平台',
        url: '#',
        icon: '📝',
      },
      {
        id: 6,
        name: '即时通讯',
        description: '团队实时沟通工具',
        url: '#',
        icon: '💬',
      },
    ],
  },
  {
    category: '监控运维',
    items: [
      {
        id: 7,
        name: '监控平台',
        description: '系统和应用监控dashboard',
        url: '#',
        icon: '📈',
      },
      {
        id: 8,
        name: '日志中心',
        description: '集中式日志查询和分析平台',
        url: '#',
        icon: '📋',
      },
      {
        id: 9,
        name: '告警系统',
        description: '异常监控和告警通知系统',
        url: '#',
        icon: '🔔',
      },
    ],
  },
];

export default function ToolsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTools = tools.map(category => ({
    ...category,
    items: category.items.filter(tool =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">内部工具</h1>
          <p className="mt-4 text-lg text-gray-600">
            快速访问团队常用的开���工具和协作平台
          </p>
        </div>

        {/* 搜索框 */}
        <div className="mt-8 max-w-xl mx-auto">
          <div className="flex rounded-md shadow-sm">
            <input
              type="text"
              placeholder="搜索工具..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 工具列表 */}
        <div className="mt-12 space-y-12">
          {filteredTools.map((category) => (
            <div key={category.category}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {category.category}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {category.items.map((tool) => (
                  <a
                    key={tool.id}
                    href={tool.url}
                    className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{tool.icon}</span>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {tool.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-600">没有找到匹配的工具</p>
          </div>
        )}

        {/* 快速访问提示 */}
        <div className="mt-16 bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">💡 小贴士</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• 所有工具都已经过SSO配置，可以直接使用公司账号登录</li>
            <li>• 如需申请新工具访问权限，请联系IT支持团队</li>
            <li>• 定期查看工具更新公告，了解新功能和改进</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 