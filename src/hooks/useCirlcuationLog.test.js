import { act } from 'react';
import { useLocation } from 'react-router-dom';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import { useCirculationLog } from './useCirculationLog';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({}),
}));

describe('useCirculationLog', () => {
  it('should not call API right away, but after location is changed', async () => {
    const { result, rerender } = renderHook(
      () => useCirculationLog(false,
        jest.fn().mockResolvedValue(),
        null,
        {
          limit: 50,
          offset: 0,
        }),
    );

    expect(result.current.isLoading).toBe(false);

    useLocation.mockReturnValue({ search: '?workflowStatus=Pending' });
    rerender();

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it('should call API right away and return records', async () => {
    const queryLoadRecords = jest.fn().mockResolvedValue({
      totalRecords: 100,
      logRecords: {
        id: 1,
      },
    });
    const loadRecordsCB = (setValue, value) => setValue(value);
    const { result } = renderHook(() => useCirculationLog(true,
      queryLoadRecords,
      loadRecordsCB,
      {
        limit: 50,
        offset: 0,
      }));

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.recordsCount).toBe(100);
    expect(result.current.records).toEqual({
      totalRecords: 100,
      logRecords: { id: 1 },
    });
  });

  describe('when location.search is empty', () => {
    it('should reset recordsCount', async () => {
      useLocation.mockReturnValue({ search: '?limit=100&offset=0&userBarcode=1' });

      const { result, rerender } = renderHook(
        () => useCirculationLog(false,
          jest.fn().mockResolvedValue(),
          null,
          {
            limit: 100,
            offset: 0,
          }),
      );

      await act(async () => !result.current.isLoading);

      useLocation.mockReturnValue({ search: '' });
      rerender();

      await act(async () => !result.current.isLoading);
      expect(result.current.recordsCount).toBe(0);
    });
  });

  describe('when offset is not present in location.search', () => {
    it('should call API with offset 0 regardless of pagination.offset prop', async () => {
      useLocation.mockReturnValue({ search: '?userBarcode=test' });
      const queryLoadRecords = jest.fn().mockResolvedValue(undefined);

      renderHook(() => useCirculationLog(
        true,
        queryLoadRecords,
        null,
        { limit: 100, offset: 100 },
      ));

      await waitFor(() => expect(queryLoadRecords).toHaveBeenCalled());
      expect(queryLoadRecords).toHaveBeenLastCalledWith(0);
    });
  });

  describe('when offset is present in location.search', () => {
    it('should call API with the offset from URL', async () => {
      useLocation.mockReturnValue({ search: '?userBarcode=test&offset=100' });
      const queryLoadRecords = jest.fn().mockResolvedValue(undefined);

      renderHook(() => useCirculationLog(
        true,
        queryLoadRecords,
        null,
        { limit: 100, offset: 0 },
      ));

      await waitFor(() => expect(queryLoadRecords).toHaveBeenCalled());
      expect(queryLoadRecords).toHaveBeenLastCalledWith(100);
    });
  });
});
