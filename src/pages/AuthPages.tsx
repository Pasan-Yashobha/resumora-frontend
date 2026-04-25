import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RiEyeLine, RiEyeOffLine, RiFileTextLine, RiArrowRightLine,
  RiMailSendLine, RiRefreshLine, RiCheckLine,
} from 'react-icons/ri';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/auth';
import toast from 'react-hot-toast';

/*  Shared Auth Layout  */
const AuthLayout: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 mesh-gradient dot-pattern">
    <div className="w-full max-w-sm">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-md">
            <RiFileTextLine className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-xl font-semibold text-gray-900">Resumora</span>
        </Link>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-8 shadow-xl">
        <div className="mb-7">
          <h1 className="font-display text-2xl font-semibold text-gray-900 mb-1.5">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {children}
      </motion.div>
    </div>
  </div>
);

/* Login  */
export const LoginPage: React.FC = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authApi.login(form);
      setUser(res, res.token);
      toast.success(`Welcome back, ${res.name}!`);
      navigate('/dashboard');
    } catch (err: any) {
      const msg: string = err.response?.data?.message || '';
      if (msg.toLowerCase().includes('verify')) {
        setNeedsVerification(true);
      } else {
        toast.error(msg || 'Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (needsVerification) {
    return (
      <AuthLayout title="Verify your email" subtitle="">
        <ResendVerificationPanel email={form.email} onBack={() => setNeedsVerification(false)} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue building your career identity">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Email" type="email" placeholder="you@example.com"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email} autoComplete="email"
        />
        <Input
          label="Password" type={showPw ? 'text' : 'password'} placeholder="••••••••"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password} autoComplete="current-password"
          rightElement={
            <button type="button" onClick={() => setShowPw(!showPw)}>
              {showPw ? <RiEyeOffLine className="w-4 h-4" /> : <RiEyeLine className="w-4 h-4" />}
            </button>
          }
        />
        <Button type="submit" size="lg" isLoading={loading} className="mt-2" rightIcon={<RiArrowRightLine className="w-4 h-4" />}>
          Sign in
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">Create one free</Link>
      </p>
      <p className="mt-2 text-center text-sm text-gray-400">
        <Link to="/resend-verification" className="hover:text-primary-600 transition-colors">Didn't receive verification email?</Link>
      </p>
    </AuthLayout>
  );
};

/*  Register  */
export const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name || form.name.length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password.length > 15) e.password = 'Password must be at most 15 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await authApi.register({ name: form.name, email: form.email, password: form.password });
      setSuccess(true);
    } catch (err: any) {
      const data = err.response?.data;
      const msg = data?.message || data?.errors || 'Registration failed.';
      toast.error(typeof msg === 'string' ? msg : 'This email may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  /* Success screen — with resend button */
  if (success) {
    return (
      <AuthLayout title="Check your email" subtitle="">
        <VerificationSentScreen email={form.email} onBack={() => navigate('/login')} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start building your career identity today - it's free">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Full name" type="text" placeholder="Pasan Yashobha"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name} autoComplete="name"
        />
        <Input
          label="Email" type="email" placeholder="you@example.com"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email} autoComplete="email"
        />
        <Input
          label="Password" type={showPw ? 'text' : 'password'} placeholder="6-15 characters"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password} autoComplete="new-password"
          rightElement={
            <button type="button" onClick={() => setShowPw(!showPw)}>
              {showPw ? <RiEyeOffLine className="w-4 h-4" /> : <RiEyeLine className="w-4 h-4" />}
            </button>
          }
        />
        <Input
          label="Confirm password" type={showPw ? 'text' : 'password'} placeholder="Repeat your password"
          value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          error={errors.confirm} autoComplete="new-password"
        />
        <Button type="submit" size="lg" isLoading={loading} className="mt-2" rightIcon={<RiArrowRightLine className="w-4 h-4" />}>
          Create account
        </Button>
        <p className="text-xs text-gray-400 text-center">
          By registering you agree to our{' '}
          <a href="#" className="underline hover:text-gray-600">Terms of Service</a> and{' '}
          <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.
        </p>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">Sign in</Link>
      </p>
    </AuthLayout>
  );
};

/* Verification Sent Screen (shown after registration) */
const VerificationSentScreen: React.FC<{ email: string; onBack: () => void }> = ({ email, onBack }) => {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    setResending(true);
    try {
      await authApi.resendVerification(email);
      setResent(true);
      toast.success('Verification email resent!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to resend. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="text-center">
      {/* Icon */}
      <div className="w-16 h-16 mx-auto mb-5 rounded-2xl gradient-bg flex items-center justify-center">
        <RiMailSendLine className="w-8 h-8 text-white" />
      </div>

      {/* Message */}
      <p className="text-gray-600 text-sm leading-relaxed mb-2">
        We sent a verification link to
      </p>
      <p className="font-semibold text-gray-900 text-sm mb-5">{email}</p>
      <p className="text-gray-500 text-xs mb-6 leading-relaxed">
        Click the link in that email to activate your account. Check your spam folder if you don't see it.
      </p>

      {/* Resend button */}
      {resent ? (
        <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 rounded-xl py-3 px-4 mb-4">
          <RiCheckLine className="w-4 h-4" />
          Verification email resent successfully!
        </div>
      ) : (
        <Button
          variant="outline"
          size="md"
          className="w-full mb-3"
          onClick={handleResend}
          isLoading={resending}
          leftIcon={<RiRefreshLine className="w-4 h-4" />}
        >
          Resend verification email
        </Button>
      )}

      {/* Back to sign in */}
      <Button variant="ghost" size="md" className="w-full" onClick={onBack}>
        Back to sign in
      </Button>
    </div>
  );
};

/* Resend Verification Panel (reusable, used on login error) */
export const ResendVerificationPanel: React.FC<{ email?: string; onBack?: () => void }> = ({
  email: initialEmail = '',
  onBack,
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await authApi.resendVerification(email);
      setSent(true);
      toast.success('Verification email sent!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to resend. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-2xl text-amber-500">
        <RiMailSendLine />
      </div>
      <p className="text-sm text-gray-600 text-center leading-relaxed">
        Your email address is not yet verified. Enter your email below to receive a new verification link.
      </p>
      {!sent ? (
        <>
          <Input
            label="Email address" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <Button
            onClick={handleResend} isLoading={loading} disabled={!email}
            leftIcon={<RiRefreshLine className="w-4 h-4" />}
            className="w-full"
          >
            Resend verification email
          </Button>
        </>
      ) : (
        <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 rounded-xl py-3">
          <RiCheckLine className="w-4 h-4" />
          Email sent to <strong>{email}</strong>
        </div>
      )}
      {onBack && (
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700 text-center mt-1 transition-colors">
          Back to sign in
        </button>
      )}
    </div>
  );
};

/* Standalone Resend Verification Page */
export const ResendVerificationPage: React.FC = () => (
  <AuthLayout title="Resend verification" subtitle="Didn't receive the email? We'll send a new one.">
    <ResendVerificationPanel />
    <p className="mt-6 text-center text-sm text-gray-500">
      Already verified?{' '}
      <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">Sign in</Link>
    </p>
  </AuthLayout>
);
