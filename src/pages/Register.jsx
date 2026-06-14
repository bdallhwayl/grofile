import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('يرجى ملء جميع الحقول الإلزامية.');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }

    if (password.length < 6) {
      setError('يجب ألا تقل كلمة المرور عن 6 أحرف.');
      return;
    }

    setLoading(true);
    try {
      await register(email.trim(), password.trim(), name.trim());
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message || 'حدث خطأ أثناء إنشاء الحساب.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            إنشاء حساب جديد
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            سجل حسابك لتتمكن من الشراء والتقييم والتواصل السريع
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Register Form Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                الاسم بالكامل
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="محمد أحمد"
                  className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-dark-bg text-sm focus:border-primary-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-dark-bg text-sm focus:border-primary-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                كلمة المرور (6 أحرف كحد أدنى)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-dark-bg text-sm focus:border-primary-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pr-10 pl-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-dark-bg text-sm focus:border-primary-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:bg-slate-350 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب جديد'}</span>
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>لديك حساب بالفعل؟ </span>
          <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-bold">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
