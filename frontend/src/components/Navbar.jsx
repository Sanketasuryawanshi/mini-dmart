import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingCart,
  Search,
  User as UserIcon,
  LogOut,
  Package,
  ShieldCheck,
  Store,
  MapPin,
  Menu,
  X,
  ChevronDown,
  Clock,
  Sparkles,
  ClipboardList
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, isAdmin, isStaff } = useAuth();
  const { totalItemsCount, subtotal, openCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-100">
      {/* Top Utility Bar */}
      <div className="bg-[#085037] text-xs text-emerald-100 py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 font-medium">
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span>DMart Ready: <strong>Powai Hub & 45+ Store Pickup Centers</strong></span>
            </span>
            <span className="hidden md:inline-block text-emerald-300">•</span>
            <span className="hidden md:flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Express Delivery in <strong>2 Hours</strong> or Scheduled Pickup</span>
            </span>
          </div>
          <div className="flex items-center space-x-4 font-medium">
            <span className="text-amber-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Min. ₹100 Off on First 3 Orders</span>
            </span>
            {user && (
              <span className="hidden sm:inline-block bg-emerald-800/80 text-emerald-200 px-2 py-0.5 rounded text-[11px]">
                {user.role === 'ROLE_ADMIN' ? 'Admin Access' : user.role === 'ROLE_STAFF' ? 'Staff Access' : 'Verified Customer'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Location */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0F8A5F] to-[#10b981] flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                D
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                  mini <span className="text-[#0F8A5F]">D•Mart</span>
                </span>
                <span className="text-[10px] font-bold text-amber-600 tracking-wider uppercase mt-0.5">
                  Daily Lowest Prices
                </span>
              </div>
            </Link>

            {/* Delivery/Pickup Location Indicator */}
            <div className="hidden lg:flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs hover:border-emerald-500 cursor-pointer transition-colors">
              <MapPin className="w-4 h-4 text-[#0F8A5F]" />
              <div className="text-left">
                <p className="text-[10px] text-slate-500 font-semibold uppercase leading-none">Deliver / Pickup at</p>
                <p className="font-bold text-slate-800 truncate max-w-[140px]">Mumbai 400076</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search groceries (e.g. Basmati Rice, Milk, Mangoes, Detergent)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-800 text-sm pl-11 pr-24 py-2.5 rounded-xl border border-slate-200 focus:border-[#0F8A5F] focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#0F8A5F] hover:bg-[#085037] text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Navigation Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Quick Catalog link */}
            <Link
              to="/products"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                location.pathname === '/products'
                  ? 'bg-emerald-50 text-[#0F8A5F]'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Store className="w-4 h-4 text-[#0F8A5F]" />
              <span>All Products</span>
            </Link>

            {/* Staff / Admin Dashboard shortcut links */}
            {isStaff() && (
              <Link
                to="/staff/dashboard"
                className="hidden xl:flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
              >
                <ClipboardList className="w-4 h-4 text-amber-600" />
                <span>Staff Console</span>
              </Link>
            )}

            {isAdmin() && (
              <Link
                to="/admin/dashboard"
                className="hidden xl:flex items-center gap-1.5 bg-purple-50 border border-purple-200 text-purple-800 hover:bg-purple-100 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Admin Analytics</span>
              </Link>
            )}

            {/* User Account / Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#0F8A5F] flex items-center justify-center font-bold text-sm">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-800 leading-none truncate max-w-[100px]">
                      {user?.fullName?.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-slate-500 capitalize">
                      {user?.role?.replace('ROLE_', '').toLowerCase()}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div
                    onClick={() => setIsProfileOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 bg-emerald-50 text-[#0F8A5F] text-[10px] font-bold px-2 py-0.5 rounded">
                        {user?.role}
                      </span>
                    </div>

                    <Link
                      to="/my-orders"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <Package className="w-4 h-4 text-slate-500" />
                      <span>My Orders & Returns</span>
                    </Link>

                    {isStaff() && (
                      <Link
                        to="/staff/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 font-medium"
                      >
                        <ClipboardList className="w-4 h-4 text-amber-600" />
                        <span>Staff Preparation Queue</span>
                      </Link>
                    )}

                    {isAdmin() && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 font-medium"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        <span>Admin Management Portal</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-sm font-bold text-[#0F8A5F] hover:bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-300 transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2.5 bg-[#0F8A5F] hover:bg-[#085037] text-white px-4 py-2.5 rounded-xl shadow-sm transition-all duration-200 active:scale-95 group"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-amber-400 text-slate-900 text-[11px] font-black rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center ring-2 ring-white animate-bounce">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-[10px] uppercase font-semibold text-emerald-200">
                  {totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'}
                </span>
                <span className="text-sm font-extrabold">₹{subtotal.toFixed(0)}</span>
              </div>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search groceries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-sm pl-10 pr-20 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#0F8A5F]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#0F8A5F] text-white text-xs font-semibold px-3 py-1 rounded"
            >
              Go
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <Link
            to="/products"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 py-2 text-slate-700 font-semibold"
          >
            <Store className="w-5 h-5 text-[#0F8A5F]" />
            <span>Browse All Products</span>
          </Link>
          <Link
            to="/my-orders"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 py-2 text-slate-700 font-semibold"
          >
            <Package className="w-5 h-5 text-[#0F8A5F]" />
            <span>My Orders & Return History</span>
          </Link>
          {isStaff() && (
            <Link
              to="/staff/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 py-2 text-amber-700 font-semibold"
            >
              <ClipboardList className="w-5 h-5 text-amber-600" />
              <span>Staff Order Packing Console</span>
            </Link>
          )}
          {isAdmin() && (
            <Link
              to="/admin/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 py-2 text-purple-700 font-semibold"
            >
              <ShieldCheck className="w-5 h-5 text-purple-600" />
              <span>Admin Management Dashboard</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
