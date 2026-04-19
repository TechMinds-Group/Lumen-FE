import { useState, useRef } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ThinkerCard } from "./components/ThinkerCard";
import thinkersData from "../../assets/thinkers.json";
import metaData from "../../assets/meta.json";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string>
  >({});
  const [activeEra, setActiveEra] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const eraRefs = useRef<Record<string, HTMLElement | null>>(
    {},
  );

  const handleFilterChange = (
    axisId: string,
    value: string,
  ) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [axisId]: prev[axisId] === value ? "all" : value,
    }));
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    setSearchQuery("");
  };

  const handleEraClick = (eraId: string) => {
    setActiveEra(eraId);
    eraRefs.current[eraId]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const filterThinkers = (thinkers: any[]) => {
    return thinkers.filter((thinker) => {
      const matchesSearch =
        searchQuery === "" ||
        thinker.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        thinker.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        thinker.tags.some((tag: string) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesFilters = Object.entries(
        selectedFilters,
      ).every(([axisId, value]) => {
        if (value === "all" || !value) return true;
        return thinker.tags.includes(value);
      });

      return matchesSearch && matchesFilters;
    });
  };

  return (
    <div className="h-screen flex bg-[#f5f4f0]">
      <Sidebar
        eras={thinkersData.eras}
        activeEra={activeEra}
        onEraClick={handleEraClick}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          axes={metaData.axes}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onMenuClick={() => setSidebarOpen(true)}
          tagLabels={metaData.tag_labels}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
            {thinkersData.eras.map((era) => {
              const filteredThinkers = filterThinkers(
                era.thinkers,
              );

              if (filteredThinkers.length === 0) return null;

              return (
                <section
                  key={era.id}
                  ref={(el) => {
                    eraRefs.current[era.id] = el;
                  }}
                  className="mb-8 lg:mb-12"
                >
                  <div className="mb-4 lg:mb-6">
                    <h2 className="text-xs uppercase tracking-wider text-[#7f8c8d] mb-1">
                      {era.label}
                    </h2>
                    <div className="h-px bg-[#e5e3df]"></div>
                  </div>

                  <div className="space-y-3 lg:space-y-4">
                    {filteredThinkers.map((thinker) => (
                      <ThinkerCard
                        key={thinker.id}
                        thinker={thinker}
                        tagLabels={metaData.tag_labels}
                        dimensionLabels={
                          metaData.dimension_labels
                        }
                        fieldLabels={metaData.field_labels}
                      />
                    ))}
                  </div>
                </section>
              );
            })}

            {thinkersData.eras.every(
              (era) =>
                filterThinkers(era.thinkers).length === 0,
            ) && (
              <div className="text-center py-12 lg:py-16">
                <p className="text-sm lg:text-lg text-[#7f8c8d]">
                  Nenhum pensador encontrado com os filtros
                  selecionados.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}