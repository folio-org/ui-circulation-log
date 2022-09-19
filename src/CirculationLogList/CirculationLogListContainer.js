import React, {
  useCallback,
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  useLocation,
} from 'react-router-dom';
import queryString from 'query-string';

import { stripesConnect } from '@folio/stripes/core';
import { baseManifest, usePagination } from '@folio/stripes-acq-components';

import { buildLogEventsQuery } from './utils';
import { CirculationLogList } from './CirculationLogList';
import { useCirculationLog } from '../hooks/useCirculationLog';

const RESULT_COUNT_INCREMENT = 100;

const resetData = () => {};

const CirculationLogListContainerComponent = ({ mutator }) => {
  const location = useLocation();

  const [servicePoints, setServicePoints] = useState();

  useEffect(() => {
    mutator.logEventsServicePoints.GET()
      .then(setServicePoints);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadLogEvents = useCallback((offset) => {
    return mutator.logEventsListEvents.GET({
      params: {
        limit: RESULT_COUNT_INCREMENT,
        offset,
        query: buildLogEventsQuery(queryString.parse(location.search)),
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const postLoadLogEvents = useCallback((setLogEvents, logEventsResponse) => {
    setLogEvents((prevLogEvens) => ([
      ...prevLogEvens,
      ...logEventsResponse.logRecords,
    ]));
  }, []);

  const { pagination, changePage } = usePagination({ limit: RESULT_COUNT_INCREMENT, offset: 0 });

  const {
    records: logEvents,
    recordsCount: logEventsCount,
    isLoading,
  } = useCirculationLog(false, loadLogEvents, postLoadLogEvents, pagination);

  return (
    <CirculationLogList
      onNeedMoreData={changePage}
      resetData={resetData}
      logEventsCount={logEventsCount}
      isLoading={isLoading}
      logEvents={logEvents}
      servicePoints={servicePoints}
      pagination={pagination}
    />
  );
};

CirculationLogListContainerComponent.manifest = Object.freeze({
  logEventsListEvents: {
    ...baseManifest,
    path: 'audit-data/circulation/logs',
    accumulate: true,
  },
  logEventsServicePoints: {
    ...baseManifest,
    path: 'service-points',
    accumulate: true,
    records: 'servicepoints',
    params: {
      query: 'cql.allRecords=1 sortby name',
    },
  },
});

CirculationLogListContainerComponent.propTypes = {
  mutator: PropTypes.object.isRequired,
};

export const CirculationLogListContainer = stripesConnect(CirculationLogListContainerComponent);
