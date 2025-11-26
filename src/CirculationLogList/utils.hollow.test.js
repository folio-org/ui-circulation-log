import {
  makeQueryBuilder,
} from '@folio/stripes-acq-components';

import {
  buildLogEventsQuery,
  buildDatesWithTimeZoneOffsets,
  isDCBItem,
} from './utils';

import {
  DCB_INSTANCE_ID,
  DCB_HOLDINGS_RECORD_ID,
} from './constants';

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

  describe('buildDatesWithTimeZoneOffsets', () => {
    it('should return date range with offsets as per supplied timezone', () => {
      const dateRange = buildDatesWithTimeZoneOffsets('2023-09-15:2023-09-15', 'Asia/Calcutta');

      expect(dateRange).toContain('date>="2023-09-14T18:30:00.000Z" and date<="2023-09-15T18:29:59.999Z"');
    });
  });

  describe('isDCBItem ', () => {
    it('should return true when both item instance id and item holdings record id are DCB_INSTANCE_ID and DCB_HOLDINGS_RECORD_ID respectively', () => {
      const item = {
        instanceId: DCB_INSTANCE_ID,
        holdingId: DCB_HOLDINGS_RECORD_ID,
      };
      expect(isDCBItem(item)).toBeTruthy();
    });

    it('should return false when item instance id is DCB_INSTANCE_ID and item holdings record id is not DCB_HOLDINGS_RECORD_ID', () => {
      const item = {
        instanceId: DCB_INSTANCE_ID,
        holdingId: 'test',
      };
      expect(isDCBItem(item)).toBeFalsy();
    });

    it('should return false when item instance id is not DCB_INSTANCE_ID and item holdings record id is DCB_HOLDINGS_RECORD_ID', () => {
      const item = {
        instanceId: 'test',
        holdingId: DCB_HOLDINGS_RECORD_ID,
      };
      expect(isDCBItem(item)).toBeFalsy();
    });

    it('should return false when item instance id is not DCB_INSTANCE_ID and item holdings record id is not DCB_HOLDINGS_RECORD_ID', () => {
      const item = {
        instanceId: 'test',
        holdingId: 'test',
      };
      expect(isDCBItem(item)).toBeFalsy();
    });
  });
});
