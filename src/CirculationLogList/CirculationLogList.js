import React, {
  useMemo,
  useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import {
  Paneset,
  MultiColumnList,
} from '@folio/stripes/components';
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
      object={logEvent.object}
      item={logEvent.items?.[0]}
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
  focusRef,
}) => {
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

  const resultsStatusMessage = (
    <NoResultsMessage
      isLoading={isLoading}
      filters={filters}
      isFiltersOpened={isFiltersOpened}
      toggleFilters={toggleFilters}
    />
  );

  const [refs] = useState({
    filters: useRef(),
    results: useRef(),
  });

  const [isFiltersReadyToLooseFocus, setIsFiltersReadyToLooseFocus] = React.useState(false);

  const whoGetsTheFocus = isFiltersReadyToLooseFocus && logEventsCount ? 'results' : 'filters';

  if (typeof focusRef === 'object') focusRef.current = refs[whoGetsTheFocus].current;

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
            applyFilters={applyFilters}
            letLoseFocus={setIsFiltersReadyToLooseFocus}
            focusRef={refs.filters}
            disabled={isLoading}
            servicePoints={servicePoints}
          />
        </FiltersPane>
      )}

      <ResultsPane
        title={resultsPaneTitle}
        resultsPaneTitleRef={refs.results}
        count={logEventsCount}
        toggleFiltersPane={toggleFilters}
        filters={filters}
        isFiltersOpened={isFiltersOpened}
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
  focusRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

CirculationLogList.defaultProps = {
  logEventsCount: 0,
  isLoading: false,
  logEvents: [],
  servicePoints: [],
};
