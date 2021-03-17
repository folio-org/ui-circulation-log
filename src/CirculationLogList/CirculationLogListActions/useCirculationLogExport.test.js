import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { waitFor } from '@testing-library/react';
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

const files = ['bursar1.dat', 'bursar2'];

describe('useCirculationLogExport', () => {
  let postMock;
  let getMock;

  beforeEach(() => {
    postMock = jest.fn(() => ({
      json: jest.fn(() => ({ id: 'sas-fsd-53-sda' })),
    }));
    getMock = jest.fn(() => ({
      json: jest.fn(() => ({ id: 'sas-fsd-53-sda', status: 'SUCCESSFUL', files })),
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

  it('should download all files when job is successful', async () => {
    const linkMock = document.createElement('a');

    jest.clearAllTimers();

    const { result } = renderHook(
      () => useCirculationLogExport({
        onSuccess: jest.fn(),
      }),
      { wrapper },
    );

    linkMock.dispatchEvent = jest.fn();
    jest.spyOn(document, 'createElement').mockReturnValue(linkMock);

    await result.current.requestExport();

    jest.runAllTimers();

    await waitFor(() => expect(linkMock.dispatchEvent).toHaveBeenCalledTimes(files.length));
  });

  it('should not download files when job is failed', async () => {
    const linkMock = document.createElement('a');

    jest.clearAllTimers();

    useOkapiKy.mockClear().mockReturnValue({
      post: postMock,
      get: jest.fn(() => ({
        json: jest.fn(() => ({ id: 'sas-fsd-53-sda', status: 'FAILED' })),
      })),
    });

    const { result } = renderHook(
      () => useCirculationLogExport({
        onSuccess: jest.fn(),
      }),
      { wrapper },
    );

    linkMock.dispatchEvent = jest.fn();
    jest.spyOn(document, 'createElement').mockReturnValue(linkMock);

    await result.current.requestExport();

    jest.runAllTimers();

    expect(linkMock.dispatchEvent).not.toHaveBeenCalled();
  });
});
