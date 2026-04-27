import { X, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, changeLanguage, type LangCode } from '../i18n';

interface Era {
  id: string;
  label: string;
}

interface SidebarProps {
  eras: Era[];
  activeEra: string;
  onEraClick: (eraId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ eras, activeEra, onEraClick, isOpen, onClose }: SidebarProps) {
  const { t, i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEraClick = (eraId: string) => {
    onEraClick(eraId);
    onClose();
  };

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === i18n.language) ?? SUPPORTED_LANGUAGES[0];

  const flagUrl = (countryCode: string) =>
    `https://flagcdn.com/w40/${countryCode}.png`;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#2c3e50] text-white flex flex-col z-50 transform transition-transform duration-300 lg:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <h1 className="font-['Playfair_Display'] text-2xl mb-2">
                {t('app.title')}
              </h1>
              <p className="text-sm text-[#bdc3c7]">{t('app.subtitle')}</p>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-[#bdc3c7] hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <nav>
            <div className="text-xs uppercase tracking-wide text-[#95a5a6] mb-3">
              {t('sidebar.historical_eras')}
            </div>
            <ul className="space-y-1">
              {eras.map(era => (
                <li key={era.id}>
                  <button
                    onClick={() => handleEraClick(era.id)}
                    className={`w-full text-left px-3 py-2 rounded transition-colors text-sm ${
                      activeEra === era.id
                        ? 'bg-[#34495e] text-white'
                        : 'text-[#ecf0f1] hover:bg-[#34495e]/50'
                    }`}
                  >
                    {t(`eras.${era.id}`)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Language selector — pinned to bottom */}
        <div className="p-4 border-t border-[#34495e]">
          <p className="text-xs uppercase tracking-wide text-[#95a5a6] mb-2">
            {t('language_selector.label')}
          </p>

          {/* Custom select-like dropdown */}
          <div ref={langRef} className="relative">
            {/* Trigger */}
            <button
              onClick={() => setLangOpen(prev => !prev)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded bg-[#34495e] border border-[#4a6278] hover:border-[#95a5a6] text-white text-sm transition-colors"
            >
              <img
                src={flagUrl(currentLang.countryCode)}
                alt={currentLang.label}
                className="w-5 h-3.5 object-cover rounded-sm shrink-0"
              />
              <span className="flex-1 text-left">{currentLang.label}</span>
              <ChevronDown
                size={14}
                className={`text-[#95a5a6] transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown list */}
            {langOpen && (
              <ul className="absolute bottom-full mb-1 left-0 w-full bg-[#2c3e50] border border-[#4a6278] rounded overflow-hidden shadow-lg z-10">
                {SUPPORTED_LANGUAGES.map(lang => (
                  <li key={lang.code}>
                    <button
                      onClick={() => {
                        changeLanguage(lang.code as LangCode);
                        setLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                        i18n.language === lang.code
                          ? 'bg-[#34495e] text-white'
                          : 'text-[#bdc3c7] hover:bg-[#34495e]/60 hover:text-white'
                      }`}
                    >
                      <img
                        src={flagUrl(lang.countryCode)}
                        alt={lang.label}
                        className="w-5 h-3.5 object-cover rounded-sm shrink-0"
                      />
                      {lang.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}