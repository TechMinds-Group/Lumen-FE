import './i18n';
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { HelmetProvider } from 'react-helmet-async';
import { LayoutList, LayoutGrid } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ThinkerCard } from './components/ThinkerCard';
import { BookListView } from './components/BookListView';
import { PoliticalProfile } from './components/PoliticalProfile';
import { TagGlossary } from './components/TagGlossary';
import { RecommendationsModal } from './components/RecommendationsModal';
import { SEOHead } from './components/SEOHead';
import { LazyRender } from './components/LazyRender';
import { useReadingProgress } from './hooks/useReadingProgress';
import { useRecommendations } from './hooks/useRecommendations';
import { useWebVitals } from './hooks/useWebVitals';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { normalizeText } from './utils/normalizeText';
import thinkersData from '../../assets/thinkers';
import metaData from '../../assets/meta.json';

function AppContent() {
  const { t, i18n } = useTranslation();
  const { isDark } = useTheme();

  // Report Core Web Vitals. Replace the no-op with your analytics handler in production.
  useWebVitals(import.meta.env.DEV ? console.log : () => {});

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [activeEra, setActiveEra] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOnlyRead, setShowOnlyRead] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [recommendationsOpen, setRecommendationsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'thinkers' | 'books'>('thinkers');

  const { readWorks, toggleWork, isWorkRead, clearAll } = useReadingProgress();
  const { gaps } = useRecommendations(thinkersData.eras, readWorks);
  const eraRefs = useRef<Record<string, HTMLElement | null>>({});

  const translatedTagLabels: Record<string, string> = Object.fromEntries(
    Object.keys(metaData.tag_labels).map(key => [key, t(`tags.${key}`)])
  );
  const translatedDimensionLabels: Record<string, string> = Object.fromEntries(
    Object.keys(metaData.dimension_labels).map(key => [key, t(`axes.${key}`)])
  );
  const translatedFieldLabels: Record<string, string> = Object.fromEntries(
    Object.keys(metaData.field_labels).map(key => [key, t(`fields.${key}`)])
  );
  const translatedAxes = metaData.axes.map(axis => ({
    ...axis,
    label: t(`axes.${axis.id}`),
  }));

  const handleFilterChange = (axisId: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [axisId]: prev[axisId] === value ? 'all' : value,
    }));
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    setSearchQuery('');
  };

  const handleEraClick = (eraId: string) => {
    if (activeEra === eraId) {
      setActiveEra('');
      return;
    }
    setActiveEra(eraId);
    eraRefs.current[eraId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const filterThinkers = (thinkers: any[]) => {
    return thinkers.filter(thinker => {
      const normalizedQuery = normalizeText(searchQuery);

      const matchesSearch =
        searchQuery === '' ||
        normalizeText(thinker.name).includes(normalizedQuery) ||
        normalizeText(thinker.description).includes(normalizedQuery) ||
        thinker.tags.some((tag: string) =>
          normalizeText(tag).includes(normalizedQuery)
        ) ||
        (thinker.works &&
          thinker.works.some((work: any) =>
            normalizeText(work.title).includes(normalizedQuery)
          ));

      const matchesFilters = Object.entries(selectedFilters).every(([, value]) => {
        if (value === 'all' || !value) return true;
        return thinker.tags.includes(value);
      });

      const matchesReadFilter =
        !showOnlyRead ||
        (thinker.works &&
          thinker.works.some((w: any) => isWorkRead(thinker.id, w.title)));

      return matchesSearch && matchesFilters && matchesReadFilter;
    });
  };

  const allThinkers = thinkersData.eras.flatMap(era => era.thinkers);
  const totalReadWorks = readWorks.length;

  const totalVisible = thinkersData.eras.reduce(
    (total, era) => total + filterThinkers(era.thinkers).length,
    0
  );

  const langPath = i18n.language === 'pt-BR' ? '/' : `/${i18n.language}/`;

  return (
    <>
      <SEOHead lang={i18n.language as 'pt-BR' | 'en' | 'es'} path={langPath} />
    <div className={`${isDark ? 'dark' : ''} h-screen flex`}>
      <div className="h-screen flex w-full bg-[#F2EEE2] dark:bg-[#090F1C] transition-colors duration-300">
        <Sidebar
          eras={thinkersData.eras}
          activeEra={activeEra}
          onEraClick={handleEraClick}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          readWorksCount={readWorks.length}
          gapsCount={gaps.length}
          onOpenRecommendations={() => setRecommendationsOpen(true)}
        />

        <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
          <Header
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            axes={translatedAxes}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onMenuClick={() => setSidebarOpen(true)}
            tagLabels={translatedTagLabels}
            showOnlyRead={showOnlyRead}
            onToggleShowOnlyRead={() => setShowOnlyRead(!showOnlyRead)}
            totalReadWorks={totalReadWorks}
            onOpenProfile={() => setProfileOpen(true)}
            onOpenGlossary={() => setGlossaryOpen(true)}
          />

          {/* Results counter + view toggle */}
          <div className="bg-white dark:bg-[#0F1E35] border-b border-[#DDD7C8] dark:border-[#1C2E44] px-4 lg:px-6 py-2 transition-colors duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <p className="text-xs text-[#6A6355] dark:text-[#687280]">
                {totalVisible}{' '}
                {totalVisible === 1
                  ? t('results.count_one')
                  : t('results.count_other')}
              </p>
              {/* View toggle */}
              <div className="flex items-center gap-1 bg-[#ECE7DA] dark:bg-[#131E30] rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('thinkers')}
                  title="Visualização por pensadores"
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs transition-colors ${
                    viewMode === 'thinkers'
                      ? 'bg-white dark:bg-[#1C2E44] text-[#0F1E35] dark:text-[#EDE8D8] shadow-sm'
                      : 'text-[#6A6355] dark:text-[#687280] hover:text-[#0F1E35] dark:hover:text-[#A8B8C8]'
                  }`}
                >
                  <LayoutGrid size={14} />
                  <span className="hidden sm:inline">Pensadores</span>
                </button>
                <button
                  onClick={() => setViewMode('books')}
                  title="Visualização por obras"
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs transition-colors ${
                    viewMode === 'books'
                      ? 'bg-white dark:bg-[#1C2E44] text-[#0F1E35] dark:text-[#EDE8D8] shadow-sm'
                      : 'text-[#6A6355] dark:text-[#687280] hover:text-[#0F1E35] dark:hover:text-[#A8B8C8]'
                  }`}
                >
                  <LayoutList size={14} />
                  <span className="hidden sm:inline">Obras</span>
                </button>
              </div>
            </div>
          </div>

          <main className="flex-1 overflow-y-auto">
            {viewMode === 'books' ? (
              <BookListView
                eras={thinkersData.eras}
                isWorkRead={isWorkRead}
                onToggleWork={toggleWork}
                filterThinkers={filterThinkers}
                activeEra={activeEra}
                searchQuery={searchQuery}
              />
            ) : (
            <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
              {thinkersData.eras.map(era => {
                const filteredThinkers = filterThinkers(era.thinkers);
                if (filteredThinkers.length === 0) return null;

                const eraReadCount = era.thinkers.reduce((sum, t) => {
                  return (
                    sum +
                    (t.works?.filter((w: any) => isWorkRead(t.id, w.title)).length || 0)
                  );
                }, 0);
                const eraTotalWorks = era.thinkers.reduce(
                  (sum, t) => sum + (t.works?.length || 0),
                  0
                );

                return (
                  <section
                    key={era.id}
                    ref={el => { eraRefs.current[era.id] = el; }}
                    className="mb-8 lg:mb-12"
                  >
                    <div className="mb-4 lg:mb-6">
                      <div className="flex items-center justify-between mb-1">
                        <h2 className="text-xs uppercase tracking-wider text-[#6A6355] dark:text-[#687280]">
                          {t(`eras.${era.id}`)}
                        </h2>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          {t('era.read_works', { read: eraReadCount, total: eraTotalWorks })}
                        </span>
                      </div>
                      <div className="h-px bg-[#DDD7C8] dark:bg-[#1C2E44]" />
                    </div>

                    <div className="space-y-3 lg:space-y-4">
                      {filteredThinkers.map(thinker => (
                        <LazyRender key={thinker.id}>
                          <ThinkerCard
                            thinker={thinker}
                            tagLabels={translatedTagLabels}
                            dimensionLabels={translatedDimensionLabels}
                            fieldLabels={translatedFieldLabels}
                            isWorkRead={isWorkRead}
                            onToggleWork={toggleWork}
                          />
                        </LazyRender>
                      ))}
                    </div>
                  </section>
                );
              })}

              {thinkersData.eras.every(
                era => filterThinkers(era.thinkers).length === 0
              ) && (
                <div className="text-center py-12 lg:py-16">
                  <p className="text-sm lg:text-lg text-[#6A6355] dark:text-[#687280]">
                    {t('results.no_results')}
                  </p>
                </div>
              )}
            </div>
            )}
          </main>

          <PoliticalProfile
            thinkers={allThinkers}
            readWorks={readWorks}
            tagLabels={translatedTagLabels}
            onClear={clearAll}
            isOpen={profileOpen}
            onClose={() => setProfileOpen(false)}
          />

          <TagGlossary
            isOpen={glossaryOpen}
            onClose={() => setGlossaryOpen(false)}
            axes={translatedAxes}
            tagLabels={translatedTagLabels}
          />

          <RecommendationsModal
            isOpen={recommendationsOpen}
            onClose={() => setRecommendationsOpen(false)}
            eras={thinkersData.eras}
            readWorks={readWorks}
            tagLabels={translatedTagLabels}
            axisLabels={translatedDimensionLabels}
          />
        </div>
      </div>
    </div>
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </HelmetProvider>
  );
}