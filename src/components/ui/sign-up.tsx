import { cn } from "@/lib/utils";
import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useCallback,
  createContext,
  Children,
} from "react";
import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  ArrowRight,
  Mail,
  Gem,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  X,
  AlertCircle,
  PartyPopper,
  Loader,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useInView,
  type Variants,
  type Transition,
} from "framer-motion";
import type {
  GlobalOptions as ConfettiGlobalOptions,
  CreateTypes as ConfettiInstance,
  Options as ConfettiOptions,
} from "canvas-confetti";
import confetti from "canvas-confetti";

// ── Confetti ──────────────────────────────────────────────
type Api = { fire: (options?: ConfettiOptions) => void };
export type ConfettiRef = Api | null;
const ConfettiContext = createContext({} as Api);

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

interface ConfettiComponentProps extends React.ComponentPropsWithRef<"canvas"> {
  options?: ConfettiOptions;
  globalOptions?: ConfettiGlobalOptions;
  manualstart?: boolean;
}

const Confetti = forwardRef<Api, ConfettiComponentProps>((props, ref) => {
  const {
    options,
    globalOptions = { resize: true, useWorker: true },
    manualstart = false,
    ...rest
  } = props;
  const instanceRef = useRef<ConfettiInstance | null>(null);

  const canvasRef = useCallback(
    (node: HTMLCanvasElement | null) => {
      if (node !== null) {
        if (instanceRef.current) return;
        instanceRef.current = confetti.create(node, {
          ...globalOptions,
          resize: true,
        });
      } else {
        if (instanceRef.current) {
          instanceRef.current.reset();
          instanceRef.current = null;
        }
      }
    },
    [globalOptions]
  );

  const fire = useCallback(
    (opts: ConfettiOptions = {}) =>
      instanceRef.current?.({ ...options, ...opts }),
    [options]
  );

  const api = useMemo(() => ({ fire }), [fire]);
  useImperativeHandle(ref, () => api, [api]);

  useEffect(() => {
    if (!manualstart) fire();
  }, [manualstart, fire]);

  return (
    <canvas
      ref={canvasRef}
      {...rest}
      className={cn("pointer-events-none fixed inset-0 z-[100] size-full", rest.className)}
    />
  );
});
Confetti.displayName = "Confetti";

// ── TextLoop ──────────────────────────────────────────────
type TextLoopProps = {
  children: React.ReactNode[];
  className?: string;
  interval?: number;
  transition?: Transition;
  variants?: Variants;
  onIndexChange?: (index: number) => void;
  stopOnEnd?: boolean;
};

export function TextLoop({
  children,
  className,
  interval = 2,
  transition = { duration: 0.3 },
  variants,
  onIndexChange,
  stopOnEnd = false,
}: TextLoopProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = Children.toArray(children);

  useEffect(() => {
    const intervalMs = interval * 1000;
    const timer = setInterval(() => {
      setCurrentIndex((current) => {
        if (stopOnEnd && current === items.length - 1) {
          clearInterval(timer);
          return current;
        }
        const next = (current + 1) % items.length;
        onIndexChange?.(next);
        return next;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [items.length, interval, onIndexChange, stopOnEnd]);

  const motionVariants: Variants = variants ?? {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  };

  return (
    <div className={cn("relative inline-block overflow-hidden", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={currentIndex}
          variants={motionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
        >
          {items[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── BlurFade ──────────────────────────────────────────────
interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  variant?: { hidden: { y: number }; visible: { y: number } };
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: string;
  blur?: string;
}

function BlurFade({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  inView = true,
  inViewMargin = "-50px",
  blur = "6px",
}: BlurFadeProps) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin });
  const isInView = !inView || inViewResult;
  const defaultVariants: Variants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: -yOffset, opacity: 1, filter: `blur(0px)` },
  };
  const combinedVariants = variant || defaultVariants;
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={combinedVariants}
      transition={{ delay, duration, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── GlassButton ──────────────────────────────────────────
const glassButtonVariants = cva(
  "relative isolate all-unset cursor-pointer rounded-full transition-all",
  {
    variants: {
      size: {
        default: "text-base font-medium",
        sm: "text-sm font-medium",
        lg: "text-lg font-medium",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { size: "default" },
  }
);

const glassButtonTextVariants = cva(
  "glass-button-text relative block select-none tracking-tighter",
  {
    variants: {
      size: {
        default: "px-6 py-3.5",
        sm: "px-4 py-2",
        lg: "px-8 py-4",
        icon: "flex h-10 w-10 items-center justify-center",
      },
    },
    defaultVariants: { size: "default" },
  }
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  contentClassName?: string;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, children, size, contentClassName, onClick, ...props }, ref) => {
    const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const button = e.currentTarget.querySelector("button");
      if (button && e.target !== button) button.click();
    };
    return (
      <div className="glass-button-wrap" onClick={handleWrapperClick}>
        <button
          ref={ref}
          className={cn("glass-button", glassButtonVariants({ size, className }))}
          onClick={onClick}
          {...props}
        >
          <span className={cn(glassButtonTextVariants({ size }), contentClassName)}>
            {children}
          </span>
          <div className="glass-button-shadow" />
        </button>
      </div>
    );
  }
);
GlassButton.displayName = "GlassButton";

// ── Gradient Background ──────────────────────────────────
const GradientBackground = () => (
  <>
    <style>{`
      @keyframes float1 { 0% { transform: translate(0,0); } 50% { transform: translate(-10px,10px); } 100% { transform: translate(0,0); } }
      @keyframes float2 { 0% { transform: translate(0,0); } 50% { transform: translate(10px,-10px); } 100% { transform: translate(0,0); } }
    `}</style>
    <svg className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-50" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="g1" cx="30%" cy="30%" r="60%">
          <stop offset="0%" stopColor="hsl(var(--neon-purple))" stopOpacity="0.15" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="g2" cx="70%" cy="70%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--neon-cyan))" stopOpacity="0.12" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g1)" className="animate-[float1_8s_ease-in-out_infinite]" />
      <rect width="100%" height="100%" fill="url(#g2)" className="animate-[float2_10s_ease-in-out_infinite]" />
    </svg>
  </>
);

// ── Icons ────────────────────────────────────────────────
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

// ── Modal Steps ──────────────────────────────────────────
const modalSteps = [
  { message: "Signing you up...", icon: <Loader className="h-8 w-8 animate-spin text-neon-cyan" /> },
  { message: "Onboarding you...", icon: <Gem className="h-8 w-8 text-neon-purple" /> },
  { message: "Finalizing...", icon: <Lock className="h-8 w-8 text-neon-blue" /> },
  { message: "Welcome Aboard!", icon: <PartyPopper className="h-8 w-8 text-neon-cyan" /> },
];
const TEXT_LOOP_INTERVAL = 1.5;

// ── Default Logo ─────────────────────────────────────────
const DefaultLogo = () => (
  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neon-purple to-neon-cyan">
    <Gem className="h-5 w-5 text-primary-foreground" />
  </div>
);

// ── Main Component ───────────────────────────────────────
interface AuthComponentProps {
  logo?: React.ReactNode;
  brandName?: string;
  onSubmit?: (email: string, password: string) => Promise<void>;
  onGoogleClick?: () => void;
  onGitHubClick?: () => void;
  isLogin?: boolean;
  onToggleMode?: () => void;
  errorMessage?: string;
}

export const AuthComponent = ({
  logo = <DefaultLogo />,
  brandName = "TruthLens AI",
  onSubmit,
  onGoogleClick,
  onGitHubClick,
  isLogin = false,
  onToggleMode,
  errorMessage,
}: AuthComponentProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authStep, setAuthStep] = useState<"email" | "password" | "confirmPassword">("email");
  const [modalStatus, setModalStatus] = useState<"closed" | "loading" | "error" | "success">("closed");
  const [modalErrorMessage, setModalErrorMessage] = useState("");
  const confettiRef = useRef<Api>(null);

  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const isPasswordValid = password.length >= 6;
  const isConfirmPasswordValid = confirmPassword.length >= 6;

  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

  const fireSideCanons = () => {
    const fire = confettiRef.current?.fire;
    if (fire) {
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
      const particleCount = 50;
      fire({ ...defaults, particleCount, origin: { x: 0, y: 1 }, angle: 60 });
      fire({ ...defaults, particleCount, origin: { x: 1, y: 1 }, angle: 120 });
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalStatus !== "closed") return;

    // Login mode: submit directly from password step
    if (isLogin && authStep === "password") {
      setModalStatus("loading");
      try {
        await onSubmit?.(email, password);
        fireSideCanons();
        setModalStatus("success");
      } catch (error: unknown) {
        setModalErrorMessage(getErrorMessage(error, "Login failed"));
        setModalStatus("error");
      }
      return;
    }

    // Sign-up mode: confirm password step
    if (authStep !== "confirmPassword") return;
    if (password !== confirmPassword) {
      setModalErrorMessage("Passwords do not match!");
      setModalStatus("error");
      return;
    }

    setModalStatus("loading");
    try {
      await onSubmit?.(email, password);
      const loadingStepsCount = modalSteps.length - 1;
      const totalDuration = loadingStepsCount * TEXT_LOOP_INTERVAL * 1000;
      setTimeout(() => {
        fireSideCanons();
        setModalStatus("success");
      }, totalDuration);
    } catch (error: unknown) {
      setModalErrorMessage(getErrorMessage(error, "Something went wrong"));
      setModalStatus("error");
    }
  };

  const triggerFinalSubmit = () => {
    const form = document.createElement("form");
    const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
    Object.defineProperty(submitEvent, "currentTarget", { value: form });
    void handleFinalSubmit(submitEvent as unknown as React.FormEvent);
  };

  const handleProgressStep = () => {
    if (authStep === "email" && isEmailValid) {
      setAuthStep("password");
    } else if (authStep === "password") {
      if (isLogin && isPasswordValid) {
        triggerFinalSubmit();
      } else if (isPasswordValid) {
        setAuthStep("confirmPassword");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleProgressStep();
    }
  };

  const handleGoBack = () => {
    if (authStep === "confirmPassword") {
      setAuthStep("password");
      setConfirmPassword("");
    } else if (authStep === "password") {
      setAuthStep("email");
    }
  };

  const closeModal = () => {
    setModalStatus("closed");
    setModalErrorMessage("");
  };

  useEffect(() => {
    if (authStep === "password")
      setTimeout(() => passwordInputRef.current?.focus(), 500);
    else if (authStep === "confirmPassword")
      setTimeout(() => confirmPasswordInputRef.current?.focus(), 500);
  }, [authStep]);

  // Reset step when toggling login/signup
  useEffect(() => {
    setAuthStep("email");
    setPassword("");
    setConfirmPassword("");
  }, [isLogin]);

  // ── Modal ──────────────────────────────────────────
  const Modal = () => (
    <AnimatePresence>
      {modalStatus !== "closed" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative mx-4 w-full max-w-sm rounded-2xl border border-glass-border bg-card p-8 text-center shadow-2xl"
          >
            {(modalStatus === "error" || modalStatus === "success") && (
              <button
                onClick={closeModal}
                title="Close dialog"
                aria-label="Close dialog"
                className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {modalStatus === "error" && (
              <>
                <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
                <p className="text-lg font-medium text-foreground">{modalErrorMessage}</p>
                <GlassButton onClick={closeModal} className="mt-6" size="sm">
                  Try Again
                </GlassButton>
              </>
            )}

            {modalStatus === "loading" && (
              <div className="flex flex-col items-center gap-4">
                <TextLoop interval={TEXT_LOOP_INTERVAL} stopOnEnd>
                  {modalSteps.slice(0, -1).map((step, i) => (
                    <div key={i} className="flex flex-col items-center gap-3">
                      {step.icon}
                      <p className="text-lg font-medium text-foreground">{step.message}</p>
                    </div>
                  ))}
                </TextLoop>
              </div>
            )}

            {modalStatus === "success" && (
              <div className="flex flex-col items-center gap-3">
                {modalSteps[modalSteps.length - 1].icon}
                <p className="text-lg font-medium text-foreground">
                  {modalSteps[modalSteps.length - 1].message}
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background p-4">
      <style>{`
        @property --angle-1 { syntax: "<angle>"; inherits: false; initial-value: -75deg; }
        @property --angle-2 { syntax: "<angle>"; inherits: false; initial-value: -45deg; }
        .glass-button-wrap { --anim-time: 400ms; --anim-ease: cubic-bezier(0.25, 1, 0.5, 1); --border-width: clamp(1px, 0.0625em, 4px); position: relative; z-index: 2; transform-style: preserve-3d; transition: transform var(--anim-time) var(--anim-ease); }
        .glass-button-wrap:has(.glass-button:active) { transform: rotateX(25deg); }
        .glass-button-shadow { --shadow-cutoff-fix: 2em; position: absolute; width: calc(100% + var(--shadow-cutoff-fix)); height: calc(100% + var(--shadow-cutoff-fix)); top: calc(0% - var(--shadow-cutoff-fix) / 2); left: calc(0% - var(--shadow-cutoff-fix) / 2); filter: blur(clamp(2px, 0.125em, 12px)); transition: filter var(--anim-time) var(--anim-ease); pointer-events: none; z-index: 0; }
        .glass-button-shadow::after { content: ""; position: absolute; inset: 0; border-radius: 9999px; background: linear-gradient(180deg, oklch(from var(--foreground) l c h / 20%), oklch(from var(--foreground) l c h / 10%)); width: calc(100% - var(--shadow-cutoff-fix) - 0.25em); height: calc(100% - var(--shadow-cutoff-fix) - 0.25em); top: calc(var(--shadow-cutoff-fix) - 0.5em); left: calc(var(--shadow-cutoff-fix) - 0.875em); padding: 0.125em; box-sizing: border-box; mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude; transition: all var(--anim-time) var(--anim-ease); opacity: 1; }
        .glass-button { -webkit-tap-highlight-color: transparent; backdrop-filter: blur(clamp(1px, 0.125em, 4px)); transition: all var(--anim-time) var(--anim-ease); background: linear-gradient(-75deg, oklch(from var(--background) l c h / 5%), oklch(from var(--background) l c h / 20%), oklch(from var(--background) l c h / 5%)); box-shadow: inset 0 0.125em 0.125em oklch(from var(--foreground) l c h / 5%), inset 0 -0.125em 0.125em oklch(from var(--background) l c h / 50%), 0 0.25em 0.125em -0.125em oklch(from var(--foreground) l c h / 20%), 0 0 0.1em 0.25em inset oklch(from var(--background) l c h / 20%), 0 0 0 0 oklch(from var(--background) l c h); }
        .glass-button:hover { transform: scale(0.975); backdrop-filter: blur(0.01em); box-shadow: inset 0 0.125em 0.125em oklch(from var(--foreground) l c h / 5%), inset 0 -0.125em 0.125em oklch(from var(--background) l c h / 50%), 0 0.15em 0.05em -0.1em oklch(from var(--foreground) l c h / 25%), 0 0 0.05em 0.1em inset oklch(from var(--background) l c h / 50%), 0 0 0 0 oklch(from var(--background) l c h); }
        .glass-button-text { color: oklch(from var(--foreground) l c h / 90%); text-shadow: 0em 0.25em 0.05em oklch(from var(--foreground) l c h / 10%); transition: all var(--anim-time) var(--anim-ease); }
        .glass-button:hover .glass-button-text { text-shadow: 0.025em 0.025em 0.025em oklch(from var(--foreground) l c h / 12%); }
        .glass-button-text::after { content: ""; display: block; position: absolute; width: calc(100% - var(--border-width)); height: calc(100% - var(--border-width)); top: calc(0% + var(--border-width) / 2); left: calc(0% + var(--border-width) / 2); box-sizing: border-box; border-radius: 9999px; overflow: clip; background: linear-gradient(var(--angle-2), transparent 0%, oklch(from var(--background) l c h / 50%) 40% 50%, transparent 55%); z-index: 3; mix-blend-mode: screen; pointer-events: none; background-size: 200% 200%; background-position: 0% 50%; transition: background-position calc(var(--anim-time) * 1.25) var(--anim-ease), --angle-2 calc(var(--anim-time) * 1.25) var(--anim-ease); }
        .glass-button:hover .glass-button-text::after { background-position: 25% 50%; }
        .glass-button:active .glass-button-text::after { background-position: 50% 15%; --angle-2: -15deg; }
        .glass-button::after { content: ""; position: absolute; z-index: 1; inset: 0; border-radius: 9999px; width: calc(100% + var(--border-width)); height: calc(100% + var(--border-width)); top: calc(0% - var(--border-width) / 2); left: calc(0% - var(--border-width) / 2); padding: var(--border-width); box-sizing: border-box; background: conic-gradient(from var(--angle-1) at 50% 50%, oklch(from var(--foreground) l c h / 50%) 0%, transparent 5% 40%, oklch(from var(--foreground) l c h / 50%) 50%, transparent 60% 95%, oklch(from var(--foreground) l c h / 50%) 100%), linear-gradient(180deg, oklch(from var(--background) l c h / 50%), oklch(from var(--background) l c h / 50%)); mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude; transition: all var(--anim-time) var(--anim-ease), --angle-1 500ms ease; box-shadow: inset 0 0 0 calc(var(--border-width) / 2) oklch(from var(--background) l c h / 50%); pointer-events: none; }
        .glass-button:hover::after { --angle-1: -125deg; }
        .glass-button:active::after { --angle-1: -75deg; }
        .glass-button-wrap:has(.glass-button:hover) .glass-button-shadow { filter: blur(clamp(2px, 0.0625em, 6px)); }
        .glass-button-wrap:has(.glass-button:hover) .glass-button-shadow::after { top: calc(var(--shadow-cutoff-fix) - 0.875em); opacity: 1; }
        .glass-button-wrap:has(.glass-button:active) .glass-button-shadow { filter: blur(clamp(2px, 0.125em, 12px)); }
        .glass-button-wrap:has(.glass-button:active) .glass-button-shadow::after { top: calc(var(--shadow-cutoff-fix) - 0.5em); opacity: 0.75; }
        .glass-button-wrap:has(.glass-button:active) .glass-button-text { text-shadow: 0.025em 0.25em 0.05em oklch(from var(--foreground) l c h / 12%); }
        .glass-button-wrap:has(.glass-button:active) .glass-button { box-shadow: inset 0 0.125em 0.125em oklch(from var(--foreground) l c h / 5%), inset 0 -0.125em 0.125em oklch(from var(--background) l c h / 50%), 0 0.125em 0.125em -0.125em oklch(from var(--foreground) l c h / 20%), 0 0 0.1em 0.25em inset oklch(from var(--background) l c h / 20%), 0 0.225em 0.05em 0 oklch(from var(--foreground) l c h / 5%), 0 0.25em 0 0 oklch(from var(--background) l c h / 75%), inset 0 0.25em 0.05em 0 oklch(from var(--foreground) l c h / 15%); }

        .glass-input-wrap { position: relative; z-index: 2; transform-style: preserve-3d; border-radius: 9999px; }
        .glass-input { display: flex; position: relative; width: 100%; align-items: center; gap: 0.5rem; border-radius: 9999px; padding: 0.25rem; -webkit-tap-highlight-color: transparent; backdrop-filter: blur(clamp(1px, 0.125em, 4px)); transition: all 400ms cubic-bezier(0.25, 1, 0.5, 1); background: linear-gradient(-75deg, oklch(from var(--background) l c h / 5%), oklch(from var(--background) l c h / 20%), oklch(from var(--background) l c h / 5%)); box-shadow: inset 0 0.125em 0.125em oklch(from var(--foreground) l c h / 5%), inset 0 -0.125em 0.125em oklch(from var(--background) l c h / 50%), 0 0.25em 0.125em -0.125em oklch(from var(--foreground) l c h / 20%), 0 0 0.1em 0.25em inset oklch(from var(--background) l c h / 20%); }
        .glass-input-wrap:focus-within .glass-input { backdrop-filter: blur(0.01em); box-shadow: inset 0 0.125em 0.125em oklch(from var(--foreground) l c h / 5%), inset 0 -0.125em 0.125em oklch(from var(--background) l c h / 50%), 0 0.15em 0.05em -0.1em oklch(from var(--foreground) l c h / 25%), 0 0 0.05em 0.1em inset oklch(from var(--background) l c h / 50%); }
        .glass-input::after { content: ""; position: absolute; z-index: 1; inset: 0; border-radius: 9999px; width: calc(100% + clamp(1px, 0.0625em, 4px)); height: calc(100% + clamp(1px, 0.0625em, 4px)); top: calc(0% - clamp(1px, 0.0625em, 4px) / 2); left: calc(0% - clamp(1px, 0.0625em, 4px) / 2); padding: clamp(1px, 0.0625em, 4px); box-sizing: border-box; background: conic-gradient(from var(--angle-1) at 50% 50%, oklch(from var(--foreground) l c h / 50%) 0%, transparent 5% 40%, oklch(from var(--foreground) l c h / 50%) 50%, transparent 60% 95%, oklch(from var(--foreground) l c h / 50%) 100%), linear-gradient(180deg, oklch(from var(--background) l c h / 50%), oklch(from var(--background) l c h / 50%)); mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude; transition: all 400ms cubic-bezier(0.25, 1, 0.5, 1), --angle-1 500ms ease; box-shadow: inset 0 0 0 calc(clamp(1px, 0.0625em, 4px) / 2) oklch(from var(--background) l c h / 50%); pointer-events: none; }
        .glass-input-wrap:focus-within .glass-input::after { --angle-1: -125deg; }
        .glass-input-text-area { position: absolute; inset: 0; border-radius: 9999px; pointer-events: none; }
        .glass-input-text-area::after { content: ""; display: block; position: absolute; width: calc(100% - clamp(1px, 0.0625em, 4px)); height: calc(100% - clamp(1px, 0.0625em, 4px)); top: calc(0% + clamp(1px, 0.0625em, 4px) / 2); left: calc(0% + clamp(1px, 0.0625em, 4px) / 2); box-sizing: border-box; border-radius: 9999px; overflow: clip; background: linear-gradient(var(--angle-2), transparent 0%, oklch(from var(--background) l c h / 50%) 40% 50%, transparent 55%); z-index: 3; mix-blend-mode: screen; pointer-events: none; background-size: 200% 200%; background-position: 0% 50%; transition: background-position calc(400ms * 1.25) cubic-bezier(0.25, 1, 0.5, 1), --angle-2 calc(400ms * 1.25) cubic-bezier(0.25, 1, 0.5, 1); }
        .glass-input-wrap:focus-within .glass-input-text-area::after { background-position: 25% 50%; }
      `}</style>

      <GradientBackground />
      <Confetti ref={confettiRef} manualstart />
      <Modal />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <BlurFade delay={0.1}>
          <div className="mb-8 flex items-center justify-center gap-3">
            {logo}
            <span className="font-display text-2xl font-bold gradient-text">{brandName}</span>
          </div>
        </BlurFade>

        {/* Card */}
        <BlurFade delay={0.2}>
          <div className="rounded-2xl border border-glass-border bg-card/60 backdrop-blur-xl p-8">
            <form onSubmit={handleFinalSubmit}>
              <AnimatePresence mode="wait">
                {/* Step titles */}
                <motion.div
                  key={authStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {authStep === "email" && (
                    <>
                      <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                        {isLogin ? "Welcome Back" : "Get started with Us"}
                      </h2>
                      <p className="text-sm text-muted-foreground mb-6">Continue with</p>

                      {/* Social buttons */}
                      <div className="flex gap-3 mb-6">
                        {onGoogleClick && (
                          <GlassButton
                            type="button"
                            onClick={onGoogleClick}
                            className="flex-1"
                            size="sm"
                          >
                            <span className="flex items-center justify-center gap-2">
                              <GoogleIcon className="h-4 w-4" />
                              Google
                            </span>
                          </GlassButton>
                        )}
                        {onGitHubClick && (
                          <GlassButton
                            type="button"
                            onClick={onGitHubClick}
                            className="flex-1"
                            size="sm"
                          >
                            <span className="flex items-center justify-center gap-2">
                              <GitHubIcon className="h-4 w-4" />
                              GitHub
                            </span>
                          </GlassButton>
                        )}
                      </div>

                      <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-glass-border" />
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-card/60 px-3 text-xs text-muted-foreground font-mono uppercase tracking-widest">
                            OR
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {authStep === "password" && (
                    <>
                      <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                        {isLogin ? "Enter your password" : "Create your password"}
                      </h2>
                      <p className="text-sm text-muted-foreground mb-6">
                        {isLogin
                          ? "Sign in to your account"
                          : "Your password must be at least 6 characters long."}
                      </p>
                    </>
                  )}

                  {authStep === "confirmPassword" && (
                    <>
                      <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                        One Last Step
                      </h2>
                      <p className="text-sm text-muted-foreground mb-6">
                        Confirm your password to continue
                      </p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Input fields */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={authStep + "-input"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Email + password input (email step & password step) */}
                  {authStep !== "confirmPassword" && (
                    <div className="space-y-4">
                      {/* Email input */}
                      <div className="glass-input-wrap">
                        <div className="glass-input">
                          <div className="glass-input-text-area" />
                          <div className="relative z-10 flex w-full items-center">
                            <AnimatePresence>
                              {authStep === "password" && (
                                <motion.span
                                  initial={{ width: 0, opacity: 0 }}
                                  animate={{ width: "auto", opacity: 1 }}
                                  exit={{ width: 0, opacity: 0 }}
                                  className="ml-3 text-xs text-muted-foreground font-mono overflow-hidden whitespace-nowrap"
                                >
                                  Email
                                </motion.span>
                              )}
                            </AnimatePresence>
                            <div
                              className={cn(
                                "flex items-center justify-center transition-all duration-300",
                                email.length > 20 && authStep === "email"
                                  ? "w-0 px-0"
                                  : "w-10 pl-2"
                              )}
                            >
                              <Mail className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <input
                              type="email"
                              placeholder="Your email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              onKeyDown={handleKeyDown}
                              readOnly={authStep !== "email"}
                              className={cn(
                                "relative z-10 h-full w-0 flex-grow bg-transparent py-3.5 text-foreground placeholder:text-muted-foreground/60 focus:outline-none transition-[padding-right] duration-300 ease-in-out delay-300",
                                isEmailValid && authStep === "email" ? "pr-2" : "pr-4"
                              )}
                            />
                            <AnimatePresence>
                              {isEmailValid && authStep === "email" && (
                                <motion.div
                                  initial={{ width: 0, opacity: 0 }}
                                  animate={{ width: "auto", opacity: 1 }}
                                  exit={{ width: 0, opacity: 0 }}
                                >
                                  <GlassButton
                                    type="button"
                                    onClick={handleProgressStep}
                                    size="sm"
                                  >
                                    <ArrowRight className="h-4 w-4" />
                                  </GlassButton>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>

                      {/* Password input (only in password step) */}
                      {authStep === "password" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-3"
                        >
                          <div className="glass-input-wrap">
                            <div className="glass-input">
                              <div className="glass-input-text-area" />
                              <div className="relative z-10 flex w-full items-center">
                                <AnimatePresence>
                                  {password.length > 0 && (
                                    <motion.span
                                      initial={{ width: 0, opacity: 0 }}
                                      animate={{ width: "auto", opacity: 1 }}
                                      exit={{ width: 0, opacity: 0 }}
                                      className="ml-3 text-xs text-muted-foreground font-mono overflow-hidden whitespace-nowrap"
                                    >
                                      Password
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                                <div className="flex w-10 items-center justify-center pl-2">
                                  <Lock className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <input
                                  ref={passwordInputRef}
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Create a password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  onKeyDown={handleKeyDown}
                                  className="relative z-10 h-full w-0 flex-grow bg-transparent py-3.5 text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                                />
                                <div className="pr-1">
                                  {isPasswordValid ? (
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="rounded-full p-2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                      {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </button>
                                  ) : (
                                    <Lock className="mr-2 h-4 w-4 text-muted-foreground/30" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={handleGoBack}
                              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
                            >
                              <ArrowLeft className="h-3 w-3" />
                              Go back
                            </button>

                            {isPasswordValid && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                              >
                                <GlassButton
                                  type={isLogin ? "submit" : "button"}
                                  onClick={isLogin ? undefined : handleProgressStep}
                                  size="sm"
                                >
                                  <span className="flex items-center gap-2">
                                    {isLogin ? "Sign In" : "Continue"}
                                    <ArrowRight className="h-4 w-4" />
                                  </span>
                                </GlassButton>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Confirm password (signup only) */}
                  {authStep === "confirmPassword" && (
                    <div className="space-y-3">
                      <div className="glass-input-wrap">
                        <div className="glass-input">
                          <div className="glass-input-text-area" />
                          <div className="relative z-10 flex w-full items-center">
                            <AnimatePresence>
                              {confirmPassword.length > 0 && (
                                <motion.span
                                  initial={{ width: 0, opacity: 0 }}
                                  animate={{ width: "auto", opacity: 1 }}
                                  exit={{ width: 0, opacity: 0 }}
                                  className="ml-3 text-xs text-muted-foreground font-mono overflow-hidden whitespace-nowrap"
                                >
                                  Confirm Password
                                </motion.span>
                              )}
                            </AnimatePresence>
                            <div className="flex w-10 items-center justify-center pl-2">
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <input
                              ref={confirmPasswordInputRef}
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="relative z-10 h-full w-0 flex-grow bg-transparent py-3.5 text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                            />
                            <div className="pr-1">
                              {isConfirmPasswordValid ? (
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="rounded-full p-2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </button>
                              ) : (
                                <Lock className="mr-2 h-4 w-4 text-muted-foreground/30" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={handleGoBack}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
                        >
                          <ArrowLeft className="h-3 w-3" />
                          Go back
                        </button>

                        {isConfirmPasswordValid && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            <GlassButton type="submit" size="sm">
                              <span className="flex items-center gap-2">
                                Create Account
                                <ArrowRight className="h-4 w-4" />
                              </span>
                            </GlassButton>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </form>

            {/* Toggle mode */}
            <div className="mt-6 text-center">
              <button
                onClick={onToggleMode}
                className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors font-mono"
              >
                {isLogin ? (
                  <>
                    New agent?{" "}
                    <span className="text-neon-cyan/80 hover:text-neon-cyan">
                      Create account →
                    </span>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <span className="text-neon-cyan/80 hover:text-neon-cyan">
                      Sign in →
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Forgot password (login only) */}
            {isLogin && authStep === "password" && (
              <div className="mt-3 text-center">
                <a
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-neon-cyan transition-colors font-mono"
                >
                  Reset credentials →
                </a>
              </div>
            )}
          </div>
        </BlurFade>
      </div>
    </div>
  );
};
