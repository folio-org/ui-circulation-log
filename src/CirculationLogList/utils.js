import { flatten } from 'lodash';

import {
  makeQueryBuilder,
} from '@folio/stripes-acq-components';

import { CUSTOM_FILTERS } from './constants';

export const buildLogEventsQuery = queryParams => {
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

  return makeQueryBuilder(
    'cql.allRecords=1',
    undefined,
    undefined,
    CUSTOM_FILTERS,
  )(formattedQueryParams);
};
