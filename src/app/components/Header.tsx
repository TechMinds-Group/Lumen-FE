import { Search, X, Menu, Filter } from 'lucide-react';
import { useState } from 'react';

interface Axis {
  id: string;
  label: string;
  valores: string[];
}

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  axes: Axis[];
  selectedFilters: Record<string, string>;
  onFilterChange: (axisId: string, value: string) => void;
  onClearFilters: () => void;
  onMenuClick: () => void;
}

export function Header({
  searchQuery,
  onSearchChange,
  axes,
  selectedFilters,
  onFilterChange,
  onClearFilters,
  onMenuClick
}: HeaderProps) {
  const [showFilters, setShowFilters] = useState(false);
  const hasActiveFilters = Object.values(selectedFilters).some(v => v !== 'all');

  return (
    <header className="bg-white border-b border-[#e5e3df] p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-[#2c3e50] hover:text-[#34495e] transition-colors"
          >
            <Menu size={24} />
          </button>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#95a5a6]" size={18} />
            <input
              type="text"
              placeholder="Buscar pensadores..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-[#dfe6e9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3e50]/20"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 bg-[#ecf0f1] text-[#2c3e50] rounded-lg hover:bg-[#dfe6e9] transition-colors"
          >
            <Filter size={18} />
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-[#e74c3c] rounded-full"></span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#e74c3c]/10 text-[#e74c3c] rounded-lg hover:bg-[#e74c3c]/20 transition-colors whitespace-nowrap text-sm"
            >
              <X size={16} />
              Limpar
            </button>
          )}
        </div>

        <div className={`space-y-3 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#e74c3c]/10 text-[#e74c3c] rounded-lg hover:bg-[#e74c3c]/20 transition-colors text-sm"
            >
              <X size={16} />
              Limpar todos os filtros
            </button>
          )}

          <div className="flex flex-wrap gap-2 lg:gap-3">
            {axes.map((axis) => {
              if (axis.id === 'metodo') {
                return (
                  <select
                    key={axis.id}
                    value={selectedFilters[axis.id] || 'all'}
                    onChange={(e) => onFilterChange(axis.id, e.target.value)}
                    className="w-full lg:w-auto px-3 py-1.5 text-xs lg:text-sm border border-[#dfe6e9] rounded bg-white hover:border-[#2c3e50]/30 transition-colors"
                  >
                    <option value="all">{axis.label}: Todos</option>
                    {axis.valores.map((valor) => (
                      <option key={valor} value={valor}>
                        {valor.charAt(0).toUpperCase() + valor.slice(1)}
                      </option>
                    ))}
                  </select>
                );
              }

              return (
                <div key={axis.id} className="w-full lg:w-auto">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-2 px-3 py-2 lg:py-1.5 bg-[#ecf0f1] rounded-lg">
                    <span className="text-xs text-[#7f8c8d] font-medium lg:font-normal">
                      {axis.label}:
                    </span>
                    <div className="flex flex-wrap gap-1.5 lg:gap-1">
                      {axis.valores.map((valor) => (
                        <button
                          key={valor}
                          onClick={() => onFilterChange(axis.id, valor)}
                          className={`px-2.5 lg:px-2 py-1 lg:py-0.5 text-xs rounded transition-colors ${
                            selectedFilters[axis.id] === valor
                              ? 'bg-[#2c3e50] text-white'
                              : 'bg-white text-[#2c3e50] hover:bg-[#34495e]/10'
                          }`}
                        >
                          {valor.charAt(0).toUpperCase() + valor.slice(1)}
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
