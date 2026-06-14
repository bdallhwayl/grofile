import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, FolderGit2, ShoppingCart, 
  MessageSquare, Star, Settings, FileSpreadsheet, Plus, 
  Trash2, Edit3, Check, X, ShieldAlert, LogOut, Download, Eye, RefreshCw
} from 'lucide-react';
import { 
  getStats, getProducts, addProduct, updateProduct, deleteProduct,
  getProjects, addProject, updateProject, deleteProject,
  getReviews, approveReview, deleteReview,
  getMessages, markMessageRead, replyToMessage, deleteMessage,
  getOrders, updateOrderStatus, getSettings, updateSettings, backupDatabase
} from '../../services/db';
import { useAuth } from '../../context/AuthContext';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('stats'); // stats, products, projects, orders, messages, reviews, settings
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  
  // Data lists
  const [products, setProducts] = useState([]);
  const [projects, setProjects] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [siteSettings, setSiteSettings] = useState({});

  // Modals / Form States
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null); // null for add, object for edit
  const [currentProject, setCurrentProject] = useState(null);

  // Message reply states
  const [replyText, setReplyText] = useState('');
  const [activeMessageId, setActiveMessageId] = useState(null);

  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // Load Admin Data
  const loadAdminData = async () => {
    try {
      setLoading(true);
      const metrics = await getStats();
      setStats(metrics);

      const prods = await getProducts();
      setProducts(prods);

      const projs = await getProjects();
      setProjects(projs);

      const ords = await getOrders();
      setOrders(ords);

      const msgs = await getMessages();
      setMessages(msgs);

      const revs = await getReviews();
      setReviews(revs);

      const settings = await getSettings();
      setSiteSettings(settings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleBackup = () => {
    backupDatabase();
  };

  // -------------------------------------------------------------
  // PRODUCTS ACTIONS
  // -------------------------------------------------------------
  const [prodForm, setProdForm] = useState({ name: '', price: 0, category: '', status: 'متوفر', description: '', image: '' });
  
  const openProductModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setProdForm({ ...product });
    } else {
      setCurrentProduct(null);
      setProdForm({ name: '', price: 0, category: 'موقع ويب', status: 'متوفر', description: '', image: '' });
    }
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (currentProduct) {
        await updateProduct(currentProduct.id, prodForm);
      } else {
        await addProduct(prodForm);
      }
      setProductModalOpen(false);
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج نهائياً؟')) {
      await deleteProduct(id);
      loadAdminData();
    }
  };

  // -------------------------------------------------------------
  // PROJECTS ACTIONS
  // -------------------------------------------------------------
  const [projForm, setProjForm] = useState({ title: '', description: '', category: '', technologies: '', link: '', image: '' });
  
  const openProjectModal = (project = null) => {
    if (project) {
      setCurrentProject(project);
      setProjForm({ 
        ...project, 
        technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies 
      });
    } else {
      setCurrentProject(null);
      setProjForm({ title: '', description: '', category: 'موقع ويب', technologies: '', link: '', image: '' });
    }
    setProjectModalOpen(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    const formattedPayload = {
      ...projForm,
      technologies: projForm.technologies.split(',').map(t => t.trim()).filter(Boolean)
    };
    try {
      if (currentProject) {
        await updateProject(currentProject.id, formattedPayload);
      } else {
        await addProject(formattedPayload);
      }
      setProjectModalOpen(false);
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المشروع نهائياً؟')) {
      await deleteProject(id);
      loadAdminData();
    }
  };

  // -------------------------------------------------------------
  // ORDERS ACTIONS
  // -------------------------------------------------------------
  const handleUpdateOrderStatus = async (id, status) => {
    await updateOrderStatus(id, status);
    loadAdminData();
  };

  // -------------------------------------------------------------
  // MESSAGE ACTIONS
  // -------------------------------------------------------------
  const handleOpenReply = (msgId) => {
    setActiveMessageId(msgId);
    setReplyText('');
  };

  const handleSendReply = async (msgId) => {
    if (!replyText.trim()) return;
    await replyToMessage(msgId, replyText.trim());
    await markMessageRead(msgId);
    setActiveMessageId(null);
    setReplyText('');
    loadAdminData();
  };

  const handleDeleteMsg = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      await deleteMessage(id);
      loadAdminData();
    }
  };

  // -------------------------------------------------------------
  // REVIEWS ACTIONS
  // -------------------------------------------------------------
  const handleApproveReview = async (id) => {
    await approveReview(id);
    loadAdminData();
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('هل أنت متأكد من رفض أو حذف هذا التقييم؟')) {
      await deleteReview(id);
      loadAdminData();
    }
  };

  // -------------------------------------------------------------
  // CONTENT SETTINGS ACTIONS
  // -------------------------------------------------------------
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await updateSettings(siteSettings);
    alert('تم حفظ إعدادات الموقع والبيانات الشخصية بنجاح!');
    loadAdminData();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-10 h-10 text-primary-500 animate-spin" />
          <span className="text-sm font-semibold text-slate-500">جاري تحميل لوحة التحكم...</span>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'stats', label: 'الرئيسية والإحصائيات', icon: LayoutDashboard },
    { id: 'products', label: 'إدارة المنتجات', icon: ShoppingBag },
    { id: 'projects', label: 'إدارة المشاريع', icon: FolderGit2 },
    { id: 'orders', label: 'طلبات المتجر', icon: ShoppingCart },
    { id: 'messages', label: 'رسائل التواصل', icon: MessageSquare },
    { id: 'reviews', label: 'مراجعة التقييمات', icon: Star },
    { id: 'settings', label: 'إعدادات الموقع', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-dark-bg text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-300">
      {/* Sidebar sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-dark-card border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="pb-4 border-b border-slate-200 dark:border-slate-800 text-center md:text-right">
            <span className="text-lg font-black text-gradient">لوحة تحكم المشرف</span>
            <p className="text-xs text-slate-400 mt-1">عبد الله وائل فتحي</p>
          </div>

          <nav className="space-y-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                  ${activeTab === item.id
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }
                `}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <Link
            to="/"
            className="w-full py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-center block text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            عرض الموقع الرئيسي
          </Link>
          <button
            onClick={() => logout().then(() => navigate('/'))}
            className="w-full py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Main Workspace */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        
        {/* TAB 1: STATISTICS */}
        {activeTab === 'stats' && stats && (
          <div className="space-y-8">
            {/* Greeting Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-black">إحصائيات المنصة الكلية</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">متابعة مؤشرات أداء الموقع والنشاطات الأخيرة</p>
              </div>
              <button
                onClick={handleBackup}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center gap-2 shadow-sm hover:scale-95 transition-transform"
              >
                <Download className="w-4 h-4" />
                <span>تحميل نسخة احتياطية (JSON)</span>
              </button>
            </div>

            {/* Metric widgets */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              {[
                { label: 'إجمالي الزوار', value: stats.visitorCount, color: 'text-primary-500' },
                { label: 'المنتجات الرقمية', value: stats.productsCount, color: 'text-secondary-500' },
                { label: 'مشاريع المعرض', value: stats.projectsCount, color: 'text-amber-500' },
                { label: 'طلب شراء', value: stats.ordersCount, color: 'text-purple-500' },
                { label: 'رسالة بريدية', value: stats.messagesCount, color: 'text-blue-500' },
                { label: 'المستخدمين', value: stats.usersCount, color: 'text-rose-500' },
              ].map((card, i) => (
                <div key={i} className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-center">
                  <span className="text-xs font-bold text-slate-400">{card.label}</span>
                  <div className={`text-2xl sm:text-3xl font-black mt-2 ${card.color}`}>{card.value}</div>
                </div>
              ))}
            </div>

            {/* Audit activity log trail */}
            <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold mb-4">سجل العمليات الأخير (Audit Log)</h3>
              <div className="space-y-4">
                {stats.recentActivities && stats.recentActivities.length > 0 ? (
                  stats.recentActivities.map((log, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <span className="font-bold text-slate-700 dark:text-slate-300 ml-2">[{log.user}]</span>
                        <span className="text-slate-500">{log.action}</span>
                      </div>
                      <span className="text-slate-400" style={{ direction: 'ltr' }}>
                        {new Date(log.timestamp).toLocaleTimeString('ar-EG')} - {new Date(log.timestamp).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 text-center py-6">لا يوجد أنشطة مسجلة حالياً.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black">إدارة المنتجات الرقمية</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">إضافة وتعديل وحذف منتجات المتجر</p>
              </div>
              <button
                onClick={() => openProductModal()}
                className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة منتج جديد</span>
              </button>
            </div>

            <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 text-xs">
                    <tr>
                      <th className="p-4">اسم المنتج</th>
                      <th className="p-4">السعر</th>
                      <th className="p-4">التصنيف</th>
                      <th className="p-4">الحالة</th>
                      <th className="p-4 text-center">العمليات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {products.map(prod => (
                      <tr key={prod.id} className="hover:bg-slate-500/5">
                        <td className="p-4 font-bold">{prod.name}</td>
                        <td className="p-4 text-primary-600 dark:text-primary-400 font-extrabold">{prod.price}$</td>
                        <td className="p-4">{prod.category}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold text-white ${prod.status === 'متوفر' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                            {prod.status}
                          </span>
                        </td>
                        <td className="p-4 flex justify-center gap-2">
                          <button
                            onClick={() => openProductModal(prod)}
                            className="p-1.5 rounded bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 rounded bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MANAGE PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black">إدارة مشاريع المعرض</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">إضافة وتعديل أعمال البورتفوليو</p>
              </div>
              <button
                onClick={() => openProjectModal()}
                className="px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة مشروع جديد</span>
              </button>
            </div>

            <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 text-xs">
                    <tr>
                      <th className="p-4">عنوان المشروع</th>
                      <th className="p-4">التصنيف</th>
                      <th className="p-4">التقنيات المستخدمة</th>
                      <th className="p-4 text-center">العمليات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {projects.map(proj => (
                      <tr key={proj.id} className="hover:bg-slate-500/5">
                        <td className="p-4 font-bold">{proj.title}</td>
                        <td className="p-4">{proj.category}</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {proj.technologies && (Array.isArray(proj.technologies) ? proj.technologies : [proj.technologies]).map((t, idx) => (
                              <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-[10px] px-1.5 py-0.5 rounded text-slate-500">
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 flex justify-center gap-2">
                          <button
                            onClick={() => openProjectModal(proj)}
                            className="p-1.5 rounded bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-1.5 rounded bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: STORE ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black">طلبات الشراء والمبيعات</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">إدارة ومتابعة طلبات المنتجات من الزوار</p>
            </div>

            <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 text-xs">
                    <tr>
                      <th className="p-4">المنتج المطلوب</th>
                      <th className="p-4">اسم العميل</th>
                      <th className="p-4">البريد الإلكتروني</th>
                      <th className="p-4">الحالة</th>
                      <th className="p-4 text-center">تغيير الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-500/5">
                        <td className="p-4 font-bold">{order.productName}</td>
                        <td className="p-4">{order.userName}</td>
                        <td className="p-4">{order.userEmail}</td>
                        <td className="p-4">
                          <span className={`
                            px-2.5 py-0.5 rounded text-[10px] font-bold text-white
                            ${order.status === 'جديد' ? 'bg-blue-500' : order.status === 'قيد التنفيذ' ? 'bg-amber-500' : order.status === 'مكتمل' ? 'bg-emerald-500' : 'bg-rose-500'}
                          `}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 flex justify-center gap-1.5">
                          {['قيد التنفيذ', 'مكتمل', 'ملغي'].map(st => (
                            <button
                              key={st}
                              onClick={() => handleUpdateOrderStatus(order.id, st)}
                              className="px-2 py-1 bg-slate-100 dark:bg-slate-850 hover:bg-primary-500 hover:text-white transition-colors rounded text-[10px] font-semibold"
                            >
                              {st}
                            </button>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CONTACT MESSAGES */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black">الرسائل الواردة</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">قراءة والرد على استفسارات الزوار</p>
            </div>

            <div className="space-y-4">
              {messages.length > 0 ? (
                messages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`
                      p-6 rounded-2xl border transition-all shadow-sm space-y-4
                      ${msg.read 
                        ? 'bg-white dark:bg-dark-card border-slate-200 dark:border-slate-800' 
                        : 'bg-primary-500/5 dark:bg-primary-500/5 border-primary-500/30'
                      }
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-xs text-primary-600 dark:text-primary-400 font-bold">الموضوع: {msg.subject}</span>
                        <h4 className="text-base font-bold">{msg.name}</h4>
                        <p className="text-xs text-slate-400">{msg.email} | {msg.phone || 'بدون هاتف'}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenReply(msg.id)}
                          className="px-3 py-1.5 bg-secondary-500/10 text-secondary-600 hover:bg-secondary-500 hover:text-white transition-colors rounded-xl text-xs font-bold"
                        >
                          رد سريع
                        </button>
                        <button
                          onClick={() => handleDeleteMsg(msg.id)}
                          className="p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl">
                      {msg.message}
                    </p>

                    {/* Replies listing */}
                    {msg.replies && msg.replies.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <h5 className="text-xs font-bold text-slate-400">الردود السابقة:</h5>
                        {msg.replies.map((rep, idx) => (
                          <div key={idx} className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/15 p-3 rounded-lg text-xs leading-relaxed">
                            <p className="text-emerald-600 dark:text-emerald-400 font-bold">الرد:</p>
                            <p className="mt-1 text-slate-700 dark:text-slate-300">{rep.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply box form inline */}
                    {activeMessageId === msg.id && (
                      <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <textarea
                          rows="3"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="اكتب ردك هنا..."
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-850 dark:bg-dark-bg text-xs rounded-xl focus:outline-none focus:border-secondary-500"
                        ></textarea>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setActiveMessageId(null)}
                            className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg"
                          >
                            إلغاء
                          </button>
                          <button
                            onClick={() => handleSendReply(msg.id)}
                            className="px-4 py-1.5 text-xs font-bold text-white bg-secondary-600 hover:bg-secondary-700 rounded-lg shadow-sm"
                          >
                            إرسال الرد
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400 text-center py-12">لا توجد رسائل واردة حالياً.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: MANAGE REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black">إدارة تقييمات العملاء</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">الموافقة على التعليقات قبل نشرها على الموقع</p>
            </div>

            <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 text-xs">
                    <tr>
                      <th className="p-4">العميل</th>
                      <th className="p-4">التقييم</th>
                      <th className="p-4">التعليق</th>
                      <th className="p-4">الحالة</th>
                      <th className="p-4 text-center">العمليات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {reviews.map(rev => (
                      <tr key={rev.id} className="hover:bg-slate-500/5">
                        <td className="p-4 font-bold flex items-center gap-2">
                          <img src={rev.photo} className="w-8 h-8 rounded-full object-cover" />
                          <span>{rev.name}</span>
                        </td>
                        <td className="p-4 text-amber-500 font-extrabold">{rev.rating}★</td>
                        <td className="p-4 max-w-xs truncate">{rev.comment}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold text-white ${rev.approved ? 'bg-emerald-500' : 'bg-yellow-500'}`}>
                            {rev.approved ? 'معتمد' : 'معلق للمراجعة'}
                          </span>
                        </td>
                        <td className="p-4 flex justify-center gap-1.5">
                          {!rev.approved && (
                            <button
                              onClick={() => handleApproveReview(rev.id)}
                              className="p-1.5 rounded bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors"
                              title="موافقة"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="p-1.5 rounded bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SITE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-2xl font-black">إعدادات محتوى الموقع</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">تحديث نصوص الصفحة الرئيسية والبيانات الشخصية ووسائل الاتصال</p>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500">اسم صاحب الموقع</label>
                  <input
                    type="text"
                    value={siteSettings.aboutHeroTitle || ''}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, aboutHeroTitle: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-dark-bg text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500">الوصف التعريفي للرئيسية</label>
                  <input
                    type="text"
                    value={siteSettings.aboutHeroDesc || ''}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, aboutHeroDesc: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-dark-bg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500">العمر</label>
                  <input
                    type="number"
                    value={siteSettings.aboutAge || 14}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, aboutAge: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-dark-bg text-sm text-center"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500">سنوات الخبرة</label>
                  <input
                    type="number"
                    value={siteSettings.aboutExperience || 2}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, aboutExperience: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-dark-bg text-sm text-center"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500">رقم الهاتف</label>
                  <input
                    type="text"
                    value={siteSettings.phone || ''}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-dark-bg text-sm text-center"
                    style={{ direction: 'ltr' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500">بريد التواصل</label>
                  <input
                    type="email"
                    value={siteSettings.email || ''}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-dark-bg text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500">حساب GitHub</label>
                  <input
                    type="url"
                    value={siteSettings.github || ''}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, github: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-dark-bg text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500">السيرة الذاتية المفصلة (Bio)</label>
                <textarea
                  rows="4"
                  value={siteSettings.aboutBio || ''}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, aboutBio: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-dark-bg text-sm resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-md hover:shadow-lg transition-all"
              >
                حفظ التغييرات
              </button>
            </form>
          </div>
        )}

      </main>

      {/* -------------------------------------------------------------
          MODALS SECTION (Products & Projects Cruds Modals)
         ------------------------------------------------------------- */}
      
      {/* 1. PRODUCT MODAL */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setProductModalOpen(false)}></div>
          <form 
            onSubmit={handleSaveProduct}
            className="relative bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl z-10 space-y-4"
          >
            <h3 className="text-xl font-bold">{currentProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج رقمي جديد'}</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={prodForm.name}
                onChange={(e) => setProdForm(p => ({ ...p, name: e.target.value }))}
                placeholder="اسم المنتج"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 dark:bg-dark-bg text-sm focus:outline-none"
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={prodForm.price}
                  onChange={(e) => setProdForm(p => ({ ...p, price: parseFloat(e.target.value) }))}
                  placeholder="سعر المنتج ($)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 dark:bg-dark-bg text-sm focus:outline-none"
                  required
                />
                <input
                  type="text"
                  value={prodForm.category}
                  onChange={(e) => setProdForm(p => ({ ...p, category: e.target.value }))}
                  placeholder="التصنيف"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 dark:bg-dark-bg text-sm focus:outline-none"
                  required
                />
              </div>
              <select
                value={prodForm.status}
                onChange={(e) => setProdForm(p => ({ ...p, status: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 dark:bg-dark-bg text-sm focus:outline-none"
              >
                <option value="متوفر">متوفر</option>
                <option value="طلب مسبق">طلب مسبق</option>
                <option value="غير متوفر">غير متوفر</option>
              </select>
              <input
                type="url"
                value={prodForm.image}
                onChange={(e) => setProdForm(p => ({ ...p, image: e.target.value }))}
                placeholder="رابط صورة المنتج"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 dark:bg-dark-bg text-xs focus:outline-none"
                required
              />
              <textarea
                rows="3"
                value={prodForm.description}
                onChange={(e) => setProdForm(p => ({ ...p, description: e.target.value }))}
                placeholder="وصف المنتج بالتفصيل..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 dark:bg-dark-bg text-sm focus:outline-none resize-none"
                required
              ></textarea>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-primary-500/25"
              >
                حفظ البيانات
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. PROJECT MODAL */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setProjectModalOpen(false)}></div>
          <form 
            onSubmit={handleSaveProject}
            className="relative bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl z-10 space-y-4"
          >
            <h3 className="text-xl font-bold">{currentProject ? 'تعديل بيانات المشروع' : 'إضافة مشروع جديد للمعرض'}</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={projForm.title}
                onChange={(e) => setProjForm(p => ({ ...p, title: e.target.value }))}
                placeholder="عنوان المشروع"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 dark:bg-dark-bg text-sm focus:outline-none"
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={projForm.category}
                  onChange={(e) => setProjForm(p => ({ ...p, category: e.target.value }))}
                  placeholder="التصنيف (مثال: تطبيقات ويب)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 dark:bg-dark-bg text-sm focus:outline-none"
                  required
                />
                <input
                  type="url"
                  value={projForm.link}
                  onChange={(e) => setProjForm(p => ({ ...p, link: e.target.value }))}
                  placeholder="رابط المشروع الخارجي"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 dark:bg-dark-bg text-xs focus:outline-none"
                />
              </div>
              <input
                type="text"
                value={projForm.technologies}
                onChange={(e) => setProjForm(p => ({ ...p, technologies: e.target.value }))}
                placeholder="التقنيات المستخدمة (مفصولة بفواصل، مثال: React, Tailwind, Node)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 dark:bg-dark-bg text-xs focus:outline-none"
                required
              />
              <input
                type="url"
                value={projForm.image}
                onChange={(e) => setProjForm(p => ({ ...p, image: e.target.value }))}
                placeholder="رابط صورة المشروع"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 dark:bg-dark-bg text-xs focus:outline-none"
                required
              />
              <textarea
                rows="3"
                value={projForm.description}
                onChange={(e) => setProjForm(p => ({ ...p, description: e.target.value }))}
                placeholder="وصف المشروع بالتفصيل..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 dark:bg-dark-bg text-sm focus:outline-none resize-none"
                required
              ></textarea>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setProjectModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-primary-500/25"
              >
                حفظ البيانات
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
