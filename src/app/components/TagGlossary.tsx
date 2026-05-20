import { X, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TAG_COLORS, TAG_COLOR_FALLBACK } from '../utils/tagColors';

interface Axis {
  id: string;
  label: string;
  values: string[];
}

interface TagGlossaryProps {
  isOpen: boolean;
  onClose: () => void;
  axes: Axis[];
  tagLabels: Record<string, string>;
}

export function TagGlossary({ isOpen, onClose, axes, tagLabels }: TagGlossaryProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#0F1E35] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col transition-colors duration-300 shadow-2xl dark:shadow-black/50">
        <div className="p-6 border-b border-[#DDD7C8] dark:border-[#1C2E44] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HelpCircle className="text-[#0F1E35] dark:text-[#687280]" size={24} />
            <h2 className="text-xl font-medium text-[#0F1E35] dark:text-[#EDE8D8]">
              {t('glossary.title')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#6A6355] dark:text-[#687280] hover:text-[#0F1E35] dark:hover:text-[#EDE8D8] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-sm text-[#6A6355] dark:text-[#687280] mb-6">
            {t('glossary.description')}
          </p>

          <div className="space-y-6">
            {axes.map(axis => (
              <div
                key={axis.id}
                className="bg-[#F2EEE2] dark:bg-[#131E30] rounded-lg p-5 border border-[#DDD7C8] dark:border-[#1C2E44] transition-colors duration-300"
              >
                <h3 className="font-semibold text-[#0F1E35] dark:text-[#EDE8D8] mb-4 text-lg">
                  {axis.label}
                </h3>
                <div className="space-y-3">
                  {axis.values.map(value => (
                    <div key={value} className="flex gap-3">
                      <div className="flex-shrink-0">
                        <span
                          className={`inline-block px-3 py-1 rounded border text-xs font-medium ${
                            TAG_COLORS[value] || TAG_COLOR_FALLBACK
                          }`}
                        >
                          {tagLabels[value] || value}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#1A2E4A] dark:text-[#A8B8C8]">
                          {t(`tag_descriptions.${value}`, { defaultValue: t('glossary.description') })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-[#0F1E35]/6 dark:bg-[#C9A84C]/10 border border-[#0F1E35]/15 dark:border-[#C9A84C]/25 rounded-lg">
            <p className="text-xs text-[#0F1E35] dark:text-[#D8B85A]">
              <strong>{t('glossary.tip_label')}:</strong>{' '}
              {t('glossary.tip')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}