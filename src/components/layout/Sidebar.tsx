import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiFileTextLine, RiLayoutGridLine, RiPaletteLine, RiBankCardLine,
  RiSettings3Line, RiLogoutBoxLine, RiArrowLeftSLine, RiArrowRightSLine, RiMenuLine
} from 'react-icons/ri';
import { useAuthStore } from '../../store/authStore';
import { Avatar, Badge } from '../ui/Badge';
import { cn } from '../../utils/helpers';
import { Star } from 'lucide-react';

interface NavItem { to: string; icon: React.ReactNode; label: string; exact?: boolean; }

const navItems: NavItem[] = [
  { to: '/dashboard',           icon: <RiLayoutGridLine />, label: 'Overview',   exact: true },
  { to: '/dashboard/resumes',   icon: <RiFileTextLine />,   label: 'My Resumes' },
  { to: '/dashboard/templates', icon: <RiPaletteLine />,    label: 'Templates'  },
  { to: '/dashboard/billing',   icon: <RiBankCardLine />,   label: 'Billing'    },
  { to: '/dashboard/settings',  icon: <RiSettings3Line />,  label: 'Settings'   },
];

interface SidebarProps { mobileOpen?: boolean; onMobileClose?: () => void; }

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, clearAuth } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (item: NavItem) =>
    item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);

  const Content = () => (
    <div className={cn('flex flex-col h-full transition-all duration-300', collapsed ? 'w-16' : 'w-60')}>
      {/* Logo */}
      <div className={cn('flex items-center px-4 py-5 gap-3', collapsed && 'justify-center')}>
        <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center shadow-md shrink-0">
          <RiFileTextLine className="w-4 h-4 text-white" />
        </div>
        {!collapsed && <span className="font-display text-lg font-semibold text-gray-900 tracking-tight">Resumora</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.to} to={item.to} onClick={onMobileClose} title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative',
                collapsed && 'justify-center',
                active ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              {active && <motion.div layoutId="activeNavBg" className="absolute inset-0 bg-primary-50 rounded-xl" />}
              <span className={cn('relative z-10 shrink-0 text-lg', active ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-700')}>
                {item.icon}
              </span>
              {!collapsed && <span className="relative z-10">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade Banner */}
      {!collapsed && user?.subscriptionPlan !== 'premium' && (
        <div className="mx-3 mb-3 p-3.5 rounded-xl bg-gradient-to-br from-primary-50 to-violet-50 border border-primary-100">
          <div className="flex items-center gap-2 mb-1.5">
            <Star className="w-4 h-4 text-primary-600" />
            <span className="text-xs font-semibold text-primary-700">Upgrade to Premium</span>
          </div>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">Unlock all 10 templates and features.</p>
          <Link to="/dashboard/billing" className="block w-full text-center text-xs font-semibold py-1.5 px-3 rounded-lg gradient-bg text-white hover:brightness-110 transition-all">
            Upgrade now
          </Link>
        </div>
      )}

      {/* User footer */}
      <div className="px-2 pb-3 border-t border-gray-100 pt-2 mt-auto">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-default transition-colors group">
            <Avatar name={user?.name || 'User'} imageUrl={user?.profileImageUrl} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <Badge variant={user?.subscriptionPlan === 'premium' ? 'premium' : 'default'} size="sm">
                {user?.subscriptionPlan === 'premium' ? 'Premium' : 'Basic'}
              </Badge>
            </div>
            <button
              onClick={() => { clearAuth(); navigate('/'); }}
              className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
              title="Sign out"
            >
              <RiLogoutBoxLine className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => { clearAuth(); navigate('/'); }}
            className="w-full flex justify-center p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Sign out"
          >
            <RiLogoutBoxLine className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center text-gray-500 hover:text-gray-700 hover:shadow-md transition-all"
      >
        {collapsed ? <RiArrowRightSLine className="w-3 h-3" /> : <RiArrowLeftSLine className="w-3 h-3" />}
      </button>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block relative bg-white border-r border-gray-100 h-screen sticky top-0 shrink-0 overflow-visible">
        <Content />
      </aside>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-30" onClick={onMobileClose} />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 bg-white border-r border-gray-100 z-40 overflow-visible"
            >
              <Content />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export const DashboardTopBar: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const { user } = useAuthStore();
  return (
    <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <RiMenuLine className="w-5 h-5" />
        </button>
        <span className="font-display text-lg font-semibold text-gray-900">Resumora</span>
      </div>
      <Avatar name={user?.name || 'User'} imageUrl={user?.profileImageUrl} size="sm" />
    </div>
  );
};
