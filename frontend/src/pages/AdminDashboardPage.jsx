import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Store,
  Layers,
  Search,
  Save,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [slots, setSlots] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'inventory', 'slots', 'users'

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    imageUrl: '',
    categoryId: '',
    brand: '',
    mrp: '',
    price: '',
    unit: '',
    stockQuantity: 20,
    isPerishable: false,
    shelfLife: '6 Months',
    isActive: true,
  });

  // Slot Modal State
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [slotForm, setSlotForm] = useState({
    storeName: 'DMart Ready - Powai Hub',
    storeAddress: 'Sector 14, Main Avenue',
    slotDate: new Date().toISOString().split('T')[0],
    startTime: '10:00:00',
    endTime: '12:00:00',
    maxCapacity: 10,
  });

  // Inline stock edit map
  const [stockEdits, setStockEdits] = useState({});

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, catRes, slotsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/products/all'),
        api.get('/categories'),
        api.get('/slots'),
        api.get('/admin/users'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (prodRes.data.success) setProducts(prodRes.data.data);
      if (catRes.data.success) setCategories(catRes.data.data);
      if (slotsRes.data.success) setSlots(slotsRes.data.data);
      if (usersRes.data.success) setUsersList(usersRes.data.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleStockUpdate = async (productId) => {
    const newQty = stockEdits[productId];
    if (newQty === undefined) return;

    try {
      const res = await api.patch(`/products/${productId}/stock`, { stockQuantity: Number(newQty) });
      if (res.data.success) {
        toast.success('Stock quantity updated successfully');
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, stockQuantity: Number(newQty) } : p))
        );
        const next = { ...stockEdits };
        delete next[productId];
        setStockEdits(next);
      }
    } catch (err) {
      toast.error('Failed to update stock');
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const res = await api.put(`/products/${editingProduct.id}`, productForm);
        if (res.data.success) {
          toast.success('Product updated successfully');
          setIsProductModalOpen(false);
          fetchAdminData();
        }
      } else {
        const res = await api.post('/products', productForm);
        if (res.data.success) {
          toast.success('New product created successfully');
          setIsProductModalOpen(false);
          fetchAdminData();
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save product';
      toast.error(msg);
    }
  };

  const handleSaveSlot = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/slots', slotForm);
      if (res.data.success) {
        toast.success('Pickup slot added successfully');
        setIsSlotModalOpen(false);
        fetchAdminData();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create slot';
      toast.error(msg);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        toast.success(`User role updated to ${newRole}`);
        setUsersList((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      toast.error('Failed to update user role');
    }
  };

  const openCreateProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60',
      categoryId: categories[0]?.id || '',
      brand: 'DMart Fresh',
      mrp: '100.00',
      price: '79.00',
      unit: '1 kg',
      stockQuantity: 50,
      isPerishable: false,
      shelfLife: '6 Months',
      isActive: true,
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      categoryId: product.category?.id || '',
      brand: product.brand || '',
      mrp: product.mrp,
      price: product.price,
      unit: product.unit,
      stockQuantity: product.stockQuantity,
      isPerishable: product.isPerishable || false,
      shelfLife: product.shelfLife || '',
      isActive: product.isActive,
    });
    setIsProductModalOpen(true);
  };

  const COLORS = ['#0F8A5F', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-purple-300 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Executive Admin Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            DMart Store Analytics & Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time revenue metrics, inventory replenishment, pickup slots & RBAC permissions
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'inventory', label: 'Inventory' },
            { id: 'products', label: 'Products' },
            { id: 'slots', label: 'Slots' },
            { id: 'users', label: 'Users & Roles' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sales</p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  ₹{stats?.totalRevenue ? Number(stats.totalRevenue).toFixed(0) : '0'}
                </p>
                <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> ₹{stats?.revenueToday ? Number(stats.revenueToday).toFixed(0) : '0'} today
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0F8A5F] flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {stats?.totalOrders || 0}
                </p>
                <p className="text-[11px] font-semibold text-slate-500 mt-1">
                  {stats?.ordersToday || 0} placed today
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Customers</p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {stats?.totalCustomers || 0}
                </p>
                <p className="text-[11px] font-semibold text-purple-600 mt-1">
                  Verified Accounts
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock Warnings</p>
                <p className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">
                  {stats?.lowStockCount || 0} Items
                </p>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className="text-[11px] font-extrabold text-rose-600 hover:underline mt-1 block"
                >
                  Restock immediately →
                </button>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Sales Chart */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">7-Day Sales Trend (₹)</h3>
                  <p className="text-xs text-slate-400">Daily store & delivery revenue</p>
                </div>
                <span className="bg-emerald-50 text-[#0F8A5F] text-xs font-bold px-2.5 py-1 rounded-lg">
                  Live Sync
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.dailySalesChart || []}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F8A5F" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0F8A5F" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(val) => [`₹${Number(val).toFixed(0)}`, 'Revenue']}
                      contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700 }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#0F8A5F" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Share */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm">Category Sales Share</h3>
              <p className="text-xs text-slate-400">Distribution across grocery aisles</p>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.topSellingCategories || []}
                      dataKey="percentage"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={65}
                      innerRadius={40}
                      paddingAngle={3}
                    >
                      {(stats?.topSellingCategories || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => [`${val}%`, 'Share']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                {(stats?.topSellingCategories || []).map((cat, i) => (
                  <div key={cat.category} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="truncate max-w-[130px]">{cat.category}</span>
                    </span>
                    <span className="font-bold text-slate-900">{cat.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INVENTORY REPLENISHMENT TAB */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-slate-900 text-lg">Inventory & Stock Control</h3>
              <p className="text-xs text-slate-500">Live warehouse quantities with inline quick-replenish controls</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price / MRP</th>
                  <th className="p-3.5">Current Stock</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {products.map((p) => {
                  const currentStock = p.stockQuantity;
                  const isLow = currentStock <= 5;
                  const editVal = stockEdits[p.id] !== undefined ? stockEdits[p.id] : currentStock;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={p.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60'}
                          alt={p.name}
                          className="w-10 h-10 object-contain rounded-lg bg-slate-100 p-1"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{p.name}</p>
                          <p className="text-[11px] text-slate-400">{p.unit} • {p.brand}</p>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-600">{p.category?.name}</td>
                      <td className="p-3.5 font-bold text-slate-900">
                        ₹{Number(p.price).toFixed(0)} <span className="text-[10px] text-slate-400 line-through">₹{Number(p.mrp).toFixed(0)}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-black text-sm">{currentStock}</span> units
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                            currentStock === 0
                              ? 'bg-rose-100 text-rose-700'
                              : isLow
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {currentStock === 0 ? 'Out of Stock' : isLow ? 'Low Stock' : 'Optimal'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={editVal}
                            onChange={(e) =>
                              setStockEdits({ ...stockEdits, [p.id]: parseInt(e.target.value) || 0 })
                            }
                            className="w-20 bg-slate-100 border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-center"
                          />
                          {stockEdits[p.id] !== undefined && stockEdits[p.id] !== currentStock && (
                            <button
                              onClick={() => handleStockUpdate(p.id)}
                              className="bg-[#0F8A5F] hover:bg-[#085037] text-white p-1.5 rounded-lg shadow-sm"
                              title="Save stock"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-slate-900 text-lg">Product Catalog Management</h3>
              <p className="text-xs text-slate-500">Create, edit, or adjust grocery pricing, unit sizes and categories</p>
            </div>
            <button
              onClick={openCreateProductModal}
              className="bg-[#0F8A5F] hover:bg-[#085037] text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Grocery Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4 flex items-center justify-between gap-3 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={p.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60'}
                    alt={p.name}
                    className="w-12 h-12 object-contain bg-white rounded-xl p-1 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-xs truncate">{p.name}</h4>
                    <p className="text-[11px] text-slate-400">{p.unit} • ₹{Number(p.price).toFixed(0)}</p>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/60 px-1.5 rounded">
                      {p.category?.name}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openEditProductModal(p)}
                  className="p-2 bg-white border border-slate-200 hover:bg-purple-50 hover:border-purple-300 text-slate-600 hover:text-purple-700 rounded-xl transition-colors shrink-0"
                  title="Edit product"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SLOTS TAB */}
      {activeTab === 'slots' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-slate-900 text-lg">Store Pickup Slots & Capacity</h3>
              <p className="text-xs text-slate-500">Configure pickup hubs, collection hours, and max customer slots per hour</p>
            </div>
            <button
              onClick={() => setIsSlotModalOpen(true)}
              className="bg-[#0F8A5F] hover:bg-[#085037] text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Pickup Slot</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {slots.map((slot) => {
              const booked = slot.bookedCount;
              const cap = slot.maxCapacity;
              const isFull = booked >= cap;

              return (
                <div
                  key={slot.id}
                  className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-slate-900 text-xs truncate max-w-[180px]">{slot.storeName}</h4>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        isFull ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {booked} / {cap} Booked
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#0F8A5F]" />
                    <span>{slot.slotDate}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5 text-[#0F8A5F]" />
                    <span>{slot.startTime} - {slot.endTime}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* USERS & ROLES TAB */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 animate-in fade-in">
          <div>
            <h3 className="font-black text-slate-900 text-lg">User Accounts & Role Permissions (RBAC)</h3>
            <p className="text-xs text-slate-500">Manage customer accounts, grant store staff privileges or admin access</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase">
                <tr>
                  <th className="p-3.5">Full Name</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Phone / Pincode</th>
                  <th className="p-3.5">Current Role</th>
                  <th className="p-3.5 text-right">Switch Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">{u.fullName}</td>
                    <td className="p-3.5 text-slate-600">{u.email}</td>
                    <td className="p-3.5 text-slate-500">{u.phone || 'N/A'} ({u.pincode || '400076'})</td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                          u.role === 'ROLE_ADMIN'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'ROLE_STAFF'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none"
                      >
                        <option value="ROLE_CUSTOMER">CUSTOMER</option>
                        <option value="ROLE_STAFF">STAFF</option>
                        <option value="ROLE_ADMIN">ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Create/Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
          <div onClick={() => setIsProductModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-black text-slate-900 text-base">
                  {editingProduct ? 'Edit Grocery Item' : 'Create New Grocery Item'}
                </h3>
                <button onClick={() => setIsProductModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category *</label>
                    <select
                      required
                      value={productForm.categoryId}
                      onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Brand Name</label>
                    <input
                      type="text"
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">MRP (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={productForm.mrp}
                      onChange={(e) => setProductForm({ ...productForm, mrp: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">DMart Price (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pack Size / Unit *</label>
                    <input
                      type="text"
                      placeholder="e.g. 1 kg, 500 g"
                      required
                      value={productForm.unit}
                      onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Warehouse Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      value={productForm.stockQuantity}
                      onChange={(e) => setProductForm({ ...productForm, stockQuantity: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Shelf Life</label>
                    <input
                      type="text"
                      placeholder="e.g. 7 Days, 6 Months"
                      value={productForm.shelfLife}
                      onChange={(e) => setProductForm({ ...productForm, shelfLife: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={productForm.isPerishable}
                      onChange={(e) => setProductForm({ ...productForm, isPerishable: e.target.checked })}
                      className="w-4 h-4 text-[#0F8A5F] rounded"
                    />
                    <span>Farm Fresh / Perishable Item</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#0F8A5F] hover:bg-[#085037] text-white font-extrabold py-3 rounded-xl shadow-md"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Slot Modal */}
      {isSlotModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
          <div onClick={() => setIsSlotModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-black text-slate-900 text-base">Add Store Pickup Slot</h3>
                <button onClick={() => setIsSlotModalOpen(false)} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSlot} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Store Name *</label>
                  <input
                    type="text"
                    required
                    value={slotForm.storeName}
                    onChange={(e) => setSlotForm({ ...slotForm, storeName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Slot Date *</label>
                  <input
                    type="date"
                    required
                    value={slotForm.slotDate}
                    onChange={(e) => setSlotForm({ ...slotForm, slotDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Start Time *</label>
                    <input
                      type="text"
                      placeholder="10:00:00"
                      required
                      value={slotForm.startTime}
                      onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">End Time *</label>
                    <input
                      type="text"
                      placeholder="12:00:00"
                      required
                      value={slotForm.endTime}
                      onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Order Capacity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={slotForm.maxCapacity}
                    onChange={(e) => setSlotForm({ ...slotForm, maxCapacity: parseInt(e.target.value) || 10 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsSlotModalOpen(false)}
                    className="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#0F8A5F] hover:bg-[#085037] text-white font-extrabold py-3 rounded-xl shadow-md"
                  >
                    Add Slot
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
