import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { noop } from 'lodash';

import {
  AccordionSet,
  Accordion,
  EmptyMessage,
  getLocaleDateFormat,
} from '@folio/stripes/components';
import {
  useSetRef,
  useSetRefOnFocus,
  MultiSelectionFilter,
} from '@folio/stripes/smart-components';

import {
  AcqCheckboxFilter,
  AcqDateRangeFilter,
  FilterAccordion,
} from '@folio/stripes-acq-components';

import {
  LOG_EVENT_OBJECTS,
  LOAN_ACTIONS,
  NOTICE_ACTIONS,
  FEE_ACTIONS,
  REQUEST_ACTIONS,
} from '../constants';
import { TextFilters } from './TextFilters';

import { buildCheckboxFilterOptions } from './utils';

const loanFilterOptions = buildCheckboxFilterOptions(LOAN_ACTIONS);
const noticeFilterOptions = buildCheckboxFilterOptions(NOTICE_ACTIONS);
const feeFilterOptions = buildCheckboxFilterOptions(FEE_ACTIONS);
const requestFilterOptions = buildCheckboxFilterOptions(REQUEST_ACTIONS);

export const CirculationLogListFilter = ({
  activeFilters,
  applyFilters,
  disabled = false,
  servicePoints = [],
  focusRef,
  letLoseFocus = noop,
}) => {
  const intl = useIntl();

  const adaptedApplyFilters = useCallback(
    ({ name, values }) => applyFilters({ [name]: values }),
    [applyFilters],
  );

  const localeDateFormat = useMemo(() => (
    getLocaleDateFormat({ intl })
  ), [intl]);

  const servicePointFilterOptions = useMemo(() => {
    return servicePoints.map(servicePoint => ({
      label: servicePoint.name,
      value: servicePoint.id,
    }));
  }, [servicePoints]);

  const setFocusRef = useSetRef(focusRef);
  const setFocusRefOnFocus = useSetRefOnFocus(focusRef);

  return (
    <AccordionSet>
      <Accordion header={() => <EmptyMessage />} label="">
        <div onFocus={() => letLoseFocus(true)}>
          <TextFilters
            activeFilters={activeFilters}
            applyFilters={applyFilters}
            disabled={disabled}
            focusRef={node => {
              setFocusRef(node);
              setFocusRefOnFocus(node);
            }}
          />
        </div>
      </Accordion>

      <div onFocus={() => letLoseFocus(true)}>
        <AcqDateRangeFilter
          activeFilters={activeFilters?.date}
          labelId="ui-circulation-log.logEvent.date"
          name="date"
          onChange={adaptedApplyFilters}
          disabled={disabled}
          closedByDefault={false}
          dateFormat={localeDateFormat}
          focusRef={setFocusRefOnFocus}
        />
      </div>

      <div onFocus={() => letLoseFocus(true)}>
        <FilterAccordion
          activeFilters={activeFilters?.servicePointId}
          closedByDefault={false}
          disabled={disabled}
          labelId="ui-circulation-log.logEvent.servicePoint"
          name="servicePointId"
          onChange={adaptedApplyFilters}
        >
          <MultiSelectionFilter
            ariaLabelledBy="accordion-toggle-button-servicePointId"
            dataOptions={servicePointFilterOptions}
            disabled={disabled}
            name="servicePointId"
            onChange={adaptedApplyFilters}
            selectedValues={activeFilters?.servicePointId}
          />
        </FilterAccordion>

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
      </div>
    </AccordionSet>
  );
};

CirculationLogListFilter.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  servicePoints: PropTypes.arrayOf(PropTypes.object),
  focusRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  letLoseFocus: PropTypes.func,
};
