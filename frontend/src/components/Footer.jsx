import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, RefreshCw, Truck, Tag, PhoneCall, Mail, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 pt-12 pb-8 border-t-4 border-[#0F8A5F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Propositions / Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-800">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">DMart Daily Discounts</h4>
              <p className="text-xs text-slate-400 mt-1">Guaranteed lower prices than traditional retail MRP on every item.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-800">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Pickup or Home Delivery</h4>
              <p className="text-xs text-slate-400 mt-1">Scheduled time slots at DMart Ready pickup points or doorstep delivery.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-800">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">7-Day Easy Returns</h4>
              <p className="text-xs text-slate-400 mt-1">Hassle-free return and exchange requests processed directly via our portal.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-800">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Quality Assured</h4>
              <p className="text-xs text-slate-400 mt-1">Farm-fresh produce and hygienically packed staples with strict expiry checks.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#0F8A5F] flex items-center justify-center text-white font-black text-lg">
                D
              </div>
              <span className="text-xl font-black text-white">
                mini <span className="text-[#10b981]">D•Mart</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Your one-stop supermarket for daily household groceries, dairy, fresh farm vegetables, staples, and personal care at genuine discounted DMart prices.
            </p>
            <div className="mt-4 flex items-center space-x-3 text-xs text-slate-400">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#10b981]" /> 50+ Hubs in Mumbai</span>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Top Categories</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/products?category=1" className="hover:text-white transition-colors">Fruits & Vegetables</Link></li>
              <li><Link to="/products?category=2" className="hover:text-white transition-colors">Dairy, Bakery & Eggs</Link></li>
              <li><Link to="/products?category=3" className="hover:text-white transition-colors">Staples, Rice & Dals</Link></li>
              <li><Link to="/products?category=4" className="hover:text-white transition-colors">Snacks & Beverages</Link></li>
              <li><Link to="/products?category=5" className="hover:text-white transition-colors">Personal Care & Grooming</Link></li>
              <li><Link to="/products?category=6" className="hover:text-white transition-colors">Household Cleaning</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Account & Support</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/my-orders" className="hover:text-white transition-colors">Track Orders</Link></li>
              <li><Link to="/my-orders" className="hover:text-white transition-colors">Return & Exchange Status</Link></li>
              <li><Link to="/staff/dashboard" className="hover:text-white transition-colors text-amber-400">Staff Portal (Store Operations)</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-white transition-colors text-purple-400">Admin Portal (Analytics & Inventory)</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Test Account Credentials</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Customer Care</h5>
            <div className="space-y-3 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#10b981]" />
                <span>1800 209 8888 (Toll Free: 8 AM - 8 PM)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#10b981]" />
                <span>support@minidmart.com</span>
              </p>
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 mt-2">
                <p className="text-[11px] text-amber-300 font-semibold">⚡ Need instant help with your delivery?</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Contact the store manager directly through your order tracking screen.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2">
          <p>© 2026 Mini D-Mart Retail Application. Built for practical full stack assessment.</p>
          <p className="flex items-center gap-1">
            <span>Engineered with Java 21 Spring Boot + MySQL + React</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
