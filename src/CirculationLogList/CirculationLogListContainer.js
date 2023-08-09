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
import { LOAN_ACTIONS } from './constants';
import { markOldPatronInfoAsSuperseded } from './markOldPatronInfoAsSuperseded';

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

  // For given log records fetch log records by item barcode
  // and return a map of most recent PATRON_INFO logs
  const captureMostRecentPatronInfoLogs = async (logRecords) => {
    const barcodeSet = new Set();
    const logsByIdMap = new Map();

    logRecords.forEach(log => {
      if (log.action === LOAN_ACTIONS.PATRON_INFO && log?.items?.[0]?.itemBarcode) {
        barcodeSet.add(`items=${log?.items?.[0]?.itemBarcode}`);
      }
    });

    const query = Array.from(barcodeSet).join(' or ');

    if (!query) {
      return logsByIdMap;
    }

    mutator.logEventsListEventsByBarcode.reset();
    const results = await mutator.logEventsListEventsByBarcode.GET({
      params: {
        query: `(${query}) and action=="${LOAN_ACTIONS.PATRON_INFO}" sortby date/sort.descending`,
        limit: 1000,
      },
    });

    if (results?.logRecords) {
      const { logRecords: logs } = results;
      // key represents item barcode, value represents log id
      const itemBarcodeMap = new Map();

      // capture the most recent log based on gven item barcode
      logs.forEach(log => {
        const itemBarcode = log?.items?.[0]?.itemBarcode;

        if (!itemBarcodeMap.has(itemBarcode)) {
          itemBarcodeMap.set(itemBarcode, log.id);
          logsByIdMap.set(log.id, log);
        }
      });
    }

    return logsByIdMap;
  };

  const postLoadLogEvents = useCallback(async (setLogEvents, logEventsResponse) => {
    const { logRecords } = logEventsResponse;
    const logsByIdMap = await captureMostRecentPatronInfoLogs(logRecords);
    const markedLogRecords = markOldPatronInfoAsSuperseded(logRecords, logsByIdMap);

    setLogEvents((prevLogEvens) => ([
      ...prevLogEvens,
      ...markedLogRecords,
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
  logEventsListEventsByBarcode: {
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
