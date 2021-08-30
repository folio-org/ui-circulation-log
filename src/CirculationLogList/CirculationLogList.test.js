import React from 'react';
import { render, screen, within } from '@testing-library/react';

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

describe('Circulation Log List', () => {
  it('displays log events filter pane', () => {
    renderCirculationLogList({});

    expect(screen.getByRole('heading', { name: /searchAndFilter/ })).toBeVisible();
  });

  it('Then it should display log events table header', () => {
    const logEvent = getLogEvent();

    renderCirculationLogList({ logEvents: [logEvent] });

    const grid = screen.getByRole('grid');
    const columns = [
      /user/,
      /item/,
      /object/,
      /action$/, // not to mix with /actions/
      /date/,
      /servicePoint/,
      /source/,
      /description/,
      /actions/,
    ];

    columns.forEach(
      name => expect(within(grid).getByRole('columnheader', { name })).toBeVisible(),
    );
  });

  it('Then it should display log events table row', async () => {
    const logEvent = getLogEvent();
    renderCirculationLogList({ logEvents: [logEvent] });

    const row = screen.getByRole('row', { name: new RegExp(logEvent.userBarcode) });
    const cells = [
      logEvent.userBarcode,
      logEvent.items[0].itemBarcode,
      new RegExp(`logEvent.object.${logEvent.object}`),
      new RegExp(`logEvent.action.${logEvent.action}`),
      logEvent.date,
      logEvent.source,
      logEvent.description,
      servicePoint.name,
      'CirculationLogEventActions',
    ];

    cells.forEach(
      name => expect(within(row).getByRole('gridcell', { name })).toBeVisible(),
    );
  });

  it('auto-focuses first text field when there is no results', () => {
    renderCirculationLogList({});

    const [first, ...rest] = screen.getAllByRole('textbox');

    expect(first).toHaveFocus();
    rest.forEach(field => expect(field).not.toHaveFocus());
  });
});
