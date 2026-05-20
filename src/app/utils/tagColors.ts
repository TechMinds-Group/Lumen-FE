export const TAG_COLORS: Record<string, string> = {
  // Political axis
  freedom:      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
  authority:    'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
  state:        'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
  market:       'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
  community:    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700',
  tradition:    'bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700',
  rupture:      'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
  individual:   'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-700',
  collective:   'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700',

  // Epistemology axis (source of knowledge)
  rationalist:  'bg-pink-50 text-pink-700 border-pink-300 font-medium dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-700',
  empiricist:   'bg-teal-50 text-teal-700 border-teal-300 font-medium dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700',

  // Ontology axis (driver of political reality)
  idealist:        'bg-purple-50 text-purple-800 border-purple-300 font-medium dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
  materialist:     'bg-amber-50 text-amber-800 border-amber-300 font-medium dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700',
  interactionist:  'bg-slate-100 text-slate-700 border-slate-300 font-medium dark:bg-slate-800/40 dark:text-slate-300 dark:border-slate-600',

  // Historicity axis (relation to history)
  ahistorical:  'bg-stone-100 text-stone-700 border-stone-300 font-medium dark:bg-stone-800/40 dark:text-stone-300 dark:border-stone-600',
  historicist:  'bg-rose-50 text-rose-700 border-rose-200 font-medium dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700',
  dialectical:  'bg-violet-50 text-violet-700 border-violet-200 font-medium dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700',

  // Anthropology & scope (rendered as DimensionBadge, colors handled inline)
  optimistic:   'bg-yellow-50 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',
  pessimistic:  'bg-slate-100 text-slate-800 border-slate-400 dark:bg-slate-700/50 dark:text-slate-200 dark:border-slate-500',
  ambivalent:   'bg-[#F2EEE2] text-[#6A6355] border-[#DDD7C8] dark:bg-[#131E30] dark:text-[#A8B8C8] dark:border-[#1C2E44]',
  universalist: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
  particularist:'bg-orange-50 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
};

export const TAG_COLOR_FALLBACK =
  'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-700/30 dark:text-gray-300 dark:border-gray-600';
