import React, {
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';

import {
  AccordionSet,
} from '@folio/stripes/components';

import {
  AcqCheckboxFilter,
  AcqDateRangeFilter,
} from '@folio/stripes-acq-components';

import {
  LOG_EVENT_OBJECTS,
  LOAN_ACTIONS,
  NOTICE_ACTIONS,
  FEE_ACTIONS,
  REQUEST_ACTIONS,
} from '../constants';

import { TextFilter } from './TextFilter';
import { buildCheckboxFilterOptions } from './utils';

const applyFiltersAdapter = (applyFilters) => ({ name, values }) => applyFilters(name, values);
const loanFilterOptions = buildCheckboxFilterOptions(LOAN_ACTIONS);
const noticeFilterOptions = buildCheckboxFilterOptions(NOTICE_ACTIONS);
const feeFilterOptions = buildCheckboxFilterOptions(FEE_ACTIONS);
const requestFilterOptions = buildCheckboxFilterOptions(REQUEST_ACTIONS);

export const CirculationLogListFilter = ({
  activeFilters,
  applyFilters,
  disabled,
  servicePoints,
}) => {
  const adaptedApplyFilters = useCallback(
    applyFiltersAdapter(applyFilters),
    [applyFilters],
  );

  const servicePointFilterOptions = useMemo(() => {
    return servicePoints.map(servicePoint => ({
      label: servicePoint.name,
      value: servicePoint.id,
    }));
  }, [servicePoints]);

  return (
    <AccordionSet>
      <TextFilter
        activeFilters={activeFilters?.userBarcode}
        labelId="ui-circulation-log.logEvent.user"
        name="userBarcode"
        onChange={adaptedApplyFilters}
        disabled={disabled}
        closedByDefault={false}
      />

      <TextFilter
        activeFilters={activeFilters?.itemBarcode}
        labelId="ui-circulation-log.logEvent.item"
        name="itemBarcode"
        onChange={adaptedApplyFilters}
        disabled={disabled}
        closedByDefault={false}
      />

      <TextFilter
        activeFilters={activeFilters?.description}
        labelId="ui-circulation-log.logEvent.description"
        name="description"
        onChange={adaptedApplyFilters}
        disabled={disabled}
        closedByDefault={false}
      />

      <AcqDateRangeFilter
        activeFilters={activeFilters?.date}
        labelId="ui-circulation-log.logEvent.date"
        name="date"
        onChange={adaptedApplyFilters}
        disabled={disabled}
        closedByDefault={false}
      />

      <AcqCheckboxFilter
        activeFilters={activeFilters?.servicePointId}
        disabled={disabled}
        labelId="ui-circulation-log.logEvent.servicePoint"
        name="servicePointId"
        onChange={adaptedApplyFilters}
        options={servicePointFilterOptions}
        closedByDefault={false}
      />

      <AcqCheckboxFilter
        activeFilters={activeFilters?.loan}
        disabled={disabled}
        labelId={`ui-circulation-log.logEvent.object.${LOG_EVENT_OBJECTS.LOAN}`}
        name="loan"
        onChange={adaptedApplyFilters}
        options={loanFilterOptions}
      />

      <AcqCheckboxFilter
        activeFilters={activeFilters?.notice}
        disabled={disabled}
        labelId={`ui-circulation-log.logEvent.object.${LOG_EVENT_OBJECTS.NOTICE}`}
        name="notice"
        onChange={adaptedApplyFilters}
        options={noticeFilterOptions}
      />

      <AcqCheckboxFilter
        activeFilters={activeFilters?.fee}
        disabled={disabled}
        labelId={`ui-circulation-log.logEvent.object.${LOG_EVENT_OBJECTS.FEE}`}
        name="fee"
        onChange={adaptedApplyFilters}
        options={feeFilterOptions}
      />

      <AcqCheckboxFilter
        activeFilters={activeFilters?.request}
        disabled={disabled}
        labelId={`ui-circulation-log.logEvent.object.${LOG_EVENT_OBJECTS.REQUEST}`}
        name="request"
        onChange={adaptedApplyFilters}
        options={requestFilterOptions}
      />
    </AccordionSet>
  );
};

CirculationLogListFilter.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  servicePoints: PropTypes.arrayOf(PropTypes.object),
};

CirculationLogListFilter.defaultProps = {
  servicePoints: [],
};
