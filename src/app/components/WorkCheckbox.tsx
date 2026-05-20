import { Download, Check, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Work {
  title: string;
  download_url: string;
}

interface WorkCheckboxProps {
  work: Work;
  isRead: boolean;
  onToggle: () => void;
}

export function WorkCheckbox({ work, isRead, onToggle }: WorkCheckboxProps) {
  const { t } = useTranslation();

  const hasValidUrl = work.download_url && work.download_url.trim() !== '';
  const finalUrl = hasValidUrl
    ? `https://github.com/victor-souza-dev/RepoStaticFile/raw/refs/heads/main/politica/${work.download_url}`
    : '';

  return (
    <div
      className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all duration-200 group ${
        isRead
          ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700'
          : 'bg-[#F7F3EA] dark:bg-[#131E30] border-[#DDD7C8] dark:border-[#1C2E44] hover:bg-[#F2EEE2] dark:hover:bg-[#0E1828] cursor-pointer'
      }`}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      title={isRead ? t('work_checkbox.mark_unread') : t('work_checkbox.mark_read')}
    >
      {/* Checkbox com área maior */}
      <div
        className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
          isRead
            ? 'bg-emerald-600 border-emerald-600 scale-100'
            : 'border-[#C8C0B0] dark:border-[#3A4E62] group-hover:border-emerald-500 group-hover:scale-105'
        }`}
      >
        {isRead && (
          <Check
            size={12}
            className="text-white animate-in fade-in zoom-in duration-200"
            strokeWidth={3}
          />
        )}
      </div>

      {/* Título com indicador de hover */}
      <span
        className={`text-xs flex-1 transition-all duration-200 ${
          isRead
            ? 'text-emerald-900 dark:text-emerald-300 font-medium'
            : 'text-[#0F1E35] dark:text-[#A8B8C8] group-hover:text-[#0D1B2A] dark:group-hover:text-white'
        }`}
      >
        {work.title}
      </span>

      {/* Badge "Lida" quando marcado */}
      {isRead && (
        <span className="shrink-0 text-[10px] uppercase tracking-wider font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded">
          {t('work_checkbox.read_badge')}
        </span>
      )}

      {/* Download / unavailable */}
      {hasValidUrl ? (
        <a
          href={finalUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={t('work_checkbox.download')}
          className="shrink-0 flex items-center gap-1 px-2 py-1 bg-[#0F1E35] dark:bg-[#1C2E44] text-white rounded text-xs hover:bg-[#1A2E4A] dark:hover:bg-[#243650] transition-colors z-10"
          onClick={e => e.stopPropagation()}
        >
          <Download size={12} />
          <span className="hidden sm:inline">{t('work_checkbox.download')}</span>
        </a>
      ) : (
        <span
          title={t('work_checkbox.unavailable')}
          className="shrink-0 flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded text-xs border border-amber-200 dark:border-amber-800"
          onClick={e => e.stopPropagation()}
        >
          <AlertTriangle size={11} />
          <span className="hidden sm:inline text-[11px]">{t('work_checkbox.unavailable')}</span>
        </span>
      )}
    </div>
  );
}