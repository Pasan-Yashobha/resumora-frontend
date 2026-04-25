import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiFileTextLine, RiMenuLine, RiCloseLine, RiLogoutBoxLine, RiUserLine, RiLayoutGridLine, RiArrowDownSLine
} from 'react-icons/ri';
import { useAuthStore } from '../../store/authStore';
import { Avatar } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cn } from '../../utils/helpers';
import { Star } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => { clearAuth(); navigate('/'); setDropdownOpen(false); };

  return (
    <header className={cn('fixed top-0 left-0 right-0 z-40 transition-all duration-300', scrolled ? 'glass shadow-glass border-b border-white/60 py-3' : 'bg-transparent py-4')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center shadow-md group-hover:shadow-glow transition-shadow duration-300">
              <RiFileTextLine className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl font-semibold text-gray-900 tracking-tight">Resumora</span>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={cn('flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors', location.pathname.startsWith('/dashboard') ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100')}>
                  <RiLayoutGridLine className="w-4 h-4" /> Dashboard
                </Link>
                <div className="relative">
                  <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors">
                    <Avatar name={user?.name || 'User'} imageUrl={user?.profileImageUrl} size="sm" />
                    <span className="text-sm font-medium text-gray-700 max-w-24 truncate">{user?.name}</span>
                    <RiArrowDownSLine className={cn('w-4 h-4 text-gray-400 transition-transform', dropdownOpen && 'rotate-180')} />
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                        <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.15 }} className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 overflow-hidden">
                          <div className="px-4 py-3 border-b border-gray-50">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                          </div>
                          <div className="p-1.5">
                            <Link to="/dashboard/settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                              <RiUserLine className="w-4 h-4" /> Profile & Settings
                            </Link>
                            <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors">
                              <RiLogoutBoxLine className="w-4 h-4" /> Sign out
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
                <Link to="/register"><Button size="sm" leftIcon={<Star className="w-3.5 h-3.5" />}>Get started free</Button></Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <RiCloseLine className="w-5 h-5" /> : <RiMenuLine className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden overflow-hidden bg-white border-t border-gray-100">
            <div className="px-4 py-4 flex flex-col gap-1">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"><RiLayoutGridLine className="w-4 h-4" /> Dashboard</Link>
                  <Link to="/dashboard/settings" className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"><RiUserLine className="w-4 h-4" /> Settings</Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 mt-1"><RiLogoutBoxLine className="w-4 h-4" /> Sign out</button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link to="/login" className="w-full"><Button variant="outline" size="md" className="w-full">Sign in</Button></Link>
                  <Link to="/register" className="w-full"><Button size="md" className="w-full">Get started free</Button></Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
