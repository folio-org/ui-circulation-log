import {
  LOG_EVENT_OBJECTS,
} from '../constants';

export const getHasLoanDetails = (object, loanId) => (
  loanId
  && (
    object === LOG_EVENT_OBJECTS.LOAN
    || object === LOG_EVENT_OBJECTS.FEE
  )
);

export const getHasUserDetails = (object, userId) => (
  userId
  && (
    object === LOG_EVENT_OBJECTS.LOAN
    || object === LOG_EVENT_OBJECTS.FEE
  )
);

export const getHasItemDetails = (object, itemId) => (
  itemId && object === LOG_EVENT_OBJECTS.LOAN
);

export const getHasFeeDetails = (object, feeId) => (
  feeId && object === LOG_EVENT_OBJECTS.FEE
);

export const getHasRequestDetails = (object, requestId) => (
  requestId
  && (
    object === LOG_EVENT_OBJECTS.LOAN
    || object === LOG_EVENT_OBJECTS.FEE
  )
);
