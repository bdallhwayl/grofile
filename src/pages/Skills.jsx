import React from 'react';
import { motion } from 'framer-motion';
import { Award, Code, Layout, Database, BookOpen, Layers } from 'lucide-react';

export const Skills = () => {
  const coreSkills = [
    { name: 'HTML5 / SEMANTIC WEB', percentage: 99, color: 'from-orange-500 to-red-500', icon: Layout },
    { name: 'CSS3 / TAILWIND CSS / SAAS', percentage: 98, color: 'from-blue-500 to-cyan-500', icon: Layers },
    { name: 'JAVASCRIPT (ES6+) / CORE JS', percentage: 98, color: 'from-yellow-400 to-amber-500', icon: Code },
    { name: 'REACT.JS / VITE / REDUX', percentage: 96, color: 'from-primary-500 to-indigo-500', icon: Award },
    { name: 'PYTHON / ALGORITHMS', percentage: 93, color: 'from-green-500 to-emerald-600', icon: Database },
  ];

  const categories = [
    {
      title: 'واجهات أمامية (Frontend)',
      items: ['React.js', 'Tailwind CSS', 'Framer Motion', 'HTML5 & CSS3', 'DOM Manipulation', 'Redux Toolkit']
    },
    {
      title: 'لغات برمجة وقواعد بيانات',
      items: ['JavaScript (ES6)', 'Python', 'Firebase Firestore', 'Firebase Auth', 'Local Storage Web API', 'SQL (أساسيات)']
    },
    {
      title: 'أدوات ومنهجيات التطوير',
      items: ['Git & GitHub', 'Vite Bundler', 'NPM Package Manager', 'Chrome DevTools', 'Responsive Web Design', 'SEO Best Practices']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-colors duration-300">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
          المهارات والخبرات التقنية
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          عرض لمستويات خبرتي في لغات البرمجة وأطر العمل والتقنيات التي أستخدمها لبناء المشاريع.
        </p>
        <div className="w-20 h-1 bg-primary-500 mx-auto rounded-full"></div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: Animated Progress Bars */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            مستويات الاحتراف الأساسية
          </h3>
          <div className="space-y-6">
            {coreSkills.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <span className="flex items-center gap-2">
                    <skill.icon className="w-5 h-5 text-primary-500" />
                    <span>{skill.name}</span>
                  </span>
                  <span>{skill.percentage}%</span>
                </div>
                {/* Progress bar outer container */}
                <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Skill Categorizations (Tech Stack Overview) */}
        <div className="lg:col-span-5 space-y-8">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            مجموعات المهارات التفصيلية
          </h3>
          <div className="grid grid-cols-1 gap-6">
            {categories.map((cat, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-secondary-500" />
                  <span>{cat.title}</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item, itemIdx) => (
                    <span 
                      key={itemIdx}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50 hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-colors cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
