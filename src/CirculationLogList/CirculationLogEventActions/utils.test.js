import {
  LOG_EVENT_OBJECTS,
} from '../constants';

import * as logEventActions from './utils';

describe('CirculationLogEventActions utils', () => {
  describe('getHasLoanDetails', () => {
    it('should return false when user id is not defined', () => {
      expect(logEventActions.getHasLoanDetails(LOG_EVENT_OBJECTS.LOAN, undefined, [{}])).toBeFalsy();
    });

    it('should return false when loan id is not defined', () => {
      expect(logEventActions.getHasLoanDetails(LOG_EVENT_OBJECTS.LOAN, 'userId', [{}])).toBeFalsy();
    });

    it('should return true when object supports loans passed with loan id', () => {
      expect(logEventActions.getHasLoanDetails(LOG_EVENT_OBJECTS.LOAN, 'userId', [{ loanId: 0 }])).toBeTruthy();
      expect(logEventActions.getHasLoanDetails(LOG_EVENT_OBJECTS.FEE, 'userId', [{ loanId: 0 }])).toBeTruthy();
      expect(logEventActions.getHasLoanDetails(LOG_EVENT_OBJECTS.REQUEST, 'userId', [{ loanId: 0 }])).toBeTruthy();
      expect(logEventActions.getHasLoanDetails(LOG_EVENT_OBJECTS.NOTICE, 'userId', [{ loanId: 0 }])).toBeTruthy();
    });

    it('should return false when object have multiple items', () => {
      expect(logEventActions.getHasLoanDetails(LOG_EVENT_OBJECTS.LOAN, 'userId', [{ loanId: 1 }, { loanId: 2 }])).toBeFalsy();
    });

    it('should return false when object does not support loans passed with loan id', () => {
      expect(logEventActions.getHasLoanDetails(LOG_EVENT_OBJECTS.ITEM_BLOCK, 'userId', [{ loanId: 1 }])).toBeFalsy();
      expect(logEventActions.getHasLoanDetails(LOG_EVENT_OBJECTS.MANUAL_BLOCK, 'userId', [{ loanId: 1 }])).toBeFalsy();
      expect(logEventActions.getHasLoanDetails(LOG_EVENT_OBJECTS.PATRON_BLOCK, 'userId', [{ loanId: 1 }])).toBeFalsy();
    });
  });

  describe('getHasUserDetails', () => {
    it('should return false when user id is not defined', () => {
      expect(logEventActions.getHasUserDetails(LOG_EVENT_OBJECTS.LOAN, undefined)).toBeFalsy();
    });

    it('should return true when object supports user details', () => {
      expect(logEventActions.getHasUserDetails(LOG_EVENT_OBJECTS.LOAN, 'userId')).toBeTruthy();
      expect(logEventActions.getHasUserDetails(LOG_EVENT_OBJECTS.FEE, 'userId')).toBeTruthy();
      expect(logEventActions.getHasUserDetails(LOG_EVENT_OBJECTS.REQUEST, 'userId')).toBeTruthy();
      expect(logEventActions.getHasUserDetails(LOG_EVENT_OBJECTS.NOTICE, 'userId')).toBeTruthy();
      expect(logEventActions.getHasUserDetails(LOG_EVENT_OBJECTS.MANUAL_BLOCK, 'userId')).toBeTruthy();
    });

    it('should return false when object does not support user details', () => {
      expect(logEventActions.getHasUserDetails(LOG_EVENT_OBJECTS.ITEM_BLOCK, 'userId')).toBeFalsy();
      expect(logEventActions.getHasUserDetails(LOG_EVENT_OBJECTS.PATRON_BLOCK, 'userId')).toBeFalsy();
    });
  });

  describe('getHasFeeDetails', () => {
    it('should return false when load id is not defined', () => {
      expect(logEventActions.getHasFeeDetails(LOG_EVENT_OBJECTS.LOAN, undefined)).toBeFalsy();
    });

    it('should return true when object supports loans passed with loan id', () => {
      expect(logEventActions.getHasFeeDetails(LOG_EVENT_OBJECTS.FEE, 'feeId', 'userId')).toBeTruthy();
      expect(logEventActions.getHasFeeDetails(LOG_EVENT_OBJECTS.NOTICE, 'feeId', 'userId')).toBeTruthy();
    });

    it('should return false when object does not support loans passed with loan id', () => {
      expect(logEventActions.getHasFeeDetails(LOG_EVENT_OBJECTS.LOAN, 'feeId')).toBeFalsy();
      expect(logEventActions.getHasFeeDetails(LOG_EVENT_OBJECTS.REQUEST, 'feeId')).toBeFalsy();
      expect(logEventActions.getHasFeeDetails(LOG_EVENT_OBJECTS.ITEM_BLOCK, 'feeId')).toBeFalsy();
      expect(logEventActions.getHasFeeDetails(LOG_EVENT_OBJECTS.MANUAL_BLOCK, 'feeId')).toBeFalsy();
      expect(logEventActions.getHasFeeDetails(LOG_EVENT_OBJECTS.PATRON_BLOCK, 'feeId')).toBeFalsy();
    });
  });

  describe('getHasRequestDetails', () => {
    it('should return false when load id is not defined', () => {
      expect(logEventActions.getHasRequestDetails(LOG_EVENT_OBJECTS.LOAN, undefined)).toBeFalsy();
    });

    it('should return true when object supports loans passed with loan id', () => {
      expect(logEventActions.getHasRequestDetails(LOG_EVENT_OBJECTS.LOAN, 'requestId')).toBeTruthy();
      expect(logEventActions.getHasRequestDetails(LOG_EVENT_OBJECTS.FEE, 'requestId')).toBeTruthy();
      expect(logEventActions.getHasRequestDetails(LOG_EVENT_OBJECTS.REQUEST, 'requestId')).toBeTruthy();
      expect(logEventActions.getHasRequestDetails(LOG_EVENT_OBJECTS.NOTICE, 'requestId')).toBeTruthy();
    });

    it('should return false when object does not support loans passed with loan id', () => {
      expect(logEventActions.getHasRequestDetails(LOG_EVENT_OBJECTS.ITEM_BLOCK, 'requestId')).toBeFalsy();
      expect(logEventActions.getHasRequestDetails(LOG_EVENT_OBJECTS.MANUAL_BLOCK, 'requestId')).toBeFalsy();
      expect(logEventActions.getHasRequestDetails(LOG_EVENT_OBJECTS.PATRON_BLOCK, 'requestId')).toBeFalsy();
    });
  });

  describe('getHasNoticePolicyDetails', () => {
    it('should return false when load id is not defined', () => {
      expect(logEventActions.getHasNoticePolicyDetails(LOG_EVENT_OBJECTS.LOAN, undefined)).toBeFalsy();
    });

    it('should return true when object supports loans passed with loan id', () => {
      expect(logEventActions.getHasNoticePolicyDetails(LOG_EVENT_OBJECTS.NOTICE, 'noticeId')).toBeTruthy();
    });

    it('should return false when object does not support loans passed with loan id', () => {
      expect(logEventActions.getHasNoticePolicyDetails(LOG_EVENT_OBJECTS.FEE, 'noticeId')).toBeFalsy();
      expect(logEventActions.getHasNoticePolicyDetails(LOG_EVENT_OBJECTS.LOAN, 'noticeId')).toBeFalsy();
      expect(logEventActions.getHasNoticePolicyDetails(LOG_EVENT_OBJECTS.REQUEST, 'noticeId')).toBeFalsy();
      expect(logEventActions.getHasNoticePolicyDetails(LOG_EVENT_OBJECTS.ITEM_BLOCK, 'noticeId')).toBeFalsy();
      expect(logEventActions.getHasNoticePolicyDetails(LOG_EVENT_OBJECTS.MANUAL_BLOCK, 'noticeId')).toBeFalsy();
      expect(logEventActions.getHasNoticePolicyDetails(LOG_EVENT_OBJECTS.PATRON_BLOCK, 'noticeId')).toBeFalsy();
    });
  });

  describe('getHasTemplateDetails', () => {
    it('should return false when load id is not defined', () => {
      expect(logEventActions.getHasTemplateDetails(LOG_EVENT_OBJECTS.LOAN, undefined)).toBeFalsy();
    });

    it('should return true when object supports loans passed with loan id', () => {
      expect(logEventActions.getHasTemplateDetails(LOG_EVENT_OBJECTS.NOTICE, 'templateId')).toBeTruthy();
    });

    it('should return false when object does not support loans passed with loan id', () => {
      expect(logEventActions.getHasTemplateDetails(LOG_EVENT_OBJECTS.FEE, 'templateId')).toBeFalsy();
      expect(logEventActions.getHasTemplateDetails(LOG_EVENT_OBJECTS.LOAN, 'templateId')).toBeFalsy();
      expect(logEventActions.getHasTemplateDetails(LOG_EVENT_OBJECTS.REQUEST, 'templateId')).toBeFalsy();
      expect(logEventActions.getHasTemplateDetails(LOG_EVENT_OBJECTS.ITEM_BLOCK, 'templateId')).toBeFalsy();
      expect(logEventActions.getHasTemplateDetails(LOG_EVENT_OBJECTS.MANUAL_BLOCK, 'templateId')).toBeFalsy();
      expect(logEventActions.getHasTemplateDetails(LOG_EVENT_OBJECTS.PATRON_BLOCK, 'templateId')).toBeFalsy();
    });
  });
});
