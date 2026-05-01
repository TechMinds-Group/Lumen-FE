import { Download, Check } from 'lucide-react';
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
      className={`flex items-center justify-between gap-2 p-2 rounded border transition-all ${
        isRead
          ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 shadow-sm'
          : 'bg-[#F7F3EA] dark:bg-[#131E30] border-[#DDD7C8] dark:border-[#1C2E44] hover:bg-[#F2EEE2] dark:hover:bg-[#0E1828]'
      }`}
    >
      <label className="flex items-center gap-2 flex-1 cursor-pointer group">
        <div
          onClick={e => {
            e.stopPropagation();
            onToggle();
          }}
          className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
            isRead
              ? 'bg-emerald-600 border-emerald-600'
              : 'border-[#C8C0B0] dark:border-[#3A4E62] group-hover:border-emerald-400'
          }`}
        >
          {isRead && <Check size={12} className="text-white" strokeWidth={3} />}
        </div>
        <span
          className={`text-xs flex-1 transition-all ${
            isRead
              ? 'text-emerald-900 dark:text-emerald-300 font-medium'
              : 'text-[#0F1E35] dark:text-[#A8B8C8]'
          }`}
        >
          {work.title}
        </span>
      </label>

      {hasValidUrl ? (
        <a
          href={finalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-2 py-1 bg-[#0F1E35] dark:bg-[#1C2E44] text-white rounded text-xs hover:bg-[#1A2E4A] dark:hover:bg-[#243650] transition-colors"
          onClick={e => e.stopPropagation()}
        >
          <Download size={12} />
          <span className="hidden sm:inline">{t('work_checkbox.download')}</span>
        </a>
      ) : (
        <span className="flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded text-xs border border-amber-200 dark:border-amber-800">
          <span className="text-[10px]">⚠️</span>
          <span className="hidden sm:inline">{t('work_checkbox.unavailable')}</span>
          <span className="sm:hidden">{t('work_checkbox.unavailable_short')}</span>
        </span>
      )}
    </div>
  );
}