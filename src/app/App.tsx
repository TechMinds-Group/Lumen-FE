import { useState, useRef } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ThinkerCard } from "./components/ThinkerCard";
import { PoliticalProfile } from "./components/PoliticalProfile";
import { TagGlossary } from "./components/TagGlossary";
import { useReadingProgress } from "./hooks/useReadingProgress";
import thinkersData from "../../assets/thinkers.json";
import metaData from "../../assets/meta.json";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string>
  >({});
  const [activeEra, setActiveEra] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOnlyRead, setShowOnlyRead] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);

  const { readWorks, toggleWork, isWorkRead, clearAll } = useReadingProgress();

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

      const matchesReadFilter = !showOnlyRead ||
        (thinker.works && thinker.works.some((w: any) => isWorkRead(thinker.id, w.title)));

      return matchesSearch && matchesFilters && matchesReadFilter;
    });
  };

  const allThinkers = thinkersData.eras.flatMap(era => era.thinkers);
  const totalReadWorks = readWorks.length;

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
          showOnlyRead={showOnlyRead}
          onToggleShowOnlyRead={() => setShowOnlyRead(!showOnlyRead)}
          totalReadWorks={totalReadWorks}
          onOpenProfile={() => setProfileOpen(true)}
          onOpenGlossary={() => setGlossaryOpen(true)}
        />

        <div className="bg-white border-b border-[#e5e3df] px-4 lg:px-6 py-2">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs text-[#7f8c8d]">
              {thinkersData.eras.reduce(
                (total, era) => total + filterThinkers(era.thinkers).length,
                0
              )}{" "}
              {thinkersData.eras.reduce(
                (total, era) => total + filterThinkers(era.thinkers).length,
                0
              ) === 1 ? "Pensador" : "Pensadores"}
            </p>
          </div>
        </div>

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
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-xs uppercase tracking-wider text-[#7f8c8d]">
                        {era.label}
                      </h2>
                      <span className="text-xs text-emerald-600 font-medium">
                        {era.thinkers.reduce((sum, t) => {
                          const readInThisAuthor = t.works?.filter((w: any) =>
                            isWorkRead(t.id, w.title)
                          ).length || 0;
                          return sum + readInThisAuthor;
                        }, 0)}/{era.thinkers.reduce((sum, t) => sum + (t.works?.length || 0), 0)} obras lidas
                      </span>
                    </div>
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
                        isWorkRead={isWorkRead}
                        onToggleWork={toggleWork}
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

        <PoliticalProfile
          thinkers={allThinkers}
          readWorks={readWorks}
          tagLabels={metaData.tag_labels}
          onClear={clearAll}
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
        />

        <TagGlossary
          isOpen={glossaryOpen}
          onClose={() => setGlossaryOpen(false)}
          axes={metaData.axes}
          tagLabels={metaData.tag_labels}
        />
      </div>
    </div>
  );
}