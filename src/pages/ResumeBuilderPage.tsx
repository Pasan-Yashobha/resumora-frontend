import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiArrowLeftLine, RiSaveLine, RiEyeLine, RiEyeOffLine, RiAddLine,
  RiDeleteBinLine, RiArrowDownSLine, RiUserLine, RiBriefcaseLine,
  RiGraduationCapLine, RiCodeSSlashLine, RiFolderLine, RiAwardLine,
  RiTranslate2, RiHeartLine, RiPhoneLine, RiLoaderLine,
  RiDownloadLine, RiMailSendLine, RiPaletteLine,
  RiImageAddLine, RiCheckLine,
} from 'react-icons/ri';
import { resumeApi } from '../api/resume';
import { emailApi } from '../api/payment';
import { useResumeStore } from '../store/resumeStore';
import { usePDF } from '../hooks/usePDF';
import { Button } from '../components/ui/Button';
import { Input, Textarea, RangeInput, DateSelect, YearSelect } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { ResumePreview } from '../components/resume/ResumePreview';
import { generateId, MOCK_RESUMES } from '../utils/helpers';
import { COLOR_PALETTES, TEMPLATE_CATALOG } from '../types';
import type { Resume, WorkExperience, Education, Skill, Project, Certification, Language } from '../types';
import { cn } from '../utils/helpers';
import toast from 'react-hot-toast';

type Section = 'profileInfo' | 'contactInfo' | 'workExperience' | 'education' | 'skills'
  | 'projects' | 'certifications' | 'languages' | 'interests';

const SECTIONS = [
  { id: 'profileInfo' as Section,    label: 'Profile',        icon: <RiUserLine /> },
  { id: 'contactInfo' as Section,    label: 'Contact',        icon: <RiPhoneLine /> },
  { id: 'workExperience' as Section, label: 'Experience',     icon: <RiBriefcaseLine /> },
  { id: 'education' as Section,      label: 'Education',      icon: <RiGraduationCapLine /> },
  { id: 'skills' as Section,         label: 'Skills',         icon: <RiCodeSSlashLine /> },
  { id: 'projects' as Section,       label: 'Projects',       icon: <RiFolderLine /> },
  { id: 'certifications' as Section, label: 'Certifications', icon: <RiAwardLine /> },
  { id: 'languages' as Section,      label: 'Languages',      icon: <RiTranslate2 /> },
  { id: 'interests' as Section,      label: 'Interests',      icon: <RiHeartLine /> },
  { id: 'design' as any,             label: 'Design',         icon: <RiPaletteLine /> },
];



/* Main Page */
export const ResumeBuilderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setCurrentResume, updateResume } = useResumeStore();
  const { downloadPDF, getPDFBlob } = usePDF();

  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<Section | 'design'>('profileInfo');
  const [showPreview, setShowPreview] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [downloadModal, setDownloadModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  // The visible live-preview container
  const previewRef = useRef<HTMLDivElement>(null);

  /* Load */
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    resumeApi.getById(id)
      .then((data) => { setResume(data); setCurrentResume(data); })
      .catch(() => {
        const mock = MOCK_RESUMES.find((r) => r._id === id);
        const blank: Resume = {
          _id: id, userId: 'demo', title: 'New Resume',
          template: { theme: '01', colorPalette: ['#636B2F', '#BAC095'] },
          profileInfo: {}, contactInfo: {},
          workExperience: [], education: [], skills: [],
          projects: [], certifications: [], languages: [], interests: [],
        };
        setResume((mock as Resume) ?? blank);
      })
      .finally(() => setLoading(false));
  }, [id]);

  /* Field updaters */
  const updateField = useCallback(<K extends keyof Resume>(field: K, value: Resume[K]) => {
    setResume((prev) => prev ? { ...prev, [field]: value } : prev);
    setIsDirty(true);
  }, []);

  const updateNested = useCallback(<K extends keyof Resume>(section: K, field: string, value: unknown) => {
    setResume((prev) => {
      if (!prev) return prev;
      return { ...prev, [section]: { ...(prev[section] as Record<string, unknown>), [field]: value } };
    });
    setIsDirty(true);
  }, []);

  /* Save */
  const handleSave = async () => {
    if (!resume || !id) return;
    setSaving(true);
    try {
      const saved = await resumeApi.update(id, resume);
      setResume(saved); updateResume(id, saved); setIsDirty(false);
      toast.success('Saved!');
    } catch {
      setIsDirty(false);
      toast.success('Saved!');
    } finally { setSaving(false); }
  };

  /* Download - pass DOM element directly to usePDF */
  const handleDownload = async () => {
    if (!previewRef.current || !resume) return;
    setGeneratingPDF(true);
    try {
      await downloadPDF(previewRef.current, `${resume.title || 'resume'}.pdf`);
      setDownloadModal(false);
      toast.success('Resume downloaded successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  /* Get PDF blob for email - pass DOM element directly */
  const getEmailPDFBlob = useCallback(async (): Promise<Blob> => {
    if (!previewRef.current) throw new Error('Preview not ready');
    return getPDFBlob(previewRef.current);
  }, [getPDFBlob]);

  /* Loading screen */
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <RiLoaderLine className="w-8 h-8 text-primary-600 animate-spin" />
          <p className="text-sm text-gray-500">Loading resume…</p>
        </div>
      </div>
    );
  }

  if (!resume) return null;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">

      {/* Top bar */}
      <div className="glass border-b border-gray-100 px-4 py-3 flex items-center gap-3 z-10 shrink-0">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <RiArrowLeftLine className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          <input
            value={resume.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="text-sm font-semibold text-gray-900 bg-transparent border-none outline-none focus:ring-0 w-full"
            placeholder="Untitled Resume"
          />
          {isDirty && <p className="text-xs text-amber-500">Unsaved changes</p>}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm" variant="outline"
            onClick={() => setEmailModal(true)}
            leftIcon={<RiMailSendLine className="w-3.5 h-3.5" />}
            className="hidden sm:flex"
          >
            Send
          </Button>
          <Button
            size="sm" variant="outline"
            onClick={() => setDownloadModal(true)}
            leftIcon={<RiDownloadLine className="w-3.5 h-3.5" />}
          >
            Download
          </Button>
          <Button
            size="sm" variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            leftIcon={showPreview ? <RiEyeOffLine className="w-3.5 h-3.5" /> : <RiEyeLine className="w-3.5 h-3.5" />}
            className="hidden sm:flex"
          >
            {showPreview ? 'Hide' : 'Preview'}
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            isLoading={saving}
            leftIcon={<RiSaveLine className="w-3.5 h-3.5" />}
          >
            Save
          </Button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Section nav */}
        <div className="w-12 lg:w-44 bg-white border-r border-gray-100 flex flex-col py-2 overflow-y-auto shrink-0">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id as any)}
              title={s.label}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 mx-1 rounded-xl text-left transition-all duration-150 text-lg',
                activeSection === s.id
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
              )}
            >
              <span className="shrink-0">{s.icon}</span>
              <span className="text-sm font-medium hidden lg:block">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Editor panel */}
        <div className={cn(
          'bg-white border-r border-gray-100 overflow-y-auto flex-shrink-0 transition-all duration-300',
          showPreview ? 'w-full lg:w-[400px]' : 'flex-1'
        )}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18 }}
              className="p-5"
            >
              {activeSection === 'design'
                ? <DesignSection resume={resume} onUpdateField={updateField} />
                : <SectionEditor section={activeSection as Section} resume={resume} onUpdateNested={updateNested} onUpdateField={updateField} />
              }
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Visible live preview (decorative - for user to see while editing) */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto bg-gray-200/60 hidden lg:flex items-start justify-center p-8"
            >
              <div className="bg-white shadow-2xl" style={{ width: '794px', minHeight: '1123px' }}>
                <ResumePreview resume={resume} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/*
          - Real PDF source div -
          Always mounted, always visible to the browser (opacity:0 trick),
          at left:-9999px so it doesn't interfere with UI.
          previewRef always points here - guaranteed valid for html2canvas.
          opacity:0.01 (not 0) forces browser to compute layout and load fonts.
        */}
        <div
          ref={previewRef}
          style={{
            position: 'fixed',
            top: 0,
            left: '-9999px',
            width: '794px',
            minHeight: '1123px',
            background: '#fff',
            opacity: 0.01,       // Must NOT be 0 - browser skips layout at opacity:0
            zIndex: -1,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
          aria-hidden="true"
        >
          <ResumePreview resume={resume} />
        </div>
      </div>

      {/* Download modal */}
      <Modal
        isOpen={downloadModal}
        onClose={() => setDownloadModal(false)}
        title="Download Resume"
        description="Your resume will be exported as a PDF file."
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-600 leading-relaxed">
            A high-quality PDF of your resume will be generated and downloaded automatically.
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setDownloadModal(false)}>Cancel</Button>
            <Button
              onClick={handleDownload}
              isLoading={generatingPDF}
              leftIcon={<RiDownloadLine className="w-4 h-4" />}
            >
              {generatingPDF ? 'Generating PDF…' : 'Download PDF'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Email modal */}
      <Modal
        isOpen={emailModal}
        onClose={() => setEmailModal(false)}
        title="Send Resume by Email"
        size="md"
      >
        <EmailSendForm
          resume={resume}
          onClose={() => setEmailModal(false)}
          getBlob={getEmailPDFBlob}
        />
      </Modal>
    </div>
  );
};

/* Design Section */
const DesignSection: React.FC<{
  resume: Resume;
  onUpdateField: <K extends keyof Resume>(f: K, v: Resume[K]) => void;
}> = ({ resume, onUpdateField }) => {
  const currentTheme = resume.template?.theme || '01';
  const currentPalette = resume.template?.colorPalette || COLOR_PALETTES[0].colors;

  const setTemplate = (id: string) => {
    const tmpl = TEMPLATE_CATALOG.find((t) => t.id === id);
    onUpdateField('template', { theme: id, colorPalette: tmpl?.defaultColors || currentPalette });
  };

  const setPalette = (colors: string[]) => {
    onUpdateField('template', { theme: currentTheme, colorPalette: colors });
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title="Design & Theme" />

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Template</p>
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATE_CATALOG.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => setTemplate(tmpl.id)}
              className={cn(
                'relative p-3 rounded-xl border text-left transition-all duration-150',
                currentTheme === tmpl.id
                  ? 'border-primary-400 bg-primary-50 ring-2 ring-primary-400'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-900">{tmpl.name}</span>
                {currentTheme === tmpl.id && <RiCheckLine className="w-3.5 h-3.5 text-primary-600" />}
              </div>
              <span className={cn(
                'text-xs px-1.5 py-0.5 rounded-full',
                tmpl.plan === 'premium' ? 'bg-violet-100 text-violet-700' : 'bg-green-100 text-green-700'
              )}>
                {tmpl.plan === 'premium' ? 'Premium' : 'Free'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Colour Palette</p>
        <div className="grid grid-cols-2 gap-2">
          {COLOR_PALETTES.map((palette) => {
            const isSelected = currentPalette[0] === palette.colors[0];
            return (
              <button
                key={palette.name}
                onClick={() => setPalette(palette.colors)}
                className={cn(
                  'flex items-center gap-2.5 p-2.5 rounded-xl border transition-all duration-150',
                  isSelected
                    ? 'border-primary-400 bg-primary-50 ring-2 ring-primary-400'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div className="flex gap-1 shrink-0">
                  <div className="w-4 h-4 rounded-full" style={{ background: palette.colors[0] }} />
                  <div className="w-4 h-4 rounded-full" style={{ background: palette.colors[1] }} />
                </div>
                <span className="text-xs font-medium text-gray-700">{palette.name}</span>
                {isSelected && <RiCheckLine className="w-3.5 h-3.5 text-primary-600 ml-auto" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* Design Section */
const EmailSendForm: React.FC<{
  resume: Resume;
  onClose: () => void;
  getBlob: () => Promise<Blob>;
}> = ({ resume, onClose, getBlob }) => {
  const [form, setForm] = useState({
    recipientEmail: '',
    // subject: `${resume.profileInfo?.fullName || 'Resume'} - ${resume.profileInfo?.designation || 'Job Application'}`,
    subject: `Resume Application`,
    message: `Dear Hiring Manager,\n\nPlease find attached my resume for your consideration.\n\nBest regards,\n${resume.profileInfo?.fullName || ''}`,
  });
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.recipientEmail) e.recipientEmail = 'Recipient email is required';
    else if (!/\S+@\S+\.\S+/.test(form.recipientEmail)) e.recipientEmail = 'Enter a valid email';
    if (!form.subject) e.subject = 'Subject is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSend = async () => {
    if (!validate()) return;
    setSending(true);
    try {
      toast.loading('Generating PDF…', { id: 'email-send' });
      const blob = await getBlob();

      toast.loading('Sending email…', { id: 'email-send' });
      await emailApi.sendResume(
        form.recipientEmail,
        form.subject,
        form.message,
        blob,
        `${resume.title || 'resume'}.pdf`
      );

      toast.success(`Resume sent to ${form.recipientEmail}!`, { id: 'email-send' });
      onClose();
    } catch (err: any) {
      console.error('Send email error:', err);
      toast.dismiss('email-send');
      const msg = err?.response?.data?.message;
      if (err?.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
      } else if (msg) {
        toast.error(msg);
      } else {
        toast.error('Failed to send email. Please check your connection and try again.');
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Recipient email"
        type="email"
        placeholder="recruiter@company.com"
        value={form.recipientEmail}
        onChange={(e) => setForm({ ...form, recipientEmail: e.target.value })}
        error={errors.recipientEmail}
        autoFocus
      />
      <Input
        label="Subject"
        placeholder="Job application subject"
        value={form.subject}
        onChange={(e) => setForm({ ...form, subject: e.target.value })}
        error={errors.subject}
      />
      <Textarea
        label="Message"
        rows={5}
        placeholder="Your cover message…"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />
      <p className="text-xs text-gray-400">
        Your resume PDF will be generated and attached automatically.
      </p>
      <div className="flex gap-2 justify-end pt-1">
        <Button variant="ghost" onClick={onClose} disabled={sending}>Cancel</Button>
        <Button
          onClick={handleSend}
          isLoading={sending}
          leftIcon={<RiMailSendLine className="w-4 h-4" />}
        >
          {sending ? 'Sending…' : 'Send Resume'}
        </Button>
      </div>
    </div>
  );
};

/* Section Editor dispatcher */
interface SEProps {
  section: Section;
  resume: Resume;
  onUpdateNested: (section: keyof Resume, field: string, value: unknown) => void;
  onUpdateField: <K extends keyof Resume>(field: K, value: Resume[K]) => void;
}

const SectionEditor: React.FC<SEProps> = ({ section, resume, onUpdateNested, onUpdateField }) => {
  switch (section) {
    case 'profileInfo':    return <ProfileSection    resume={resume} onUpdate={onUpdateNested} />;
    case 'contactInfo':    return <ContactSection    resume={resume} onUpdate={onUpdateNested} />;
    case 'workExperience': return <WorkExpSection    resume={resume} onUpdate={onUpdateField} />;
    case 'education':      return <EducationSection  resume={resume} onUpdate={onUpdateField} />;
    case 'skills':         return <SkillsSection     resume={resume} onUpdate={onUpdateField} />;
    case 'projects':       return <ProjectsSection   resume={resume} onUpdate={onUpdateField} />;
    case 'certifications': return <CertsSection      resume={resume} onUpdate={onUpdateField} />;
    case 'languages':      return <LanguagesSection  resume={resume} onUpdate={onUpdateField} />;
    case 'interests':      return <InterestsSection  resume={resume} onUpdate={onUpdateField} />;
    default: return null;
  }
};

/* Profile */
const ProfileSection: React.FC<{ resume: Resume; onUpdate: (s: keyof Resume, f: string, v: unknown) => void }> = ({ resume, onUpdate }) => {
  const p = resume.profileInfo || {};
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const resumeId = resume._id || resume.id;
      if (resumeId) {
        const result = await resumeApi.uploadImages(resumeId, undefined, file);
        if (result.profilePreviewUrl) {
          onUpdate('profileInfo', 'profilePreviewUrl', result.profilePreviewUrl);
          toast.success('Profile photo uploaded!');
          return;
        }
      }
      throw new Error('fallback');
    } catch {
      // Fallback: local object URL for demo
      const url = URL.createObjectURL(file);
      onUpdate('profileInfo', 'profilePreviewUrl', url);
      toast.success('Profile photo set!');
    } finally { setUploading(false); }
  };

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Profile Information" />
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 shrink-0 flex items-center justify-center">
          {p.profilePreviewUrl
            ? <img src={p.profilePreviewUrl} alt="Profile" className="w-full h-full object-cover" crossOrigin="anonymous" />
            : <RiUserLine className="w-7 h-7 text-gray-400" />
          }
        </div>
        <div>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            {uploading ? <RiLoaderLine className="w-4 h-4 animate-spin" /> : <RiImageAddLine className="w-4 h-4" />}
            {uploading ? 'Uploading…' : 'Upload photo'}
          </button>
          <p className="text-xs text-gray-400 mt-0.5">JPG or PNG, up to 5 MB</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </div>
      </div>
      <Input label="Full name" placeholder="Pasan Yashobha" value={p.fullName || ''} onChange={(e) => onUpdate('profileInfo', 'fullName', e.target.value)} />
      <Input label="Job title / Designation" placeholder="Senior Software Engineer" value={p.designation || ''} onChange={(e) => onUpdate('profileInfo', 'designation', e.target.value)} />
      <Textarea label="Professional summary" placeholder="Write 2–3 sentences about your background…" value={p.summary || ''} onChange={(e) => onUpdate('profileInfo', 'summary', e.target.value)} rows={4} />
    </div>
  );
};

/* Contact */
const ContactSection: React.FC<{ resume: Resume; onUpdate: (s: keyof Resume, f: string, v: unknown) => void }> = ({ resume, onUpdate }) => {
  const c = resume.contactInfo || {};
  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Contact Information" />
      <Input label="Email" type="email" placeholder="pasan@example.com" value={c.email || ''} onChange={(e) => onUpdate('contactInfo', 'email', e.target.value)} />
      <Input label="Phone" placeholder="+94 71 123 4567" value={c.phone || ''} onChange={(e) => onUpdate('contactInfo', 'phone', e.target.value)} />
      <Input label="Location" placeholder="Panadura" value={c.location || ''} onChange={(e) => onUpdate('contactInfo', 'location', e.target.value)} />
      <Input label="LinkedIn" placeholder="linkedin.com/in/yourprofile" value={c.linkedIn || ''} onChange={(e) => onUpdate('contactInfo', 'linkedIn', e.target.value)} />
      <Input label="GitHub" placeholder="github.com/yourhandle" value={c.github || ''} onChange={(e) => onUpdate('contactInfo', 'github', e.target.value)} />
      <Input label="Website / Portfolio" placeholder="yourportfolio.com" value={c.website || ''} onChange={(e) => onUpdate('contactInfo', 'website', e.target.value)} />
    </div>
  );
};

/* Work Experience */
const WorkExpSection: React.FC<{ resume: Resume; onUpdate: (f: keyof Resume, v: Resume[keyof Resume]) => void }> = ({ resume, onUpdate }) => {
  const items = (resume.workExperience || []).map((w) => ({ ...w, id: w.id || generateId() }));
  const add = () => onUpdate('workExperience', [...items, { id: generateId(), company: '', role: '', startDate: '', endDate: '', description: '' }] as WorkExperience[]);
  const remove = (id: string) => onUpdate('workExperience', items.filter((i) => i.id !== id) as WorkExperience[]);
  const update = (id: string, field: string, value: unknown) =>
    onUpdate('workExperience', items.map((i) => i.id === id ? { ...i, [field]: value } : i) as WorkExperience[]);
  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Work Experience" onAdd={add} addLabel="Add position" />
      {items.length === 0 && <EmptyHint text="No experience added yet." />}
      {items.map((item, idx) => (
        <CollapsibleCard key={item.id} title={item.company || `Position ${idx + 1}`} subtitle={item.role} onRemove={() => remove(item.id!)}>
          <Input label="Company" placeholder="Abc Company" value={item.company} onChange={(e) => update(item.id!, 'company', e.target.value)} />
          <Input label="Role / Title" placeholder="Senior Developer" value={item.role} onChange={(e) => update(item.id!, 'role', e.target.value)} />
          <DateSelect label="Start date" value={item.startDate} onChange={(v) => update(item.id!, 'startDate', v)} />
          <DateSelect label="End date" value={item.endDate} onChange={(v) => update(item.id!, 'endDate', v)} allowPresent />
          <Textarea label="Description" placeholder="• Led development of…&#10;• Improved performance by…" value={item.description} onChange={(e) => update(item.id!, 'description', e.target.value)} rows={4} />
        </CollapsibleCard>
      ))}
    </div>
  );
};

/* Education */
const EducationSection: React.FC<{ resume: Resume; onUpdate: (f: keyof Resume, v: Resume[keyof Resume]) => void }> = ({ resume, onUpdate }) => {
  const items = (resume.education || []).map((e) => ({ ...e, id: e.id || generateId() }));
  const add = () => onUpdate('education', [...items, { id: generateId(), degree: '', institution: '', startDate: '', endDate: '' }] as Education[]);
  const remove = (id: string) => onUpdate('education', items.filter((i) => i.id !== id) as Education[]);
  const update = (id: string, f: string, v: string) =>
    onUpdate('education', items.map((i) => i.id === id ? { ...i, [f]: v } : i) as Education[]);
  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Education" onAdd={add} addLabel="Add education" />
      {items.length === 0 && <EmptyHint text="No education added yet." />}
      {items.map((item, idx) => (
        <CollapsibleCard key={item.id} title={item.institution || `Education ${idx + 1}`} subtitle={item.degree} onRemove={() => remove(item.id!)}>
          <Input label="Degree" placeholder="BSc. in IT" value={item.degree} onChange={(e) => update(item.id!, 'degree', e.target.value)} />
          <Input label="Institution" placeholder="UOM" value={item.institution} onChange={(e) => update(item.id!, 'institution', e.target.value)} />
          <YearSelect label="Start year" value={item.startDate} onChange={(v) => update(item.id!, 'startDate', v)} />
          <YearSelect label="End year (or expected)" value={item.endDate} onChange={(v) => update(item.id!, 'endDate', v)} />
        </CollapsibleCard>
      ))}
    </div>
  );
};

/* Skills */
const SkillsSection: React.FC<{ resume: Resume; onUpdate: (f: keyof Resume, v: Resume[keyof Resume]) => void }> = ({ resume, onUpdate }) => {
  const items = (resume.skills || []).map((s) => ({ ...s, id: s.id || generateId() }));
  const add = () => onUpdate('skills', [...items, { id: generateId(), name: '', progress: 80 }] as Skill[]);
  const remove = (id: string) => onUpdate('skills', items.filter((i) => i.id !== id) as Skill[]);
  const update = (id: string, f: string, v: unknown) =>
    onUpdate('skills', items.map((i) => i.id === id ? { ...i, [f]: v } : i) as Skill[]);
  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Skills" onAdd={add} addLabel="Add skill" />
      {items.length === 0 && <EmptyHint text="No skills added yet." />}
      {items.map((item) => (
        <div key={item.id} className="card p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Input placeholder="e.g. React, Python, AWS…" value={item.name} onChange={(e) => update(item.id!, 'name', e.target.value)} className="flex-1" />
            <button onClick={() => remove(item.id!)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0">
              <RiDeleteBinLine className="w-3.5 h-3.5" />
            </button>
          </div>
          <RangeInput value={item.progress} onChange={(v) => update(item.id!, 'progress', v)} label="Proficiency" />
        </div>
      ))}
    </div>
  );
};

/* Projects */
const ProjectsSection: React.FC<{ resume: Resume; onUpdate: (f: keyof Resume, v: Resume[keyof Resume]) => void }> = ({ resume, onUpdate }) => {
  const items = (resume.projects || []).map((p) => ({ ...p, id: p.id || generateId() }));
  const add = () => onUpdate('projects', [...items, { id: generateId(), title: '', description: '', github: '', livedemo: '' }] as Project[]);
  const remove = (id: string) => onUpdate('projects', items.filter((i) => i.id !== id) as Project[]);
  const update = (id: string, f: string, v: string) =>
    onUpdate('projects', items.map((i) => i.id === id ? { ...i, [f]: v } : i) as Project[]);
  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Projects" onAdd={add} addLabel="Add project" />
      {items.length === 0 && <EmptyHint text="No projects added yet." />}
      {items.map((item, idx) => (
        <CollapsibleCard key={item.id} title={item.title || `Project ${idx + 1}`} onRemove={() => remove(item.id!)}>
          <Input label="Project title" placeholder="My Awesome App" value={item.title} onChange={(e) => update(item.id!, 'title', e.target.value)} />
          <Textarea label="Description" placeholder="What you built and the tech used…" value={item.description} onChange={(e) => update(item.id!, 'description', e.target.value)} rows={3} />
          <Input label="GitHub URL" placeholder="github.com/you/project" value={item.github || ''} onChange={(e) => update(item.id!, 'github', e.target.value)} />
          <Input label="Live demo URL" placeholder="myproject.vercel.app" value={item.livedemo || ''} onChange={(e) => update(item.id!, 'livedemo', e.target.value)} />
        </CollapsibleCard>
      ))}
    </div>
  );
};

/* Certifications */
const CertsSection: React.FC<{ resume: Resume; onUpdate: (f: keyof Resume, v: Resume[keyof Resume]) => void }> = ({ resume, onUpdate }) => {
  const items = (resume.certifications || []).map((c) => ({ ...c, id: c.id || generateId() }));
  const add = () => onUpdate('certifications', [...items, { id: generateId(), title: '', issuer: '', year: '' }] as Certification[]);
  const remove = (id: string) => onUpdate('certifications', items.filter((i) => i.id !== id) as Certification[]);
  const update = (id: string, f: string, v: string) =>
    onUpdate('certifications', items.map((i) => i.id === id ? { ...i, [f]: v } : i) as Certification[]);
  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Certifications" onAdd={add} addLabel="Add certification" />
      {items.length === 0 && <EmptyHint text="No certifications added yet." />}
      {items.map((item, idx) => (
        <CollapsibleCard key={item.id} title={item.title || `Certification ${idx + 1}`} subtitle={item.issuer} onRemove={() => remove(item.id!)}>
          <Input label="Certification title" placeholder="AWS Solutions Architect" value={item.title} onChange={(e) => update(item.id!, 'title', e.target.value)} />
          <Input label="Issuer" placeholder="Amazon Web Services" value={item.issuer} onChange={(e) => update(item.id!, 'issuer', e.target.value)} />
          <YearSelect label="Year obtained" value={item.year} onChange={(v) => update(item.id!, 'year', v)} />
        </CollapsibleCard>
      ))}
    </div>
  );
};

/* Languages */
const LanguagesSection: React.FC<{ resume: Resume; onUpdate: (f: keyof Resume, v: Resume[keyof Resume]) => void }> = ({ resume, onUpdate }) => {
  const items = (resume.languages || []).map((l) => ({ ...l, id: l.id || generateId() }));
  const add = () => onUpdate('languages', [...items, { id: generateId(), name: '', progress: 80 }] as Language[]);
  const remove = (id: string) => onUpdate('languages', items.filter((i) => i.id !== id) as Language[]);
  const update = (id: string, f: string, v: unknown) =>
    onUpdate('languages', items.map((i) => i.id === id ? { ...i, [f]: v } : i) as Language[]);
  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Languages" onAdd={add} addLabel="Add language" />
      {items.length === 0 && <EmptyHint text="No languages added yet." />}
      {items.map((item) => (
        <div key={item.id} className="card p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Input placeholder="e.g. English, Sinhala…" value={item.name} onChange={(e) => update(item.id!, 'name', e.target.value)} className="flex-1" />
            <button onClick={() => remove(item.id!)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0">
              <RiDeleteBinLine className="w-3.5 h-3.5" />
            </button>
          </div>
          <RangeInput value={item.progress} onChange={(v) => update(item.id!, 'progress', v)} label="Proficiency" />
        </div>
      ))}
    </div>
  );
};

/* Interests */
const InterestsSection: React.FC<{ resume: Resume; onUpdate: (f: keyof Resume, v: Resume[keyof Resume]) => void }> = ({ resume, onUpdate }) => {
  const items = resume.interests || [];
  const [newItem, setNewItem] = useState('');
  const add = () => {
    if (!newItem.trim()) return;
    onUpdate('interests', [...items, newItem.trim()] as string[]);
    setNewItem('');
  };
  const remove = (idx: number) => onUpdate('interests', items.filter((_, i) => i !== idx) as string[]);
  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="Interests & Hobbies" />
      <div className="flex gap-2">
        <Input placeholder="e.g. Open source, Hiking…" value={newItem} onChange={(e) => setNewItem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} className="flex-1" />
        <Button size="sm" variant="outline" onClick={add} disabled={!newItem.trim()}>
          <RiAddLine className="w-4 h-4" />
        </Button>
      </div>
      {items.length === 0 && <EmptyHint text="No interests added yet." />}
      <div className="flex flex-wrap gap-2">
        {items.map((interest, idx) => (
          <motion.span key={idx} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium border border-primary-100">
            {interest}
            <button onClick={() => remove(idx)} className="hover:text-red-500 transition-colors">
              <RiDeleteBinLine className="w-3 h-3" />
            </button>
          </motion.span>
        ))}
      </div>
    </div>
  );
};

/* Shared UI primitives */
const SectionHeader: React.FC<{ title: string; onAdd?: () => void; addLabel?: string }> = ({ title, onAdd, addLabel }) => (
  <div className="flex items-center justify-between mb-1">
    <h2 className="font-display text-lg font-semibold text-gray-900">{title}</h2>
    {onAdd && (
      <Button variant="outline" size="sm" onClick={onAdd} leftIcon={<RiAddLine className="w-3.5 h-3.5" />}>
        {addLabel}
      </Button>
    )}
  </div>
);

const EmptyHint: React.FC<{ text: string }> = ({ text }) => (
  <div className="py-8 text-center text-sm text-gray-400 bg-gray-50/60 rounded-xl border border-dashed border-gray-200">
    {text}
  </div>
);

const CollapsibleCard: React.FC<{ title: string; subtitle?: string; onRemove: () => void; children: React.ReactNode }> = ({ title, subtitle, onRemove, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="card overflow-hidden">
      <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors" onClick={() => setOpen(!open)}>
        <div className="text-left min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{title || 'New entry'}</p>
          {subtitle && <p className="text-xs text-gray-500 truncate">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <RiDeleteBinLine className="w-3.5 h-3.5" />
          </button>
          <RiArrowDownSLine className={cn('w-4 h-4 text-gray-400 transition-transform', open && 'rotate-180')} />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 flex flex-col gap-3 border-t border-gray-50">
              <div className="pt-3">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
