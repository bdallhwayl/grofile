import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Send, Code, Award, Users, ArrowUpRight } from 'lucide-react';
import { getSettings, getStats } from '../services/db';

export const Home = () => {
  const [settings, setSettings] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sData = await getSettings();
        setSettings(sData);
        
        const stData = await getStats();
        setStats(stData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="relative min-h-[calc(screen-16)] flex items-center justify-center py-20 px-4 overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none animate-float"></div>
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-secondary-500/10 dark:bg-secondary-500/5 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none animate-float" style={{ animationDelay: '2s' }}></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl w-full text-center relative z-10 space-y-8"
      >
        {/* Avatar Section */}
        <motion.div variants={itemVariants} className="relative inline-block">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-400 blur-md opacity-70 animate-pulse"></div>
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full p-1.5 bg-gradient-to-tr from-primary-500 via-purple-500 to-secondary-500 animate-glow-pulse">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
              alt="عبد الله وائل فتحي"
              className="w-full h-full rounded-full object-cover border-4 border-white dark:border-dark-bg"
            />
          </div>
        </motion.div>

        {/* Title Name */}
        <motion.div variants={itemVariants} className="space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-primary-500/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 border border-primary-500/20">
            مرحباً بك في موقعي الشخصي
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
            {settings?.aboutHeroTitle || 'عبد الله وائل فتحي'}
          </h1>
          <p className="text-lg sm:text-2xl font-medium text-slate-600 dark:text-slate-300">
            {settings?.aboutHeroDesc || 'مطور ويب ومبرمج شغوف بالتقنيات الحديثة'}
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          variants={itemVariants} 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
        >
          <Link
            to="/projects"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/35 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <Code className="w-5 h-5" />
            <span>استعرض أعمالي</span>
            <ArrowLeft className="w-4 h-4 mr-1" />
          </Link>

          <Link
            to="/store"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>المتجر الإلكتروني</span>
          </Link>

          <Link
            to="/contact"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white dark:bg-dark-card text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span>تواصل معي</span>
          </Link>
        </motion.div>

        {/* Small Statistics Summary cards */}
        {stats && (
          <motion.div 
            variants={itemVariants}
            className="pt-12 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
          >
            <div className="glass p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 text-center">
              <div className="text-2xl font-black text-primary-500 dark:text-primary-400">
                +{stats.projectsCount || 0}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">المشاريع المنجزة</div>
            </div>

            <div className="glass p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 text-center">
              <div className="text-2xl font-black text-secondary-500 dark:text-secondary-400">
                +{stats.productsCount || 0}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">المنتجات المعروضة</div>
            </div>

            <div className="glass p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 col-span-2 sm:col-span-1 text-center">
              <div className="text-2xl font-black text-purple-500 dark:text-purple-400">
                2+ سنة
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">سنوات الخبرة</div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Home;
