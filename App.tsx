
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { INITIAL_PRODUCTS } from './constants';
import { Product, ViewType, User } from './types';
import Sidebar from './components/Sidebar';
import InventoryTable from './components/InventoryTable';
import DashboardCharts from './components/DashboardCharts';
import SmartAssistant from './components/SmartAssistant';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [user, setUser] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Auth Form State
  const [authData, setAuthData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  // Modal Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    stock: ''
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const themeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (isAuthenticated && contentRef.current) {
      gsap.fromTo(contentRef.current, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, [isAuthenticated, currentView]);

  const toggleTheme = () => {
    if (themeBtnRef.current) {
      gsap.to(themeBtnRef.current, {
        rotate: theme === 'light' ? 360 : -360,
        duration: 0.5,
        ease: "back.out(1.7)",
        onComplete: () => {
          gsap.set(themeBtnRef.current, { rotate: 0 });
        }
      });
    }
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ 
      id: '1', 
      name: authData.fullName || 'Admin User', 
      email: authData.email || 'admin@jz9.com', 
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authData.email || 'Admin'}` 
    });
    setIsAuthenticated(true);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ 
      id: Date.now().toString(), 
      name: authData.fullName, 
      email: authData.email, 
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authData.fullName}` 
    });
    setIsAuthenticated(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const stockNum = parseInt(newProduct.stock);
    const priceNum = parseFloat(newProduct.price);
    
    const item: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      category: newProduct.category,
      stock: stockNum,
      price: priceNum,
      sku: `${newProduct.category.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
      status: stockNum === 0 ? 'Out of Stock' : stockNum < 10 ? 'Low Stock' : 'In Stock',
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    setProducts(prev => [item, ...prev]);
    setIsAddModalOpen(false);
    setNewProduct({ name: '', category: 'Electronics', price: '', stock: '' });
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  // Dynamic Stats
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const lowStockCount = products.filter(p => p.status === 'Low Stock').length;
  const outOfStockCount = products.filter(p => p.status === 'Out of Stock').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
        
        <div className="w-full max-w-md bg-white dark:bg-zinc-900/50 backdrop-blur-xl p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl z-10">
          <div className="text-center mb-10">
            <h1 className="text-6xl font-black text-indigo-600 mb-6 tracking-tighter">JZ9</h1>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">{isRegistering ? 'Join JZ9' : 'Welcome Back'}</h1>
            <p className="text-zinc-500 dark:text-zinc-500">{isRegistering ? 'Create your profile to start' : 'Enter your credentials'}</p>
          </div>

          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-6">
            {isRegistering && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Full Name</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. Alexander JZ" 
                  value={authData.fullName}
                  onChange={e => setAuthData({...authData, fullName: e.target.value})}
                  className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-zinc-900 dark:text-white" 
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Email Address</label>
              <input 
                required 
                type="email" 
                placeholder="you@company.com" 
                value={authData.email}
                onChange={e => setAuthData({...authData, email: e.target.value})}
                className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-zinc-900 dark:text-white" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Password</label>
              <input 
                required 
                type="password" 
                placeholder="••••••••" 
                value={authData.password}
                onChange={e => setAuthData({...authData, password: e.target.value})}
                className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-zinc-900 dark:text-white" 
              />
            </div>
            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]">
              {isRegistering ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
            >
              {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        onLogout={() => setIsAuthenticated(false)} 
        user={user}
      />
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-8 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-20 transition-colors duration-300">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 capitalize">{currentView}</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <input 
                type="text" 
                placeholder="Search assets..." 
                className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full px-5 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 w-64 transition-all" 
              />
              <svg className="w-4 h-4 text-zinc-400 dark:text-zinc-500 absolute right-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>

            <button 
              ref={themeBtnRef}
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"/></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
              )}
            </button>
            
            <button className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-white dark:ring-zinc-950"></span>
            </button>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{user?.name}</p>
                <p className="text-xs text-zinc-500">Inventory Lead</p>
              </div>
              <img src={user?.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm" />
            </div>
          </div>
        </header>

        <div className="p-8 overflow-y-auto" ref={contentRef}>
          {currentView === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Stock', value: totalStock.toLocaleString(), change: '+12%', color: 'indigo' },
                  { label: 'Asset Value', value: `$${(totalValue / 1000).toFixed(1)}k`, change: '+8%', color: 'emerald' },
                  { label: 'Low Stock', value: lowStockCount, change: `-5%`, color: 'amber' },
                  { label: 'Out of Stock', value: outOfStockCount, change: '0%', color: 'rose' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm group">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-sm font-medium text-zinc-500">{stat.label}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${stat.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : stat.change === '0%' ? 'bg-zinc-500/10 text-zinc-500' : 'bg-rose-500/10 text-rose-500'}`}>
                        {stat.change}
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{stat.value}</div>
                  </div>
                ))}
              </div>

              <SmartAssistant products={products} />
              <DashboardCharts />
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Recent Activity</h3>
                <button onClick={() => setCurrentView('inventory')} className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">View All &rarr;</button>
              </div>
              <InventoryTable products={products.slice(0, 5)} onDelete={handleDeleteProduct} />
            </>
          )}

          {currentView === 'inventory' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Master Inventory</h3>
                  <p className="text-sm text-zinc-500">Manage {products.length} distinct assets</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                   <button onClick={() => setIsAddModalOpen(true)} className="flex-1 sm:flex-none px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                     Add Item
                   </button>
                </div>
              </div>
              <InventoryTable products={products} onDelete={handleDeleteProduct} />
            </div>
          )}

          {currentView === 'analytics' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-center">
                  <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Deep Insights</h4>
                  <p className="text-zinc-500">Advanced forecasting coming soon for JZ9.</p>
                </div>
                <div className="bg-indigo-600/5 p-8 rounded-2xl border border-indigo-500/20 text-center">
                  <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Smart Predictions</h4>
                  <p className="text-zinc-600 dark:text-zinc-300">Predicting trends based on {products.length} items.</p>
                </div>
              </div>
            </div>
          )}

          {currentView === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-6">
               <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-8">
                  <div className="relative">
                    <img src={user?.avatar} className="w-24 h-24 rounded-3xl border-4 border-white dark:border-zinc-800 shadow-xl" alt="Large Avatar" />
                    <button className="absolute -bottom-2 -right-2 bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-600/20">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    </button>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{user?.name}</h3>
                    <p className="text-zinc-500">{user?.email}</p>
                    <div className="mt-4 flex gap-2">
                       <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full border border-emerald-500/20 uppercase tracking-tighter">Verified Lead</span>
                       <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 text-xs font-bold rounded-full border border-indigo-500/20 uppercase tracking-tighter">Expert Level</span>
                    </div>
                  </div>
                  <div className="ml-auto flex-shrink-0 text-right">
                     <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Profile Strength</p>
                     <div className="w-32 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className="w-[85%] h-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                     </div>
                  </div>
               </div>

              <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-8">Personal Information</h3>
                <form onSubmit={handleUpdateProfile} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Display Name</label>
                      <input 
                        type="text" 
                        value={user?.name} 
                        onChange={(e) => setUser(prev => prev ? {...prev, name: e.target.value} : null)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Email Address</label>
                      <input 
                        type="email" 
                        value={user?.email} 
                        onChange={(e) => setUser(prev => prev ? {...prev, email: e.target.value} : null)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
                      />
                    </div>
                  </div>
                  <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                    <button type="submit" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-md">Update Profile</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Add New Asset</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-500">Product Name</label>
                <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-4 py-3 rounded-xl text-zinc-900 dark:text-white" placeholder="e.g. iPad Pro 12.9" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-500">Category</label>
                  <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-4 py-3 rounded-xl text-zinc-900 dark:text-white">
                    <option>Electronics</option>
                    <option>Furniture</option>
                    <option>Accessories</option>
                    <option>Software</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-500">Price ($)</label>
                  <input required type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-4 py-3 rounded-xl text-zinc-900 dark:text-white" placeholder="0.00" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-500">Initial Stock</label>
                <input required type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-4 py-3 rounded-xl text-zinc-900 dark:text-white" placeholder="0" />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-6 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20">Create Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
