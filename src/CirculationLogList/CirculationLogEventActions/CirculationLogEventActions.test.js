import React from 'react';
import { render } from '@testing-library/react';

import '@folio/stripes-acq-components/test/jest/__mock__';

import {
  useStripes,
} from '@folio/stripes/core';
import {
  Dropdown,
} from '@folio/stripes/components';

import { CirculationLogEventActions } from './CirculationLogEventActions';
import {
  getHasLoanDetails,
  getHasUserDetails,
  getHasFeeDetails,
  getHasItemDetails,
  getHasRequestDetails,
  getHasNoticePolicyDetails,
  getHasTemplateDetails,
} from './utils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: jest.fn(({ children, to }) => (
    <>
      <span>{children}</span>
      <span>{to}</span>
    </>
  )),
}));

jest.mock('@folio/stripes/components', () => {
  return {
    ...jest.requireActual('@folio/stripes/components'),
    Dropdown: jest.fn(({ renderTrigger, renderMenu }) => (
      <>
        {renderTrigger({ ariaProps: {} })}
        {renderMenu({ open: true })}
      </>
    )),
  };
});

jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  getHasLoanDetails: jest.fn(),
  getHasFeeDetails: jest.fn(),
  getHasItemDetails: jest.fn(),
  getHasUserDetails: jest.fn(),
  getHasRequestDetails: jest.fn(),
  getHasTemplateDetails: jest.fn(),
  getHasNoticePolicyDetails: jest.fn(),
}));

const renderCirculationLogEventActions = ({ item, referenceIds } = {}) => (render(
  <CirculationLogEventActions
    item={item}
    referenceIds={referenceIds}
  />,
));

describe('Given Circulation Log Event Actions', () => {
  let stripes;

  beforeEach(() => {
    Dropdown.mockClear();

    getHasLoanDetails.mockReturnValueOnce(false);
    getHasFeeDetails.mockReturnValueOnce(false);
    getHasItemDetails.mockReturnValueOnce(false);
    getHasUserDetails.mockReturnValueOnce(false);
    getHasRequestDetails.mockReturnValueOnce(false);
    getHasTemplateDetails.mockReturnValueOnce(false);
    getHasNoticePolicyDetails.mockReturnValueOnce(false);

    stripes = useStripes();

    stripes.hasPerm.mockReset();
  });

  it('Than it should not render Dropdown actions when no actions available', () => {
    renderCirculationLogEventActions();

    expect(Dropdown).not.toHaveBeenCalled();
  });

  describe('And Loan details action', () => {
    const referenceIds = { userId: 1 };
    const item = { loanId: 1 };

    beforeEach(() => {
      getHasLoanDetails.mockReset();
      getHasLoanDetails.mockReturnValueOnce(true);
    });

    it('Than it should display action when it is available', () => {
      stripes.hasPerm.mockReturnValue(true);

      const { getByText, queryByText } = renderCirculationLogEventActions({ item, referenceIds });

      expect(queryByText('ui-circulation-log.logEvent.actions.loanDetails')).toBeDefined();
      expect(getByText(`/users/${referenceIds.userId}/loans/view/${item.loanId}`)).toBeDefined();
    });

    it('Than it should not display action when no permission', () => {
      stripes.hasPerm.mockReturnValue(false);

      const { queryByText } = renderCirculationLogEventActions({ item, referenceIds });

      expect(queryByText('ui-circulation-log.logEvent.actions.loanDetails')).toBeNull();
    });
  });

  describe('And Fee details action', () => {
    const referenceIds = { userId: 1, feeFineId: 1 };

    beforeEach(() => {
      getHasFeeDetails.mockReset();
      getHasFeeDetails.mockReturnValueOnce(true);
    });

    it('Than it should display when it is available', () => {
      stripes.hasPerm.mockReturnValue(true);

      const { getByText } = renderCirculationLogEventActions({ referenceIds });

      expect(getByText('ui-circulation-log.logEvent.actions.feeDetails')).toBeDefined();
      expect(getByText(`/users/${referenceIds.userId}/accounts/view/${referenceIds.feeFineId}`)).toBeDefined();
    });

    it('Than it should not display action when no parmission', () => {
      stripes.hasPerm.mockReturnValue(false);

      const { queryByText } = renderCirculationLogEventActions({ referenceIds });

      expect(queryByText('ui-circulation-log.logEvent.actions.feeDetails')).toBeNull();
    });
  });

  describe('And User details action', () => {
    const referenceIds = { userId: 1 };

    beforeEach(() => {
      getHasUserDetails.mockReset();
      getHasUserDetails.mockReturnValueOnce(true);
    });

    it('Than it should display when it is available', () => {
      stripes.hasPerm.mockReturnValue(true);

      const { getByText } = renderCirculationLogEventActions({ referenceIds });

      expect(getByText('ui-circulation-log.logEvent.actions.userDetails')).toBeDefined();
      expect(getByText(`/users/view/${referenceIds.userId}`)).toBeDefined();
    });

    it('Than it should not display action when no parmission', () => {
      stripes.hasPerm.mockReturnValue(false);

      const { queryByText } = renderCirculationLogEventActions({ referenceIds });

      expect(queryByText('ui-circulation-log.logEvent.actions.userDetails')).toBeNull();
    });
  });

  describe('And Item details action', () => {
    const item = { instanceId: 1, holdingId: 1, itemId: 1 };

    beforeEach(() => {
      getHasItemDetails.mockReset();
      getHasItemDetails.mockReturnValueOnce(true);
    });

    it('Than it should display when it is available', () => {
      stripes.hasPerm.mockReturnValue(true);

      const { getByText } = renderCirculationLogEventActions({ item });

      expect(getByText('ui-circulation-log.logEvent.actions.itemDetails')).toBeDefined();
      expect(getByText(
        `/inventory/view/${item.instanceId}/${item.holdingId}/${item.itemId}`,
      )).toBeDefined();
    });

    it('Than it should not display action when no parmission', () => {
      stripes.hasPerm.mockReturnValue(false);

      const { queryByText } = renderCirculationLogEventActions({ item });

      expect(queryByText('ui-circulation-log.logEvent.actions.itemDetails')).toBeNull();
    });
  });

  describe('And Request details action', () => {
    const referenceIds = { requestId: 1 };

    beforeEach(() => {
      getHasRequestDetails.mockReset();
      getHasRequestDetails.mockReturnValueOnce(true);
    });

    it('Than it should display when it is available', () => {
      stripes.hasPerm.mockReturnValue(true);

      const { getByText } = renderCirculationLogEventActions({ referenceIds });

      expect(getByText('ui-circulation-log.logEvent.actions.requestDetails')).toBeDefined();
      expect(getByText(`/requests/view/${referenceIds.requestId}`)).toBeDefined();
    });

    it('Than it should not display action when no parmission', () => {
      stripes.hasPerm.mockReturnValue(false);

      const { queryByText } = renderCirculationLogEventActions({ referenceIds });

      expect(queryByText('ui-circulation-log.logEvent.actions.requestDetails')).toBeNull();
    });
  });

  describe('And Notice policy details action', () => {
    const referenceIds = { noticePolicyId: 1 };

    beforeEach(() => {
      getHasNoticePolicyDetails.mockReset();
      getHasNoticePolicyDetails.mockReturnValueOnce(true);
    });

    it('Than it should display when it is available', () => {
      stripes.hasPerm.mockReturnValue(true);

      const { getByText } = renderCirculationLogEventActions({ referenceIds });

      expect(getByText('ui-circulation-log.logEvent.actions.noticePolicyDetails')).toBeDefined();
      expect(getByText(`/settings/circulation/notice-policies/${referenceIds.noticePolicyId}`)).toBeDefined();
    });

    it('Than it should not display action when no parmission', () => {
      stripes.hasPerm.mockReturnValue(false);

      const { queryByText } = renderCirculationLogEventActions({ referenceIds });

      expect(queryByText('ui-circulation-log.logEvent.actions.noticePolicyDetails')).toBeNull();
    });
  });

  describe('And Template details action', () => {
    const referenceIds = { templateId: 1 };

    beforeEach(() => {
      getHasTemplateDetails.mockReset();
      getHasTemplateDetails.mockReturnValueOnce(true);
    });

    it('Than it should display when it is available', () => {
      stripes.hasPerm.mockReturnValue(true);

      const { getByText } = renderCirculationLogEventActions({ referenceIds });

      expect(getByText('ui-circulation-log.logEvent.actions.templateDetails')).toBeDefined();
      expect(getByText(`/settings/circulation/patron-notices/${referenceIds.templateId}`)).toBeDefined();
    });

    it('Than it should not display action when no parmission', () => {
      stripes.hasPerm.mockReturnValue(false);

      const { queryByText } = renderCirculationLogEventActions({ referenceIds });

      expect(queryByText('ui-circulation-log.logEvent.actions.templateDetails')).toBeNull();
    });
  });
});