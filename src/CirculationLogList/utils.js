import { flatten } from 'lodash';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import {
  makeQueryBuilder,
  SORTING_PARAMETER,
} from '@folio/stripes-acq-components';

import { CUSTOM_FILTERS, DATE_DEFAULT_SORTING_DIRECTION } from './constants';

dayjs.extend(utc);
dayjs.extend(timezone);

const DATE_SORT_CLAUSE = `date/sort.${DATE_DEFAULT_SORTING_DIRECTION}`;

const queryBuilder = makeQueryBuilder(
  'cql.allRecords=1',
  undefined,
  `sortby ${DATE_SORT_CLAUSE}`,
  CUSTOM_FILTERS,
);

export const buildDatesWithTimeZoneOffsets = (dates, localTimeZone) => {
  const [from, to] = dates.split(':');
  const start = dayjs.tz(from, localTimeZone).startOf('day').format();
  const end = dayjs.tz(to, localTimeZone).endOf('day').format();

  return `(date>="${start}" and date<="${end}")`;
};

export const buildLogEventsQuery = (queryParams, localTimeZone) => {
  const objectFilters = ['loan', 'fee', 'notice', 'request'];
  const formattedQueryParams = {
    ...queryParams,
    ...objectFilters.reduce((acc, filter) => {
      acc[filter] = undefined;

      return acc;
    }, {}),
  };

  const actionFilterValues = objectFilters.reduce((acc, filter) => {
    return [...acc, ...flatten([queryParams[filter] || []])];
  }, []);

  if (actionFilterValues.length) formattedQueryParams.action = actionFilterValues;
  if (queryParams.date) {
    const datesLocalized = buildDatesWithTimeZoneOffsets(queryParams.date, localTimeZone);

    formattedQueryParams.date = datesLocalized;
  }

  let query = queryBuilder(formattedQueryParams);

  // We want to sort by date inside any other sorting
  // and the makeQueryBuilder() is able to generate only one sortBy parameter
  // so we add date sorting in plain text
  if (formattedQueryParams[SORTING_PARAMETER]) query += ` ${DATE_SORT_CLAUSE}`;

  return query;
};
