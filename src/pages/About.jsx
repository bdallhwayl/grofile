import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Award, Clock, Code, Heart, CheckCircle2 } from 'lucide-react';
import { getSettings } from '../services/db';
import AnimatedCounter from '../components/AnimatedCounter';

export const About = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, []);

  const stats = [
    { label: 'العمر', value: settings?.aboutAge || 14, suffix: ' سنة' },
    { label: 'الخبرة', value: settings?.aboutExperience || 2, suffix: ' سنة' },
    { label: 'المشاريع المنتهية', value: 12, suffix: '+' },
    { label: 'العملاء السعداء', value: 8, suffix: '+' },
  ];

  const accomplishments = [
    'تطوير 10+ تطبيقات ومواقع ويب احترافية باستخدام React.',
    'بناء وتصميم متاجر إلكترونية متكاملة مع لوحات تحكم متقدمة.',
    'خبرة جيدة في تكامل الخدمات البرمجية السحابية مثل Firebase وRESTful APIs.',
    'مهارات عالية في تصميم واجهات مستخدم مخصصة وسريعة باستخدام Tailwind CSS.',
    'دراسة هندسة البرمجيات وتعلم لغات JavaScript وPython وتطبيقاتهما بشكل مكثف.'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-colors duration-300">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
          نبذة عني
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          تعرف على مسيرتي البرمجية، وخبراتي، وأهم الإنجازات التي حققتها.
        </p>
        <div className="w-20 h-1 bg-primary-500 mx-auto rounded-full"></div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Additional Personal Photo & Design elements */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 relative"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary-500/20 to-secondary-500/20 blur-2xl transform -rotate-6 scale-105"></div>
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-dark-card p-3">
            <img
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=80"
              alt="مساحة العمل البرمجية"
              className="rounded-2xl w-full h-[400px] object-cover"
            />
            <div className="absolute bottom-6 right-6 left-6 glass p-4 rounded-xl border border-white/20 shadow-md">
              <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                شعار المسيرة
              </span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-1">
                "العمر هو مجرد رقم، والشغف بالبرمجة هو ما يصنع الفارق الحقيقي."
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Description Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 space-y-6"
        >
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            مبرمج واجهات أمامية طموح ومطور ويب متكامل
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {settings?.aboutBio || 'أنا عبد الله وائل فتحي، عمراني 14 عاماً وأمتلك خبرة برمجية تصل إلى سنتين. بدأت شغفي في عالم الحاسوب والبرمجة منذ الصغر، مما دفعني لتعلم أحدث التقنيات وأفضل الممارسات البرمجية المستعملة في كبرى شركات التقنية العالمية. أركز بشكل أساسي على بناء واجهات ويب وتطبيقات تفاعلية متكاملة تتميز بالسلاسة والسرعة العالية.'}
          </p>

          {/* Stats count indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm text-center"
              >
                <div className="text-3xl font-black text-primary-600 dark:text-primary-400">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Achievements list */}
          <div className="space-y-3 pt-2">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-secondary-500" />
              <span>أهم الإنجازات والمهارات الحالية:</span>
            </h4>
            <ul className="space-y-2">
              {accomplishments.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
