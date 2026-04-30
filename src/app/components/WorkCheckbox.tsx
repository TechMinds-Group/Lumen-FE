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
          : 'bg-[#faf9f7] dark:bg-[#1a2035] border-[#e5e3df] dark:border-[#2d3748] hover:bg-[#f5f4f0] dark:hover:bg-[#1e2537]'
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
              : 'border-gray-300 dark:border-[#4a5568] group-hover:border-emerald-400'
          }`}
        >
          {isRead && <Check size={12} className="text-white" strokeWidth={3} />}
        </div>
        <span
          className={`text-xs flex-1 transition-all ${
            isRead
              ? 'text-emerald-900 dark:text-emerald-300 font-medium'
              : 'text-[#2c3e50] dark:text-[#94a3b8]'
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
          className="flex items-center gap-1 px-2 py-1 bg-[#2c3e50] dark:bg-[#2d3748] text-white rounded text-xs hover:bg-[#34495e] dark:hover:bg-[#374151] transition-colors"
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
