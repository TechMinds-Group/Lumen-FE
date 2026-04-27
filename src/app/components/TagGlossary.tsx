import { X, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[#e5e3df] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HelpCircle className="text-[#2c3e50]" size={24} />
            <h2 className="text-xl font-medium text-[#2c3e50]">
              {t('glossary.title')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#7f8c8d] hover:text-[#2c3e50] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <p className="text-sm text-[#7f8c8d] mb-6">
            {t('glossary.description')}
          </p>

          <div className="space-y-6">
            {axes.map(axis => (
              <div
                key={axis.id}
                className="bg-[#f5f4f0] rounded-lg p-5 border border-[#e5e3df]"
              >
                <h3 className="font-semibold text-[#2c3e50] mb-4 text-lg">
                  {axis.label}
                </h3>
                <div className="space-y-3">
                  {axis.values.map(value => (
                    <div key={value} className="flex gap-3">
                      <div className="flex-shrink-0">
                        <span
                          className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                            value === 'rupture'
                              ? 'bg-[#e74c3c]/10 text-[#e74c3c]'
                              : value === 'tradition'
                              ? 'bg-[#3498db]/10 text-[#3498db]'
                              : 'bg-[#2c3e50]/10 text-[#2c3e50]'
                          }`}
                        >
                          {tagLabels[value] || value}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#34495e]">
                          {t(`tag_descriptions.${value}`, {
                            defaultValue: t('glossary.description'),
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-900">
              <strong>{t('glossary.tip_label')}:</strong>{' '}
              {t('glossary.tip')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
