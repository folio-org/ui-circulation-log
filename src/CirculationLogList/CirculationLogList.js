import React, {
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import {
  useStripes,
} from '@folio/stripes/core';
import {
  Paneset,
  MultiColumnList,
} from '@folio/stripes/components';
import { useSetRefOnFocus } from '@folio/stripes/smart-components';
import {
  FiltersPane,
  FolioFormattedTime,
  ResetButton,
  ResultsPane,
  NoResultsMessage,
  useLocationSorting,
  useToggle,
} from '@folio/stripes-acq-components';

import { useLocationFilters } from '../hooks';
import { CirculationLogEventItems } from './CirculationLogEventItems';
import { CirculationLogListFilter } from './CirculationLogListFilter';
import { CirculationLogListActions } from './CirculationLogListActions';
import { CirculationLogEventActions } from './CirculationLogEventActions';

const resultsPaneTitle = <FormattedMessage id="ui-circulation-log.meta.title" />;
const visibleColumns = ['userBarcode', 'itemBarcode', 'object', 'action', 'date', 'servicePoint', 'source', 'description', 'actions'];
const sortableFields = ['userBarcode', 'itemBarcode', 'object', 'action', 'date', 'source', 'description'];
const columnMapping = {
  userBarcode: <FormattedMessage id="ui-circulation-log.logEvent.user" />,
  itemBarcode: <FormattedMessage id="ui-circulation-log.logEvent.item" />,
  object: <FormattedMessage id="ui-circulation-log.logEvent.object" />,
  action: <FormattedMessage id="ui-circulation-log.logEvent.action" />,
  date: <FormattedMessage id="ui-circulation-log.logEvent.date" />,
  servicePoint: <FormattedMessage id="ui-circulation-log.logEvent.servicePoint" />,
  source: <FormattedMessage id="ui-circulation-log.logEvent.source" />,
  description: <FormattedMessage id="ui-circulation-log.logEvent.description" />,
  actions: <FormattedMessage id="ui-circulation-log.logEvent.actions" />,
};
const getResultsFormatter = (servicePointsMap) => ({
  itemBarcode: logEvent => <CirculationLogEventItems items={logEvent.items} />,
  object: logEvent => <FormattedMessage id={`ui-circulation-log.logEvent.object.${logEvent.object}`} />,
  action: logEvent => <FormattedMessage id={`ui-circulation-log.logEvent.action.${logEvent.action}`} />,
  date: logEvent => <FolioFormattedTime dateString={logEvent.date} />,
  servicePoint: logEvent => servicePointsMap[logEvent.servicePointId],
  actions: logEvent => (
    <CirculationLogEventActions
      objectType={logEvent.object}
      items={logEvent.items}
      referenceIds={logEvent.linkToIds}
    />
  ),
});

export const CirculationLogList = ({
  isLoading,
  onNeedMoreData,
  resetData,
  logEvents,
  logEventsCount,
  servicePoints,
}) => {
  const stripes = useStripes();
  const history = useHistory();
  const location = useLocation();

  const { filters, applyFilters, resetFilters } = useLocationFilters({ history, location });

  const [
    sortingField,
    sortingDirection,
    changeSorting,
  ] = useLocationSorting(location, history, resetData, sortableFields);
  const [isFiltersOpened, toggleFilters] = useToggle(true);

  const servicePointsMap = useMemo(() => {
    return servicePoints.reduce((acc, servicePoint) => {
      acc[servicePoint.id] = servicePoint.name;

      return acc;
    }, {});
  }, [servicePoints]);
  const resultsFormatter = useMemo(() => getResultsFormatter(servicePointsMap), [servicePointsMap]);

  const renderActionMenu = useCallback(
    ({ onToggle }) => (
      <CirculationLogListActions
        logEventsCount={logEventsCount}
        onToggle={onToggle}
      />
    ),
    [logEventsCount],
  );

  const resultsStatusMessage = (
    <NoResultsMessage
      isLoading={isLoading}
      filters={filters}
      isFiltersOpened={isFiltersOpened}
      toggleFilters={toggleFilters}
    />
  );

  const filtersRef = useRef();
  const resultsRef = useRef();

  const setRefOnFocus = useSetRefOnFocus(filtersRef);

  // default state is true, so if there are any results on page load - they are immediately focused
  const [isFiltersReadyToLooseFocus, setIsFiltersReadyToLooseFocus] = React.useState(true);

  const focus = useCallback(() => {
    const whoIsGettingFocus = isFiltersReadyToLooseFocus && logEventsCount ? resultsRef : filtersRef;

    if (whoIsGettingFocus.current) whoIsGettingFocus.current.focus();
  }, [isFiltersReadyToLooseFocus, logEventsCount]);

  useEffect(() => {
    if (!isLoading) focus();
  }, [isLoading, focus]);

  // If a user is applying the same filters - there will be no server request
  // but we still want the appropriate element to be focused - results or the last visited filter field
  const applyFiltersAndFocus = (...args) => {
    applyFilters(...args);
    focus();
  };

  return (
    <Paneset data-test-log-events-list>
      {isFiltersOpened && (
        <FiltersPane toggleFilters={toggleFilters}>
          <ResetButton
            id="reset-receiving-filters"
            reset={resetFilters}
            disabled={!location.search || isLoading}
          />

          <CirculationLogListFilter
            activeFilters={filters}
            applyFilters={applyFiltersAndFocus}
            letLoseFocus={setIsFiltersReadyToLooseFocus}
            focusRef={setRefOnFocus.default}
            disabled={isLoading}
            servicePoints={servicePoints}
          />
        </FiltersPane>
      )}

      <ResultsPane
        title={resultsPaneTitle}
        resultsPaneTitleRef={resultsRef}
        count={logEventsCount}
        toggleFiltersPane={toggleFilters}
        filters={filters}
        isFiltersOpened={isFiltersOpened}
        renderActionMenu={stripes.hasInterface('data-export-spring') && renderActionMenu}
      >
        <MultiColumnList
          id="circulation-log-list"
          totalCount={logEventsCount}
          contentData={logEvents}
          visibleColumns={visibleColumns}
          columnMapping={columnMapping}
          formatter={resultsFormatter}
          loading={isLoading}
          autosize
          onNeedMoreData={onNeedMoreData}
          sortOrder={sortingField}
          sortDirection={sortingDirection}
          onHeaderClick={changeSorting}
          isEmptyMessage={resultsStatusMessage}
          hasMargin
          pagingType="click"
          interactive={false}
        />
      </ResultsPane>
    </Paneset>
  );
};

CirculationLogList.propTypes = {
  onNeedMoreData: PropTypes.func.isRequired,
  resetData: PropTypes.func.isRequired,
  logEventsCount: PropTypes.number,
  isLoading: PropTypes.bool,
  logEvents: PropTypes.arrayOf(PropTypes.object),
  servicePoints: PropTypes.arrayOf(PropTypes.object),
};

CirculationLogList.defaultProps = {
  logEventsCount: 0,
  isLoading: false,
  logEvents: [],
  servicePoints: [],
};
