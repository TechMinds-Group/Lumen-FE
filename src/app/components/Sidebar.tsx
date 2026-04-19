import { X } from 'lucide-react';

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
  const handleEraClick = (eraId: string) => {
    onEraClick(eraId);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#2c3e50] text-white p-6 overflow-y-auto z-50 transform transition-transform duration-300 lg:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <h1 className="font-['Playfair_Display'] text-2xl mb-2">
              Pensadores Políticos
            </h1>
            <p className="text-sm text-[#bdc3c7]">Mapa Multidimensional</p>
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
            Eras Históricas
          </div>
          <ul className="space-y-1">
            {eras.map((era) => (
              <li key={era.id}>
                <button
                  onClick={() => handleEraClick(era.id)}
                  className={`w-full text-left px-3 py-2 rounded transition-colors text-sm ${
                    activeEra === era.id
                      ? 'bg-[#34495e] text-white'
                      : 'text-[#ecf0f1] hover:bg-[#34495e]/50'
                  }`}
                >
                  {era.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
