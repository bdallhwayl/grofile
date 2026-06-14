import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  setDoc
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';

// -------------------------------------------------------------
// LOCAL STORAGE MOCK SEED DATA
// -------------------------------------------------------------
const defaultProducts = [
  {
    id: 'prod-1',
    name: 'منصة التجارة الإلكترونية المتكاملة',
    price: 299,
    description: 'نظام متجر إلكتروني متكامل مع سلة تسوق ولوحة تحكم متطورة ونظام تتبع للطلبات.',
    category: 'مواقع ويب',
    status: 'متوفر',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-2',
    name: 'تطبيق إدارة المهام والإنتاجية',
    price: 49,
    description: 'تطبيق لتنظيم المهام اليومية مع إحصائيات تفاعلية وإشعارات فورية للمستخدمين.',
    category: 'تطبيقات جوال',
    status: 'متوفر',
    image: 'https://images.unsplash.com/photo-1540350394557-8d14678e7f91?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-3',
    name: 'نظام حجز المواعيد للأطباء والعيادات',
    price: 189,
    description: 'موقع ويب يتيح للمرضى حجز المواعيد ومتابعة الطبيب بشكل كامل مع بوابة دفع تجريبية.',
    category: 'مواقع ويب',
    status: 'طلب مسبق',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'prod-4',
    name: 'كورس احتراف React & Tailwind CSS',
    price: 79,
    description: 'دورة تعليمية شاملة من الصفر حتى الاحتراف لبناء واجهات ويب جذابة وسريعة الاستجابة.',
    category: 'تعليم',
    status: 'متوفر',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60'
  }
];

const defaultProjects = [
  {
    id: 'proj-1',
    title: 'موقع شركة البرمجيات الحديثة',
    description: 'تصميم وتطوير موقع تعريفي لشركة برمجيات مع انتقالات احترافية ودعم كامل للوضع الداكن.',
    category: 'مواقع ويب',
    technologies: ['React', 'Tailwind CSS', 'Framer Motion'],
    link: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'proj-2',
    title: 'تطبيق محادثة فوري (Chat App)',
    description: 'تطبيق محادثة حقيقي يتيح للمستخدمين إنشاء غرف دردشة والتواصل النصي الفوري.',
    category: 'تطبيقات ويب',
    technologies: ['React', 'Firebase Auth', 'Firestore'],
    link: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 'proj-3',
    title: 'لوحة تحكم إحصائية (Admin Dashboard)',
    description: 'لوحة تحكم ذكية تعرض تحليلات المبيعات وعدد المستخدمين ومعدل التفاعل برسوم بيانية.',
    category: 'لوحة تحكم',
    technologies: ['React', 'ChartJS', 'Tailwind'],
    link: 'https://example.com',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=60'
  }
];

const defaultReviews = [
  {
    id: 'rev-1',
    name: 'أحمد محمود',
    rating: 5,
    comment: 'عمل رائع جداً، كود نظيف وتصميم عصري فاق توقعاتي. مبرمج متميز وخلوق.',
    photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
    approved: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'rev-2',
    name: 'ياسر القحطاني',
    rating: 5,
    comment: 'سرعة في التنفيذ واحترافية عالية بالرغم من صغر سنه. أنصح بالتعامل معه بشدة!',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=60',
    approved: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'rev-3',
    name: 'هدى عبد الرحمن',
    rating: 4,
    comment: 'تصميم المتجر ممتاز وسهل الاستخدام، والتواصل كان ممتازاً طوال فترة العمل.',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=60',
    approved: true,
    createdAt: new Date().toISOString()
  }
];

const defaultSettings = {
  phone: '+201021481234',
  email: 'bdallhwaylg@gmail.com',
  github: 'https://github.com/abdallahwael',
  linkedin: 'https://linkedin.com',
  facebook: 'https://facebook.com',
  aboutBio: 'أنا عبد الله وائل فتحي، مطور ويب ومبرمج واجهات أمامية شغوف بالتقنيات الحديثة. أعمل في مجال تطوير الويب وتصميم المواقع وتطبيقات المتاجر الإلكترونية المتكاملة بمستوى احترافي ينافس الشركات الكبرى.',
  aboutAge: 14,
  aboutExperience: 2,
  aboutHeroTitle: 'عبد الله وائل فتحي',
  aboutHeroDesc: 'مطور ويب ومبرمج شغوف بالتقنيات الحديثة'
};

const initializeMockDB = () => {
  if (!localStorage.getItem('mock_db_initialized')) {
    localStorage.setItem('mock_products', JSON.stringify(defaultProducts));
    localStorage.setItem('mock_projects', JSON.stringify(defaultProjects));
    localStorage.setItem('mock_reviews', JSON.stringify(defaultReviews));
    localStorage.setItem('mock_settings', JSON.stringify(defaultSettings));
    localStorage.setItem('mock_messages', JSON.stringify([]));
    localStorage.setItem('mock_orders', JSON.stringify([]));
    localStorage.setItem('mock_logs', JSON.stringify([
      { action: 'تهيئة النظام', user: 'النظام', timestamp: new Date().toISOString() }
    ]));
    localStorage.setItem('mock_db_initialized', 'true');
  }
};

// Execute initialization
initializeMockDB();

// -------------------------------------------------------------
// DATABASE UTILITY WRAPPERS
// -------------------------------------------------------------

// Helper to get local storage parsed item
const getLocalItem = (key) => JSON.parse(localStorage.getItem(key)) || [];
const setLocalItem = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Add Admin Action Log
export const logActivity = async (action, user = 'مسؤول النظام') => {
  const logEntry = {
    action,
    user,
    timestamp: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    try {
      await addDoc(collection(db, 'activity_logs'), logEntry);
    } catch (e) {
      console.error(e);
    }
  } else {
    const logs = getLocalItem('mock_logs');
    logs.unshift(logEntry);
    setLocalItem('mock_logs', logs.slice(0, 100)); // Cap at 100 logs
  }
};

// 1. PRODUCTS CRUD
export const getProducts = async () => {
  if (isFirebaseConfigured) {
    const snapshot = await getDocs(collection(db, 'products'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } else {
    return getLocalItem('mock_products');
  }
};

export const addProduct = async (product) => {
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, 'products'), product);
    await logActivity(`إضافة منتج جديد: ${product.name}`);
    return { id: docRef.id, ...product };
  } else {
    const products = getLocalItem('mock_products');
    const newProduct = { id: `prod-${Date.now()}`, ...product };
    products.push(newProduct);
    setLocalItem('mock_products', products);
    await logActivity(`إضافة منتج جديد: ${product.name}`);
    return newProduct;
  }
};

export const updateProduct = async (id, updatedProduct) => {
  if (isFirebaseConfigured) {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, updatedProduct);
    await logActivity(`تعديل المنتج: ${updatedProduct.name || id}`);
    return { id, ...updatedProduct };
  } else {
    const products = getLocalItem('mock_products');
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedProduct };
      setLocalItem('mock_products', products);
      await logActivity(`تعديل المنتج: ${updatedProduct.name || id}`);
      return products[index];
    }
    throw new Error('Product not found');
  }
};

export const deleteProduct = async (id) => {
  if (isFirebaseConfigured) {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
    await logActivity(`حذف المنتج رقم: ${id}`);
    return id;
  } else {
    let products = getLocalItem('mock_products');
    products = products.filter(p => p.id !== id);
    setLocalItem('mock_products', products);
    await logActivity(`حذف المنتج رقم: ${id}`);
    return id;
  }
};

// 2. PROJECTS CRUD
export const getProjects = async () => {
  if (isFirebaseConfigured) {
    const snapshot = await getDocs(collection(db, 'projects'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } else {
    return getLocalItem('mock_projects');
  }
};

export const addProject = async (project) => {
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, 'projects'), project);
    await logActivity(`إضافة مشروع جديد: ${project.title}`);
    return { id: docRef.id, ...project };
  } else {
    const projects = getLocalItem('mock_projects');
    const newProject = { id: `proj-${Date.now()}`, ...project };
    projects.push(newProject);
    setLocalItem('mock_projects', projects);
    await logActivity(`إضافة مشروع جديد: ${project.title}`);
    return newProject;
  }
};

export const updateProject = async (id, updatedProject) => {
  if (isFirebaseConfigured) {
    const docRef = doc(db, 'projects', id);
    await updateDoc(docRef, updatedProject);
    await logActivity(`تعديل المشروع: ${updatedProject.title || id}`);
    return { id, ...updatedProject };
  } else {
    const projects = getLocalItem('mock_projects');
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updatedProject };
      setLocalItem('mock_projects', projects);
      await logActivity(`تعديل المشروع: ${updatedProject.title || id}`);
      return projects[index];
    }
    throw new Error('Project not found');
  }
};

export const deleteProject = async (id) => {
  if (isFirebaseConfigured) {
    const docRef = doc(db, 'projects', id);
    await deleteDoc(docRef);
    await logActivity(`حذف المشروع رقم: ${id}`);
    return id;
  } else {
    let projects = getLocalItem('mock_projects');
    projects = projects.filter(p => p.id !== id);
    setLocalItem('mock_projects', projects);
    await logActivity(`حذف المشروع رقم: ${id}`);
    return id;
  }
};

// 3. REVIEWS CRUD (Moderation included)
export const getReviews = async () => {
  if (isFirebaseConfigured) {
    const snapshot = await getDocs(collection(db, 'reviews'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } else {
    return getLocalItem('mock_reviews');
  }
};

export const addReview = async (review) => {
  const newReview = {
    ...review,
    approved: false, // Moderated by default
    createdAt: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, 'reviews'), newReview);
    return { id: docRef.id, ...newReview };
  } else {
    const reviews = getLocalItem('mock_reviews');
    const reviewWithId = { id: `rev-${Date.now()}`, ...newReview };
    reviews.push(reviewWithId);
    setLocalItem('mock_reviews', reviews);
    return reviewWithId;
  }
};

export const approveReview = async (id) => {
  if (isFirebaseConfigured) {
    const docRef = doc(db, 'reviews', id);
    await updateDoc(docRef, { approved: true });
    await logActivity(`قبول التقييم رقم: ${id}`);
    return id;
  } else {
    const reviews = getLocalItem('mock_reviews');
    const index = reviews.findIndex(r => r.id === id);
    if (index !== -1) {
      reviews[index].approved = true;
      setLocalItem('mock_reviews', reviews);
      await logActivity(`قبول التقييم رقم: ${id}`);
      return id;
    }
    throw new Error('Review not found');
  }
};

export const deleteReview = async (id) => {
  if (isFirebaseConfigured) {
    const docRef = doc(db, 'reviews', id);
    await deleteDoc(docRef);
    await logActivity(`حذف التقييم رقم: ${id}`);
    return id;
  } else {
    let reviews = getLocalItem('mock_reviews');
    reviews = reviews.filter(r => r.id !== id);
    setLocalItem('mock_reviews', reviews);
    await logActivity(`حذف التقييم رقم: ${id}`);
    return id;
  }
};

// 4. MESSAGES CRUD
export const getMessages = async () => {
  if (isFirebaseConfigured) {
    const snapshot = await getDocs(collection(db, 'messages'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } else {
    return getLocalItem('mock_messages');
  }
};

export const addMessage = async (msg) => {
  const newMsg = {
    ...msg,
    read: false,
    replies: [],
    createdAt: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, 'messages'), newMsg);
    return { id: docRef.id, ...newMsg };
  } else {
    const messages = getLocalItem('mock_messages');
    const msgWithId = { id: `msg-${Date.now()}`, ...newMsg };
    messages.push(msgWithId);
    setLocalItem('mock_messages', messages);
    return msgWithId;
  }
};

export const markMessageRead = async (id) => {
  if (isFirebaseConfigured) {
    const docRef = doc(db, 'messages', id);
    await updateDoc(docRef, { read: true });
    return id;
  } else {
    const messages = getLocalItem('mock_messages');
    const index = messages.findIndex(m => m.id === id);
    if (index !== -1) {
      messages[index].read = true;
      setLocalItem('mock_messages', messages);
      return id;
    }
    throw new Error('Message not found');
  }
};

export const replyToMessage = async (id, replyText) => {
  const replyObj = {
    text: replyText,
    timestamp: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    const docRef = doc(db, 'messages', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const currentReplies = docSnap.data().replies || [];
      await updateDoc(docRef, { 
        replies: [...currentReplies, replyObj] 
      });
      await logActivity(`الرد على الرسالة رقم: ${id}`);
    }
  } else {
    const messages = getLocalItem('mock_messages');
    const index = messages.findIndex(m => m.id === id);
    if (index !== -1) {
      const currentReplies = messages[index].replies || [];
      messages[index].replies = [...currentReplies, replyObj];
      setLocalItem('mock_messages', messages);
      await logActivity(`الرد على الرسالة رقم: ${id}`);
      return messages[index];
    }
    throw new Error('Message not found');
  }
};

export const deleteMessage = async (id) => {
  if (isFirebaseConfigured) {
    const docRef = doc(db, 'messages', id);
    await deleteDoc(docRef);
    await logActivity(`حذف الرسالة رقم: ${id}`);
    return id;
  } else {
    let messages = getLocalItem('mock_messages');
    messages = messages.filter(m => m.id !== id);
    setLocalItem('mock_messages', messages);
    await logActivity(`حذف الرسالة رقم: ${id}`);
    return id;
  }
};

// 5. ORDERS CRUD
export const getOrders = async () => {
  if (isFirebaseConfigured) {
    const snapshot = await getDocs(collection(db, 'orders'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } else {
    return getLocalItem('mock_orders');
  }
};

export const addOrder = async (order) => {
  const newOrder = {
    ...order,
    status: 'جديد', // جديد, قيد التنفيذ, مكتمل, ملغي
    createdAt: new Date().toISOString()
  };
  if (isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, 'orders'), newOrder);
    await logActivity(`طلب منتج جديد: ${order.productName} بواسطة ${order.userName}`);
    return { id: docRef.id, ...newOrder };
  } else {
    const orders = getLocalItem('mock_orders');
    const orderWithId = { id: `ord-${Date.now()}`, ...newOrder };
    orders.push(orderWithId);
    setLocalItem('mock_orders', orders);
    await logActivity(`طلب منتج جديد: ${order.productName} بواسطة ${order.userName}`);
    return orderWithId;
  }
};

export const updateOrderStatus = async (id, status) => {
  if (isFirebaseConfigured) {
    const docRef = doc(db, 'orders', id);
    await updateDoc(docRef, { status });
    await logActivity(`تحديث حالة الطلب ${id} إلى ${status}`);
    return id;
  } else {
    const orders = getLocalItem('mock_orders');
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index].status = status;
      setLocalItem('mock_orders', orders);
      await logActivity(`تحديث حالة الطلب ${id} إلى ${status}`);
      return id;
    }
    throw new Error('Order not found');
  }
};

// 6. SETTINGS & DYNAMIC DATA EDITORS
export const getSettings = async () => {
  if (isFirebaseConfigured) {
    const docRef = doc(db, 'settings', 'global');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Seed initial settings into Firestore
      await setDoc(docRef, defaultSettings);
      return defaultSettings;
    }
  } else {
    return getLocalItem('mock_settings');
  }
};

export const updateSettings = async (newSettings) => {
  if (isFirebaseConfigured) {
    const docRef = doc(db, 'settings', 'global');
    await setDoc(docRef, newSettings, { merge: true });
    await logActivity('تعديل الإعدادات العامة للموقع');
    return newSettings;
  } else {
    const current = getLocalItem('mock_settings');
    const updated = { ...current, ...newSettings };
    setLocalItem('mock_settings', updated);
    await logActivity('تعديل الإعدادات العامة للموقع');
    return updated;
  }
};

// 7. STATISTICS METRICS
export const getStats = async () => {
  const products = await getProducts();
  const projects = await getProjects();
  const reviews = await getReviews();
  const messages = await getMessages();
  const orders = await getOrders();
  
  // Calculate logs & users simulation
  let logsList = [];
  let userCount = 4; // Mock standard users
  
  if (isFirebaseConfigured) {
    try {
      const logSnap = await getDocs(collection(db, 'activity_logs'));
      logsList = logSnap.docs.map(d => d.data());
      // Estimate users from auth or a collection if registered
      const userSnap = await getDocs(collection(db, 'users'));
      userCount = userSnap.size || 4;
    } catch (e) {
      console.warn("Could not query activity logs / users in firebase: ", e);
    }
  } else {
    logsList = getLocalItem('mock_logs');
    const localUsers = JSON.parse(localStorage.getItem('mock_users')) || [];
    userCount = 4 + localUsers.length;
  }

  // Simulated Visitors
  let visitorCount = parseInt(localStorage.getItem('visitor_counter') || '785');
  if (!localStorage.getItem('visitor_session_tracked')) {
    visitorCount += 1;
    localStorage.setItem('visitor_counter', visitorCount.toString());
    localStorage.setItem('visitor_session_tracked', 'true');
  }

  return {
    visitorCount,
    productsCount: products.length,
    projectsCount: projects.length,
    messagesCount: messages.length,
    ordersCount: orders.length,
    usersCount: userCount,
    recentActivities: logsList.slice(0, 10),
  };
};

// Mock Backup System
export const backupDatabase = () => {
  const backup = {
    products: getLocalItem('mock_products'),
    projects: getLocalItem('mock_projects'),
    reviews: getLocalItem('mock_reviews'),
    settings: getLocalItem('mock_settings'),
    messages: getLocalItem('mock_messages'),
    orders: getLocalItem('mock_orders'),
    logs: getLocalItem('mock_logs'),
    backupDate: new Date().toISOString()
  };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `site_backup_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  logActivity('إنشاء نسخة احتياطية من البيانات وتحميلها');
  return true;
};
