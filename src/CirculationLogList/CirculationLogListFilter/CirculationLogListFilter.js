import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  AccordionSet,
} from '@folio/stripes/components';

import {
  AcqCheckboxFilter,
} from '@folio/stripes-acq-components';

const applyFiltersAdapter = (applyFilters) => ({ name, values }) => applyFilters(name, values);

export const CirculationLogListFilter = ({
  activeFilters,
  applyFilters,
  disabled,
}) => {
  const adaptedApplyFilters = useCallback(
    applyFiltersAdapter(applyFilters),
    [applyFilters],
  );

  return (
    <AccordionSet>
      <AcqCheckboxFilter
        id="filter-loan"
        activeFilters={activeFilters?.loan}
        disabled={disabled}
        labelId="ui-circulation-log.logEvent.object"
        name="loan"
        onChange={adaptedApplyFilters}
        options={[{ label: 'Loan', value: 'loan' }]}
      />
    </AccordionSet>
  );
};

CirculationLogListFilter.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};
