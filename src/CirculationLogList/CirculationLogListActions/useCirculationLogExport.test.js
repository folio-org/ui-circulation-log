import { act } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { renderHook } from '@testing-library/react-hooks';

import { useCirculationLogExport } from './useCirculationLogExport';
import { buildLogEventsQuery } from '../utils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({}),
}));

jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  buildLogEventsQuery: jest.fn(),
}));

useOkapiKy.mockReturnValue({
  get: jest.fn().mockReturnValue({
    json: jest.fn().mockResolvedValue({
      id: '123',
      status: 'SUCCESSFUL',
      fileNames: ['export.csv'],
    }),
  }),
  post: jest.fn().mockReturnValue({
    json: jest.fn().mockResolvedValue({ id: '123' }),
  }),
});

const queryClient = new QueryClient();

const timezone = 'UTC';
const mockOnSuccess = jest.fn();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useCirculationLogExport', () => {
  describe('when buildLogEventsQuery is called', () => {
    it('should pass timezone', async () => {
      const { result } = renderHook(() => useCirculationLogExport({
        onSuccess: mockOnSuccess,
      }), { wrapper });

      await act(() => result.current.requestExport());

      expect(buildLogEventsQuery).toHaveBeenCalledWith(expect.any(Object), timezone);
    });
  });
});
