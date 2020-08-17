import React, {
  useCallback,
} from 'react';

import { stripesConnect } from '@folio/stripes/core';
import { useList } from '@folio/stripes-acq-components';

import { CirculationLogList } from './CirculationLogList';

const RESULT_COUNT_INCREMENT = 30;

const resetData = () => {};

const CirculationLogListContainerComponent = () => {
  const loadLogEvents = useCallback(() => {
    return Promise.resolve({
      totalRecords: 1,
      logEvents: [{
        userId: '56783471',
        itemId: '1243343',
        object: 'Loan',
        action: 'Renewed',
        date: '2020-08-17T01:27:04.133+0000',
        servicePointId: 'SP1',
        source: 'System',
        description: 'New due date...',
      }],
    });
  }, []);

  const postLoadLogEvents = useCallback((setLogEvents, logEventsResponse) => {
    setLogEvents(logEventsResponse.logEvents);
  }, []);

  const {
    records: logEvents,
    recordsCount: logEventsCount,
    isLoading,
    onNeedMoreData,
  } = useList(false, loadLogEvents, postLoadLogEvents, RESULT_COUNT_INCREMENT);

  return (
    <CirculationLogList
      onNeedMoreData={onNeedMoreData}
      resetData={resetData}
      logEventsCount={logEventsCount}
      isLoading={isLoading}
      logEvents={logEvents}
    />
  );
};

export const CirculationLogListContainer = stripesConnect(CirculationLogListContainerComponent);
