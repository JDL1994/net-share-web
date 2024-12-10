'use client';

import { useState } from 'react';

const projects = [
  {
    id: 1,
    name: '智能客服系统',
    status: '进行中',
    progress: 75,
    startDate: '2024-01-15',
    endDate: '2024-04-30',
    description: '基于AI技术的新一代智能客服系统，提供自动问答和情感分析功能。',
    milestones: [
      {
        id: 1,
        title: '需求分析完成',
        date: '2024-01-30',
        status: 'completed',
      },
      {
        id: 2,
        title: '系统架构设计',
        date: '2024-02-15',
        status: 'completed',
      },
      {
        id: 3,
        title: '核心功能开发',
        date: '2024-03-30',
        status: 'in-progress',
      },
      {
        id: 4,
        title: '系统测试与部署',
        date: '2024-04-30',
        status: 'pending',
      },
    ],
    team: [
      { name: '张三', role: '项目负责人' },
      { name: '李四', role: '技术架构师' },
      { name: '王五', role: '前端开发' },
    ],
  },
  {
    id: 2,
    name: '数据分析平台',
    status: '规划中',
    progress: 20,
    startDate: '2024-03-01',
    endDate: '2024-06-30',
    description: '企业级数据分析平台，支持多维度数据可视化和实时分析。',
    milestones: [
      {
        id: 1,
        title: '市场调研',
        date: '2024-03-15',
        status: 'completed',
      },
      {
        id: 2,
        title: '需求规划',
        date: '2024-03-30',
        status: 'in-progress',
      },
      {
        id: 3,
        title: '技术选型',
        date: '2024-04-15',
        status: 'pending',
      },
      {
        id: 4,
        title: '开发实施',
        date: '2024-06-15',
        status: 'pending',
      },
    ],
    team: [
      { name: '赵六', role: '项目经理' },
      { name: '钱七', role: '数据架构师' },
      { name: '孙八', role: '后端开发' },
    ],
  },
];

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState(projects[0]);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">项目进度</h1>
          <p className="mt-4 text-lg text-gray-600">
            跟踪项目进展，了解最新动态
          </p>
        </div>

        {/* 项目选择器 */}
        <div className="mt-8">
          <div className="sm:hidden">
            <select
              className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              value={selectedProject.id}
              onChange={(e) => {
                const project = projects.find(p => p.id === Number(e.target.value));
                if (project) setSelectedProject(project);
              }}
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="flex space-x-4" aria-label="Tabs">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`${
                    project.id === selectedProject.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  } px-3 py-2 font-medium text-sm rounded-md`}
                >
                  {project.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 项目详情 */}
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {selectedProject.name}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {selectedProject.description}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedProject.status === '进行中'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {selectedProject.status}
              </span>
            </div>
          </div>

          {/* 项目信息 */}
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">开始日期</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {selectedProject.startDate}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">预计完成</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {selectedProject.endDate}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">项目进度</dt>
                <dd className="mt-1">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-indigo-600">
                          {selectedProject.progress}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                      <div
                        style={{ width: `${selectedProject.progress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                      ></div>
                    </div>
                  </div>
                </dd>
              </div>
            </dl>
          </div>

          {/* 项目里程碑 */}
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                项目里程碑
              </h3>
              <div className="mt-4 space-y-6">
                {selectedProject.milestones.map((milestone, index) => (
                  <div
                    key={milestone.id}
                    className="relative flex items-center space-x-4"
                  >
                    <div
                      className={`h-4 w-4 rounded-full ${
                        milestone.status === 'completed'
                          ? 'bg-green-500'
                          : milestone.status === 'in-progress'
                          ? 'bg-yellow-500'
                          : 'bg-gray-300'
                      }`}
                    ></div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          {milestone.title}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {milestone.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 项目团队 */}
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                项目团队
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {selectedProject.team.map((member, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {member.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 