import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RiArrowRightLine, RiCheckLine, RiFileTextLine, RiShieldCheckLine, RiGlobalLine, RiStarFill, RiLinkedinBoxLine, RiGithubLine, RiMailLine
} from 'react-icons/ri';
import { Gauge, ShieldCheck, BadgeCheck, UserCheck } from "lucide-react";
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

const features = [
  { icon: <Gauge className="w-5 h-5" />, title: 'Build in Minutes', description: 'Intuitive section-by-section editor with live preview. No design skills needed.' },
  { icon: <RiFileTextLine className="w-5 h-5" />, title: '10 Pro Templates', description: '5 free templates plus 5 premium layouts crafted for every industry.' },
  { icon: <RiGlobalLine className="w-5 h-5" />, title: 'Share Anywhere', description: 'Export as PDF, download, or send directly via email to recruiters.' },
  { icon: <RiShieldCheckLine className="w-5 h-5" />, title: 'Private & Secure', description: 'Your data is encrypted and never shared without your permission.' },
];

const testimonials = [
  { name: 'Dilshani Kaushalya', role: 'Software Engineer at Google', text: 'I landed my dream job within 2 weeks of using Resumora. The templates are stunning and the editor is so fast.', initials: 'DK' },
  { name: 'Pasan Yashobha', role: 'Product Manager at Stripe', text: "The cleanest resume builder I've used. Simple, fast, and the live preview is a game changer.", initials: 'PY' },
  { name: 'Kaushalya Bandara', role: 'UX Designer at Figma', text: "Resumora's design quality made my resume stand out immediately. Got 3 interviews in the first week.", initials: 'KB' },
];

const plans = [
  {
    name: 'Basic', price: 'Free', description: 'Perfect for getting started',
    features: ['Up to 10 resumes', '5 free templates', 'PDF download', 'Email support', 'Real-time preview'],
    cta: 'Get started free', highlight: false,
  },
  {
    name: 'Premium', price: '$9.99', period: 'one-time', description: 'Everything you need to land the job',
    features: ['Unlimited resumes', 'All 10 templates', 'PDF download', 'Email support', 'Real-time preview', 'Priority support', 'Color palette customisation'],
    cta: 'Upgrade to Premium', highlight: true,
  },
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } };

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-60" />
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium mb-8">
            <BadgeCheck className="w-3.5 h-3.5" />
            Trusted by 10,000+ job seekers worldwide
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold text-gray-900 tracking-tight leading-[1.08] mb-6">
            Design Your{' '}
            <span className="gradient-text italic">Career</span>
            <br />Identity.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Build stunning, ATS optimised resumes in minutes. Choose from 10 professional templates, customise colours, and download as PDF.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to={isAuthenticated ? '/dashboard' : '/register'}>
              <Button size="lg" rightIcon={<RiArrowRightLine className="w-4 h-4" />}>
                {isAuthenticated ? 'Go to Dashboard' : 'Start for free'}
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">Sign in</Button>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            {['No credit card required', '5 free templates', 'PDF download included'].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <RiCheckLine className="w-4 h-4 text-accent-500" />
                <span>{t}</span>
              </div>
            ))}
          </motion.div>

          {/* Browser mockup */}
          <motion.div initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }} className="mt-16 relative mx-auto max-w-4xl">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-50 border-b border-gray-100">
                {['bg-red-400', 'bg-yellow-400', 'bg-green-400'].map((c, i) => <div key={i} className={`w-3 h-3 rounded-full ${c}`} />)}
                <div className="flex-1 mx-4 h-5 rounded-md bg-gray-200/70 max-w-xs" />
              </div>
              <div className="flex min-h-[300px] md:min-h-[380px]">
                <div className="w-44 bg-gray-50 border-r border-gray-100 p-4 flex flex-col gap-3 shrink-0">
                  <div className="h-3 w-20 bg-gray-200 rounded-full" />
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-lg ${i === 0 ? 'bg-primary-200' : 'bg-gray-200'}`} />
                      <div className={`h-2.5 rounded-full ${i === 0 ? 'bg-primary-300 w-16' : 'bg-gray-200 w-14'}`} />
                    </div>
                  ))}
                </div>
                <div className="flex-1 p-5 flex gap-5">
                  <div className="flex-1 space-y-3">
                    <div className="h-3 w-24 bg-gray-300 rounded-full" />
                    {[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-xl border border-gray-200" />)}
                    <div className="h-20 bg-gray-100 rounded-xl border border-gray-200" />
                  </div>
                  <div className="w-40 md:w-48 bg-gradient-to-b from-primary-50 to-white rounded-xl border border-gray-100 p-3 shrink-0 hidden sm:block">
                    <div className="flex flex-col items-center gap-1.5 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary-200" />
                      <div className="h-2 w-20 bg-primary-200 rounded-full" />
                      <div className="h-1.5 w-14 bg-gray-200 rounded-full" />
                    </div>
                    <div className="h-px bg-primary-100 mb-2" />
                    <div className="space-y-1.5">{[...Array(5)].map((_, i) => <div key={i} className="h-1.5 bg-gray-100 rounded-full" style={{ width: `${80 - i * 8}%` }} />)}</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 hidden md:block">
              <div className="bg-white rounded-xl px-3.5 py-2.5 shadow-xl border border-gray-100 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">ATS Optimised</p>
                  <p className="text-xs text-gray-500">98% pass rate</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="text-center mb-14">
            <motion.p variants={item} className="text-sm font-medium text-primary-600 mb-3 uppercase tracking-widest">Why Resumora</motion.p>
            <motion.h2 variants={item} className="font-display text-4xl md:text-5xl font-semibold text-gray-900 mb-4">Everything you need to get hired</motion.h2>
            <motion.p variants={item} className="text-gray-500 text-lg max-w-2xl mx-auto">A complete resume building experience designed for modern job seekers.</motion.p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <motion.div key={f.title} variants={item} className="card p-6 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4 text-xl">{f.icon}</div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-medium text-primary-600 mb-3 uppercase tracking-widest">Testimonials</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-gray-900">Loved by job seekers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6">
                <div className="flex gap-0.5 mb-4">{[...Array(5)].map((_, j) => <RiStarFill key={j} className="w-4 h-4 text-amber-400" />)}</div>
                <p className="text-sm text-gray-700 leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">{t.initials}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 md:py-28 bg-gray-50" id="pricing">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-medium text-primary-600 mb-3 uppercase tracking-widest">Pricing</p>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-gray-900 mb-4">Simple, honest pricing</h2>
            <p className="text-gray-500 text-lg">One time payment. No subscriptions. No surprises.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={`card p-8 relative ${plan.highlight ? 'ring-2 ring-primary-500 shadow-glow' : ''}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 gradient-bg text-white text-xs font-semibold rounded-full shadow-md">Most Popular</span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl font-semibold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-gray-400 text-sm">/ {plan.period}</span>}
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <RiCheckLine className="w-4 h-4 text-accent-500 shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <Link to={isAuthenticated ? '/dashboard/billing' : '/register'}>
                  <Button variant={plan.highlight ? 'primary' : 'outline'} size="lg" className="w-full" rightIcon={<RiArrowRightLine className="w-4 h-4" />}>
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative p-12 md:p-16 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 gradient-bg opacity-95" />
            <div className="absolute inset-0 dot-pattern opacity-10" />
            <div className="relative">
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">Your next role is one resume away.</h2>
              <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">Join thousands of professionals who've levelled up their career with Resumora.</p>
              <Link to={isAuthenticated ? '/dashboard' : '/register'}>
                <Button size="lg" className="bg-white !text-primary-200 hover:bg-gray-50 shadow-lg" rightIcon={<RiArrowRightLine className="w-4 h-4" />}>
                  {isAuthenticated ? 'Open Dashboard' : 'Build your resume | free'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center">
                  <RiFileTextLine className="w-4 h-4 text-white" />
                </div>
                <span className="font-display text-white font-semibold text-lg">Resumora</span>
              </div>
              <p className="text-sm leading-relaxed mb-5">Design your career identity. Build professional resumes in minutes.</p>
              {/* <div className="flex gap-3">
                {[
                  { icon: <RiTwitterXLine className="w-4 h-4" />, href: '#' },
                  { icon: <RiLinkedinBoxLine className="w-4 h-4" />, href: '#' },
                  { icon: <RiGithubLine className="w-4 h-4" />, href: '#' },
                  { icon: <RiMailLine className="w-4 h-4" />, href: '#' },
                ].map((s, i) => (
                  <a key={i} href={s.href} className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                    {s.icon}
                  </a>
                ))} */}
              <div className="flex gap-3">
                {[
                  { icon: <RiLinkedinBoxLine className="w-4 h-4" />, href: 'https://www.linkedin.com/in/pasan-yashobha-17602b305' },
                  { icon: <RiGithubLine className="w-4 h-4" />, href: 'https://github.com/Pasan-Yashobha' },
                  { icon: <RiMailLine className="w-4 h-4" />, href: 'mailto:pasanyashobha.254@gmail.com' },
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2.5 text-sm">
                {['Templates', 'Pricing', 'Resume Examples', 'ATS Tips'].map((l) => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm">
                {['About Us', 'Blog', 'Careers', 'Contact'].map((l) => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2.5 text-sm">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'].map((l) => (
                  <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <p>© {new Date().getFullYear()} Resumora. All rights reserved.</p>
            <p className="flex items-center gap-1.5">Built for ambitious professionals worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

