import React from 'react';
import {
  render,
  cleanup,
  act,
} from '@testing-library/react';

import '@folio/stripes-acq-components/test/jest/__mock__';

import { CirculationLogListContainer } from './CirculationLogListContainer';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({}),
}));

jest.mock('@folio/stripes-acq-components', () => {
  return {
    ...jest.requireActual('@folio/stripes-acq-components'),
    useList: (isLoading, loadRecords, postLoad) => {
      loadRecords();
      postLoad(() => {}, {});

      return {};
    },
  };
});

jest.mock('./CirculationLogList', () => ({
  CirculationLogList: () => <span>CirculationLogList</span>,
}));

const renderCirculationLogListContainer = ({ mutator }) => (render(
  <CirculationLogListContainer
    mutator={mutator}
  />,
));

describe('Given Circulation Log List Container', () => {
  let mutator;

  beforeEach(() => {
    mutator = {
      logEventsListEvents: {
        GET: jest.fn(() => Promise.resolve([])),
      },
      logEventsServicePoints: {
        GET: jest.fn(() => Promise.resolve([])),
      },
    };
  });

  afterEach(cleanup);

  it('Than it should fetch log events', async () => {
    await act(async () => {
      await renderCirculationLogListContainer({ mutator });
    });

    expect(mutator.logEventsListEvents.GET).toHaveBeenCalled();
  });

  it('Than it should fetch service points', async () => {
    await act(async () => {
      await renderCirculationLogListContainer({ mutator });
    });

    expect(mutator.logEventsServicePoints.GET).toHaveBeenCalled();
  });

  it('Than it should display Circulation Log List', async () => {
    let getByText;

    await act(async () => {
      const renderer = await renderCirculationLogListContainer({ mutator });

      getByText = renderer.getByText;
    });

    expect(getByText('CirculationLogList')).toBeDefined();
  });
});
