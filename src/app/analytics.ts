import { track } from '@vercel/analytics';

export type AnalyticsEvent =
  | { name: 'search_performed'; query: string; results_count: number }
  | { name: 'filter_applied'; axis: string; value: string }
  | { name: 'filter_cleared' }
  | { name: 'era_navigated'; era_id: string; deselected: boolean }
  | { name: 'view_mode_changed'; mode: 'thinkers' | 'books' }
  | { name: 'work_toggled'; thinker_id: string; action: 'read' | 'unread' }
  | { name: 'modal_opened'; modal: 'profile' | 'glossary' | 'recommendations' }
  | { name: 'language_changed'; from: string; to: string }
  | { name: 'theme_changed'; theme: 'dark' | 'light' }
  | { name: 'sidebar_opened' }
  | { name: 'sidebar_closed' }
  | { name: 'show_only_read_toggled'; enabled: boolean }
  | { name: 'export_initiated'; scope: string }
  | { name: 'reading_progress_cleared' };

export function trackEvent(event: AnalyticsEvent) {
  const { name, ...properties } = event;
  track(name, properties as Record<string, string | number | boolean>);
}
