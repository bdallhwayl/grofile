import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Eye, Tag, AlertCircle, X, Check } from 'lucide-react';
import { getProducts, addOrder } from '../services/db';
import { useAuth } from '../context/AuthContext';
import Skeleton from '../components/Skeleton';

export const Store = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState(['الكل']);
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderingProduct, setOrderingProduct] = useState(null);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);

        const uniqCats = ['الكل', ...new Set(data.map(p => p.category).filter(Boolean))];
        setCategories(uniqCats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleFilter = (category) => {
    setActiveCategory(category);
    if (category === 'الكل') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === category));
    }
  };

  const handleOrderNow = async (product) => {
    setOrderingProduct(product.id);
    try {
      // 1. Create a dynamic order entry in the database
      const orderData = {
        productId: product.id,
        productName: product.name,
        price: product.price,
        userId: currentUser?.uid || 'guest',
        userName: currentUser?.displayName || 'زائر غير مسجل',
        userEmail: currentUser?.email || 'guest@example.com',
      };
      
      await addOrder(orderData);

      // 2. Redirect to contact page with navigation state prefilled
      navigate('/contact', { 
        state: { 
          prefilledSubject: `طلب منتج: ${product.name}`,
          prefilledMessage: `مرحباً عبد الله، أود طلب المنتج التالي:\n- الاسم: ${product.name}\n- السعر: ${product.price} دولار\n\nيرجى التواصل معي لإتمام عملية الشراء الدفع والتسليم.` 
        } 
      });
    } catch (err) {
      console.error("Order creation failed: ", err);
    } finally {
      setOrderingProduct(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 transition-colors duration-300">
      {/* Header Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
          المتجر الإلكتروني
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          تصفح باقة من البرامج الجاهزة، المواقع المتميزة، والخدمات الرقمية التي أقدمها مباشرة للبيع.
        </p>
        <div className="w-20 h-1 bg-primary-500 mx-auto rounded-full"></div>
      </div>

      {/* Category Tabs */}
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

      {/* Products Grid Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <Skeleton variant="card" count={4} />
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              {/* Product Image */}
              <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-950">
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=500&auto=format&fit=crop&q=60'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                  <span className={`
                    px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-sm text-white
                    ${product.status === 'متوفر' ? 'bg-emerald-500' : product.status === 'طلب مسبق' ? 'bg-amber-500' : 'bg-rose-500'}
                  `}>
                    {product.status}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-primary-500" />
                    <span>{product.category}</span>
                  </span>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary-500 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-slate-400 dark:text-slate-500">السعر:</span>
                    <span className="text-lg font-black text-primary-600 dark:text-primary-400 ml-1">
                      {product.price}$
                    </span>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      title="عرض التفاصيل"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      disabled={product.status === 'غير متوفر' || orderingProduct === product.id}
                      onClick={() => handleOrderNow(product)}
                      className="px-3.5 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 disabled:dark:bg-slate-800 disabled:text-slate-400 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>{orderingProduct === product.id ? 'جاري الطلب...' : 'اطلب الآن'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-slate-500 dark:text-slate-400">
            <AlertCircle className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-lg font-bold">لا يوجد منتجات معروضة حالياً في هذا القسم.</p>
          </div>
        )}
      </div>

      {/* Product Details Modal Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Content container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-3xl bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/40 text-white hover:bg-slate-900/60 md:bg-white md:dark:bg-dark-bg md:text-slate-600 md:dark:text-slate-400 md:hover:bg-slate-100 md:border md:border-slate-200 md:dark:border-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Product Image */}
              <div className="w-full md:w-1/2 h-64 md:h-auto bg-slate-100 dark:bg-slate-950 relative">
                <img
                  src={selectedProduct.image || 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=500&auto=format&fit=crop&q=60'}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Meta details */}
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-primary-500/10 text-primary-600 dark:text-primary-400">
                      {selectedProduct.category}
                    </span>
                    <span className={`
                      px-2.5 py-1 rounded-lg text-[10px] font-bold text-white
                      ${selectedProduct.status === 'متوفر' ? 'bg-emerald-500' : selectedProduct.status === 'طلب مسبق' ? 'bg-amber-500' : 'bg-rose-500'}
                    `}>
                      {selectedProduct.status}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    {selectedProduct.name}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500">القيمة المالية</span>
                    <span className="text-2xl font-black text-primary-600 dark:text-primary-400">
                      {selectedProduct.price}$
                    </span>
                  </div>

                  <button
                    disabled={selectedProduct.status === 'غير متوفر' || orderingProduct === selectedProduct.id}
                    onClick={() => {
                      const prod = selectedProduct;
                      setSelectedProduct(null);
                      handleOrderNow(prod);
                    }}
                    className="px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 disabled:dark:bg-slate-800 disabled:text-slate-400 text-white font-bold transition-all flex items-center gap-2 shadow-md shadow-primary-500/20"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>اطلب الآن</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Store;
