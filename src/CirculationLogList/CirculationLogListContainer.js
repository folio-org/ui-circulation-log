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
import {
  useList,
  baseManifest,
} from '@folio/stripes-acq-components';

import { buildLogEventsQuery } from './utils';
import { CirculationLogList } from './CirculationLogList';

const RESULT_COUNT_INCREMENT = 30;

const resetData = () => {};

const CirculationLogListContainerComponent = ({ mutator }) => {
  const location = useLocation();

  const [servicePoints, setServicePoints] = useState();

  const focusRef = React.useRef(null);

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

    return focusRef.current?.focus?.();
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
      servicePoints={servicePoints}
      focusRef={focusRef}
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
