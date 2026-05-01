import { Download, Check, BookOpen, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Work {
  title: string;
  download_url: string;
}

interface Thinker {
  id: string;
  name: string;
  period: string;
  works?: Work[];
}

interface Era {
  id: string;
  label: string;
  thinkers: Thinker[];
}

interface BookListViewProps {
  eras: Era[];
  isWorkRead: (thinkerId: string, workTitle: string) => boolean;
  onToggleWork: (thinkerId: string, workTitle: string) => void;
  filterThinkers: (thinkers: Thinker[]) => Thinker[];
}

const BASE_URL =
  'https://github.com/victor-souza-dev/RepoStaticFile/raw/refs/heads/main/politica/';

export function BookListView({ eras, isWorkRead, onToggleWork, filterThinkers }: BookListViewProps) {
  const { t } = useTranslation();

  const allBooks = eras.flatMap(era => {
    const filteredThinkers = filterThinkers(era.thinkers);
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

  // Group by era for rendering
  const groupedByEra = eras
    .map(era => {
      const filteredThinkers = filterThinkers(era.thinkers);
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

  if (totalBooks === 0) {
    return (
      <div className="text-center py-16">
        <BookOpen className="mx-auto mb-3 text-[#b5b0a8] dark:text-[#4a5568]" size={32} />
        <p className="text-sm text-[#7f8c8d] dark:text-[#64748b]">{t('results.no_results')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Summary bar */}
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
      </div>

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
