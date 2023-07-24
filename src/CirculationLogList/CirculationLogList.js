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
import {
  FiltersPane,
  ResetButton,
  ResultsPane,
  NoResultsMessage,
  useLocationSorting,
  useToggle,
  PrevNextPagination,
} from '@folio/stripes-acq-components';

import { useLocationFilters } from '../hooks';
import { CirculationLogEventItems } from './CirculationLogEventItems';
import { CirculationLogListFilter } from './CirculationLogListFilter';
import { CirculationLogListActions } from './CirculationLogListActions';
import { CirculationLogEventActions } from './CirculationLogEventActions';
import { FormattedTime } from './FormattedTime';
import markOldPatronInfoAsSuperseded from './markOldPatronInfoAsSuperseded';

const resultsPaneTitle = <FormattedMessage id="ui-circulation-log.meta.title" />;
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
  date: logEvent => <FormattedTime dateString={logEvent.date} />,
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
  pagination,
}) => {
  const stripes = useStripes();
  const history = useHistory();
  const location = useLocation();

  const isActionColumnVisible = stripes.hasPerm('ui-circulation-log.log-event.all');
  const actionColumn = ['actions'];
  const visibleColumns = ['userBarcode', 'itemBarcode', 'object', 'action', 'date', 'servicePoint', 'source', 'description', ...(isActionColumnVisible ? actionColumn : [])];

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

  // default state is true, so if there are any results on page load - they are immediately focused
  const [isFiltersReadyToLooseFocus, setIsFiltersReadyToLooseFocus] = React.useState(true);

  const focus = useCallback(() => {
    const whoIsGettingFocus = isFiltersReadyToLooseFocus && logEventsCount ? resultsRef : filtersRef;

    if (whoIsGettingFocus.current) whoIsGettingFocus.current.focus();
  }, [isFiltersReadyToLooseFocus, logEventsCount]);

  useEffect(() => {
    if (!isLoading) focus();
  }, [isLoading, focus]);

  // If a user is applying the same filters - there will be no server request,
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
            focusRef={filtersRef}
            disabled={isLoading}
            servicePoints={servicePoints}
          />
        </FiltersPane>
      )}

      <ResultsPane
        title={resultsPaneTitle}
        resultsPaneTitleRef={resultsRef}
        count={logEventsCount}
        autosize
        toggleFiltersPane={toggleFilters}
        filters={filters}
        isFiltersOpened={isFiltersOpened}
        renderActionMenu={stripes.hasInterface('data-export-spring') && renderActionMenu}
      >
        {(({ height, width }) => (
          <>
            <MultiColumnList
              id="circulation-log-list"
              totalCount={logEventsCount}
              contentData={markOldPatronInfoAsSuperseded(logEvents)}
              visibleColumns={visibleColumns}
              columnMapping={columnMapping}
              formatter={resultsFormatter}
              loading={isLoading}
              onNeedMoreData={onNeedMoreData}
              sortOrder={sortingField}
              sortDirection={sortingDirection || undefined} // sortingDirection is sometimes an empty string, which is not suitable for MCL propTypes
              onHeaderClick={changeSorting}
              isEmptyMessage={resultsStatusMessage}
              hasMargin
              pagingType={null}
              interactive={false}
              height={height - PrevNextPagination.HEIGHT}
              width={width}
            />
            {logEvents.length > 0 && (
            <PrevNextPagination
              {...pagination}
              totalCount={logEventsCount}
              disabled={isLoading}
              onChange={onNeedMoreData}
            />
            )}
          </>
        ))}
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
  pagination: PropTypes.object,
};

CirculationLogList.defaultProps = {
  logEventsCount: 0,
  isLoading: false,
  logEvents: [],
  servicePoints: [],
};
