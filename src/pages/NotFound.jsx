import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowRight } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-center bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
      <div className="space-y-6 max-w-md">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary-500/10 rounded-full blur-2xl animate-pulse"></div>
          <h1 className="text-9xl font-black text-gradient select-none">404</h1>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">الصفحة غير موجودة</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            عذراً، الصفحة التي تبحث عنها قد تم نقلها، حذفها، أو أنها غير موجودة في هذا العنوان مؤقتاً.
          </p>
        </div>

        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-md shadow-primary-500/20 transition-all hover:-translate-y-0.5"
          >
            <span>العودة للصفحة الرئيسية</span>
            <ArrowRight className="w-4 h-4 mr-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
