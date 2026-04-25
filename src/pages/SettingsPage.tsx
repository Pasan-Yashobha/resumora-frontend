import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, User, Lock, Bell, Trash2, Save, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/auth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Badge';
import toast from 'react-hot-toast';

type Tab = 'profile' | 'security' | 'notifications';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Lock className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account preferences.</p>
      </motion.div>

      {/* Tab Bar */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-8 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
      </motion.div>
    </div>
  );
};

// Profile Tab

const ProfileTab: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await authApi.uploadProfileImage(file);
      updateUser({ profileImageUrl: res.imageUrl });
      toast.success('Profile photo updated!');
    } catch {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600)); // Simulated save
    updateUser({ name: name.trim() });
    toast.success('Profile updated!');
    setSaving(false);
  };

  return (
    <div className="card p-6 flex flex-col gap-6">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <Avatar
            name={user?.name || 'User'}
            imageUrl={user?.profileImageUrl}
            size="xl"
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-md hover:bg-primary-700 transition-colors"
          >
            {uploading
              ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Camera className="w-3.5 h-3.5" />
            }
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
        <div>
          <p className="font-semibold text-gray-900">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <button
            onClick={() => fileRef.current?.click()}
            className="text-xs text-primary-600 hover:text-primary-700 mt-1 font-medium"
          >
            Change photo
          </button>
        </div>
      </div>

      <hr className="border-gray-100" />

      <div className="flex flex-col gap-4">
        <Input
          label="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
        />
        <Input
          label="Email address"
          value={email}
          disabled
          hint="Email cannot be changed after registration."
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} isLoading={saving} leftIcon={<Save className="w-4 h-4" />}>
          Save changes
        </Button>
      </div>
    </div>
  );
};

// Security Tab

const SecurityTab: React.FC = () => {
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPass !== form.confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    if (form.newPass.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setForm({ current: '', newPass: '', confirm: '' });
    toast.success('Password updated!');
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-1">Change password</h3>
        <p className="text-sm text-gray-500 mb-5">Choose a strong password of at least 6 characters.</p>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input
            label="Current password"
            type={show ? 'text' : 'password'}
            value={form.current}
            onChange={(e) => setForm({ ...form, current: e.target.value })}
            rightElement={
              <button type="button" onClick={() => setShow(!show)}>
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
          <Input
            label="New password"
            type={show ? 'text' : 'password'}
            value={form.newPass}
            onChange={(e) => setForm({ ...form, newPass: e.target.value })}
          />
          <Input
            label="Confirm new password"
            type={show ? 'text' : 'password'}
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />
          <div className="flex justify-end">
            <Button type="submit" isLoading={saving}>
              Update password
            </Button>
          </div>
        </form>
      </div>

      {/* Danger zone */}
      <div className="card p-6 border border-red-100">
        <h3 className="font-semibold text-red-700 mb-1">Danger zone</h3>
        <p className="text-sm text-gray-500 mb-4">
          Permanently delete your account and all associated data. This cannot be undone.
        </p>
        <Button
          variant="danger"
          size="sm"
          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          onClick={() => toast.error('Contact support to delete your account.')}
        >
          Delete account
        </Button>
      </div>
    </div>
  );
};

// Notifications Tab

const NotificationsTab: React.FC = () => {
  const [prefs, setPrefs] = useState({
    marketing: false,
    updates: true,
    tips: true,
    security: true,
  });

  const toggle = (key: keyof typeof prefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const items = [
    { key: 'security' as const, label: 'Security alerts', description: 'Get notified about login activity and security events.' },
    { key: 'updates' as const, label: 'Product updates', description: 'Learn about new features and improvements.' },
    { key: 'tips' as const, label: 'Resume tips', description: 'Receive tips to help improve your resume.' },
    { key: 'marketing' as const, label: 'Promotional emails', description: 'Deals, offers, and announcements from Resumora.' },
  ];

  return (
    <div className="card p-6 flex flex-col gap-1 divide-y divide-gray-50">
      {items.map((item) => (
        <div key={item.key} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
          <div>
            <p className="text-sm font-medium text-gray-900">{item.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
          </div>
          <button
            onClick={() => toggle(item.key)}
            className={`relative w-10 h-5.5 h-[22px] rounded-full transition-colors duration-200 shrink-0 mt-0.5 ${
              prefs[item.key] ? 'bg-primary-600' : 'bg-gray-200'
            }`}
            role="switch"
            aria-checked={prefs[item.key]}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                prefs[item.key] ? 'translate-x-[18px]' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      ))}
      <div className="pt-5">
        <Button onClick={() => toast.success('Preferences saved!')} size="sm">
          Save preferences
        </Button>
      </div>
    </div>
  );
};
