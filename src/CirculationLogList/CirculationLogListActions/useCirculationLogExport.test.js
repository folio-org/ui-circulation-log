import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import '@folio/stripes-acq-components/test/jest/__mock__';
import { useOkapiKy } from '@folio/stripes/core';

import {
  useCirculationLogExport,
} from './useCirculationLogExport';

jest.useFakeTimers();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({}),
}));

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useCirculationLogExport', () => {
  let postMock;
  let getMock;

  beforeEach(() => {
    postMock = jest.fn(() => ({
      json: jest.fn(() => ({ id: 'sas-fsd-53-sda' })),
    }));
    getMock = jest.fn(() => ({
      json: jest.fn(() => ({ id: 'sas-fsd-53-sda', status: 'FAILED' })),
    }));

    useOkapiKy.mockClear().mockReturnValue({
      post: postMock,
      get: getMock,
    });
  });

  it('should make post request to create export job', async () => {
    const { result } = renderHook(
      () => useCirculationLogExport({
        onSuccess: jest.fn(),
      }),
      { wrapper },
    );

    await result.current.requestExport();

    expect(postMock).toHaveBeenCalled();
  });

  it('should call polling timer', async () => {
    const { result } = renderHook(
      () => useCirculationLogExport({
        onSuccess: jest.fn(),
      }),
      { wrapper },
    );

    await result.current.requestExport();

    expect(setTimeout).toHaveBeenCalled();
  });

  it('should poll jobs', async () => {
    jest.clearAllTimers();

    const { result } = renderHook(
      () => useCirculationLogExport({
        onSuccess: jest.fn(),
      }),
      { wrapper },
    );

    await result.current.requestExport();

    jest.runAllTimers();

    expect(getMock).toHaveBeenCalled();
  });
});
