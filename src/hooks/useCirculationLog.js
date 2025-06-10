import {
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { getFiltersCount } from '@folio/stripes-acq-components/lib/AcqList/utils';

export const useCirculationLog = (isLoadingRightAway, queryLoadRecords, loadRecordsCB, pagination) => {
  const location = useLocation();
  const [records, setRecords] = useState([]);
  const [recordsCount, setRecordsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const queryParams = queryString.parse(location.search);
  const resultsPaneTitleRef = useRef();

  const defaultSearchParams = {
    queryParams,
    limit: pagination.limit,
    offset: pagination.offset,
  };

  const loadRecords = useCallback(offset => {
    const filtersCount = getFiltersCount(queryParams);
    const hasToCallAPI = isLoadingRightAway || filtersCount > 0;

    if (!hasToCallAPI || isLoading) {
      return Promise.resolve();
    }

    setIsLoading(true);

    // to get the actual totalRecords count, the limit should be set to 0
    queryLoadRecords(defaultSearchParams.offset, 0).then(totalRecordsResponse => {
      setRecordsCount(totalRecordsResponse?.totalRecords);
    });

    return queryLoadRecords(defaultSearchParams.offset).then(recordsResponse => {
      if (!offset) {
        if (recordsResponse?.totalRecords != null) {
          // eslint-disable-next-line no-unused-expressions
          resultsPaneTitleRef?.current?.focus();
        }
      }

      return recordsResponse && loadRecordsCB(setRecords, recordsResponse);
    }).finally(() => setIsLoading(false));
  }, [queryParams, isLoadingRightAway, isLoading, queryLoadRecords, defaultSearchParams.offset, loadRecordsCB]);

  const refreshList = useCallback(() => {
    setRecords([]);
    loadRecords(0);
  }, [loadRecords]);

  useEffect(
    () => {
      refreshList();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

  return {
    records,
    recordsCount,
    isLoading,
    refreshList,
    resultsPaneTitleRef,
  };
};
