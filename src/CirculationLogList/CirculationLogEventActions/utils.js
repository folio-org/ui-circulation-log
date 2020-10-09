import {
  LOG_EVENT_OBJECTS,
} from '../constants';

export const getHasLoanDetails = (object, loanId) => (
  loanId
  && (
    object === LOG_EVENT_OBJECTS.LOAN
    || object === LOG_EVENT_OBJECTS.FEE
    || object === LOG_EVENT_OBJECTS.REQUEST
    || object === LOG_EVENT_OBJECTS.NOTICE
  )
);

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
