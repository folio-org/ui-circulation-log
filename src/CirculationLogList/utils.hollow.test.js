import '@folio/stripes-acq-components/test/jest/__mock__';

import {
  makeQueryBuilder,
} from '@folio/stripes-acq-components';

import {
  buildLogEventsQuery,
} from './utils';

jest.mock('@folio/stripes-acq-components', () => {
  return {
    ...jest.requireActual('@folio/stripes-acq-components'),
    makeQueryBuilder: jest.fn(() => queryParams => JSON.stringify(queryParams)),
  };
});

describe('CirculationLogList utils', () => {
  describe('buildLogEventsQuery', () => {
    it('should invoke stripes acq makeQueryBuilder to build a query string', () => {
      buildLogEventsQuery({});

      expect(makeQueryBuilder).toHaveBeenCalled();
    });

    it('should remove single object action properties from filter query', () => {
      const objectFilters = ['loan', 'fee', 'notice', 'request'];

      const filterQuery = buildLogEventsQuery({
        ...objectFilters.reduce((acc, object) => {
          acc[object] = 'object';

          return acc;
        }, {}),
      });

      objectFilters.forEach(
        (object) => expect(filterQuery.includes(object)).toBeFalsy(),
      );
    });

    it('should union single object props to action property in filter query', () => {
      const filterQuery = buildLogEventsQuery({
        loan: 'Check out',
        notice: ['Sent', 'Edited'],
      });

      expect(filterQuery.includes('"action":["Check out","Sent","Edited"]')).toBeTruthy();
    });
  });
});
