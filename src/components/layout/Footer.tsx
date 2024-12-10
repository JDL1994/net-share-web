export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} 群组信息分享平台. 保留所有权利.
          </div>
          <div className="text-sm text-gray-500">
            联系我们: group@example.com
          </div>
        </div>
      </div>
    </footer>
  );
} 