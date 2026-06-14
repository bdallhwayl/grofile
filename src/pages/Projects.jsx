import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, FolderOpen, Code } from 'lucide-react';
import { getProjects } from '../services/db';
import Skeleton from '../components/Skeleton';

export const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [categories, setCategories] = useState(['الكل']);
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getProjects();
        setProjects(data);
        setFilteredProjects(data);

        // Extract unique categories
        const uniqCats = ['الكل', ...new Set(data.map(p => p.category).filter(Boolean))];
        setCategories(uniqCats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleFilter = (category) => {
    setActiveCategory(category);
    if (category === 'الكل') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.category === category));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-colors duration-300">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
          أعمالي ومشاريعي
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          معرض لبعض من أفضل المشاريع التي قمت بتطويرها مؤخراً باستخدام مختلف اللغات والتقنيات.
        </p>
        <div className="w-20 h-1 bg-primary-500 mx-auto rounded-full"></div>
      </div>

      {/* Category Filter Tabs */}
      {!loading && categories.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => handleFilter(cat)}
              className={`
                px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300
                ${activeCategory === cat
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                  : 'bg-white dark:bg-dark-card text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Projects Grid Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <Skeleton variant="card" count={3} />
        ) : filteredProjects.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={project.id}
                className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-950">
                  <img
                    src={project.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-full bg-white text-slate-950 font-bold hover:bg-primary-500 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-secondary-500/10 text-secondary-600 dark:text-secondary-400">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary-500 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech stack tags */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
                      {project.technologies.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="col-span-full py-16 text-center text-slate-500 dark:text-slate-400">
            <FolderOpen className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-lg font-bold">لا يوجد مشاريع معروضة في هذا القسم حالياً.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
