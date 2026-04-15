import { act } from 'react';
import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useLocationFilters } from './useLocationFilters';

describe('useLocationFilters', () => {
  const mockHistory = { push: jest.fn() };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('applyFilters', () => {
    describe('when offset is present in location.search', () => {
      it('should strip offset from the resulting URL', () => {
        const mockLocation = { search: '?offset=100&limit=100&userBarcode=old' };
        const { result } = renderHook(() => useLocationFilters({ history: mockHistory, location: mockLocation }));

        act(() => {
          result.current.applyFilters({ userBarcode: 'new' });
        });

        const pushedSearch = mockHistory.push.mock.calls[0][0].search;
        expect(pushedSearch).not.toMatch(/offset=100/);
      });
    });

    describe('when offset is not present in location.search', () => {
      it('should push new filters without adding offset', () => {
        const mockLocation = { search: '?limit=100&userBarcode=old' };
        const { result } = renderHook(() => useLocationFilters({ history: mockHistory, location: mockLocation }));

        act(() => {
          result.current.applyFilters({ userBarcode: 'new' });
        });

        const pushedSearch = mockHistory.push.mock.calls[0][0].search;
        expect(pushedSearch).toMatch(/userBarcode=new/);
        expect(pushedSearch).not.toMatch(/offset=/);
      });
    });
  });

  describe('resetFilters', () => {
    it('should push empty search', () => {
      const mockLocation = { search: '?offset=100&userBarcode=test' };
      const { result } = renderHook(() => useLocationFilters({ history: mockHistory, location: mockLocation }));

      act(() => {
        result.current.resetFilters();
      });

      expect(mockHistory.push).toHaveBeenCalledWith({ pathname: '', search: '' });
    });
  });
});
