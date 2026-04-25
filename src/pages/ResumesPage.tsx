import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, FileText } from 'lucide-react';
import { useResumeStore } from '../store/resumeStore';
import { resumeApi } from '../api/resume';
import { ResumeCard } from '../components/dashboard/ResumeCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { EmptyState, ResumeCardSkeleton } from '../components/ui/Loader';
import { Modal } from '../components/ui/Modal';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { MOCK_RESUMES } from '../utils/helpers';
import type { Resume } from '../types';
import toast from 'react-hot-toast';

export const ResumesPage: React.FC = () => {
  const { resumes, setResumes, addResume, deleteResume, isLoading, setLoading } = useResumeStore();
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
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
        setResumes(MOCK_RESUMES as Resume[]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = resumes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.profileInfo?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    r.profileInfo?.designation?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const resume = await resumeApi.create(newTitle.trim());
      addResume(resume);
      const id = resume._id || resume.id;
      setCreateModal(false);
      setNewTitle('');
      navigate(`/resume/${id}`);
    } catch {
      const mock: Resume = {
        _id: `mock-${Date.now()}`,
        userId: user?.id || '',
        title: newTitle.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        workExperience: [], education: [], skills: [],
        projects: [], certifications: [], languages: [], interests: [],
        profileInfo: {}, contactInfo: {},
      };
      addResume(mock);
      setCreateModal(false);
      setNewTitle('');
      navigate(`/resume/${mock._id}`);
    } finally {
      setCreating(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try { await resumeApi.delete(deleteId); } catch { /* swallow */ }
    deleteResume(deleteId);
    toast.success('Resume deleted.');
    setDeleteId(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="font-display text-3xl font-semibold text-gray-900">My Resumes</h1>
          <p className="text-gray-500 mt-1">{resumes.length} resume{resumes.length !== 1 ? 's' : ''} in your workspace</p>
        </div>
        <Button
          onClick={() => setCreateModal(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          New resume
        </Button>
      </motion.div>

      {/* Search */}
      {resumes.length > 3 && (
        <div className="mb-6 max-w-sm">
          <Input
            placeholder="Search resumes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftElement={<Search className="w-4 h-4" />}
          />
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(6)].map((_, i) => <ResumeCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 && search ? (
        <EmptyState
          icon={<Search className="w-8 h-8" />}
          title="No results found"
          description={`No resumes match "${search}". Try a different search.`}
          action={<Button variant="ghost" onClick={() => setSearch('')}>Clear search</Button>}
        />
      ) : resumes.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<FileText className="w-8 h-8" />}
            title="No resumes yet"
            description="Create your first resume and start building your career identity today."
            action={
              <Button onClick={() => setCreateModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
                Create first resume
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setCreateModal(true)}
            className="card border-2 border-dashed border-gray-200 hover:border-primary-300 hover:bg-primary-50/20 transition-all duration-200 flex flex-col items-center justify-center gap-3 py-12 cursor-pointer group min-h-[240px]"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
              <Plus className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
            </div>
            <span className="text-sm font-medium text-gray-400 group-hover:text-primary-600 transition-colors">
              New resume
            </span>
          </motion.button>
          {filtered.map((resume, i) => (
            <ResumeCard
              key={resume._id || resume.id}
              resume={resume}
              onDelete={setDeleteId}
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

      {/* Delete Modal */}
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
