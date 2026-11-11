'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { ROUTES } from '@/lib/constants/navigation';
import { cn } from '@/lib/utils';

export function LoginForm() {
  const router = useRouter();

  // Form State
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);

  // Validation & Submission States
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [authError, setAuthError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  // Informational Modals
  const [isForgotModalOpen, setIsForgotModalOpen] = React.useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = React.useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = React.useState(false);

  // Quick fill demo credentials
  const handleFillDemo = () => {
    setEmail('architect@axis-architecture.com');
    setPassword('StudioSpatial2026!');
    setEmailError('');
    setPasswordError('');
    setAuthError('');
  };

  const validate = (): boolean => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setAuthError('');

    const emailTrimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailTrimmed) {
      setEmailError('Please enter your work email address.');
      isValid = false;
    } else if (!emailRegex.test(emailTrimmed)) {
      setEmailError('Please enter a valid email address (e.g. name@studio.com).');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Please enter your password.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must contain at least 6 characters.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setAuthError('');

    // Controlled prototype authentication delay
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);

      // Smooth transition to dashboard stub
      setTimeout(() => {
        router.push(ROUTES.DASHBOARD);
      }, 450);
    }, 750);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full max-w-md mx-auto"
    >
      {/* ------------------------------------------------------------------ */}
      {/* 1. BRAND MARK & WELCOME HEADER */}
      {/* ------------------------------------------------------------------ */}
      <div className="space-y-2 mb-8">
        <div className="flex items-center justify-between">
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-axis-accent rounded-axis-xs"
          >
            <div className="w-8 h-8 rounded-axis-xs bg-[#252525] text-axis-bg flex items-center justify-center font-mono font-bold text-xs shadow-axis-xs group-hover:bg-axis-accent transition-colors">
              AX
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold tracking-wider text-axis-text-primary uppercase leading-tight">
                AXIS
              </span>
              <span className="text-[9px] font-mono tracking-widest text-axis-text-muted uppercase leading-none">
                ARCHITECTURE
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={handleFillDemo}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-axis-accent bg-axis-accent/10 hover:bg-axis-accent/15 border border-axis-accent/30 rounded-axis-xs transition-colors"
            title="Auto-fill demo credentials for immediate testing"
          >
            <Sparkles className="w-3 h-3 text-axis-accent" />
            <span>Use Demo Account</span>
          </button>
        </div>

        <div className="pt-4 space-y-1">
          <h1 className="text-2xl font-medium tracking-tight text-axis-text-primary">
            Welcome back
          </h1>
          <p className="text-xs text-axis-text-secondary leading-relaxed">
            Sign in to access your architectural projects and spatial reconstruction workspace.
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. AUTHENTICATION STATUS BANNER (Alert if needed) */}
      {/* ------------------------------------------------------------------ */}
      {authError && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-5 p-3 rounded-axis-xs bg-status-failed-bg border border-status-failed-border text-status-failed-text text-xs flex items-start gap-2.5"
          role="alert"
        >
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="leading-snug">{authError}</p>
        </motion.div>
      )}

      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-5 p-3 rounded-axis-xs bg-status-completed-bg border border-status-completed-border text-status-completed-text text-xs flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <p className="font-medium">Credentials verified. Opening workspace dashboard…</p>
        </motion.div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 3. SIGN-IN FORM */}
      {/* ------------------------------------------------------------------ */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email Address */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium text-axis-text-primary mb-1.5"
          >
            Email address
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError('');
            }}
            placeholder="you@example.com"
            leftIcon={<Mail className="w-4 h-4 text-axis-text-muted" />}
            error={emailError}
            disabled={isLoading || isSuccess}
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-axis-text-primary"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(true)}
              className="text-xs text-axis-text-secondary hover:text-axis-accent transition-colors font-medium focus-visible:outline-none focus-visible:underline"
            >
              Forgot password?
            </button>
          </div>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
              }}
              placeholder="••••••••••••"
              leftIcon={<Lock className="w-4 h-4 text-axis-text-muted" />}
              error={passwordError}
              disabled={isLoading || isSuccess}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2.5 top-[9px] text-axis-text-muted hover:text-axis-text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-axis-accent rounded p-0.5"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-axis-border text-axis-accent focus:ring-axis-accent focus:ring-offset-axis-bg rounded-axis-xs transition-colors accent-[#B85D36]"
            />
            <span className="text-xs text-axis-text-secondary hover:text-axis-text-primary">
              Remember this device
            </span>
          </label>

          <span className="text-[10px] font-mono text-axis-text-muted uppercase">
            SECURE SESSION
          </span>
        </div>

        {/* Primary Sign In Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full text-sm font-medium shadow-axis-sm"
            isLoading={isLoading}
            disabled={isLoading || isSuccess}
            rightIcon={!isLoading && <ArrowRight className="w-4 h-4" />}
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </Button>
        </div>
      </form>

      {/* ------------------------------------------------------------------ */}
      {/* 4. SOCIAL AUTHENTICATION (Google SSO) */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative my-6 flex items-center justify-center">
        <div className="w-full border-t border-axis-border" />
        <span className="absolute bg-axis-bg px-3 text-[11px] font-mono uppercase tracking-wider text-axis-text-muted">
          OR
        </span>
      </div>

      <button
        type="button"
        onClick={() => setIsGoogleModalOpen(true)}
        className="w-full h-10 px-4 rounded-axis-sm border border-axis-border bg-axis-bg-elevated hover:bg-axis-surface/60 text-xs font-medium text-axis-text-primary shadow-axis-xs hover:border-axis-border-strong active:bg-axis-surface transition-all flex items-center justify-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-axis-accent"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* ------------------------------------------------------------------ */}
      {/* 5. CREATE ACCOUNT LINK */}
      {/* ------------------------------------------------------------------ */}
      <div className="mt-8 text-center">
        <p className="text-xs text-axis-text-secondary">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={() => setIsRegisterModalOpen(true)}
            className="text-axis-accent font-medium hover:underline focus-visible:outline-none"
          >
            Create account
          </button>
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 6. MODALS FOR SECONDARY ACTIONS */}
      {/* ------------------------------------------------------------------ */}
      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Password Recovery"
        description="Enterprise Workspace Credentials"
        footer={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsForgotModalOpen(false)}
          >
            Understood
          </Button>
        }
      >
        <div className="space-y-3 text-xs text-axis-text-secondary">
          <p>
            AXIS ARCHITECTURE accounts are tied to verified studio domains. For security reasons,
            password resets are managed through your studio&apos;s workspace administrator.
          </p>
          <div className="p-3 rounded-axis-xs bg-axis-surface border border-axis-border space-y-1">
            <span className="font-mono text-[10px] text-axis-text-muted uppercase">
              RECOVERY PROTOCOL
            </span>
            <p className="font-mono text-axis-text-primary">
              Contact: support@axis-architecture.com or your firm BIM manager.
            </p>
          </div>
        </div>
      </Modal>

      {/* Create Account Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Studio Account Provisioning"
        description="AXIS Architectural Technology Platform"
        footer={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsRegisterModalOpen(false)}
          >
            Close
          </Button>
        }
      >
        <div className="space-y-3 text-xs text-axis-text-secondary">
          <p>
            New architectural organization licenses and studio seats are currently provisioned via
            enterprise access invitations in this preview phase.
          </p>
          <p>
            You may use the provided <strong>Demo Account</strong> button on the login screen to explore
            the application workflow immediately.
          </p>
        </div>
      </Modal>

      {/* Google SSO Modal */}
      <Modal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        title="Google Enterprise SSO"
        description="OAuth 2.0 Architectural Federation"
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsGoogleModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsGoogleModalOpen(false);
                handleFillDemo();
              }}
            >
              Use Demo Account Instead
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs text-axis-text-secondary">
          <p>
            Google Workspace Federated Authentication is configured for domain-authenticated
            architectural studios in Part 02 prototype mode.
          </p>
          <div className="p-3 rounded bg-axis-surface border border-axis-border font-mono text-[11px] text-axis-text-primary">
            FEDERATION STATUS: STANDBY (PROTOTYPE READY)
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
