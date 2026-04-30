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
    <header className="bg-white dark:bg-[#161b27] border-b border-[#e5e3df] dark:border-[#2d3748] p-4 lg:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          {/* Hamburger */}
          <button
            onClick={onMenuClick}
            className="lg:hidden text-[#2c3e50] dark:text-[#94a3b8] hover:text-[#34495e] dark:hover:text-white transition-colors"
          >
            <Menu size={24} />
          </button>

          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#95a5a6] dark:text-[#475569]"
              size={18}
            />
            <input
              type="text"
              placeholder={t('header.search_placeholder')}
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-[#dfe6e9] dark:border-[#2d3748] rounded-lg
                bg-white dark:bg-[#1e2537] text-[#2c3e50] dark:text-[#e2e8f0]
                placeholder:text-[#95a5a6] dark:placeholder:text-[#475569]
                focus:outline-none focus:ring-2 focus:ring-[#2c3e50]/20 dark:focus:ring-[#4a6fa5]/30
                transition-colors duration-300"
            />
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 bg-[#ecf0f1] dark:bg-[#2d3748] text-[#2c3e50] dark:text-[#94a3b8] rounded-lg hover:bg-[#dfe6e9] dark:hover:bg-[#374151] transition-colors"
          >
            <Filter size={18} />
            {hasActiveFilters && <span className="w-2 h-2 bg-[#e74c3c] rounded-full" />}
          </button>

          {/* Glossary */}
          <button
            onClick={onOpenGlossary}
            className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-[#ecf0f1] dark:bg-[#2d3748] text-[#2c3e50] dark:text-[#94a3b8] rounded-lg hover:bg-[#dfe6e9] dark:hover:bg-[#374151] transition-colors text-sm"
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
                : 'bg-[#ecf0f1] dark:bg-[#2d3748] text-[#2c3e50] dark:text-[#94a3b8] hover:bg-[#dfe6e9] dark:hover:bg-[#374151]'
            }`}
          >
            <BookCheck size={16} />
            {t('header.only_read')}
          </button>

          {/* View Profile (desktop) */}
          {totalReadWorks > 0 && (
            <button
              onClick={onOpenProfile}
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors whitespace-nowrap text-sm"
            >
              <BarChart3 size={16} />
              {t('header.view_profile', { count: totalReadWorks })}
            </button>
          )}

          {/* Clear filters (desktop) */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#e74c3c]/10 dark:bg-[#e74c3c]/20 text-[#e74c3c] rounded-lg hover:bg-[#e74c3c]/20 dark:hover:bg-[#e74c3c]/30 transition-colors whitespace-nowrap text-sm"
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
              className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#e74c3c]/10 text-[#e74c3c] rounded-lg hover:bg-[#e74c3c]/20 transition-colors text-sm"
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
                    className="w-full lg:w-auto px-3 py-1.5 text-xs lg:text-sm border border-[#dfe6e9] dark:border-[#2d3748] rounded bg-white dark:bg-[#1e2537] text-[#2c3e50] dark:text-[#e2e8f0] hover:border-[#2c3e50]/30 transition-colors"
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
                  <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-2 px-3 py-2 lg:py-1.5 bg-[#ecf0f1] dark:bg-[#1e2537] rounded-lg transition-colors duration-300">
                    <span className="text-xs text-[#7f8c8d] dark:text-[#64748b] font-medium lg:font-normal">
                      {axis.label}:
                    </span>
                    <div className="flex flex-wrap gap-1.5 lg:gap-1">
                      {axis.values.map(value => (
                        <button
                          key={value}
                          onClick={() => onFilterChange(axis.id, value)}
                          className={`px-2.5 lg:px-2 py-1 lg:py-0.5 text-xs rounded transition-colors ${
                            selectedFilters[axis.id] === value
                              ? 'bg-[#2c3e50] dark:bg-[#4a6fa5] text-white'
                              : 'bg-white dark:bg-[#2d3748] text-[#2c3e50] dark:text-[#94a3b8] hover:bg-[#34495e]/10 dark:hover:bg-[#374151]'
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
