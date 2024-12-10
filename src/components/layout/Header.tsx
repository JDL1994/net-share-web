'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const menuItems = [
  { href: '/', label: '首页' },
  { href: '/training', label: '培训日历' },
  { href: '/knowledge', label: '知识分享' },
  { href: '/projects', label: '项目进度' },
  { href: '/tools', label: '内部工具' },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              href="/"
              className="group flex items-center space-x-2 text-blue-600 font-bold text-xl"
            >
              <svg 
                className="w-8 h-8 transform transition-transform group-hover:scale-110 group-hover:rotate-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span className="hidden sm:inline transform transition-all group-hover:text-blue-700 group-hover:scale-105">
                知识分享平台
              </span>
            </Link>
          </div>

          <div className="hidden sm:flex sm:items-center sm:space-x-1">
            {menuItems.map((item) => {
              const isActive = 
                item.href === '/' 
                  ? pathname === '/' 
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative px-3 py-2 rounded-md text-sm font-medium
                    transition-all duration-300 ease-in-out
                    group overflow-hidden
                    ${isActive 
                      ? 'text-blue-600 bg-blue-50/50' 
                      : 'text-gray-700 hover:text-blue-600'
                    }
                  `}
                >
                  <span className="relative z-10">{item.label}</span>
                  <span 
                    className={`
                      absolute inset-0 bg-blue-50 transform origin-left
                      transition-transform duration-300 ease-out
                      ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                    `}
                  />
                  <span 
                    className={`
                      absolute bottom-0 left-0 w-full h-0.5 bg-blue-600
                      transform origin-left transition-transform duration-300
                      ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                    `}
                  />
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 
                hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 
                focus:ring-inset focus:ring-blue-500 transition-all duration-200"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">打开主菜单</span>
              <svg
                className={`h-6 w-6 transition-transform duration-200 ${
                  isMobileMenuOpen ? 'transform rotate-90' : ''
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div 
        className={`
          sm:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'max-h-64' : 'max-h-0'}
        `}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = 
              item.href === '/' 
                ? pathname === '/' 
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  block px-3 py-2 rounded-md text-base font-medium
                  transition-all duration-200
                  ${isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
} 