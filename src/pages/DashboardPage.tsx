import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, Plus, TrendingUp, ArrowRight, Eye, Star,
  Calendar
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useResumeStore } from '../store/resumeStore';
import { resumeApi } from '../api/resume';
import { ResumeCard } from '../components/dashboard/ResumeCard';
import { Button } from '../components/ui/Button';
import { EmptyState, StatCardSkeleton, ResumeCardSkeleton } from '../components/ui/Loader';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { MOCK_RESUMES } from '../utils/helpers';
import toast from 'react-hot-toast';
import type { Resume } from '../types';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { resumes, setResumes, addResume, deleteResume, isLoading, setLoading } = useResumeStore();
  const [createModal, setCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await resumeApi.getAll();
        setResumes(data);
      } catch {
        // Fallback to mock data for demo
        setResumes(MOCK_RESUMES as Resume[]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const resume = await resumeApi.create(newTitle.trim());
      addResume(resume);
      setCreateModal(false);
      setNewTitle('');
      toast.success('Resume created!');
      navigate(`/resume/${resume._id || resume.id}`);
    } catch {
      // Mock creation for demo
      const mockResume: Resume = {
        _id: `mock-${Date.now()}`,
        userId: user?.id || '',
        title: newTitle.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        workExperience: [], education: [], skills: [], projects: [],
        certifications: [], languages: [], interests: [],
        profileInfo: {}, contactInfo: {},
      };
      addResume(mockResume);
      setCreateModal(false);
      setNewTitle('');
      toast.success('Resume created!');
      navigate(`/resume/${mockResume._id}`);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await resumeApi.delete(deleteId);
    } catch { /* swallow */ }
    deleteResume(deleteId);
    toast.success('Resume deleted.');
    setDeleteId(null);
  };

  const stats = [
    { label: 'Total Resumes', value: resumes.length, icon: <FileText className="w-5 h-5" />, color: 'text-primary-600 bg-primary-50' },
    { label: 'Plan', value: user?.subscriptionPlan || 'Basic', icon: <Star className="w-5 h-5" />, color: 'text-primary-600 bg-primary-50' },
    { label: 'Last Updated', value: resumes[0] ? new Date(resumes[0].updatedAt || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—', icon: <Calendar className="w-5 h-5" />, color: 'text-primary-600 bg-primary-50' },
    { label: 'Templates Used', value: new Set(resumes.map(r => r.template?.theme || 'default')).size, icon: <TrendingUp className="w-5 h-5" />, color: 'text-primary-600 bg-primary-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="font-display text-3xl font-semibold text-gray-900">
            Good {getGreeting()}, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-500 mt-1">Here's your resume workspace.</p>
        </div>
        <Button
          onClick={() => setCreateModal(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          size="md"
        >
          New resume
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {isLoading
          ? [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
          : stats.map((s) => (
            <motion.div key={s.label} variants={item} className="card p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                {s.icon}
              </div>
              <p className="font-display text-2xl font-semibold text-gray-900 capitalize">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </motion.div>
          ))
        }
      </motion.div>

      {/* Premium CTA for Basic users */}
      {user?.subscriptionPlan !== 'premium' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative mb-8 p-5 rounded-2xl overflow-hidden border border-primary-100 bg-gradient-to-r from-primary-50 via-violet-50 to-purple-50"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Unlock Premium Features</p>
                <p className="text-sm text-gray-500 mt-0.5">Get all templates, unlimited resumes, and priority support.</p>
              </div>
            </div>
            <Link to="/dashboard/billing">
              <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Upgrade - $9.99
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Resumes Grid */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-gray-900">My Resumes</h2>
        {resumes.length > 0 && (
          <Link to="/dashboard/resumes" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => <ResumeCardSkeleton key={i} />)}
        </div>
      ) : resumes.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<FileText className="w-8 h-8" />}
            title="No resumes yet"
            description="Create your first resume and start building your career identity."
            action={
              <Button onClick={() => setCreateModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
                Create first resume
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {/* Add new card */}
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setCreateModal(true)}
            className="card border-2 border-dashed border-gray-200 hover:border-primary-300 hover:bg-primary-50/30 transition-all duration-300 flex flex-col items-center justify-center gap-3 py-12 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
              <Plus className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
            </div>
            <span className="text-sm font-medium text-gray-400 group-hover:text-primary-600 transition-colors">
              New resume
            </span>
          </motion.button>

          {resumes.slice(0, 7).map((resume, i) => (
            <ResumeCard
              key={resume._id || resume.id}
              resume={resume}
              onDelete={handleDelete}
              index={i}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={createModal}
        onClose={() => { setCreateModal(false); setNewTitle(''); }}
        title="Create new resume"
        description="Give your resume a title to get started"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Resume title"
            placeholder="e.g. Software Engineer Resume"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => { setCreateModal(false); setNewTitle(''); }}>
              Cancel
            </Button>
            <Button onClick={handleCreate} isLoading={creating} disabled={!newTitle.trim()}>
              Create resume
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete resume?"
        description="This action cannot be undone."
        size="sm"
      >
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}
