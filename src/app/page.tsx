import Image from "next/image";

export default function Home() {
  const latestUpdates = [
    {
      id: 1,
      title: '新增前沿技术分享',
      date: '2024-03-10',
      description: '关于人工智能在软件开发中的应用研究',
    },
    {
      id: 2,
      title: '项目里程碑达成',
      date: '2024-03-08',
      description: '智能客服系统成功上线',
    },
    {
      id: 3,
      title: '即将举行的培训',
      date: '2024-03-15',
      description: '微服务架构实践工作坊',
    },
  ];

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 网站简介 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            欢迎来到群组信息分享平台
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            这是一个专门用于群组内部信息分享和知识管理的平台。在这里，你可以了解最新的技术动态、
            项目进展，参与培训活动，以及使用各种内部工具。
          </p>
        </div>

        {/* 最新动态 */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">最新动态</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestUpdates.map((update) => (
              <div
                key={update.id}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {update.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{update.date}</p>
                  <p className="mt-3 text-base text-gray-600">
                    {update.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 快速链接 */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">快速访问</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href="/knowledge"
              className="block p-6 bg-white shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-medium text-gray-900">前沿知识</h3>
              <p className="mt-2 text-sm text-gray-600">
                浏览和分享最新的技术趋势和行业动态
              </p>
            </a>
            <a
              href="/projects"
              className="block p-6 bg-white shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-medium text-gray-900">项目进度</h3>
              <p className="mt-2 text-sm text-gray-600">
                查看各个项目的最新进展和里程碑
              </p>
            </a>
            <a
              href="/training"
              className="block p-6 bg-white shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-medium text-gray-900">培训资源</h3>
              <p className="mt-2 text-sm text-gray-600">
                参与培训活动，提升专业技能
              </p>
            </a>
            <a
              href="/tools"
              className="block p-6 bg-white shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-medium text-gray-900">内部工具</h3>
              <p className="mt-2 text-sm text-gray-600">
                访问常用的开发和协作工具
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
