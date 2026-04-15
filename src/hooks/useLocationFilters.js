import { useCallback, useMemo } from 'react';

import { buildFiltersObj, buildSearch } from '@folio/stripes-acq-components';

const filterValueMapper = value => (Array.isArray(value) && (value.length === 0) ? undefined : value);

export const useLocationFilters = ({ history, location }) => {
  const filters = useMemo(() => buildFiltersObj(location.search), [location.search]);

  const applyFilters = useCallback(
    newFilters => {
      const filtersEntriesToMerge = Object.entries(newFilters)
        .map(([key, value]) => [key, filterValueMapper(value)]);

      const filtersToMerge = Object.fromEntries(filtersEntriesToMerge);

      history.push({
        pathname: '',
        // Reset offset when applying new filters so usePagination never sees a stale
        // offset in the URL. Without this, buildSearch would preserve the old offset
        // (e.g. offset=100 from page 2), and useCirculationLog's effect would fire
        // against that intermediate URL before usePagination resets it to 0.
        search: buildSearch({ ...filtersToMerge, offset: undefined }, location.search),
      });

      return newFilters;
    },
    [history, location.search],
  );

  const resetFilters = useCallback(
    () => {
      history.push({
        pathname: '',
        search: '',
      });
    },
    [history],
  );

  return {
    filters,
    applyFilters,
    resetFilters,
  };
};
