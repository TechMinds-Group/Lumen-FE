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
  activeEra?: string;
}

const BASE_URL =
  'https://github.com/victor-souza-dev/RepoStaticFile/raw/refs/heads/main/politica/';

export function BookListView({ eras, isWorkRead, onToggleWork, filterThinkers, activeEra }: BookListViewProps) {
  const { t } = useTranslation();
  const [exportOpen, setExportOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const eraSectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (activeEra && eraSectionRefs.current[activeEra]) {
      eraSectionRefs.current[activeEra]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeEra]);

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
        <BookOpen className="mx-auto mb-3 text-[#C0B8A8] dark:text-[#3A4E62]" size={32} />
        <p className="text-sm text-[#6A6355] dark:text-[#687280]">{t('results.no_results')}</p>
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
      <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#0F1E35] border border-[#DDD7C8] dark:border-[#1C2E44] rounded-lg">
        <BookOpen size={16} className="text-[#6A6355] dark:text-[#687280] shrink-0" />
        <span className="text-sm text-[#2A2420] dark:text-[#A8B8C8]">
          <span className="font-medium text-emerald-600 dark:text-emerald-400">{readBooks}</span>
          <span className="text-[#6A6355] dark:text-[#687280]"> / {totalBooks} obras lidas</span>
        </span>

        {/* Progress bar */}
        <div className="flex-1 h-1.5 bg-[#DDD7C8] dark:bg-[#1C2E44] rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 dark:bg-emerald-600 rounded-full transition-all duration-500"
            style={{ width: totalBooks > 0 ? `${(readBooks / totalBooks) * 100}%` : '0%' }}
          />
        </div>
        <span className="text-xs text-[#6A6355] dark:text-[#687280] shrink-0">
          {totalBooks > 0 ? Math.round((readBooks / totalBooks) * 100) : 0}%
        </span>

        {/* Export button */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setExportOpen(v => !v)}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F1E35] dark:bg-[#1C2E44] text-white rounded-lg text-xs hover:bg-[#1A2E4A] dark:hover:bg-[#243650] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
            <div className="absolute right-0 top-full mt-1.5 z-50 w-60 bg-white dark:bg-[#131E30] border border-[#DDD7C8] dark:border-[#1C2E44] rounded-xl shadow-xl overflow-hidden">
              <div className="px-3 py-2 border-b border-[#EAE5D6] dark:border-[#1C2E44]">
                <p className="text-[11px] uppercase tracking-wider text-[#6A6355] dark:text-[#687280] font-medium">
                  Exportar planilha (.xlsx)
                </p>
              </div>
              {exportOptions.map(opt => (
                <button
                  key={opt.scope}
                  onClick={() => handleExport(opt.scope)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-[#F2EEE2] dark:hover:bg-[#1C2E44] transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <FileSpreadsheet
                      size={14}
                      className="text-emerald-600 dark:text-emerald-400 shrink-0"
                    />
                    <span className="text-sm text-[#0D1B2A] dark:text-[#EDE8D8]">
                      {opt.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#6A6355] dark:text-[#687280] shrink-0 bg-[#EDE8DA] dark:bg-[#1C2E44] px-1.5 py-0.5 rounded">
                    {opt.desc}
                  </span>
                </button>
              ))}
              <div className="px-4 py-2 border-t border-[#EAE5D6] dark:border-[#1C2E44] bg-[#F7F3EA] dark:bg-[#0F1E35]">
                <p className="text-[10px] text-[#8A8275] dark:text-[#4A5E72]">
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
          <section key={era.id} ref={el => (eraSectionRefs.current[era.id] = el)}>
            {/* Era header */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xs uppercase tracking-wider text-[#6A6355] dark:text-[#687280]">
                  {t(`eras.${era.id}`)}
                </h2>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {t('era.read_works', { read: eraReadCount, total: books.length })}
                </span>
              </div>
              <div className="h-px bg-[#DDD7C8] dark:bg-[#1C2E44]" />
            </div>

            {/* Books table */}
            <div className="bg-white dark:bg-[#0F1E35] border border-[#DDD7C8] dark:border-[#1C2E44] rounded-lg overflow-hidden">
              {books.map(({ thinker, work, isRead, hasUrl }, idx) => (
                <div
                  key={`${thinker.id}-${work.title}`}
                  className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 group relative
                    ${idx !== 0 ? 'border-t border-[#EAE5D6] dark:border-[#1C2840]' : ''}
                    ${isRead
                      ? 'bg-emerald-50/60 dark:bg-emerald-900/10'
                      : 'hover:bg-[#F2EEE2] dark:hover:bg-[#14203A] cursor-pointer'
                    }`}
                  onClick={() => onToggleWork(thinker.id, work.title)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onToggleWork(thinker.id, work.title);
                    }
                  }}
                  title={isRead ? t('work_checkbox.mark_unread') : t('work_checkbox.mark_read')}
                >
                  {/* Checkbox com área maior */}
                  <div
                    className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200
                      ${isRead
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

                  {/* Title + author - agora com indicador de hover */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm truncate transition-all duration-200
                        ${isRead
                          ? 'text-emerald-900 dark:text-emerald-300 font-medium'
                          : 'text-[#0D1B2A] dark:text-[#EDE8D8] group-hover:text-[#0F1E35] dark:group-hover:text-white'
                        }`}
                    >
                      {work.title}
                    </p>
                    <p className="text-xs text-[#6A6355] dark:text-[#687280] truncate mt-0.5">
                      {thinker.name}
                      <span className="mx-1 opacity-50">·</span>
                      <span className="opacity-70">{thinker.period}</span>
                    </p>
                  </div>

                  {/* Badge "Lida" quando marcado */}
                  {isRead && (
                    <span className="shrink-0 text-[10px] uppercase tracking-wider font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded">
                      {t('work_checkbox.read_badge')}
                    </span>
                  )}

                  {/* Download / unavailable */}
                  {hasUrl ? (
                    <a
                      href={`${BASE_URL}${work.download_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={t('work_checkbox.download')}
                      className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 bg-[#0F1E35] dark:bg-[#1C2E44] text-white rounded text-xs hover:bg-[#1A2E4A] dark:hover:bg-[#243650] transition-colors z-10"
                      onClick={e => e.stopPropagation()}
                    >
                      <Download size={12} />
                      <span className="hidden sm:inline">{t('work_checkbox.download')}</span>
                    </a>
                  ) : (
                    <span
                      title={t('work_checkbox.unavailable')}
                      className="shrink-0 flex items-center gap-1 px-2 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded text-xs border border-amber-200 dark:border-amber-800"
                      onClick={e => e.stopPropagation()}
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