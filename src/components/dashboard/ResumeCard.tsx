import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiMoreLine, RiEditLine, RiDeleteBinLine, RiCalendarLine } from 'react-icons/ri';
import type { Resume } from '../../types';
import { formatDate } from '../../utils/helpers';

interface ResumeCardProps { resume: Resume; onDelete?: (id: string) => void; index?: number; }

export const ResumeCard: React.FC<ResumeCardProps> = ({ resume, onDelete, index = 0 }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const resumeId = resume._id || resume.id || '';
  const accent = resume.template?.colorPalette?.[0] || '#636B2F';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="group card-hover flex flex-col overflow-hidden"
    >
      <Link to={`/resume/${resumeId}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl" style={{ background: `linear-gradient(135deg, ${accent}18 0%, ${accent}08 100%)` }}>
          {resume.thumbnailLink ? (
            <img src={resume.thumbnailLink} alt={resume.title} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="w-full max-w-[110px] space-y-2">
                <div className="w-9 h-9 rounded-full mx-auto" style={{ background: `${accent}40` }} />
                <div className="h-2 rounded-full w-full" style={{ background: `${accent}35` }} />
                <div className="h-1.5 rounded-full w-3/4 mx-auto" style={{ background: `${accent}25` }} />
                <div className="mt-3 space-y-1.5">
                  {[...Array(3)].map((_, i) => <div key={i} className="h-1.5 rounded-full bg-gray-200/70" style={{ width: `${90 - i * 10}%` }} />)}
                </div>
                <div className="mt-2 space-y-1">
                  {[...Array(4)].map((_, i) => <div key={i} className="h-1 rounded-full bg-gray-100/80" />)}
                </div>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/8 transition-colors duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2 shadow-md">
              <RiEditLine className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">Edit Resume</span>
            </div>
          </div>
        </div>
      </Link>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{resume.title}</h3>
            {resume.profileInfo?.designation && (
              <p className="text-xs text-gray-500 mt-0.5 truncate">{resume.profileInfo.designation}</p>
            )}
          </div>
          <div className="relative shrink-0">
            <button
              onClick={(e) => { e.preventDefault(); setMenuOpen(!menuOpen); }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <RiMoreLine className="w-4 h-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden py-1">
                  <Link to={`/resume/${resumeId}`} className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMenuOpen(false)}>
                    <RiEditLine className="w-3.5 h-3.5" /> Edit
                  </Link>
                  <button
                    onClick={(e) => { e.preventDefault(); setMenuOpen(false); onDelete?.(resumeId); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <RiDeleteBinLine className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <RiCalendarLine className="w-3 h-3" />
          <span>Updated {formatDate(resume.updatedAt)}</span>
        </div>
        <Link to={`/resume/${resumeId}`} className="flex items-center justify-center gap-2 py-2 rounded-xl border border-primary-200 text-primary-700 text-xs font-medium hover:bg-primary-50 hover:border-primary-300 transition-all duration-200">
          <RiEditLine className="w-3.5 h-3.5" /> Open Editor
        </Link>
      </div>
    </motion.div>
  );
};
