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
        search: `${buildSearch(filtersToMerge, location.search)}`,
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
