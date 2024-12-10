'use client';

import { useState } from 'react';

const articles = [
  {
    id: 1,
    title: '人工智能在软件开发中的应用',
    category: '技术趋势',
    date: '2024-03-10',
    summary: '探讨AI如何改变软件开发流程，提高开发效率和代码质量。',
    author: '张三',
  },
  {
    id: 2,
    title: '微服务架构最佳实践',
    category: '架构设计',
    date: '2024-03-08',
    summary: '分享微服务架构的设计原则、实施策略和常见陷阱。',
    author: '李四',
  },
  {
    id: 3,
    title: '云原生应用开发指南',
    category: '云计算',
    date: '2024-03-05',
    summary: '详解云原生应用的特点、开发方法和部署策略。',
    author: '王五',
  },
];

const categories = ['全部', '技术趋势', '架构设计', '云计算', '开发工具', '最佳实践'];

export default function KnowledgePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">前沿知识分享</h1>
          <p className="mt-4 text-lg text-gray-600">
            发现和分享最新的技术趋势、最佳实践和行业洞察
          </p>
        </div>

        {/* 搜索和筛选 */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="搜索文章..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="sm:w-48">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 文章列表 */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-indigo-600">
                    {article.category}
                  </span>
                  <span className="text-sm text-gray-500">{article.date}</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {article.title}
                </h2>
                <p className="text-gray-600 mb-4">{article.summary}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">作者: {article.author}</span>
                  <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                    阅读更多
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center mt-8 p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-600">没有找到匹配的文章</p>
          </div>
        )}
      </div>
    </div>
  );
} 