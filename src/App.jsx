import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { useTheme } from './context/ThemeContext';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Skills = lazy(() => import('./pages/Skills'));
const Projects = lazy(() => import('./pages/Projects'));
const Store = lazy(() => import('./pages/Store'));
const Reviews = lazy(() => import('./pages/Reviews'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Premium loading fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-slate-50/50 dark:bg-dark-bg/50">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin"></div>
    </div>
  </div>
);

export const App = () => {
  const { theme } = useTheme();

  return (
    <BrowserRouter>
      <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${theme === 'dark' ? 'bg-dark-bg text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
        
        {/* Main Navbar */}
        <Navbar />

        {/* Dynamic Suspense Routes Container */}
        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/store" element={<Store />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Regular User Routes */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />

              {/* Protected Admin Only Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        {/* Main Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
