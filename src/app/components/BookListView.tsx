import { useState, useRef, useEffect } from 'react';
import { Download, Check, BookOpen, AlertTriangle, FileSpreadsheet, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { exportWorksToExcel, type ExportOptions } from '../utils/exportWorks';

interface Work {
  title: string;
  download_url: string;
}

interface Thinker {
  id: string;
  name: string;
  period: string;
  works?: Work[];
  tags?: string[];
}

interface Era {
  id: string;
  label: string;
  thinkers: Thinker[];
}

interface BookListViewProps {
  eras: readonly Era[];
  isWorkRead: (thinkerId: string, workTitle: string) => boolean;
  onToggleWork: (thinkerId: string, workTitle: string) => void;
  filterThinkers: (thinkers: Thinker[]) => Thinker[];
}

const BASE_URL =
  'https://github.com/victor-souza-dev/RepoStaticFile/raw/refs/heads/main/politica/';

export function BookListView({ eras, isWorkRead, onToggleWork, filterThinkers }: BookListViewProps) {
  const { t } = useTranslation();
  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const allBooks = eras.flatMap(era => {
    const filteredThinkers = filterThinkers(era.thinkers as Thinker[]);
    return filteredThinkers.flatMap(thinker =>
      (thinker.works || []).map(work => ({
        era,
        thinker,
        work,
        isRead: isWorkRead(thinker.id, work.title),
        hasUrl: !!(work.download_url && work.download_url.trim() !== ''),
      }))
    );
  });

  const totalBooks = allBooks.length;
  const readBooks = allBooks.filter(b => b.isRead).length;

  const groupedByEra = eras
    .map(era => {
      const filteredThinkers = filterThinkers(era.thinkers as Thinker[]);
      const books = filteredThinkers.flatMap(thinker =>
        (thinker.works || []).map(work => ({
          thinker,
          work,
          isRead: isWorkRead(thinker.id, work.title),
          hasUrl: !!(work.download_url && work.download_url.trim() !== ''),
        }))
      );
      return { era, books };
    })
    .filter(group => group.books.length > 0);

  const eraLabels = Object.fromEntries(
    eras.map(era => [era.id, t(`eras.${era.id}`)])
  );

  const handleExport = (scope: ExportOptions['scope']) => {
    setExporting(true);
    setExportOpen(false);
    setTimeout(() => {
      exportWorksToExcel(eras, isWorkRead, eraLabels, { scope });
      setExporting(false);
    }, 50);
  };

  if (totalBooks === 0) {
    return (
      <div className="text-center py-16">
        <BookOpen className="mx-auto mb-3 text-[#b5b0a8] dark:text-[#4a5568]" size={32} />
        <p className="text-sm text-[#7f8c8d] dark:text-[#64748b]">{t('results.no_results')}</p>
      </div>
    );
  }

  const exportOptions: { scope: ExportOptions['scope']; label: string; desc: string }[] = [
    {
      scope: 'all',
      label: 'Exportar todas as obras',
      desc: `${totalBooks} obras`,
    },
    {
      scope: 'read',
      label: 'Exportar apenas lidas',
      desc: `${readBooks} obras`,
    },
    {
      scope: 'unread',
      label: 'Exportar apenas pendentes',
      desc: `${totalBooks - readBooks} obras`,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">

      {/* Summary + Export bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#161b27] border border-[#e5e3df] dark:border-[#2d3748] rounded-lg">
        <BookOpen size={16} className="text-[#7f8c8d] dark:text-[#64748b] shrink-0" />
        <span className="text-sm text-[#4a4a4a] dark:text-[#94a3b8]">
          <span className="font-medium text-emerald-600 dark:text-emerald-400">{readBooks}</span>
          <span className="text-[#7f8c8d] dark:text-[#64748b]"> / {totalBooks} obras lidas</span>
        </span>

        {/* Progress bar */}
        <div className="flex-1 h-1.5 bg-[#e5e3df] dark:bg-[#2d3748] rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 dark:bg-emerald-600 rounded-full transition-all duration-500"
            style={{ width: totalBooks > 0 ? `${(readBooks / totalBooks) * 100}%` : '0%' }}
          />
        </div>
        <span className="text-xs text-[#7f8c8d] dark:text-[#64748b] shrink-0">
          {totalBooks > 0 ? Math.round((readBooks / totalBooks) * 100) : 0}%
        </span>

        {/* Export button */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setExportOpen(v => !v)}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2c3e50] dark:bg-[#2d3748] text-white rounded-lg text-xs hover:bg-[#34495e] dark:hover:bg-[#374151] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet size={13} />
            <span className="hidden sm:inline">
              {exporting ? 'Exportando…' : 'Exportar'}
            </span>
            <ChevronDown
              size={12}
              className={`transition-transform duration-200 ${exportOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {exportOpen && (
            <div className="absolute right-0 top-full mt-1.5 z-50 w-60 bg-white dark:bg-[#1e2537] border border-[#e5e3df] dark:border-[#2d3748] rounded-xl shadow-xl overflow-hidden">
              <div className="px-3 py-2 border-b border-[#f0eeeb] dark:border-[#2d3748]">
                <p className="text-[11px] uppercase tracking-wider text-[#7f8c8d] dark:text-[#64748b] font-medium">
                  Exportar planilha (.xlsx)
                </p>
              </div>
              {exportOptions.map(opt => (
                <button
                  key={opt.scope}
                  onClick={() => handleExport(opt.scope)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-[#f5f4f0] dark:hover:bg-[#2d3748] transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <FileSpreadsheet
                      size={14}
                      className="text-emerald-600 dark:text-emerald-400 shrink-0"
                    />
                    <span className="text-sm text-[#1a1a1a] dark:text-[#e2e8f0]">
                      {opt.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#7f8c8d] dark:text-[#64748b] shrink-0 bg-[#f0eeeb] dark:bg-[#2d3748] px-1.5 py-0.5 rounded">
                    {opt.desc}
                  </span>
                </button>
              ))}
              <div className="px-4 py-2 border-t border-[#f0eeeb] dark:border-[#2d3748] bg-[#faf9f7] dark:bg-[#161b27]">
                <p className="text-[10px] text-[#95a5a6] dark:text-[#475569]">
                  Inclui abas: Obras · Por Pensador · Progresso por Era
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grouped book list */}
      {groupedByEra.map(({ era, books }) => {
        const eraReadCount = books.filter(b => b.isRead).length;
        return (
          <section key={era.id}>
            {/* Era header */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xs uppercase tracking-wider text-[#7f8c8d] dark:text-[#64748b]">
                  {t(`eras.${era.id}`)}
                </h2>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {t('era.read_works', { read: eraReadCount, total: books.length })}
                </span>
              </div>
              <div className="h-px bg-[#e5e3df] dark:bg-[#2d3748]" />
            </div>

            {/* Books table */}
            <div className="bg-white dark:bg-[#161b27] border border-[#e5e3df] dark:border-[#2d3748] rounded-lg overflow-hidden">
              {books.map(({ thinker, work, isRead, hasUrl }, idx) => (
                <div
                  key={`${thinker.id}-${work.title}`}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors group
                    ${idx !== 0 ? 'border-t border-[#f0eeeb] dark:border-[#232b3a]' : ''}
                    ${isRead
                      ? 'bg-emerald-50/60 dark:bg-emerald-900/10'
                      : 'hover:bg-[#faf9f7] dark:hover:bg-[#1a2035]'
                    }`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => onToggleWork(thinker.id, work.title)}
                    className={`shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all
                      ${isRead
                        ? 'bg-emerald-600 border-emerald-600'
                        : 'border-[#c5bfb8] dark:border-[#4a5568] group-hover:border-emerald-400'
                      }`}
                  >
                    {isRead && <Check size={10} className="text-white" strokeWidth={3} />}
                  </button>

                  {/* Title + author */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm truncate transition-colors
                        ${isRead
                          ? 'text-emerald-900 dark:text-emerald-300 font-medium'
                          : 'text-[#1a1a1a] dark:text-[#e2e8f0]'
                        }`}
                    >
                      {work.title}
                    </p>
                    <p className="text-xs text-[#7f8c8d] dark:text-[#64748b] truncate mt-0.5">
                      {thinker.name}
                      <span className="mx-1 opacity-50">·</span>
                      <span className="opacity-70">{thinker.period}</span>
                    </p>
                  </div>

                  {/* Download / unavailable */}
                  {hasUrl ? (
                    <a
                      href={`${BASE_URL}${work.download_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={t('work_checkbox.download')}
                      className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 bg-[#2c3e50] dark:bg-[#2d3748] text-white rounded text-xs hover:bg-[#34495e] dark:hover:bg-[#374151] transition-colors"
                      onClick={e => e.stopPropagation()}
                    >
                      <Download size={12} />
                      <span className="hidden sm:inline">{t('work_checkbox.download')}</span>
                    </a>
                  ) : (
                    <span
                      title={t('work_checkbox.unavailable')}
                      className="shrink-0 flex items-center gap-1 px-2 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded text-xs border border-amber-200 dark:border-amber-800"
                    >
                      <AlertTriangle size={11} />
                      <span className="hidden sm:inline text-[11px]">{t('work_checkbox.unavailable')}</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
