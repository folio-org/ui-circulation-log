import { renderHook } from '@testing-library/react-hooks';
import { useLocation } from 'react-router-dom';

import { useCirculationLog } from './useCirculationLog';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({}),
}));

describe('useCirculationLog', () => {
  it('should not call API right away, but after location is changed', async () => {
    const { result, rerender, waitForNextUpdate } = renderHook(
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
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
  });

  it('should call API right away and return records', async () => {
    const queryLoadRecords = jest.fn().mockResolvedValue({
      totalRecords: 100,
      logRecords: {
        id: 1,
      },
    });
    const loadRecordsCB = (setValue, value) => setValue(value);
    const { result, waitForNextUpdate } = renderHook(() => useCirculationLog(true,
      queryLoadRecords,
      loadRecordsCB,
      {
        limit: 50,
        offset: 0,
      }));

    expect(result.current.isLoading).toBe(true);
    await waitForNextUpdate();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.recordsCount).toBe(100);
    expect(result.current.records).toEqual({
      totalRecords: 100,
      logRecords: { id: 1 },
    });
  });
});
