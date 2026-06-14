import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, ShieldAlert, KeyRound, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Profile = () => {
  const { currentUser, isAdmin, updateUserProfile, updateUserPassword } = useAuth();
  
  // Profile Update Form States
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  
  // Password Change States
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status indicators
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);
  const [passError, setPassError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      setPhotoURL(currentUser.photoURL || '');
    }
  }, [currentUser]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess(false);
    
    if (!displayName.trim()) {
      setProfileError('الاسم بالكامل لا يمكن أن يكون فارغاً.');
      return;
    }

    setProfileLoading(true);
    try {
      await updateUserProfile(displayName.trim(), photoURL.trim());
      setProfileSuccess(true);
    } catch (err) {
      console.error(err);
      setProfileError('فشل تحديث بيانات الملف الشخصي.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess(false);

    if (!newPassword) {
      setPassError('الرجاء إدخال كلمة المرور الجديدة.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('كلمتا المرور غير متطابقتين.');
      return;
    }

    if (newPassword.length < 6) {
      setPassError('يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.');
      return;
    }

    setPassLoading(true);
    try {
      await updateUserPassword(newPassword);
      setPassSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setPassError('تعذر تغيير كلمة المرور. يرجى تسجيل الخروج والولوج مجدداً.');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-200 dark:border-slate-800 mb-12">
        <img
          src={currentUser?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60'}
          alt="avatar"
          className="w-24 h-24 rounded-full object-cover border-4 border-primary-500 shadow-md"
        />
        <div className="text-center sm:text-right space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
            <span>{currentUser?.displayName}</span>
            {isAdmin && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold">
                أدمن / مسؤول
              </span>
            )}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
            <Mail className="w-4 h-4 text-primary-500" />
            <span>{currentUser?.email}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Side: Modify Profile Metadata */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-primary-500" />
            <span>تعديل البيانات الشخصية</span>
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            {/* Display Name */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                الاسم بالكامل
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="الاسم كامل"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-dark-bg text-sm focus:border-primary-500 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Photo URL */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                رابط الصورة الشخصية
              </label>
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-dark-bg text-xs focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>

            {profileError && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            {profileSuccess && (
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2 animate-pulse">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>تم حفظ التغييرات بنجاح.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{profileLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
            </button>
          </form>
        </div>

        {/* Right Side: Change Password Form */}
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-secondary-500" />
            <span>تغيير كلمة المرور</span>
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* New Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                كلمة المرور الجديدة
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-dark-bg text-sm focus:border-primary-500 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                تأكيد كلمة المرور الجديدة
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-dark-bg text-sm focus:border-primary-500 focus:outline-none transition-colors"
                required
              />
            </div>

            {passError && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{passError}</span>
              </div>
            )}

            {passSuccess && (
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2 animate-pulse">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>تم تحديث كلمة المرور بنجاح.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={passLoading}
              className="w-full py-3 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 disabled:bg-slate-300 text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>{passLoading ? 'جاري التغيير...' : 'تحديث كلمة المرور'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
