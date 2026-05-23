import {
  X,
  ChevronDown,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  SUPPORTED_LANGUAGES,
  changeLanguage,
  type LangCode,
} from "../i18n";
import { useTheme } from "../contexts/ThemeContext";

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
  readWorksCount: number;
  gapsCount: number;
  onOpenRecommendations: () => void;
}

export function Sidebar({
  eras,
  activeEra,
  onEraClick,
  isOpen,
  onClose,
  readWorksCount,
  gapsCount,
  onOpenRecommendations,
}: SidebarProps) {
  const { t, i18n } = useTranslation();
  const { isDark, toggle } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        langRef.current &&
        !langRef.current.contains(e.target as Node)
      ) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleEraClick = (eraId: string) => {
    onEraClick(eraId);
    onClose();
  };

  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) ??
    SUPPORTED_LANGUAGES[0];
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
        className={`fixed lg:static top-0 left-0 h-dvh lg:h-auto w-64 flex flex-col z-50 transform transition-transform duration-300 lg:transform-none
          bg-[#0F1E35] dark:bg-[#060D18]
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/assets/images/techminds_lumen.png"
              alt="Lumen - TechMinds"
              className="h-16 w-auto object-contain"
            />
          </div>

          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <h1 className="font-['Playfair_Display'] text-2xl mb-2 text-white">
                {t("app.title")}
              </h1>
              <p className="text-sm text-[#8A9BB8] dark:text-[#687280]">
                {t("app.subtitle")}
              </p>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-[#8A9BB8] hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <nav>
            <div className="text-xs uppercase tracking-wide text-[#8A9BB8] dark:text-[#4A5E72] mb-3">
              {t("sidebar.historical_eras")}
            </div>
            <ul className="space-y-1">
              {eras.map((era) => (
                <li key={era.id}>
                  <button
                    onClick={() => handleEraClick(era.id)}
                    className={`w-full text-left px-3 py-2 rounded transition-colors text-sm ${
                      activeEra === era.id
                        ? "bg-[#C9A84C]/20 text-[#D8B85A] border-l-2 border-[#C9A84C]"
                        : "text-[#CBD8E8] dark:text-[#A8B8C8] hover:bg-[#1A2E4A] dark:hover:bg-[#1C2E44]/70"
                    }`}
                  >
                    {t(`eras.${era.id}`)}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Footer — pinned to bottom */}
        <div className="p-4 border-t border-[#1C2E44] dark:border-[#0F1E35] space-y-3">
          {/* Recomendações - só aparece com 5+ obras lidas */}
          {readWorksCount >= 5 && gapsCount > 0 && (
            <>
              <button
                onClick={() => {
                  onOpenRecommendations();
                  onClose();
                }}
                className="w-full px-3 py-2.5 rounded-lg bg-[#eab740]/12 dark:bg-[#eab740]/12 border border-[#eab740]/35 dark:border-[#eab740]/35 hover:bg-[#eab740]/18 dark:hover:bg-[#eab740]/18 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-start gap-2.5">
                  <Sparkles
                    size={15}
                    className="text-[#e8b840] shrink-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#e8b840] dark:text-[#e8b840] mb-0.5">
                      {t("recommendations.button_title")}
                    </p>
                    <p className="text-[10px] text-[#a0896b] dark:text-[#a0896b]">
                      {gapsCount === 1
                        ? t(
                            "recommendations.button_subtitle_one",
                            { count: gapsCount },
                          )
                        : t(
                            "recommendations.button_subtitle_other",
                            { count: gapsCount },
                          )}
                    </p>
                  </div>
                </div>
              </button>
              <div className="h-px bg-white/8" />
            </>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={toggle}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded
              bg-[#1A2E4A] dark:bg-[#131E30]
              border border-[#2A3E58] dark:border-[#1C2E44]
              hover:border-[#8A9BB8] dark:hover:border-[#687280]
              text-white text-sm transition-colors"
          >
            {isDark ? (
              <Sun
                size={15}
                className="text-[#D8B85A] shrink-0"
              />
            ) : (
              <Moon
                size={15}
                className="text-[#8A9BB8] shrink-0"
              />
            )}
            <span className="flex-1 text-left text-[#CBD8E8] dark:text-[#A8B8C8]">
              {isDark ? t("theme.light") : t("theme.dark")}
            </span>
            {/* Mini pill indicator */}
            <span
              className={`w-7 h-4 rounded-full relative transition-colors ${isDark ? "bg-[#C9A84C]" : "bg-[#2A3E58]"}`}
            >
              <span
                className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${isDark ? "left-3.5" : "left-0.5"}`}
              />
            </span>
          </button>

          {/* Language selector */}
          <div>
            <p className="text-xs uppercase tracking-wide text-[#8A9BB8] dark:text-[#4A5E72] mb-2">
              {t("language_selector.label")}
            </p>
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen((prev) => !prev)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded
                  bg-[#1A2E4A] dark:bg-[#131E30]
                  border border-[#2A3E58] dark:border-[#1C2E44]
                  hover:border-[#8A9BB8] dark:hover:border-[#687280]
                  text-white text-sm transition-colors"
              >
                <img
                  src={flagUrl(currentLang.countryCode)}
                  alt={currentLang.label}
                  className="w-5 h-3.5 object-cover rounded-sm shrink-0"
                />
                <span className="flex-1 text-left">
                  {currentLang.label}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-[#8A9BB8] transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                />
              </button>

              {langOpen && (
                <ul className="absolute bottom-full mb-1 left-0 w-full bg-[#0F1E35] dark:bg-[#060D18] border border-[#2A3E58] dark:border-[#1C2E44] rounded overflow-hidden shadow-lg z-10">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <li key={lang.code}>
                      <button
                        onClick={() => {
                          changeLanguage(lang.code as LangCode);
                          setLangOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                          i18n.language === lang.code
                            ? "bg-[#1A2E4A] dark:bg-[#1C2E44] text-white"
                            : "text-[#A8B8C8] hover:bg-[#1A2E4A]/60 dark:hover:bg-[#1C2E44]/70 hover:text-white"
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
        </div>
      </aside>
    </>
  );
}