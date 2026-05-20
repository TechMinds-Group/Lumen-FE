import { Search, X, Menu, Filter, BarChart3, BookCheck, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Axis {
  id: string;
  label: string;
  values: string[];
}

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  axes: Axis[];
  selectedFilters: Record<string, string>;
  onFilterChange: (axisId: string, value: string) => void;
  onClearFilters: () => void;
  onMenuClick: () => void;
  tagLabels: Record<string, string>;
  showOnlyRead: boolean;
  onToggleShowOnlyRead: () => void;
  totalReadWorks: number;
  onOpenProfile: () => void;
  onOpenGlossary: () => void;
}

export function Header({
  searchQuery,
  onSearchChange,
  axes,
  selectedFilters,
  onFilterChange,
  onClearFilters,
  onMenuClick,
  tagLabels,
  showOnlyRead,
  onToggleShowOnlyRead,
  totalReadWorks,
  onOpenProfile,
  onOpenGlossary,
}: HeaderProps) {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const hasActiveFilters = Object.values(selectedFilters).some(v => v !== 'all');

  return (
    <header className="bg-white dark:bg-[#0F1E35] border-b border-[#DDD7C8] dark:border-[#1C2E44] p-4 lg:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          {/* Hamburger */}
          <button
            onClick={onMenuClick}
            className="lg:hidden text-[#0F1E35] dark:text-[#A8B8C8] hover:text-[#1A2E4A] dark:hover:text-white transition-colors"
          >
            <Menu size={24} />
          </button>

          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8275] dark:text-[#7A90A8]"
              size={18}
            />
            <input
              type="text"
              placeholder={t('header.search_placeholder')}
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-[#2A3F58] dark:border-[#2A3F58] rounded-lg
                bg-white dark:bg-[#1C2E44] text-[#0F1E35] dark:text-[#F2EEE2]
                placeholder:text-[#8A8275] dark:placeholder:text-[#7A90A8]
                focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 dark:focus:ring-[#C9A84C]/50
                transition-colors duration-300"
            />
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 bg-[#ECE7DA] dark:bg-[#131E30] text-[#0F1E35] dark:text-[#A8B8C8] rounded-lg hover:bg-[#DDD7C8] dark:hover:bg-[#1C2E44] transition-colors"
          >
            <Filter size={18} />
            {hasActiveFilters && <span className="w-2 h-2 bg-[#c0392b] rounded-full" />}
          </button>

          {/* View Profile (mobile) */}
          {totalReadWorks > 0 && (
            <button
              onClick={onOpenProfile}
              className="lg:hidden flex items-center justify-center px-3 py-2 bg-[#C9A84C] text-[#0F1E35] rounded-lg hover:bg-[#B8962E] transition-colors relative"
              title={t('header.view_profile', { count: totalReadWorks })}
            >
              <BarChart3 size={18} />
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-[#0F1E35] text-[#C9A84C] text-[10px] font-medium rounded-full flex items-center justify-center leading-none">
                {totalReadWorks}
              </span>
            </button>
          )}

          {/* Glossary */}
          <button
            onClick={onOpenGlossary}
            className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-[#ECE7DA] dark:bg-[#131E30] text-[#0F1E35] dark:text-[#A8B8C8] rounded-lg hover:bg-[#DDD7C8] dark:hover:bg-[#1C2E44] transition-colors text-sm"
            title={t('header.glossary')}
          >
            <HelpCircle size={16} />
            <span className="hidden lg:inline">{t('header.glossary')}</span>
          </button>

          {/* Only Read (desktop) */}
          <button
            onClick={onToggleShowOnlyRead}
            className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm ${
              showOnlyRead
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-[#ECE7DA] dark:bg-[#131E30] text-[#0F1E35] dark:text-[#A8B8C8] hover:bg-[#DDD7C8] dark:hover:bg-[#1C2E44]'
            }`}
          >
            <BookCheck size={16} />
            {t('header.only_read')}
          </button>

          {/* View Profile (desktop) */}
          {totalReadWorks > 0 && (
            <button
              onClick={onOpenProfile}
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#C9A84C] dark:bg-[#C9A84C] text-[#0F1E35] rounded-lg hover:bg-[#B8962E] dark:hover:bg-[#D8B85A] transition-colors whitespace-nowrap text-sm"
            >
              <BarChart3 size={16} />
              {t('header.view_profile', { count: totalReadWorks })}
            </button>
          )}

          {/* Clear filters (desktop) */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#c0392b]/10 dark:bg-[#c0392b]/20 text-[#c0392b] rounded-lg hover:bg-[#c0392b]/20 dark:hover:bg-[#c0392b]/30 transition-colors whitespace-nowrap text-sm"
            >
              <X size={16} />
              {t('header.clear')}
            </button>
          )}
        </div>

        {/* Filters row */}
        <div className={`space-y-3 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#c0392b]/10 text-[#c0392b] rounded-lg hover:bg-[#c0392b]/20 transition-colors text-sm"
            >
              <X size={16} />
              {t('header.clear_all_filters')}
            </button>
          )}

          <div className="flex flex-wrap gap-2 lg:gap-3">
            {axes.map(axis => {
              if (axis.id === 'metodo') {
                return (
                  <select
                    key={axis.id}
                    value={selectedFilters[axis.id] || 'all'}
                    onChange={e => onFilterChange(axis.id, e.target.value)}
                    className="w-full lg:w-auto px-3 py-1.5 text-xs lg:text-sm border border-[#DDD7C8] dark:border-[#1C2E44] rounded bg-white dark:bg-[#131E30] text-[#0F1E35] dark:text-[#EDE8D8] hover:border-[#0F1E35]/30 transition-colors"
                  >
                    <option value="all">
                      {axis.label}: {t('header.filter_all')}
                    </option>
                    {axis.values.map(value => (
                      <option key={value} value={value}>
                        {tagLabels[value] || value.charAt(0).toUpperCase() + value.slice(1)}
                      </option>
                    ))}
                  </select>
                );
              }

              return (
                <div key={axis.id} className="w-full lg:w-auto">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-2 px-3 py-2 lg:py-1.5 bg-[#ECE7DA] dark:bg-[#131E30] rounded-lg transition-colors duration-300">
                    <span className="text-xs text-[#6A6355] dark:text-[#687280] font-medium lg:font-normal">
                      {axis.label}:
                    </span>
                    <div className="flex flex-wrap gap-1.5 lg:gap-1">
                      {axis.values.map(value => (
                        <button
                          key={value}
                          onClick={() => onFilterChange(axis.id, value)}
                          className={`px-2.5 lg:px-2 py-1 lg:py-0.5 text-xs rounded transition-colors ${
                            selectedFilters[axis.id] === value
                              ? 'bg-[#0F1E35] dark:bg-[#C9A84C] text-white dark:text-[#0F1E35]'
                              : 'bg-white dark:bg-[#1C2E44] text-[#0F1E35] dark:text-[#A8B8C8] hover:bg-[#0F1E35]/8 dark:hover:bg-[#243650]'
                          }`}
                        >
                          {tagLabels[value] || value.charAt(0).toUpperCase() + value.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}