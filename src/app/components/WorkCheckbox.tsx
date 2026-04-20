import { Download, Check } from 'lucide-react';

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
  const hasValidUrl = work.download_url && work.download_url.trim() !== '';
  const finalUrl = hasValidUrl
    ? `https://github.com/victor-souza-dev/RepoStaticFile/raw/refs/heads/main/politica/${work.download_url}`
    : '';

  return (
    <div
      className={`flex items-center justify-between gap-2 p-2 rounded border transition-all ${
        isRead
          ? 'bg-emerald-50 border-emerald-300 shadow-sm'
          : 'bg-[#faf9f7] border-[#e5e3df] hover:bg-[#f5f4f0]'
      }`}
    >
      <label className="flex items-center gap-2 flex-1 cursor-pointer group">
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
            isRead
              ? 'bg-emerald-600 border-emerald-600'
              : 'border-gray-300 group-hover:border-emerald-400'
          }`}
        >
          {isRead && <Check size={12} className="text-white" strokeWidth={3} />}
        </div>
        <span className={`text-xs flex-1 transition-all ${
          isRead
            ? 'text-emerald-900 font-medium'
            : 'text-[#2c3e50]'
        }`}>
          {work.title}
        </span>
      </label>

      {hasValidUrl ? (
        <a
          href={finalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-2 py-1 bg-[#2c3e50] text-white rounded text-xs hover:bg-[#34495e] transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Download size={12} />
          <span className="hidden sm:inline">Baixar</span>
        </a>
      ) : (
        <span className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs border border-amber-200">
          <span className="text-[10px]">⚠️</span>
          <span className="hidden sm:inline">Indisponível</span>
          <span className="sm:hidden">N/D</span>
        </span>
      )}
    </div>
  );
}
