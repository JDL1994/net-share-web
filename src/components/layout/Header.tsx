'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: '首页', href: '/' },
  { name: '前沿知识分享', href: '/knowledge' },
  { name: '项目进度', href: '/projects' },
  { name: '群组培训', href: '/training' },
  { name: '内部工具', href: '/tools' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <span className="text-xl font-bold text-gray-900">群组信息分享平台</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      isActive
                        ? 'border-b-2 border-indigo-500 text-gray-900'
                        : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
} 