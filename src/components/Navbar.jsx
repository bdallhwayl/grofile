import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Sun, Moon, User, LogOut, 
  Settings, ShoppingBag, MessageSquare, Briefcase, Award, Code, Home 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { currentUser, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setProfileDropdownOpen(false);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    { name: 'الرئيسية', path: '/', icon: Home },
    { name: 'نبذة عني', path: '/about', icon: User },
    { name: 'المهارات', path: '/skills', icon: Award },
    { name: 'المشاريع', path: '/projects', icon: Code },
    { name: 'المتجر', path: '/store', icon: ShoppingBag },
    { name: 'التقييمات', path: '/reviews', icon: MessageSquare },
    { name: 'تواصل معي', path: '/contact', icon: Briefcase },
  ];

  return (
    <nav className="sticky top-0 z-50 glass shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand Name */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-black text-gradient tracking-wider">
                عبد الله وائل
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `
                  relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5
                  ${isActive 
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-500/10' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-slate-500/5'
                  }
                `}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.name}</span>
              </NavLink>
            ))}
          </div>

          {/* Actions & Profile */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-500/10 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* User Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 pr-3 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-500/5 transition-colors focus:outline-none"
                >
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {currentUser.displayName}
                  </span>
                  <img
                    src={currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60'}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <>
                      {/* Overlay to close dropdown */}
                      <div className="fixed inset-0 z-10" onClick={() => setProfileDropdownOpen(false)}></div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 mt-2 w-48 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-20"
                      >
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-primary-500/10 hover:text-primary-500 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            <span>لوحة التحكم</span>
                          </Link>
                        )}
                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-primary-500/10 hover:text-primary-500 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>الملف الشخصي</span>
                        </Link>
                        <hr className="border-slate-100 dark:border-slate-800 my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors text-right"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>تسجيل الخروج</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-md transition-colors"
              >
                تسجيل الدخول
              </Link>
            )}
          </div>

          {/* Mobile Menu & Theme Controls */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-500/10 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-500/10 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-bg px-4 pt-2 pb-4 space-y-1 shadow-inner"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-colors
                  ${isActive 
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-500/10' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-slate-500/5'
                  }
                `}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.name}</span>
              </NavLink>
            ))}

            <hr className="border-slate-200 dark:border-slate-800 my-2" />

            {currentUser ? (
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-3 py-2">
                  <img
                    src={currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60'}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{currentUser.displayName}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser.email}</p>
                  </div>
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-primary-500/10 hover:text-primary-500"
                  >
                    <Settings className="w-5 h-5" />
                    <span>لوحة التحكم</span>
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-primary-500/10 hover:text-primary-500"
                >
                  <User className="w-5 h-5" />
                  <span>الملف الشخصي</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="w-5 h-5" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center w-full px-4 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow-md transition-colors"
              >
                تسجيل الدخول
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
