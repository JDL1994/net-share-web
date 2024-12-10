import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center">
        <Image
          src="/images/hero.jpg"
          alt="Hero background"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            内部知识分享平台
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            连接团队智慧，分享成长价值
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Training Feature */}
            <div className="relative group">
              <div className="relative h-[300px] rounded-lg overflow-hidden">
                <Image
                  src="/images/training.jpg"
                  alt="Training sessions"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">培训日历</h3>
                    <p className="max-w-sm">
                      规划和参与团队培训，提升专业技能
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Knowledge Sharing Feature */}
            <div className="relative group">
              <div className="relative h-[300px] rounded-lg overflow-hidden">
                <Image
                  src="/images/knowledge.jpg"
                  alt="Knowledge sharing"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">知识分享</h3>
                    <p className="max-w-sm">
                      分享团队经验，传递实践智慧
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            开始您的学习之旅
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            探索丰富的培训资源，参与知识分享，与团队一起成长
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/training"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              浏览培训
            </a>
            <a
              href="/knowledge"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
            >
              查看分享
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
