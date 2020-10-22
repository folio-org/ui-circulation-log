import { flatten } from 'lodash';

import {
  makeQueryBuilder,
  SORTING_PARAMETER,
  SORTING_DIRECTION_PARAMETER,
} from '@folio/stripes-acq-components';

import { CUSTOM_FILTERS, DATE_DEFAULT_SORTING_DIRECTION } from './constants';

const queryBuilder = makeQueryBuilder(
  'cql.allRecords=1',
  undefined,
  undefined,
  CUSTOM_FILTERS,
);

export const buildLogEventsQuery = queryParams => {
  const objectFilters = ['loan', 'fee', 'notice', 'request'];
  const formattedQueryParams = {
    [SORTING_PARAMETER]: 'date',
    [SORTING_DIRECTION_PARAMETER]: DATE_DEFAULT_SORTING_DIRECTION,
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

  let query = queryBuilder(formattedQueryParams);

  // We want to sort by date inside any other sorting
  // and the makeQueryBuilder() is able to generate only one sortBy parameter
  // so we add date sorting in plain text
  if (formattedQueryParams[SORTING_PARAMETER] !== 'date') query += ` date/sort.${DATE_DEFAULT_SORTING_DIRECTION}`;

  return query;
};
