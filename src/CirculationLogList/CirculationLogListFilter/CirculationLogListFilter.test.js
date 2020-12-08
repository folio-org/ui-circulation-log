import React from 'react';
import {
  render,
} from '@testing-library/react';

import '@folio/stripes-acq-components/test/jest/__mock__';

import {
  TextFilter,
  AcqDateRangeFilter,
} from '@folio/stripes-acq-components';

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
    TextFilter: jest.fn(({ labelId }) => <span>{labelId}</span>),
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
  afterEach(() => {
    TextFilter.mockClear();
  });

  it('should display filter by user barcode', () => {
    const activeFilterValue = ['10056'];
    const props = {
      ...defaultProps,
      activeFilters: { userBarcode: activeFilterValue },
    };
    const userBarcodeFilterText = 'ui-circulation-log.logEvent.user';

    const { getByText } = renderCircLogListFilter(props);
    const userBarcodeFilterProps =
      TextFilter.mock.calls.find(call => call[0].labelId === userBarcodeFilterText)[0];

    expect(getByText(userBarcodeFilterText)).toBeDefined();
    expect(userBarcodeFilterProps.onChange).toBeDefined();
    expect(userBarcodeFilterProps.activeFilters).toEqual(activeFilterValue);
  });

  it('should display filter by item barcode', () => {
    const activeFilterValue = ['10057'];
    const props = {
      ...defaultProps,
      activeFilters: { itemBarcode: activeFilterValue },
    };
    const itemBarcodeFilterText = 'ui-circulation-log.logEvent.item';

    const { getByText } = renderCircLogListFilter(props);
    const itemBarcodeFilterProps =
      TextFilter.mock.calls.find(call => call[0].labelId === itemBarcodeFilterText)[0];

    expect(getByText(itemBarcodeFilterText)).toBeDefined();
    expect(itemBarcodeFilterProps.onChange).toBeDefined();
    expect(itemBarcodeFilterProps.activeFilters).toEqual(activeFilterValue);
  });

  it('should display filter by description', () => {
    const activeFilterValue = ['Checkout info'];
    const props = {
      ...defaultProps,
      activeFilters: { description: activeFilterValue },
    };
    const descriptionFilterText = 'ui-circulation-log.logEvent.description';

    const { getByText } = renderCircLogListFilter(props);
    const descriptionFilterProps =
      TextFilter.mock.calls.find(call => call[0].labelId === descriptionFilterText)[0];

    expect(getByText(descriptionFilterText)).toBeDefined();
    expect(descriptionFilterProps.onChange).toBeDefined();
    expect(descriptionFilterProps.activeFilters).toEqual(activeFilterValue);
  });

  it('should display filter by date', () => {
    const dateFilterText = 'ui-circulation-log.logEvent.date';

    const { getByText } = renderCircLogListFilter();
    const dateFilterProps =
      AcqDateRangeFilter.mock.calls.find(call => call[0].labelId === dateFilterText)[0];

    expect(getByText(dateFilterText)).toBeDefined();
    expect(dateFilterProps.onChange).toBeDefined();
  });

  it('should display filter by loan actions', () => {
    const loanFilterText = `ui-circulation-log.logEvent.object.${LOG_EVENT_OBJECTS.LOAN}`;

    const { getByText } = renderCircLogListFilter();

    expect(getByText(loanFilterText)).toBeDefined();

    Object.values(LOAN_ACTIONS)
      .forEach((loanAction) => expect(getByText(loanAction)).toBeDefined());
  });

  it('should display filter by notice actions', () => {
    const noticeFilterText = `ui-circulation-log.logEvent.object.${LOG_EVENT_OBJECTS.NOTICE}`;

    const { getByText } = renderCircLogListFilter();

    expect(getByText(noticeFilterText)).toBeDefined();

    Object.values(NOTICE_ACTIONS)
      .forEach((noticeAction) => expect(getByText(noticeAction)).toBeDefined());
  });

  it('should display filter by fee actions', () => {
    const feeFilterText = `ui-circulation-log.logEvent.object.${LOG_EVENT_OBJECTS.FEE}`;

    const { getByText } = renderCircLogListFilter();

    expect(getByText(feeFilterText)).toBeDefined();

    Object.values(FEE_ACTIONS)
      .forEach((feeAction) => expect(getByText(feeAction)).toBeDefined());
  });

  it('should display filter by request actions', () => {
    const requestFilterText = `ui-circulation-log.logEvent.object.${LOG_EVENT_OBJECTS.REQUEST}`;

    const { getByText } = renderCircLogListFilter();

    expect(getByText(requestFilterText)).toBeDefined();

    Object.values(REQUEST_ACTIONS)
      .forEach((requestAction) => expect(getByText(requestAction)).toBeDefined());
  });

  it('auto-focuses first text field', () => {
    renderCircLogListFilter();

    // take the props for the first TextFilter, and the rest of them
    const [first, ...rest] = TextFilter.mock.calls.map(args => args[0]);

    expect(first.autoFocus).toBeTruthy();
    expect(rest.some(props => props.autoFocus)).toBeFalsy();
  });
});
