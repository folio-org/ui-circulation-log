import { buildLogEventsQuery } from './utils';

describe('CirculationLogList utils', () => {
  describe('buildLogEventsQuery sets the sorting by date in descending order', () => {
    it('by default', () => {
      const query = buildLogEventsQuery({});

      expect(query.includes('sortby date/sort.descending')).toBeTruthy();
    });

    it('as secondary sorting criteria', () => {
      const query = buildLogEventsQuery({ sorting: 'foo', sortingDirection: 'ascending' });

      expect(query.includes('sortby foo/sort.ascending date/sort.descending')).toBeTruthy();
    });
  });
});
