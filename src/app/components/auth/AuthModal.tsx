// RN-033 (UI_SPEC §12.2/§12.3): modal de autenticação com modos
// login | register | forgot | reset. Erros inline por campo (ERR-100..104)
// + toast simples para ERR-110/113. Google via GIS (VITE_GOOGLE_CLIENT_ID).

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  forgotPassword, googleLogin, login, register, resetPassword,
  type ApiError
} from '../../utils/auth';

type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

interface AuthModalProps {
  onClose: () => void;
  onAuthenticated: (user: { id: string; email: string; fullName?: string | null; emailVerified: boolean }) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (res: { credential: string }) => void }) => void;
          renderButton: (el: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export default function AuthModal({ onClose, onAuthenticated }: AuthModalProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const googleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim() ?? '';

  const setApiErrors = (errors: ApiError[]) => {
    const byField: Record<string, string> = {};
    for (const e of errors) {
      // Tradução por código (auth.errors.ERR-XXX) com fallback na mensagem da API
      const translated = e.code ? t(`auth.errors.${e.code}`) : undefined;
      const message = translated !== `auth.errors.${e.code}` ? translated : e.message;
      if (e.field && (e.code?.startsWith('ERR-10') || e.code === 'ERR-104')) {
        byField[e.field] = message;
      } else {
        setGlobalError(message);
      }
    }
    setFieldErrors(byField);
  };

  const handleError = (err: unknown) => {
    const apiErr = err as Error & { apiErrors?: ApiError[]; status?: number };
    if (apiErr.status === 429) {
      setGlobalError(t('auth.errors.rateLimited'));
      return;
    }
    if (apiErr.apiErrors?.length) {
      setApiErrors(apiErr.apiErrors);
    } else {
      setGlobalError(t('auth.errors.unexpected'));
    }
  };

  // Google Identity Services — botão renderizado no modo login/register
  useEffect(() => {
    if ((mode !== 'login' && mode !== 'register') || !googleClientId || !window.google) return;
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async res => {
        try {
          setBusy(true);
          const result = await googleLogin(res.credential);
          onAuthenticated(result.user);
          onClose();
        } catch (err) {
          handleError(err);
        } finally {
          setBusy(false);
        }
      }
    });
    if (googleBtnRef.current) {
      window.google.accounts.id.renderButton(googleBtnRef.current, { width: 280 });
    }
  }, [mode, googleClientId]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setGlobalError(null);
    setFieldErrors({});

    try {
      if (mode === 'login') {
        const result = await login(email, password);
        onAuthenticated(result.user);
        onClose();
      } else if (mode === 'register') {
        const result = await register(email, password, fullName || undefined);
        onAuthenticated(result.user);
        onClose();
      } else if (mode === 'forgot') {
        await forgotPassword(email);
        setInfo(t('auth.forgotSent'));
        setMode('login');
      } else {
        await resetPassword(resetToken, password);
        setInfo(t('auth.resetSuccess'));
        setMode('login');
      }
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    'w-full rounded border px-3 py-2 text-sm bg-transparent ' +
    'border-[#8A9BB8]/40 focus:border-[#C9A84C] focus:outline-none';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-md rounded-lg border border-[#8A9BB8]/30 bg-[#0F1E35] p-6 shadow-xl"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h2 className="mb-4 font-serif text-xl text-[#F2EEE2]">
          {t(`auth.title.${mode}`)}
        </h2>

        {globalError && (
          <p className="mb-3 rounded bg-red-900/40 px-3 py-2 text-sm text-red-200" role="alert">
            {globalError}
          </p>
        )}
        {info && (
          <p className="mb-3 rounded bg-[#C9A84C]/20 px-3 py-2 text-sm text-[#C9A84C]">
            {info}
          </p>
        )}

        <form onSubmit={submit} className="space-y-3">
          {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
            <div>
              <label htmlFor="auth-email" className="mb-1 block text-xs text-[#8A9BB8]">
                {t('auth.email')}
              </label>
              <input
                id="auth-email" type="email" value={email} required
                onChange={e => setEmail(e.target.value)}
                className={inputClass}
              />
              {fieldErrors.email && <p className="mt-1 text-xs text-red-300">{fieldErrors.email}</p>}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label htmlFor="auth-name" className="mb-1 block text-xs text-[#8A9BB8]">
                {t('auth.name')}
              </label>
              <input
                id="auth-name" type="text" value={fullName}
                onChange={e => setFullName(e.target.value)}
                className={inputClass}
              />
            </div>
          )}

          {mode === 'reset' && (
            <div>
              <label htmlFor="auth-token" className="mb-1 block text-xs text-[#8A9BB8]">
                {t('auth.resetToken')}
              </label>
              <input
                id="auth-token" type="text" value={resetToken} required
                onChange={e => setResetToken(e.target.value)}
                className={inputClass}
              />
              {fieldErrors.token && <p className="mt-1 text-xs text-red-300">{fieldErrors.token}</p>}
            </div>
          )}

          {(mode === 'login' || mode === 'register' || mode === 'reset') && (
            <div>
              <label htmlFor="auth-password" className="mb-1 block text-xs text-[#8A9BB8]">
                {t('auth.password')}
              </label>
              <input
                id="auth-password" type="password" value={password} required
                minLength={mode === 'login' ? undefined : 8}
                onChange={e => setPassword(e.target.value)}
                className={inputClass}
              />
              {fieldErrors.password && <p className="mt-1 text-xs text-red-300">{fieldErrors.password}</p>}
            </div>
          )}

          <button
            type="submit" disabled={busy}
            className="w-full rounded bg-[#C9A84C] px-4 py-2 text-sm font-semibold text-[#0F1E35] hover:opacity-90 disabled:opacity-50"
          >
            {busy ? t('auth.loading') : t(`auth.submit.${mode}`)}
          </button>
        </form>

        {(mode === 'login' || mode === 'register') && googleClientId && (
          <div className="my-3 flex justify-center">
            <div ref={googleBtnRef} />
          </div>
        )}

        <div className="mt-4 space-y-1 text-center text-xs text-[#8A9BB8]">
          {mode === 'login' && (
            <>
              <button className="block w-full hover:text-[#C9A84C]" onClick={() => setMode('forgot')}>
                {t('auth.link.forgot')}
              </button>
              <button className="block w-full hover:text-[#C9A84C]" onClick={() => setMode('register')}>
                {t('auth.link.register')}
              </button>
            </>
          )}
          {mode !== 'login' && (
            <button className="block w-full hover:text-[#C9A84C]" onClick={() => setMode('login')}>
              {t('auth.link.login')}
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-[#8A9BB8] hover:text-white"
          aria-label={t('auth.close')}
        >
          ✕
        </button>
      </div>
    </div>
  );
}