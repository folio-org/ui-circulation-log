import {
  LOG_EVENT_OBJECTS,
} from '../constants';

const objectsWithLoanDetails = new Set([
  LOG_EVENT_OBJECTS.LOAN,
  LOG_EVENT_OBJECTS.FEE,
  LOG_EVENT_OBJECTS.REQUEST,
  LOG_EVENT_OBJECTS.NOTICE,
]);

export const getHasLoanDetails = (object, userId, items) => {
  if (userId === undefined || userId === null) return false;

  if (items?.length !== 1) return false;

  const { loanId } = items[0];

  if (loanId === undefined || loanId === null) return false;

  return objectsWithLoanDetails.has(object);
};

export const getHasUserDetails = (object, userId) => (
  userId
  && (
    object === LOG_EVENT_OBJECTS.LOAN
    || object === LOG_EVENT_OBJECTS.FEE
    || object === LOG_EVENT_OBJECTS.REQUEST
    || object === LOG_EVENT_OBJECTS.NOTICE
    || object === LOG_EVENT_OBJECTS.MANUAL_BLOCK
  )
);

export const getHasFeeDetails = (object, feeId) => (
  feeId && (
    object === LOG_EVENT_OBJECTS.FEE
    || object === LOG_EVENT_OBJECTS.NOTICE
  )
);

export const getHasRequestDetails = (object, requestId) => (
  requestId
  && (
    object === LOG_EVENT_OBJECTS.LOAN
    || object === LOG_EVENT_OBJECTS.FEE
    || object === LOG_EVENT_OBJECTS.REQUEST
    || object === LOG_EVENT_OBJECTS.NOTICE
  )
);

export const getHasNoticePolicyDetails = (object, noticePolicyId) => (
  noticePolicyId && object === LOG_EVENT_OBJECTS.NOTICE
);

export const getHasTemplateDetails = (object, templateId) => (
  templateId && object === LOG_EVENT_OBJECTS.NOTICE
);
