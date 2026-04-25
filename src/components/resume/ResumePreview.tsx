import React from 'react';
import type { Resume } from '../../types';
import { formatMonthYear } from '../../utils/helpers';

interface Props { resume: Resume; }

export const ResumePreview: React.FC<Props> = ({ resume }) => {
  const theme = resume.template?.theme || '01';
  const [primary, accent] = resume.template?.colorPalette || ['#4F46E5', '#818cf8'];
  const p = { resume, primary, accent };

  switch (theme) {
    case '02': return <ModernTemplate {...p} />;
    case '03': return <MinimalTemplate {...p} />;
    case '04': return <SidebarTemplate {...p} />;
    case '05': return <CompactTemplate {...p} />;
    case '06': return <ExecutiveTemplate {...p} />;
    case '07': return <CreativeTemplate {...p} />;
    case '08': return <ElegantTemplate {...p} />;
    case '09': return <BoldTemplate {...p} />;
    case '10': return <TimelineTemplate {...p} />;
    default:   return <ClassicTemplate {...p} />;
  }
};

/*  Shared */
interface TP { resume: Resume; primary: string; accent: string; }

const S = {
  page: (extra?: React.CSSProperties): React.CSSProperties => ({
    fontFamily: '"DM Sans", Arial, sans-serif',
    fontSize: '11px',
    lineHeight: '1.5',
    color: '#1a1a1a',
    background: '#fff',
    minHeight: '297mm',
    width: '100%',
    ...extra,
  }),
  bold: { fontWeight: 700 } as React.CSSProperties,
  muted: { color: '#777', fontSize: '10px' } as React.CSSProperties,
};

// Progress bar
const Bar = ({ v, c }: { v: number; c: string }) => (
  <div style={{ height: '5px', background: '#e8e8e8', borderRadius: '3px', marginTop: '2px' }}>
    <div style={{ height: '100%', width: `${v}%`, background: c, borderRadius: '3px' }} />
  </div>
);

// Section heading with line
const H = ({ t, c, variant = 'line' }: { t: string; c: string; variant?: 'line' | 'block' | 'dot' }) => {
  if (variant === 'block') return (
    <div style={{ background: c, color: '#fff', fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '3px 7px', borderRadius: '3px', marginBottom: '8px' }}>{t}</div>
  );
  if (variant === 'dot') return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '7px' }}>
      <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: c, flexShrink: 0 }} />
      <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: c }}>{t}</span>
    </div>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
      <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: c, whiteSpace: 'nowrap' as const }}>{t}</span>
      <div style={{ flex: 1, height: '1px', background: `${c}45` }} />
    </div>
  );
};

// Contact row - plain text symbols, wraps cleanly
const Contacts = ({ c, color = '#555' }: { c: Resume['contactInfo']; color?: string }) => {
  if (!c) return null;
  const items = [
    c.email    && { label: c.email,    prefix: '' },
    c.phone    && { label: c.phone,    prefix: '' },
    c.location && { label: c.location, prefix: '' },
    c.linkedIn && { label: c.linkedIn, prefix: '' },
    c.github   && { label: c.github,   prefix: '' },
    c.website  && { label: c.website,  prefix: '' },
  ].filter(Boolean) as { label: string; prefix: string }[];
  if (!items.length) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '2px 14px', marginTop: '6px' }}>
      {items.map((it, i) => (
        <span key={i} style={{ fontSize: '10px', color, lineHeight: '1.6' }}>{it.label}</span>
      ))}
    </div>
  );
};

// Divider between experience entries
const EntryDiv = ({ i, len }: { i: number; len: number }) =>
  i < len - 1 ? <div style={{ height: '1px', background: '#f0f0f0', margin: '8px 0' }} /> : null;

/* 01 Classic */
const ClassicTemplate: React.FC<TP> = ({ resume: r, primary: P }) => {
  const p = r.profileInfo || {}; const c = r.contactInfo || {};
  return (
    <div style={S.page({ display: 'flex' })}>
      {/* Sidebar */}
      <div style={{ width: '37%', flexShrink: 0, background: `${P}11`, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {p.profilePreviewUrl && (
          <img src={p.profilePreviewUrl} alt="" crossOrigin="anonymous" style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff', display: 'block', margin: '0 auto' }} />
        )}
        <div>
          <div style={{ fontWeight: 700, fontSize: '14px', color: '#111', lineHeight: '1.3' }}>{p.fullName || 'Your Name'}</div>
          {p.designation && <div style={{ color: P, fontSize: '11px', fontWeight: 600, marginTop: '2px' }}>{p.designation}</div>}
        </div>
        {(c.email || c.phone || c.location || c.linkedIn || c.github) && (
          <div>
            <H t="Contact" c={P} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {c.email    && <div style={S.muted}>{c.email}</div>}
              {c.phone    && <div style={S.muted}>{c.phone}</div>}
              {c.location && <div style={S.muted}>{c.location}</div>}
              {c.linkedIn && <div style={S.muted}>{c.linkedIn}</div>}
              {c.github   && <div style={S.muted}>{c.github}</div>}
              {c.website  && <div style={S.muted}>{c.website}</div>}
            </div>
          </div>
        )}
        {r.skills && r.skills.length > 0 && (
          <div>
            <H t="Skills" c={P} />
            {r.skills.map((s, i) => (
              <div key={i} style={{ marginBottom: '7px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '10px', fontWeight: 500 }}>{s.name}</span>
                  <span style={{ ...S.muted }}>{s.progress}%</span>
                </div>
                <Bar v={s.progress} c={P} />
              </div>
            ))}
          </div>
        )}
        {r.languages && r.languages.length > 0 && (
          <div>
            <H t="Languages" c={P} />
            {r.languages.map((l, i) => (
              <div key={i} style={{ marginBottom: '7px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '10px', fontWeight: 500 }}>{l.name}</span>
                  <span style={{ ...S.muted }}>{l.progress}%</span>
                </div>
                <Bar v={l.progress} c={P} />
              </div>
            ))}
          </div>
        )}
        {r.interests && r.interests.length > 0 && (
          <div>
            <H t="Interests" c={P} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {r.interests.map((it, i) => (
                <span key={i} style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', background: `${P}22`, color: P }}>{it}</span>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Main */}
      <div style={{ flex: 1, padding: '24px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {p.summary && <div><H t="Summary" c={P} /><div style={{ color: '#444', lineHeight: '1.65' }}>{p.summary}</div></div>}
        {r.workExperience && r.workExperience.length > 0 && (
          <div>
            <H t="Experience" c={P} />
            {r.workExperience.map((w, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div><div style={S.bold}>{w.role}</div><div style={{ color: P, fontWeight: 500 }}>{w.company}</div></div>
                  <div style={{ ...S.muted, textAlign: 'right', flexShrink: 0, marginLeft: '8px' }}>{formatMonthYear(w.startDate)}{w.endDate ? ` – ${formatMonthYear(w.endDate)}` : ''}</div>
                </div>
                {w.description && <div style={{ color: '#555', whiteSpace: 'pre-line', lineHeight: '1.55', marginTop: '3px' }}>{w.description}</div>}
                <EntryDiv i={i} len={r.workExperience!.length} />
              </div>
            ))}
          </div>
        )}
        {r.education && r.education.length > 0 && (
          <div>
            <H t="Education" c={P} />
            {r.education.map((e, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div><div style={S.bold}>{e.degree}</div><div style={{ color: P }}>{e.institution}</div></div>
                <div style={{ ...S.muted, flexShrink: 0, marginLeft: '8px' }}>{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}</div>
              </div>
            ))}
          </div>
        )}
        {r.projects && r.projects.length > 0 && (
          <div>
            <H t="Projects" c={P} />
            {r.projects.map((pr, i) => (
              <div key={i} style={{ marginBottom: '6px' }}>
                <div style={S.bold}>{pr.title}</div>
                {pr.description && <div style={{ color: '#555' }}>{pr.description}</div>}
                {pr.github && <div style={{ color: P, fontSize: '10px' }}>{pr.github}</div>}
              </div>
            ))}
          </div>
        )}
        {r.certifications && r.certifications.length > 0 && (
          <div>
            <H t="Certifications" c={P} />
            {r.certifications.map((ce, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <div><span style={S.bold}>{ce.title}</span><span style={{ color: P }}> · {ce.issuer}</span></div>
                <span style={{ ...S.muted, flexShrink: 0, marginLeft: '8px' }}>{ce.year}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* 02 Modern */
const ModernTemplate: React.FC<TP> = ({ resume: r, primary: P, accent: A }) => {
  const p = r.profileInfo || {}; const c = r.contactInfo || {};
  return (
    <div style={S.page()}>
      <div style={{ background: `linear-gradient(135deg, ${P}, ${A})`, padding: '24px 28px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {p.profilePreviewUrl && <img src={p.profilePreviewUrl} alt="" crossOrigin="anonymous" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.4)', flexShrink: 0 }} />}
          <div>
            <div style={{ fontWeight: 800, fontSize: '20px', letterSpacing: '-0.2px' }}>{p.fullName || 'Your Name'}</div>
            {p.designation && <div style={{ opacity: 0.85, fontWeight: 500, marginTop: '2px' }}>{p.designation}</div>}
          </div>
        </div>
        <Contacts c={c} color="rgba(255,255,255,0.85)" />
      </div>
      <div style={{ padding: '20px 28px', display: 'flex', gap: '22px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '13px' }}>
          {p.summary && <div><H t="Summary" c={P} /><div style={{ color: '#444', lineHeight: '1.65' }}>{p.summary}</div></div>}
          {r.workExperience && r.workExperience.length > 0 && (
            <div><H t="Experience" c={P} />
              {r.workExperience.map((w, i) => (
                <div key={i} style={{ marginBottom: '9px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div><span style={S.bold}>{w.role}</span><span style={{ color: P }}> · {w.company}</span></div>
                    <span style={{ ...S.muted, flexShrink: 0, marginLeft: '8px' }}>{formatMonthYear(w.startDate)}{w.endDate ? ` – ${formatMonthYear(w.endDate)}` : ''}</span>
                  </div>
                  {w.description && <div style={{ color: '#555', whiteSpace: 'pre-line', marginTop: '2px' }}>{w.description}</div>}
                </div>
              ))}
            </div>
          )}
          {r.education && r.education.length > 0 && (
            <div><H t="Education" c={P} />
              {r.education.map((e, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <div><span style={S.bold}>{e.degree}</span><span style={{ color: P }}> · {e.institution}</span></div>
                  <span style={{ ...S.muted }}>{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}</span>
                </div>
              ))}
            </div>
          )}
          {r.projects && r.projects.length > 0 && (
            <div><H t="Projects" c={P} />
              {r.projects.map((pr, i) => <div key={i} style={{ marginBottom: '5px' }}><span style={S.bold}>{pr.title}</span>{pr.description && <div style={{ color: '#555' }}>{pr.description}</div>}</div>)}
            </div>
          )}
          {r.certifications && r.certifications.length > 0 && (
            <div><H t="Certifications" c={P} />
              {r.certifications.map((ce, i) => <div key={i}><span style={S.bold}>{ce.title}</span><span style={{ color: P }}> · {ce.issuer}</span><span style={{ ...S.muted }}> {ce.year}</span></div>)}
            </div>
          )}
        </div>
        <div style={{ width: '145px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '13px' }}>
          {r.skills && r.skills.length > 0 && (
            <div><H t="Skills" c={P} />
              {r.skills.map((s, i) => <div key={i} style={{ marginBottom: '7px' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '10px' }}>{s.name}</span><span style={{ ...S.muted }}>{s.progress}%</span></div><Bar v={s.progress} c={P} /></div>)}
            </div>
          )}
          {r.languages && r.languages.length > 0 && (
            <div><H t="Languages" c={P} />
              {r.languages.map((l, i) => <div key={i} style={{ marginBottom: '7px' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '10px' }}>{l.name}</span><span style={{ ...S.muted }}>{l.progress}%</span></div><Bar v={l.progress} c={P} /></div>)}
            </div>
          )}
          {r.interests && r.interests.length > 0 && (
            <div><H t="Interests" c={P} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                {r.interests.map((it, i) => <span key={i} style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '10px', background: `${P}22`, color: P }}>{it}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* 03 Minimal */
const MinimalTemplate: React.FC<TP> = ({ resume: r, primary: P }) => {
  const p = r.profileInfo || {}; const c = r.contactInfo || {};
  return (
    <div style={S.page({ padding: '32px 40px', fontFamily: '"DM Serif Display", Georgia, serif' })}>
      <div style={{ textAlign: 'center', paddingBottom: '18px', borderBottom: `1px solid ${P}30`, marginBottom: '20px' }}>
        {p.profilePreviewUrl && <img src={p.profilePreviewUrl} alt="" crossOrigin="anonymous" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', display: 'block', margin: '0 auto 10px', border: `1px solid ${P}40` }} />}
        <div style={{ fontSize: '22px', fontWeight: 600, color: '#111' }}>{p.fullName || 'Your Name'}</div>
        {p.designation && <div style={{ color: P, marginTop: '3px', fontFamily: '"DM Sans", Arial, sans-serif' }}>{p.designation}</div>}
        <div style={{ fontFamily: '"DM Sans", Arial, sans-serif', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2px 14px', marginTop: '7px' }}>
          {c.email    && <span style={{ ...S.muted }}>{c.email}</span>}
          {c.phone    && <span style={{ ...S.muted }}>{c.phone}</span>}
          {c.location && <span style={{ ...S.muted }}>{c.location}</span>}
          {c.linkedIn && <span style={{ ...S.muted }}>{c.linkedIn}</span>}
          {c.github   && <span style={{ ...S.muted }}>{c.github}</span>}
        </div>
      </div>
      <div style={{ fontFamily: '"DM Sans", Arial, sans-serif', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {p.summary && <div><H t="About" c={P} /><div style={{ color: '#444', lineHeight: '1.65' }}>{p.summary}</div></div>}
        {r.workExperience && r.workExperience.length > 0 && (
          <div><H t="Experience" c={P} />
            {r.workExperience.map((w, i) => (
              <div key={i} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: i < r.workExperience!.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div><span style={S.bold}>{w.role}</span><span style={{ color: P }}> · {w.company}</span></div>
                  <span style={{ ...S.muted }}>{formatMonthYear(w.startDate)}{w.endDate ? ` – ${formatMonthYear(w.endDate)}` : ''}</span>
                </div>
                {w.description && <div style={{ color: '#555', whiteSpace: 'pre-line', marginTop: '3px' }}>{w.description}</div>}
              </div>
            ))}
          </div>
        )}
        {r.education && r.education.length > 0 && (
          <div><H t="Education" c={P} />
            {r.education.map((e, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <div><span style={S.bold}>{e.degree}</span><span style={{ color: P }}> · {e.institution}</span></div>
                <span style={{ ...S.muted }}>{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}</span>
              </div>
            ))}
          </div>
        )}
        {r.skills && r.skills.length > 0 && (
          <div><H t="Skills" c={P} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {r.skills.map((s, i) => <span key={i} style={{ padding: '3px 10px', border: `1px solid ${P}50`, borderRadius: '20px', fontSize: '10px', color: P }}>{s.name}</span>)}
            </div>
          </div>
        )}
        {r.certifications && r.certifications.length > 0 && (
          <div><H t="Certifications" c={P} />
            {r.certifications.map((ce, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><div><span style={S.bold}>{ce.title}</span><span style={{ color: P }}> · {ce.issuer}</span></div><span style={{ ...S.muted }}>{ce.year}</span></div>)}
          </div>
        )}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {r.languages && r.languages.length > 0 && (
            <div style={{ flex: 1 }}><H t="Languages" c={P} />
              {r.languages.map((l, i) => <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '3px' }}><span style={{ fontWeight: 600 }}>{l.name}</span><span style={{ ...S.muted }}>{l.progress}%</span></div>)}
            </div>
          )}
          {r.interests && r.interests.length > 0 && (
            <div style={{ flex: 1 }}><H t="Interests" c={P} /><div style={{ color: '#555' }}>{r.interests.join(' · ')}</div></div>
          )}
        </div>
      </div>
    </div>
  );
};

/* 04 Sidebar */
const SidebarTemplate: React.FC<TP> = ({ resume: r, primary: P }) => {
  const p = r.profileInfo || {}; const c = r.contactInfo || {};
  return (
    <div style={S.page({ display: 'flex' })}>
      <div style={{ width: '38%', flexShrink: 0, background: P, color: '#fff', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {p.profilePreviewUrl && <img src={p.profilePreviewUrl} alt="" crossOrigin="anonymous" style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.35)', display: 'block', margin: '0 auto' }} />}
        <div>
          <div style={{ fontWeight: 700, fontSize: '15px' }}>{p.fullName || 'Your Name'}</div>
          {p.designation && <div style={{ opacity: 0.75, fontSize: '11px', marginTop: '2px' }}>{p.designation}</div>}
        </div>
        <div>
          <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' as const, opacity: 0.5, marginBottom: '5px' }}>Contact</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {c.email    && <div style={{ fontSize: '10px', opacity: 0.85 }}>{c.email}</div>}
            {c.phone    && <div style={{ fontSize: '10px', opacity: 0.85 }}>{c.phone}</div>}
            {c.location && <div style={{ fontSize: '10px', opacity: 0.85 }}>{c.location}</div>}
            {c.linkedIn && <div style={{ fontSize: '10px', opacity: 0.85 }}>{c.linkedIn}</div>}
            {c.github   && <div style={{ fontSize: '10px', opacity: 0.85 }}>{c.github}</div>}
          </div>
        </div>
        {r.skills && r.skills.length > 0 && (
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' as const, opacity: 0.5, marginBottom: '5px' }}>Skills</div>
            {r.skills.map((s, i) => (
              <div key={i} style={{ marginBottom: '7px' }}>
                <div style={{ opacity: 0.85, fontSize: '10px', marginBottom: '2px' }}>{s.name}</div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
                  <div style={{ height: '100%', borderRadius: '2px', width: `${s.progress}%`, background: 'rgba(255,255,255,0.7)' }} />
                </div>
              </div>
            ))}
          </div>
        )}
        {r.languages && r.languages.length > 0 && (
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' as const, opacity: 0.5, marginBottom: '5px' }}>Languages</div>
            {r.languages.map((l, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', opacity: 0.85, marginBottom: '3px' }}><span>{l.name}</span><span style={{ opacity: 0.65 }}>{l.progress}%</span></div>)}
          </div>
        )}
        {r.interests && r.interests.length > 0 && (
          <div>
            <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' as const, opacity: 0.5, marginBottom: '5px' }}>Interests</div>
            <div style={{ opacity: 0.75, lineHeight: '1.6', fontSize: '10px' }}>{r.interests.join(' · ')}</div>
          </div>
        )}
      </div>
      <div style={{ flex: 1, padding: '24px 18px', display: 'flex', flexDirection: 'column', gap: '13px' }}>
        {p.summary && <div><H t="Profile" c={P} /><div style={{ color: '#444', lineHeight: '1.65' }}>{p.summary}</div></div>}
        {r.workExperience && r.workExperience.length > 0 && (
          <div><H t="Experience" c={P} />
            {r.workExperience.map((w, i) => (
              <div key={i} style={{ marginBottom: '9px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div><div style={S.bold}>{w.role}</div><div style={{ color: P }}>{w.company}</div></div>
                  <div style={{ ...S.muted, flexShrink: 0, marginLeft: '8px', textAlign: 'right' }}>{formatMonthYear(w.startDate)}{w.endDate ? ` – ${formatMonthYear(w.endDate)}` : ''}</div>
                </div>
                {w.description && <div style={{ color: '#555', whiteSpace: 'pre-line', marginTop: '3px' }}>{w.description}</div>}
              </div>
            ))}
          </div>
        )}
        {r.education && r.education.length > 0 && (
          <div><H t="Education" c={P} />
            {r.education.map((e, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <div><div style={S.bold}>{e.degree}</div><div style={{ color: P }}>{e.institution}</div></div>
                <div style={{ ...S.muted, flexShrink: 0, marginLeft: '8px' }}>{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}</div>
              </div>
            ))}
          </div>
        )}
        {r.certifications && r.certifications.length > 0 && (
          <div><H t="Certifications" c={P} />
            {r.certifications.map((ce, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><div><span style={S.bold}>{ce.title}</span><span style={{ color: P }}> · {ce.issuer}</span></div><span style={{ ...S.muted }}>{ce.year}</span></div>)}
          </div>
        )}
        {r.projects && r.projects.length > 0 && (
          <div><H t="Projects" c={P} />
            {r.projects.map((pr, i) => <div key={i} style={{ marginBottom: '5px' }}><div style={S.bold}>{pr.title}</div>{pr.description && <div style={{ color: '#555' }}>{pr.description}</div>}</div>)}
          </div>
        )}
      </div>
    </div>
  );
};

/* 05 Compact */
const CompactTemplate: React.FC<TP> = ({ resume: r, primary: P }) => {
  const p = r.profileInfo || {}; const c = r.contactInfo || {};
  return (
    <div style={S.page({ padding: '20px 24px', fontSize: '10.5px' })}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `2px solid ${P}`, paddingBottom: '10px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {p.profilePreviewUrl && <img src={p.profilePreviewUrl} alt="" crossOrigin="anonymous" style={{ width: '52px', height: '52px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }} />}
          <div><div style={{ fontWeight: 700, fontSize: '15px' }}>{p.fullName || 'Your Name'}</div>{p.designation && <div style={{ color: P, fontWeight: 500 }}>{p.designation}</div>}</div>
        </div>
        <div style={{ textAlign: 'right', color: '#666', fontSize: '10px', lineHeight: '1.7' }}>
          {c.email && <div>{c.email}</div>}{c.phone && <div>{c.phone}</div>}{c.location && <div>{c.location}</div>}
        </div>
      </div>
      {p.summary && <div style={{ color: '#444', marginBottom: '12px', lineHeight: '1.65' }}>{p.summary}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '0 18px' }}>
        <div>
          {r.workExperience && r.workExperience.length > 0 && (
            <div style={{ marginBottom: '11px' }}><H t="Experience" c={P} variant="dot" />
              {r.workExperience.map((w, i) => (
                <div key={i} style={{ marginBottom: '7px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div><span style={S.bold}>{w.role}</span><span style={{ color: P }}> · {w.company}</span></div>
                    <span style={{ ...S.muted, flexShrink: 0, marginLeft: '8px' }}>{formatMonthYear(w.startDate)}{w.endDate ? ` – ${formatMonthYear(w.endDate)}` : ''}</span>
                  </div>
                  {w.description && <div style={{ color: '#555', whiteSpace: 'pre-line' }}>{w.description}</div>}
                </div>
              ))}
            </div>
          )}
          {r.education && r.education.length > 0 && (
            <div style={{ marginBottom: '11px' }}><H t="Education" c={P} variant="dot" />
              {r.education.map((e, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><div><span style={S.bold}>{e.degree}</span><span style={{ color: P }}> · {e.institution}</span></div><span style={{ ...S.muted }}>{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}</span></div>)}
            </div>
          )}
          {r.certifications && r.certifications.length > 0 && (
            <div><H t="Certifications" c={P} variant="dot" />
              {r.certifications.map((ce, i) => <div key={i}><span style={S.bold}>{ce.title}</span> · {ce.issuer} · <span style={{ ...S.muted }}>{ce.year}</span></div>)}
            </div>
          )}
        </div>
        <div>
          {r.skills && r.skills.length > 0 && (
            <div style={{ marginBottom: '11px' }}><H t="Skills" c={P} variant="dot" />
              {r.skills.map((s, i) => <div key={i} style={{ marginBottom: '6px' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '10px' }}>{s.name}</span><span style={{ ...S.muted }}>{s.progress}%</span></div><Bar v={s.progress} c={P} /></div>)}
            </div>
          )}
          {r.languages && r.languages.length > 0 && (
            <div style={{ marginBottom: '11px' }}><H t="Languages" c={P} variant="dot" />
              {r.languages.map((l, i) => <div key={i} style={{ marginBottom: '6px' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '10px' }}>{l.name}</span><span style={{ ...S.muted }}>{l.progress}%</span></div><Bar v={l.progress} c={P} /></div>)}
            </div>
          )}
          {r.interests && r.interests.length > 0 && (
            <div><H t="Interests" c={P} variant="dot" /><div style={{ color: '#555', lineHeight: '1.6' }}>{r.interests.join(', ')}</div></div>
          )}
        </div>
      </div>
    </div>
  );
};

/* 06–10 Premium templates */

const ExecutiveTemplate: React.FC<TP> = ({ resume: r, primary: P }) => {
  const p = r.profileInfo || {}; const c = r.contactInfo || {};
  return (
    <div style={S.page({ padding: '32px 40px' })}>
      <div style={{ textAlign: 'center', marginBottom: '14px' }}>
        {p.profilePreviewUrl && <img src={p.profilePreviewUrl} alt="" crossOrigin="anonymous" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', display: 'block', margin: '0 auto 10px' }} />}
        <div style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '22px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#111' }}>{p.fullName || 'Your Name'}</div>
        {p.designation && <div style={{ color: P, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginTop: '4px', fontWeight: 600 }}>{p.designation}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2px 14px', marginTop: '7px', color: '#666', fontSize: '10px' }}>
          {c.email && <span>{c.email}</span>}{c.phone && <span>{c.phone}</span>}{c.location && <span>{c.location}</span>}{c.linkedIn && <span>{c.linkedIn}</span>}
        </div>
      </div>
      <div style={{ height: '2px', background: P, marginBottom: '14px' }} />
      {p.summary && <div style={{ textAlign: 'center', color: '#555', fontStyle: 'italic', marginBottom: '14px', lineHeight: '1.65' }}>{p.summary}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
        {r.workExperience && r.workExperience.length > 0 && (<div><H t="Professional Experience" c={P} />{r.workExperience.map((w, i) => (<div key={i} style={{ marginBottom: '9px' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><div><span style={S.bold}>{w.role}</span><span style={{ color: P }}> · {w.company}</span></div><span style={{ ...S.muted }}>{formatMonthYear(w.startDate)}{w.endDate ? ` – ${formatMonthYear(w.endDate)}` : ''}</span></div>{w.description && <div style={{ color: '#555', whiteSpace: 'pre-line', marginTop: '2px' }}>{w.description}</div>}</div>))}</div>)}
        {r.education && r.education.length > 0 && (<div><H t="Education" c={P} />{r.education.map((e, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}><div><span style={S.bold}>{e.degree}</span><span style={{ color: P }}> · {e.institution}</span></div><span style={{ ...S.muted }}>{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}</span></div>))}</div>)}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 18px' }}>
          {r.skills && r.skills.length > 0 && (<div><H t="Skills" c={P} />{r.skills.map((s, i) => <div key={i} style={{ marginBottom: '3px', fontSize: '10px' }}>{s.name}</div>)}</div>)}
          {r.certifications && r.certifications.length > 0 && (<div><H t="Certifications" c={P} />{r.certifications.map((ce, i) => <div key={i} style={{ marginBottom: '5px' }}><span style={S.bold}>{ce.title}</span><br /><span style={{ ...S.muted }}>{ce.year}</span></div>)}</div>)}
          <div>{r.languages && r.languages.length > 0 && (<div style={{ marginBottom: '10px' }}><H t="Languages" c={P} />{r.languages.map((l, i) => <div key={i} style={{ fontSize: '10px' }}>{l.name}</div>)}</div>)}{r.interests && r.interests.length > 0 && (<div><H t="Interests" c={P} /><div style={{ color: '#555', fontSize: '10px' }}>{r.interests.join(', ')}</div></div>)}</div>
        </div>
      </div>
    </div>
  );
};

const CreativeTemplate: React.FC<TP> = ({ resume: r, primary: P, accent: A }) => {
  const p = r.profileInfo || {}; const c = r.contactInfo || {};
  return (
    <div style={S.page()}>
      <div style={{ background: `${P}10`, padding: '24px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', borderBottomLeftRadius: '80px', background: `${P}22` }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {p.profilePreviewUrl ? <img src={p.profilePreviewUrl} alt="" crossOrigin="anonymous" style={{ width: '72px', height: '72px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }} /> : <div style={{ width: '72px', height: '72px', borderRadius: '12px', background: `${P}30`, flexShrink: 0 }} />}
          <div>
            <div style={{ fontWeight: 700, fontSize: '18px' }}>{p.fullName || 'Your Name'}</div>
            {p.designation && <div style={{ color: P, fontWeight: 600, marginTop: '2px' }}>{p.designation}</div>}
            <Contacts c={c} color="#555" />
          </div>
        </div>
      </div>
      <div style={{ padding: '18px 28px', display: 'flex', gap: '18px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {p.summary && <div><H t="About Me" c={P} /><div style={{ color: '#444', lineHeight: '1.65' }}>{p.summary}</div></div>}
          {r.workExperience && r.workExperience.length > 0 && (<div><H t="Experience" c={P} />{r.workExperience.map((w, i) => (<div key={i} style={{ marginBottom: '9px' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><div><span style={S.bold}>{w.role}</span><span style={{ color: P }}> · {w.company}</span></div><span style={{ ...S.muted }}>{formatMonthYear(w.startDate)}{w.endDate ? ` – ${formatMonthYear(w.endDate)}` : ''}</span></div>{w.description && <div style={{ color: '#555', whiteSpace: 'pre-line', marginTop: '2px' }}>{w.description}</div>}</div>))}</div>)}
          {r.education && r.education.length > 0 && (<div><H t="Education" c={P} />{r.education.map((e, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}><div><span style={S.bold}>{e.degree}</span><span style={{ color: P }}> · {e.institution}</span></div><span style={{ ...S.muted }}>{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}</span></div>))}</div>)}
          {r.projects && r.projects.length > 0 && (<div><H t="Projects" c={P} />{r.projects.map((pr, i) => <div key={i} style={{ marginBottom: '5px' }}><span style={S.bold}>{pr.title}</span>{pr.description && <div style={{ color: '#555' }}>{pr.description}</div>}</div>)}</div>)}
        </div>
        <div style={{ width: '135px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {r.skills && r.skills.length > 0 && (<div><H t="Skills" c={P} />{r.skills.map((s, i) => <div key={i} style={{ marginBottom: '7px' }}><div style={{ fontSize: '10px', fontWeight: 500 }}>{s.name}</div><Bar v={s.progress} c={P} /></div>)}</div>)}
          {r.certifications && r.certifications.length > 0 && (<div><H t="Certs" c={P} />{r.certifications.map((ce, i) => <div key={i} style={{ marginBottom: '5px' }}><div style={S.bold}>{ce.title}</div><div style={{ ...S.muted }}>{ce.year}</div></div>)}</div>)}
          {r.languages && r.languages.length > 0 && (<div><H t="Languages" c={P} />{r.languages.map((l, i) => <div key={i} style={{ marginBottom: '6px' }}><div style={{ fontSize: '10px' }}>{l.name}</div><Bar v={l.progress} c={P} /></div>)}</div>)}
          {r.interests && r.interests.length > 0 && (<div><H t="Interests" c={P} /><div style={{ color: '#555', fontSize: '10px' }}>{r.interests.join(', ')}</div></div>)}
        </div>
      </div>
    </div>
  );
};

const ElegantTemplate: React.FC<TP> = ({ resume: r, primary: P }) => {
  const p = r.profileInfo || {}; const c = r.contactInfo || {};
  return (
    <div style={S.page({ padding: '32px 40px' })}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px', paddingBottom: '16px', borderBottom: `2px solid ${P}`, marginBottom: '18px' }}>
        {p.profilePreviewUrl && <img src={p.profilePreviewUrl} alt="" crossOrigin="anonymous" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />}
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: '22px', fontWeight: 600, color: '#111' }}>{p.fullName || 'Your Name'}</div>
          {p.designation && <div style={{ color: P, marginTop: '2px' }}>{p.designation}</div>}
          <Contacts c={c} color="#666" />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {p.summary && <div><H t="Profile" c={P} /><div style={{ color: '#444', fontStyle: 'italic', lineHeight: '1.65' }}>{p.summary}</div></div>}
        {r.workExperience && r.workExperience.length > 0 && (<div><H t="Experience" c={P} />{r.workExperience.map((w, i) => (<div key={i} style={{ marginBottom: '9px', paddingBottom: '9px', borderBottom: i < r.workExperience!.length - 1 ? '1px solid #f0f0f0' : 'none' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><div><span style={S.bold}>{w.role}</span><span style={{ color: P }}> · {w.company}</span></div><span style={{ ...S.muted }}>{formatMonthYear(w.startDate)}{w.endDate ? ` – ${formatMonthYear(w.endDate)}` : ''}</span></div>{w.description && <div style={{ color: '#555', whiteSpace: 'pre-line', marginTop: '2px' }}>{w.description}</div>}</div>))}</div>)}
        {r.education && r.education.length > 0 && (<div><H t="Education" c={P} />{r.education.map((e, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}><div><span style={S.bold}>{e.degree}</span><span style={{ color: P }}> · {e.institution}</span></div><span style={{ ...S.muted }}>{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}</span></div>))}</div>)}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 22px' }}>
          {r.skills && r.skills.length > 0 && (<div><H t="Skills" c={P} />{r.skills.map((s, i) => <div key={i} style={{ marginBottom: '7px' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '10px' }}>{s.name}</span><span style={{ ...S.muted }}>{s.progress}%</span></div><Bar v={s.progress} c={P} /></div>)}</div>)}
          <div>{r.certifications && r.certifications.length > 0 && (<div style={{ marginBottom: '10px' }}><H t="Certifications" c={P} />{r.certifications.map((ce, i) => <div key={i}><span style={S.bold}>{ce.title}</span><span style={{ color: P }}> · {ce.issuer}</span><span style={{ ...S.muted }}> {ce.year}</span></div>)}</div>)}{r.languages && r.languages.length > 0 && (<div><H t="Languages" c={P} />{r.languages.map((l, i) => <div key={i} style={{ fontSize: '10px' }}>{l.name} <span style={{ ...S.muted }}>{l.progress}%</span></div>)}</div>)}</div>
        </div>
        {r.interests && r.interests.length > 0 && (<div><H t="Interests" c={P} /><div>{r.interests.join(' · ')}</div></div>)}
      </div>
    </div>
  );
};

const BoldTemplate: React.FC<TP> = ({ resume: r, primary: P, accent: A }) => {
  const p = r.profileInfo || {}; const c = r.contactInfo || {};
  return (
    <div style={S.page()}>
      <div style={{ background: `linear-gradient(135deg, ${P}, ${A})`, padding: '24px 28px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {p.profilePreviewUrl && <img src={p.profilePreviewUrl} alt="" crossOrigin="anonymous" style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.3)', flexShrink: 0 }} />}
          <div>
            <div style={{ fontWeight: 900, fontSize: '22px', letterSpacing: '-0.4px' }}>{p.fullName || 'Your Name'}</div>
            {p.designation && <div style={{ opacity: 0.85, fontWeight: 600, textTransform: 'uppercase' as const, fontSize: '10px', letterSpacing: '0.08em', marginTop: '3px' }}>{p.designation}</div>}
          </div>
        </div>
        <Contacts c={c} color="rgba(255,255,255,0.85)" />
      </div>
      <div style={{ padding: '18px 28px', display: 'flex', gap: '18px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {p.summary && <div><H t="Summary" c={P} variant="block" /><div style={{ color: '#444', lineHeight: '1.65' }}>{p.summary}</div></div>}
          {r.workExperience && r.workExperience.length > 0 && (<div><H t="Experience" c={P} variant="block" />{r.workExperience.map((w, i) => (<div key={i} style={{ marginBottom: '9px' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><div><span style={S.bold}>{w.role}</span><span style={{ color: P }}> · {w.company}</span></div><span style={{ ...S.muted }}>{formatMonthYear(w.startDate)}{w.endDate ? ` – ${formatMonthYear(w.endDate)}` : ''}</span></div>{w.description && <div style={{ color: '#555', whiteSpace: 'pre-line', marginTop: '2px' }}>{w.description}</div>}</div>))}</div>)}
          {r.education && r.education.length > 0 && (<div><H t="Education" c={P} variant="block" />{r.education.map((e, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}><div><span style={S.bold}>{e.degree}</span><span style={{ color: P }}> · {e.institution}</span></div><span style={{ ...S.muted }}>{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}</span></div>))}</div>)}
          {r.projects && r.projects.length > 0 && (<div><H t="Projects" c={P} variant="block" />{r.projects.map((pr, i) => <div key={i} style={{ marginBottom: '5px' }}><span style={S.bold}>{pr.title}</span>{pr.description && <div style={{ color: '#555' }}>{pr.description}</div>}</div>)}</div>)}
        </div>
        <div style={{ width: '135px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {r.skills && r.skills.length > 0 && (<div><H t="Skills" c={P} variant="block" />{r.skills.map((s, i) => <div key={i} style={{ marginBottom: '7px' }}><div style={{ fontSize: '10px' }}>{s.name}</div><Bar v={s.progress} c={P} /></div>)}</div>)}
          {r.languages && r.languages.length > 0 && (<div><H t="Languages" c={P} variant="block" />{r.languages.map((l, i) => <div key={i} style={{ fontSize: '10px' }}>{l.name} <span style={{ ...S.muted }}>{l.progress}%</span></div>)}</div>)}
          {r.interests && r.interests.length > 0 && (<div><H t="Interests" c={P} variant="block" /><div style={{ color: '#555', fontSize: '10px' }}>{r.interests.join(', ')}</div></div>)}
        </div>
      </div>
    </div>
  );
};

const TimelineTemplate: React.FC<TP> = ({ resume: r, primary: P }) => {
  const p = r.profileInfo || {}; const c = r.contactInfo || {};
  return (
    <div style={S.page({ padding: '24px 28px' })}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', paddingBottom: '14px', borderBottom: `2px solid ${P}30`, marginBottom: '14px' }}>
        {p.profilePreviewUrl && <img src={p.profilePreviewUrl} alt="" crossOrigin="anonymous" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '18px' }}>{p.fullName || 'Your Name'}</div>
          {p.designation && <div style={{ color: P, marginTop: '2px' }}>{p.designation}</div>}
          <Contacts c={c} color="#666" />
        </div>
        {r.skills && r.skills.length > 0 && (
          <div style={{ width: '130px', flexShrink: 0 }}>
            {r.skills.slice(0, 5).map((s, i) => <div key={i} style={{ marginBottom: '6px' }}><div style={{ fontSize: '10px', fontWeight: 500 }}>{s.name}</div><Bar v={s.progress} c={P} /></div>)}
          </div>
        )}
      </div>
      {p.summary && <div style={{ color: '#444', marginBottom: '14px', lineHeight: '1.65' }}>{p.summary}</div>}
      <div style={{ display: 'flex', gap: '18px' }}>
        <div style={{ flex: 1 }}>
          {r.workExperience && r.workExperience.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <H t="Experience" c={P} />
              <div style={{ position: 'relative', paddingLeft: '16px' }}>
                <div style={{ position: 'absolute', left: '4px', top: 0, bottom: 0, width: '1px', background: `${P}40` }} />
                {r.workExperience.map((w, i) => (
                  <div key={i} style={{ position: 'relative', marginBottom: '12px' }}>
                    <div style={{ position: 'absolute', left: '-16px', top: '3px', width: '9px', height: '9px', borderRadius: '50%', background: P, border: '2px solid #fff' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div><span style={S.bold}>{w.role}</span><span style={{ color: P }}> · {w.company}</span></div>
                      <span style={{ ...S.muted, flexShrink: 0, marginLeft: '8px' }}>{formatMonthYear(w.startDate)}{w.endDate ? ` – ${formatMonthYear(w.endDate)}` : ''}</span>
                    </div>
                    {w.description && <div style={{ color: '#555', whiteSpace: 'pre-line', marginTop: '2px' }}>{w.description}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {r.projects && r.projects.length > 0 && (<div><H t="Projects" c={P} />{r.projects.map((pr, i) => <div key={i} style={{ marginBottom: '5px' }}><span style={S.bold}>{pr.title}</span>{pr.description && <div style={{ color: '#555' }}>{pr.description}</div>}</div>)}</div>)}
        </div>
        <div style={{ width: '145px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {r.education && r.education.length > 0 && (<div><H t="Education" c={P} />{r.education.map((e, i) => <div key={i} style={{ marginBottom: '7px' }}><div style={S.bold}>{e.degree}</div><div style={{ color: P }}>{e.institution}</div><div style={{ ...S.muted }}>{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}</div></div>)}</div>)}
          {r.certifications && r.certifications.length > 0 && (<div><H t="Certifications" c={P} />{r.certifications.map((ce, i) => <div key={i} style={{ marginBottom: '5px' }}><div style={S.bold}>{ce.title}</div><div style={{ ...S.muted }}>{ce.year}</div></div>)}</div>)}
          {r.languages && r.languages.length > 0 && (<div><H t="Languages" c={P} />{r.languages.map((l, i) => <div key={i} style={{ marginBottom: '6px' }}><div style={{ fontSize: '10px' }}>{l.name}</div><Bar v={l.progress} c={P} /></div>)}</div>)}
          {r.interests && r.interests.length > 0 && (<div><H t="Interests" c={P} /><div style={{ color: '#555', fontSize: '10px' }}>{r.interests.join(', ')}</div></div>)}
        </div>
      </div>
    </div>
  );
};
