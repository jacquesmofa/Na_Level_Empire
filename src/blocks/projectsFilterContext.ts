import { createContext, useContext } from 'react';
import type { SectionOf } from '@/content';

export type ProjectFilter = 'all' | 'current' | 'past' | 'av' | 'event' | 'stream' | 'doc';
export const FILTERS: ProjectFilter[] = ['all', 'current', 'past', 'av', 'event', 'stream', 'doc'];

export type FilterState = {
  active: ProjectFilter;
  setActive: (f: ProjectFilter) => void;
  labels: SectionOf<'projectsGrid'>['filterLabels'];
};

export const FilterContext = createContext<FilterState | null>(null);

/** The selected projects filter, shared by the filter bar and the grid. */
export function useProjectsFilter() {
  return useContext(FilterContext);
}
