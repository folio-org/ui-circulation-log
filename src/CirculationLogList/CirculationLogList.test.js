import React from 'react';
import { render } from '@testing-library/react';

import '@folio/stripes-acq-components/test/jest/__mock__';

import { CirculationLogList } from './CirculationLogList';

jest.mock('react-virtualized-auto-sizer', () => {
  return jest.fn(({ children }) => <div>{children({})}</div>);
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({}),
  useHistory: () => ({}),
}));

jest.mock('@folio/stripes-acq-components', () => {
  return {
    ...jest.requireActual('@folio/stripes-acq-components'),
    useLocationFilters: () => [],
    useLocationSorting: () => [],
    ResetButton: () => 'ResetButton',
    NoResultsMessage: () => 'NoResultsMessage',
  };
});

jest.mock('./CirculationLogListFilter', () => ({
  CirculationLogListFilter: () => <span>CirculationLogListFilter</span>,
}));

jest.mock('./CirculationLogEventActions', () => ({
  CirculationLogEventActions: () => <span>CirculationLogEventActions</span>,
}));

jest.mock('./CirculationLogListActions', () => ({
  CirculationLogListActions: () => <span>CirculationLogListActions</span>,
}));

const servicePoint = { id: 1, name: 'servicePoint' };
const getLogEvent = () => ({
  userBarcode: Math.random(),
  items: [{
    itemBarcode: Math.random(),
  }],
  object: 'Loan',
  action: 'Check in',
  date: '1994-07-29',
  source: 'jhon',
  description: 'Check in',
  servicePointId: servicePoint.id,
});

const renderCirculationLogList = ({ logEvents = [] }) => (render(
  <CirculationLogList
    onNeedMoreData={() => {}}
    resetData={() => {}}
    logEventsCount={logEvents.length}
    logEvents={logEvents}
    isLoading={false}
    servicePoints={[servicePoint]}
  />,
));

describe('Given Circulation Log List', () => {
  it('Then it should display log events filter pane', async () => {
    const { getByText } = renderCirculationLogList({});

    expect(getByText('CirculationLogListFilter')).toBeDefined();
  });

  it('Then it should display log events table header', async () => {
    const logEvent = getLogEvent();
    const { getByText } = renderCirculationLogList({ logEvents: [logEvent] });

    expect(getByText('ui-circulation-log.logEvent.user')).toBeDefined();
    expect(getByText('ui-circulation-log.logEvent.item')).toBeDefined();
    expect(getByText('ui-circulation-log.logEvent.object')).toBeDefined();
    expect(getByText('ui-circulation-log.logEvent.action')).toBeDefined();
    expect(getByText('ui-circulation-log.logEvent.date')).toBeDefined();
    expect(getByText('ui-circulation-log.logEvent.servicePoint')).toBeDefined();
    expect(getByText('ui-circulation-log.logEvent.source')).toBeDefined();
    expect(getByText('ui-circulation-log.logEvent.description')).toBeDefined();
  });

  it('Then it should display log events table row', async () => {
    const logEvent = getLogEvent();
    const { getByText } = renderCirculationLogList({ logEvents: [logEvent] });

    expect(getByText(`${logEvent.userBarcode}`)).toBeDefined();
    expect(getByText(`${logEvent.items[0].itemBarcode}`)).toBeDefined();
    expect(getByText(`ui-circulation-log.logEvent.object.${logEvent.object}`)).toBeDefined();
    expect(getByText(`ui-circulation-log.logEvent.action.${logEvent.action}`)).toBeDefined();
    expect(getByText(logEvent.date)).toBeDefined();
    expect(getByText(logEvent.source)).toBeDefined();
    expect(getByText(logEvent.description)).toBeDefined();
    expect(getByText(servicePoint.name)).toBeDefined();
    expect(getByText('CirculationLogEventActions')).toBeDefined();
  });
});
