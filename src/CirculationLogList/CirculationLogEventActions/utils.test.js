import '@folio/stripes-acq-components/test/jest/__mock__';

import {
  LOG_EVENT_OBJECTS,
} from '../constants';

import * as logEventActions from './utils';

describe('CirculationLogEventActions utils', () => {
  describe('getHasLoanDetails', () => {
    it('should return false when load id is not defined', () => {
      expect(logEventActions.getHasLoanDetails(LOG_EVENT_OBJECTS.LOAN, undefined)).toBeFalsy();
    });

    it('should return true when object supports loans passed with loan id', () => {
      expect(logEventActions.getHasLoanDetails(LOG_EVENT_OBJECTS.LOAN, 'loanId')).toBeTruthy();
      expect(logEventActions.getHasLoanDetails(LOG_EVENT_OBJECTS.FEE, 'loanId')).toBeTruthy();
      expect(logEventActions.getHasLoanDetails(LOG_EVENT_OBJECTS.REQUEST, 'loanId')).toBeTruthy();
      expect(logEventActions.getHasLoanDetails(LOG_EVENT_OBJECTS.NOTICE, 'loanId')).toBeTruthy();
    });

    it('should return false when object does not support loans passed with loan id', () => {
      expect(logEventActions.getHasLoanDetails(LOG_EVENT_OBJECTS.ITEM_BLOCK, 'loanId')).toBeFalsy();
      expect(logEventActions.getHasLoanDetails(LOG_EVENT_OBJECTS.MANUAL_BLOCK, 'loanId')).toBeFalsy();
      expect(logEventActions.getHasLoanDetails(LOG_EVENT_OBJECTS.PATRON_BLOCK, 'loanId')).toBeFalsy();
    });
  });

  describe('getHasUserDetails', () => {
    it('should return false when load id is not defined', () => {
      expect(logEventActions.getHasUserDetails(LOG_EVENT_OBJECTS.LOAN, undefined)).toBeFalsy();
    });

    it('should return true when object supports loans passed with loan id', () => {
      expect(logEventActions.getHasUserDetails(LOG_EVENT_OBJECTS.LOAN, 'userId')).toBeTruthy();
      expect(logEventActions.getHasUserDetails(LOG_EVENT_OBJECTS.FEE, 'userId')).toBeTruthy();
      expect(logEventActions.getHasUserDetails(LOG_EVENT_OBJECTS.REQUEST, 'userId')).toBeTruthy();
      expect(logEventActions.getHasUserDetails(LOG_EVENT_OBJECTS.NOTICE, 'userId')).toBeTruthy();
      expect(logEventActions.getHasUserDetails(LOG_EVENT_OBJECTS.MANUAL_BLOCK, 'userId')).toBeTruthy();
    });

    it('should return false when object does not support loans passed with loan id', () => {
      expect(logEventActions.getHasUserDetails(LOG_EVENT_OBJECTS.ITEM_BLOCK, 'userId')).toBeFalsy();
      expect(logEventActions.getHasUserDetails(LOG_EVENT_OBJECTS.PATRON_BLOCK, 'userId')).toBeFalsy();
    });
  });

  describe('getHasItemDetails', () => {
    it('should return false when load id is not defined', () => {
      expect(logEventActions.getHasItemDetails(LOG_EVENT_OBJECTS.LOAN, undefined)).toBeFalsy();
    });

    it('should return true when object supports loans passed with loan id', () => {
      expect(logEventActions.getHasItemDetails(LOG_EVENT_OBJECTS.LOAN, 'itemId')).toBeTruthy();
      expect(logEventActions.getHasItemDetails(LOG_EVENT_OBJECTS.NOTICE, 'itemId')).toBeTruthy();
    });

    it('should return false when object does not support loans passed with loan id', () => {
      expect(logEventActions.getHasItemDetails(LOG_EVENT_OBJECTS.FEE, 'itemId')).toBeFalsy();
      expect(logEventActions.getHasItemDetails(LOG_EVENT_OBJECTS.REQUEST, 'itemId')).toBeFalsy();
      expect(logEventActions.getHasItemDetails(LOG_EVENT_OBJECTS.ITEM_BLOCK, 'itemId')).toBeFalsy();
      expect(logEventActions.getHasItemDetails(LOG_EVENT_OBJECTS.MANUAL_BLOCK, 'itemId')).toBeFalsy();
      expect(logEventActions.getHasItemDetails(LOG_EVENT_OBJECTS.PATRON_BLOCK, 'itemId')).toBeFalsy();
    });
  });

  describe('getHasFeeDetails', () => {
    it('should return false when load id is not defined', () => {
      expect(logEventActions.getHasFeeDetails(LOG_EVENT_OBJECTS.LOAN, undefined)).toBeFalsy();
    });

    it('should return true when object supports loans passed with loan id', () => {
      expect(logEventActions.getHasFeeDetails(LOG_EVENT_OBJECTS.FEE, 'feeId')).toBeTruthy();
      expect(logEventActions.getHasFeeDetails(LOG_EVENT_OBJECTS.NOTICE, 'feeId')).toBeTruthy();
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
