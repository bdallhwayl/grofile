import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Plus, Check, Send, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { getReviews, addReview } from '../services/db';
import { useAuth } from '../context/AuthContext';
import Skeleton from '../components/Skeleton';

export const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Review Form States
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getReviews();
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Pre-fill user details if logged in
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.displayName || '');
      setPhoto(currentUser.photoURL || '');
    } else {
      setName('');
      setPhoto('');
    }
  }, [currentUser]);

  const approvedReviews = reviews.filter(r => r.approved);
  const averageRating = approvedReviews.length > 0 
    ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
    : 0;

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      setFormError('يرجى كتابة الاسم والتعليق كاملاً.');
      return;
    }
    
    setFormLoading(true);
    setFormError('');
    setFormSuccess(false);

    try {
      const payload = {
        name: name.trim(),
        rating,
        comment: comment.trim(),
        photo: photo.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
        userId: currentUser?.uid || 'guest'
      };
      
      await addReview(payload);
      setFormSuccess(true);
      setComment('');
      if (!currentUser) setName('');
    } catch (err) {
      console.error(err);
      setFormError('حدث خطأ أثناء إرسال التقييم، يرجى المحاولة لاحقاً.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-colors duration-300">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
          تقييمات وآراء العملاء
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          ماذا يقول العملاء والمستخدمون عن جودة الكود، الخدمات، والمنتجات الرقمية التي أقدمها.
        </p>
        <div className="w-20 h-1 bg-primary-500 mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left column: Feedbacks list */}
        <div className="lg:col-span-7 space-y-8">
          {/* Average metrics panel */}
          <div className="glass p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-right space-y-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">التقييم العام للموقع</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                بناءً على {approvedReviews.length} تقييم معتمد من العملاء.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-5xl font-black text-primary-600 dark:text-primary-400">
                {averageRating}
              </div>
              <div className="space-y-1">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-700'}`} 
                    />
                  ))}
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-semibold">ممتاز وجدير بالثقة</div>
              </div>
            </div>
          </div>

          {/* Testimonials List */}
          <div className="space-y-6">
            {loading ? (
              <Skeleton variant="list" count={3} />
            ) : approvedReviews.length > 0 ? (
              approvedReviews.map((rev) => (
                <div 
                  key={rev.id} 
                  className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex gap-4 items-start"
                >
                  <img
                    src={rev.photo}
                    alt={rev.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    loading="lazy"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{rev.name}</h4>
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-200 dark:text-slate-800'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <MessageSquare className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                <p className="font-semibold">لا توجد تقييمات منشورة حالياً، كن أول من يضيف تقييماً!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Review Form Submission Form */}
        <div className="lg:col-span-5 bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            أضف تقييمك الخاص
          </h3>
          
          <form onSubmit={handleSubmitReview} className="space-y-5">
            {/* Star Rating select */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                التقييم بالنجوم
              </label>
              <div className="flex gap-2 text-slate-300">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const starVal = idx + 1;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRating(starVal)}
                      className="focus:outline-none hover:scale-110 transition-transform"
                    >
                      <Star 
                        className={`w-8 h-8 ${starVal <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-800'}`} 
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                الاسم بالكامل
              </label>
              <input
                type="text"
                disabled={!!currentUser}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أحمد محمد"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-dark-bg text-sm focus:border-primary-500 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Profile Pic Link (Optional) */}
            {!currentUser && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>رابط الصورة الشخصية (اختياري)</span>
                </label>
                <input
                  type="url"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-dark-bg text-xs focus:border-primary-500 focus:outline-none transition-colors"
                />
              </div>
            )}

            {/* Comment Input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                التعليق / المراجعة
              </label>
              <textarea
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="اكتب مراجعتك هنا بالتفصيل..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-dark-bg text-sm focus:border-primary-500 focus:outline-none transition-colors resize-none"
                required
              ></textarea>
            </div>

            {/* Status updates notifications */}
            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2 animate-pulse">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>تم إرسال التقييم للمراجعة. شكراً لك!</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formLoading}
              className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 disabled:dark:bg-slate-850 text-white text-sm font-bold shadow-md shadow-primary-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{formLoading ? 'جاري الإرسال...' : 'إرسال التقييم للمراجعة'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
