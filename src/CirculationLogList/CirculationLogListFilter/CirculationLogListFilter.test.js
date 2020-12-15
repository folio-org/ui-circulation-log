import React from 'react';
import { render } from '@testing-library/react';

import '@folio/stripes-acq-components/test/jest/__mock__';

import { AcqDateRangeFilter } from '@folio/stripes-acq-components';

import {
  LOG_EVENT_OBJECTS,
  LOAN_ACTIONS,
  NOTICE_ACTIONS,
  FEE_ACTIONS,
  REQUEST_ACTIONS,
} from '../constants';

import { CirculationLogListFilter } from './CirculationLogListFilter';

jest.mock('@folio/stripes-acq-components', () => {
  return {
    ...jest.requireActual('@folio/stripes-acq-components'),
    AcqDateRangeFilter: jest.fn(({ labelId }) => <span>{labelId}</span>),
    AcqCheckboxFilter: jest.fn(({ options, labelId }) => (
      <>
        <span>{labelId}</span>
        {options.map(({ value }) => <span key={value}>{value}</span>)}
      </>
    )),
  };
});

const defaultProps = {
  activeFilters: {},
  applyFilters: jest.fn(),
  disabled: false,
};

const renderCircLogListFilter = ({
  activeFilters,
  applyFilters,
  disabled,
} = defaultProps) => (render(
  <CirculationLogListFilter
    activeFilters={activeFilters}
    applyFilters={applyFilters}
    disabled={disabled}
  />,
));

describe('CirculationLogListFilter', () => {
  describe('Text filters section', () => {
    it('has User barcode', () => {
      const activeFilterValue = '10056';

      const { getByLabelText } = renderCircLogListFilter({
        ...defaultProps,
        activeFilters: { userBarcode: [activeFilterValue] },
      });

      const field = getByLabelText('ui-circulation-log.logEvent.user');

      expect(field.value).toEqual(activeFilterValue);
    });

    it('has Item barcode', () => {
      const activeFilterValue = '10057';

      const { getByLabelText } = renderCircLogListFilter({
        ...defaultProps,
        activeFilters: { itemBarcode: [activeFilterValue] },
      });

      const field = getByLabelText('ui-circulation-log.logEvent.item');

      expect(field.value).toEqual(activeFilterValue);
    });

    it('has Description', () => {
      const activeFilterValue = 'Checkout info';

      const { getByLabelText } = renderCircLogListFilter({
        ...defaultProps,
        activeFilters: { description: [activeFilterValue] },
      });

      const field = getByLabelText('ui-circulation-log.logEvent.description');

      expect(field.value).toEqual(activeFilterValue);
    });
  });

  it('has filter by date', () => {
    const dateFilterText = 'ui-circulation-log.logEvent.date';

    const { getByText } = renderCircLogListFilter();
    const dateFilterProps =
      AcqDateRangeFilter.mock.calls.find(call => call[0].labelId === dateFilterText)[0];

    expect(getByText(dateFilterText)).toBeDefined();
    expect(dateFilterProps.onChange).toBeDefined();
  });

  it('has filter by loan actions', () => {
    const loanFilterText = `ui-circulation-log.logEvent.object.${LOG_EVENT_OBJECTS.LOAN}`;

    const { getByText } = renderCircLogListFilter();

    expect(getByText(loanFilterText)).toBeDefined();

    Object.values(LOAN_ACTIONS)
      .forEach((loanAction) => expect(getByText(loanAction)).toBeDefined());
  });

  it('has filter by notice actions', () => {
    const noticeFilterText = `ui-circulation-log.logEvent.object.${LOG_EVENT_OBJECTS.NOTICE}`;

    const { getByText } = renderCircLogListFilter();

    expect(getByText(noticeFilterText)).toBeDefined();

    Object.values(NOTICE_ACTIONS)
      .forEach((noticeAction) => expect(getByText(noticeAction)).toBeDefined());
  });

  it('has filter by fee actions', () => {
    const feeFilterText = `ui-circulation-log.logEvent.object.${LOG_EVENT_OBJECTS.FEE}`;

    const { getByText } = renderCircLogListFilter();

    expect(getByText(feeFilterText)).toBeDefined();

    Object.values(FEE_ACTIONS)
      .forEach((feeAction) => expect(getByText(feeAction)).toBeDefined());
  });

  it('has filter by request actions', () => {
    const requestFilterText = `ui-circulation-log.logEvent.object.${LOG_EVENT_OBJECTS.REQUEST}`;

    const { getByText } = renderCircLogListFilter();

    expect(getByText(requestFilterText)).toBeDefined();

    Object.values(REQUEST_ACTIONS)
      .forEach((requestAction) => expect(getByText(requestAction)).toBeDefined());
  });

  it('auto-focuses first text field', () => {
    const { getAllByRole } = renderCircLogListFilter();

    const [first, ...rest] = getAllByRole('textbox');

    expect(first).toHaveFocus();
    rest.forEach(field => expect(field).not.toHaveFocus());
  });
});
