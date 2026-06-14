import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, AlertCircle, LogIn, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('يرجى تعبئة جميع الحقول المطلوبة.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await login(email.trim(), password.trim());
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || 'فشل تسجيل الدخول. يرجى التحقق من بياناتك.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('يرجى كتابة البريد الإلكتروني أولاً لإرسال رابط الاستعادة.');
      return;
    }

    setLoading(true);
    setError('');
    setResetSent(false);

    try {
      await resetPassword(email.trim());
      setResetSent(true);
    } catch (err) {
      console.error(err);
      setError(err.message || 'تعذر إرسال بريد استعادة كلمة المرور.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-dark-bg transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm">
        {/* Title Info */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {showForgot ? 'استعادة كلمة المرور' : 'تسجيل الدخول'}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {showForgot 
              ? 'أدخل بريدك الإلكتروني لإرسال رابط استعادة الحساب' 
              : 'قم بتسجيل الدخول للوصول إلى لوحة التحكم والطلبات'
            }
          </p>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resetSent && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني.</span>
          </div>
        )}

        {/* Login/Forgot Password Forms */}
        {!showForgot ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
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
                  كلمة المرور
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
            </div>

            {/* Actions panel */}
            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  setShowForgot(true);
                  setError('');
                }}
                className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 disabled:dark:bg-slate-850 text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                البريد الإلكتروني المسجل
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

            {/* Send Link Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{loading ? 'جاري إرسال الرابط...' : 'إرسال رابط استعادة الحساب'}</span>
            </button>

            {/* Back to sign in */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setShowForgot(false);
                  setError('');
                  setResetSent(false);
                }}
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:underline"
              >
                العودة لتسجيل الدخول
              </button>
            </div>
          </form>
        )}

        {/* Footer sign up link */}
        {!showForgot && (
          <div className="text-center text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>ليس لديك حساب؟ </span>
            <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:underline font-bold">
              إنشاء حساب جديد
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
