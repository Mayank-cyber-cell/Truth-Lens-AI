'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './button';
import { AtSignIcon, ChevronLeftIcon, Mail } from 'lucide-react';
import { Input } from './input';
import { cn } from '@/lib/utils';

// ── Floating SVG Paths ──────────────────────────────────
function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(15,23,42,${0.1 + i * 0.03})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full text-neon-cyan/10" viewBox="0 0 696 316" fill="none">
        <title>Decorative Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.02}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// ── Google Icon ──────────────────────────────────────────
const GoogleIcon = (props: React.ComponentProps<'svg'>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

// ── Separator ────────────────────────────────────────────
const AuthSeparator = () => (
  <div className="relative flex items-center gap-4 py-4">
    <div className="h-px flex-1 bg-border" />
    <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">OR</span>
    <div className="h-px flex-1 bg-border" />
  </div>
);

// ── Props ────────────────────────────────────────────────
interface AuthPageProps {
  brandName?: string;
  logo?: React.ReactNode;
  testimonial?: { quote: string; author: string };
  email: string;
  onEmailChange: (email: string) => void;
  onEmailSubmit: () => void;
  onGoogleClick?: () => void;
  loading?: boolean;
  isLogin?: boolean;
  onToggleMode?: () => void;
  onBackHome?: () => void;
}

// ── Main Component ───────────────────────────────────────
export function AuthPage({
  brandName = 'TruthLens AI',
  logo,
  testimonial = {
    quote: 'This platform has revolutionized how I verify information. Fast, accurate, and indispensable.',
    author: 'A TruthLens User',
  },
  email,
  onEmailChange,
  onEmailSubmit,
  onGoogleClick,
  loading = false,
  isLogin = true,
  onToggleMode,
  onBackHome,
}: AuthPageProps) {
  return (
    <div className="flex min-h-screen w-full">
      {/* ── Left Panel ── */}
      <div className="relative hidden w-1/2 overflow-hidden bg-background lg:flex lg:flex-col lg:justify-between p-10">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          {logo}
          <span className="font-display text-xl font-bold gradient-text">{brandName}</span>
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 max-w-md"
        >
          <blockquote className="text-lg font-display text-foreground/80 leading-relaxed italic">
            "{testimonial.quote}"
          </blockquote>
          <p className="mt-4 text-sm text-muted-foreground font-mono">~ {testimonial.author}</p>
        </motion.div>

        {/* Decorative dots */}
        <div className="relative z-10 flex gap-2">
          <div className="h-2 w-2 rounded-full bg-neon-cyan/60" />
          <div className="h-2 w-2 rounded-full bg-neon-purple/40" />
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="relative flex w-full flex-col items-center justify-center bg-card p-6 lg:w-1/2">
        {/* Background subtle texture */}
        <div className="auth-grid-pattern" />

        {/* Top nav */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:hidden">
            {logo}
            <span className="font-display text-lg font-bold gradient-text">{brandName}</span>
          </div>
          <button
            onClick={onBackHome}
            className="ml-auto flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Home
          </button>
        </div>

        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-sm space-y-6"
        >
          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl font-display font-bold text-foreground">
              {isLogin ? 'Sign In' : 'Sign Up'} <span className="gradient-text">Now!</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLogin ? 'Login to your' : 'Create your'} {brandName} account.
            </p>
          </div>

          {/* Social Buttons */}
          <div className="space-y-3">
            {onGoogleClick && (
              <Button
                variant="outline"
                className="w-full justify-start gap-3 h-11 rounded-lg border-border hover:bg-muted/50 transition-colors"
                onClick={onGoogleClick}
              >
                <GoogleIcon className="h-5 w-5" />
                Continue with Google
              </Button>
            )}
          </div>

          <AuthSeparator />

          {/* Email Form */}
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter your email address to {isLogin ? 'sign in or create' : 'create'} an account
            </p>
            <div className="relative">
              <Input
                placeholder="agent@truthlens.ai"
                className="peer ps-9 h-11 rounded-lg"
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onEmailSubmit()}
              />
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                <AtSignIcon size={16} strokeWidth={2} aria-hidden="true" />
              </div>
            </div>
            <Button
              className="w-full h-11 rounded-lg font-display tracking-wider uppercase text-sm bg-gradient-to-r from-neon-purple via-neon-blue to-neon-cyan text-primary-foreground hover:opacity-90 transition-opacity border-0"
              onClick={onEmailSubmit}
              disabled={loading}
            >
              {loading ? (
                <motion.div
                  className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                `Continue With Email`
              )}
            </Button>
          </div>

          {/* Toggle & Terms */}
          <div className="space-y-4 pt-2">
            <button
              onClick={onToggleMode}
              className="w-full text-center text-sm text-muted-foreground hover:text-neon-cyan transition-colors font-mono"
            >
              {isLogin ? (
                <>New agent? <span className="text-neon-cyan/80">Create account →</span></>
              ) : (
                <>Already have an account? <span className="text-neon-cyan/80">Sign in →</span></>
              )}
            </button>
            <p className="text-xs text-muted-foreground/60 text-center leading-relaxed">
              By clicking continue, you agree to our{' '}
              <a href="#" className="underline hover:text-foreground transition-colors">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="underline hover:text-foreground transition-colors">Privacy Policy</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
