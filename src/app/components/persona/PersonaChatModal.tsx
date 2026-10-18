// RN-029 (UI_SPEC §13.1): chat com a persona de IA do autor.
// Cota de 10 msgs/dia para gratuitos (contador + bloqueio até reset),
// badge de sinalização em respostas fora da base curada (AC-P3).

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getPersonaMessages, sendPersonaMessage, PersonaApiError,
  type PersonaMessage
} from '../../utils/persona';

interface PersonaChatModalProps {
  thinkerId: string;
  thinkerName: string;
  onClose: () => void;
}

const DAILY_QUOTA = 10;

export default function PersonaChatModal({ thinkerId, thinkerName, onClose }: PersonaChatModalProps) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<PersonaMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getPersonaMessages(thinkerId)
      .then(msgs => {
        setMessages(msgs);
        const userMsgsToday = 0; // cota reseta diariamente; remaining preciso vem do POST
        setRemaining(Math.max(0, DAILY_QUOTA - userMsgsToday));
      })
      .catch(err => {
        if (err instanceof PersonaApiError && err.code === 'ERR-141') {
          onClose(); // persona não disponível
          return;
        }
        setError(t('persona.error.load'));
      })
      .finally(() => setLoading(false));
  }, [thinkerId, onClose, t]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quotaExhausted = remaining !== null && remaining <= 0;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending || quotaExhausted) return;

    const content = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content }]);
    setSending(true);
    setError(null);

    try {
      const result = await sendPersonaMessage(thinkerId, content);
      setMessages(prev => [...prev, {
        role: 'persona', content: result.reply, flaggedOffBase: result.flaggedOffBase
      }]);
      setRemaining(result.remainingToday);
    } catch (err) {
      if (err instanceof PersonaApiError && err.code === 'ERR-140') {
        setRemaining(0);
        setError(t('persona.quotaReached'));
      } else if (err instanceof PersonaApiError && err.code === 'ERR-141') {
        onClose();
      } else {
        setError(t('persona.error.send'));
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative flex h-[80vh] w-full max-w-xl flex-col rounded-lg border border-[#8A9BB8]/30 bg-[#0F1E35] shadow-xl"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-[#8A9BB8]/20 px-4 py-3">
          <div>
            <h2 className="font-serif text-lg text-[#F2EEE2]">
              {t('persona.title', { name: thinkerName })}
            </h2>
            {remaining !== null && (
              <p className="text-xs text-[#8A9BB8]">
                {t('persona.quota', { remaining, total: DAILY_QUOTA })}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-[#8A9BB8] hover:text-white"
            aria-label={t('auth.close')}
          >
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {loading && <p className="text-center text-sm text-[#8A9BB8]">{t('persona.loading')}</p>}

          {!loading && messages.length === 0 && (
            <p className="mt-8 text-center text-sm text-[#8A9BB8]">
              {t('persona.empty', { name: thinkerName })}
            </p>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                msg.role === 'user'
                  ? 'ml-auto bg-[#C9A84C] text-[#0F1E35]'
                  : 'mr-auto bg-[#1C2E44] text-[#EDE8D8]'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.flaggedOffBase && (
                <p className="mt-1.5 flex items-center gap-1 text-[10px] text-[#C9A84C]">
                  ⚠ {t('persona.offBaseBadge')}
                </p>
              )}
            </div>
          ))}

          {sending && (
            <div className="mr-auto max-w-[85%] rounded-lg bg-[#1C2E44] px-3 py-2 text-sm text-[#8A9BB8]">
              {t('persona.typing')}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {error && (
          <p className="mx-4 mb-2 rounded bg-red-900/40 px-3 py-2 text-xs text-red-200" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="flex gap-2 border-t border-[#8A9BB8]/20 p-3">
          <input
            type="text" value={input}
            onChange={e => setInput(e.target.value)}
            disabled={sending || quotaExhausted}
            placeholder={quotaExhausted ? t('persona.quotaReached') : t('persona.placeholder')}
            className="flex-1 rounded border border-[#8A9BB8]/40 bg-transparent px-3 py-2 text-sm text-[#F2EEE2] focus:border-[#C9A84C] focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={sending || quotaExhausted || !input.trim()}
            className="rounded bg-[#C9A84C] px-4 py-2 text-sm font-semibold text-[#0F1E35] hover:opacity-90 disabled:opacity-50"
          >
            {t('persona.send')}
          </button>
        </form>
      </div>
    </div>
  );
}