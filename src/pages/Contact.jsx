import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { addMessage, getSettings } from '../services/db';

export const Contact = () => {
  const location = useLocation();
  const [settings, setSettings] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  // Math Captcha
  const [captchaNum1, setCaptchaNum1] = useState(0);
  const [captchaNum2, setCaptchaNum2] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  
  // Honeypot Spam Protection
  const [honeypot, setHoneypot] = useState('');

  // Status
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Generate random math captcha
  const generateCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 10) + 1);
    setCaptchaNum2(Math.floor(Math.random() * 10) + 1);
    setCaptchaAnswer('');
  };

  useEffect(() => {
    generateCaptcha();
    const fetchSettings = async () => {
      const data = await getSettings();
      setSettings(data);
    };
    fetchSettings();
  }, []);

  // Pre-fill fields from store redirect if exists
  useEffect(() => {
    if (location.state) {
      if (location.state.prefilledSubject) {
        setSubject(location.state.prefilledSubject);
      }
      if (location.state.prefilledMessage) {
        setMessage(location.state.prefilledMessage);
      }
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // 1. Honeypot check
    if (honeypot) {
      console.warn("Spam detected via honeypot.");
      setSuccess(true); // Pretend success to fool bot
      return;
    }

    // 2. Captcha verification
    if (parseInt(captchaAnswer, 10) !== captchaNum1 + captchaNum2) {
      setError('إجابة التحقق البشري غير صحيحة، يرجى المحاولة مرة أخرى.');
      generateCaptcha();
      return;
    }

    setLoading(true);

    const messageData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject: subject.trim() || 'رسالة جديدة من الموقع الشخصي',
      message: message.trim(),
    };

    try {
      // Save to Firestore
      await addMessage(messageData);

      // EmailJS integration
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        // Build email variables matching template format
        const templateParams = {
          from_name: messageData.name,
          from_email: messageData.email,
          from_phone: messageData.phone || 'غير محدد',
          subject: messageData.subject,
          message: messageData.message,
          to_email: 'bdallhwaylg@gmail.com'
        };

        await emailjs.send(serviceId, templateId, templateParams, publicKey);
        console.log("Email sent successfully via EmailJS.");
      } else {
        console.warn("EmailJS credentials not set. Simulated email transfer to bdallhwaylg@gmail.com:", messageData);
      }

      setSuccess(true);
      // Clear Form
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
      generateCaptcha();
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء إرسال الرسالة، يرجى إعادة المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-colors duration-300">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
          تواصل معي
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          هل لديك فكرة مشروع ترغب بتطويرها؟ أو تريد طلب أحد المنتجات؟ تواصل معي فوراً وسأقوم بالرد عليك في غضون ساعات.
        </p>
        <div className="w-20 h-1 bg-primary-500 mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Contact info cards */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            معلومات الاتصال المباشر
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            يمكنك مراسلتي عبر النموذج البريدي أو الوصول إلي مباشرة من خلال البيانات المدرجة أدناه:
          </p>

          <div className="space-y-4 pt-4">
            {settings?.phone && (
              <div className="flex gap-4 p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 shadow-sm items-center">
                <div className="p-3 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-xl">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400">رقم الهاتف / واتساب</h4>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5" style={{ direction: 'ltr' }}>
                    {settings.phone}
                  </p>
                </div>
              </div>
            )}

            {settings?.email && (
              <div className="flex gap-4 p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 shadow-sm items-center">
                <div className="p-3 bg-secondary-500/10 text-secondary-600 dark:text-secondary-400 rounded-xl">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400">البريد الإلكتروني</h4>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {settings.email}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-4 p-5 rounded-2xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 shadow-sm items-center">
              <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400">الموقع الجغرافي</h4>
                <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  جمهورية مصر العربية
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact form Form */}
        <div className="lg:col-span-7 bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            أرسل رسالة مباشرة
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot hidden input for bots */}
            <input
              type="text"
              name="website_hidden_honeypot"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              autoComplete="off"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                  الاسم الكامل (مطلوب)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="محمد أحمد"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-dark-bg text-sm focus:border-primary-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                  البريد الإلكتروني (مطلوب)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-dark-bg text-sm focus:border-primary-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                  رقم الهاتف (اختياري)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+20100000000"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-dark-bg text-sm focus:border-primary-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Subject */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                  عنوان الرسالة (اختياري)
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="طلب تصميم موقع / استفسار"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-dark-bg text-sm focus:border-primary-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                نص الرسالة (مطلوب)
              </label>
              <textarea
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اكتب تفاصيل استفسارك أو طلبك هنا..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-dark-bg text-sm focus:border-primary-500 focus:outline-none transition-colors resize-none"
                required
              ></textarea>
            </div>

            {/* Spam Protection Math Captcha */}
            <div className="space-y-2 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                التحقق البشري: ما ناتج <span className="font-bold text-primary-500">{captchaNum1} + {captchaNum2}</span> ؟
              </span>
              <input
                type="number"
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                placeholder="الإجابة"
                className="w-28 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-dark-bg text-center text-sm focus:border-primary-500 focus:outline-none"
                required
              />
            </div>

            {/* Error/Success alerts */}
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>تم إرسال رسالتك بنجاح! تم إرسال نسخة إلى البريد الإلكتروني وسنقوم بالرد قريباً.</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:bg-slate-350 text-white font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span>{loading ? 'جاري إرسال الرسالة...' : 'إرسال الرسالة الآن'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
