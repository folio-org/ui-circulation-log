import React from 'react';
import { render } from '@testing-library/react';

import '@folio/stripes-acq-components/test/jest/__mock__';

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

const renderCirculationLogEventActions = ({ referenceIds } = {}) => (render(
  <CirculationLogEventActions referenceIds={referenceIds} />,
));

describe('Given Circulation Log Event Actions', () => {
  beforeEach(() => {
    Dropdown.mockClear();

    getHasLoanDetails.mockReturnValueOnce(false);
    getHasFeeDetails.mockReturnValueOnce(false);
    getHasItemDetails.mockReturnValueOnce(false);
    getHasUserDetails.mockReturnValueOnce(false);
    getHasRequestDetails.mockReturnValueOnce(false);
    getHasTemplateDetails.mockReturnValueOnce(false);
    getHasNoticePolicyDetails.mockReturnValueOnce(false);
  });

  it('Than it should not render Dropdown actions when no actions available', () => {
    renderCirculationLogEventActions();

    expect(Dropdown).not.toHaveBeenCalled();
  });

  it('That it should display Loan details action when it is available', () => {
    getHasLoanDetails.mockReset();
    getHasLoanDetails.mockReturnValueOnce(true);

    const referenceIds = { userId: 1, loanId: 1 };

    const { getByText } = renderCirculationLogEventActions({ referenceIds });

    expect(getByText('ui-circulation-log.logEvent.actions.loanDetails')).toBeDefined();
    expect(getByText(`/users/${referenceIds.userId}/loans/view/${referenceIds.loanId}`)).toBeDefined();
  });

  it('That it should display Fee details action when it is available', () => {
    getHasFeeDetails.mockReset();
    getHasFeeDetails.mockReturnValueOnce(true);

    const referenceIds = { userId: 1, feeFineId: 1 };

    const { getByText } = renderCirculationLogEventActions({ referenceIds });

    expect(getByText('ui-circulation-log.logEvent.actions.feeDetails')).toBeDefined();
    expect(getByText(`/users/${referenceIds.userId}/accounts/view/${referenceIds.feeFineId}`)).toBeDefined();
  });

  it('That it should display User details action when it is available', () => {
    getHasUserDetails.mockReset();
    getHasUserDetails.mockReturnValueOnce(true);

    const referenceIds = { userId: 1 };

    const { getByText } = renderCirculationLogEventActions({ referenceIds });

    expect(getByText('ui-circulation-log.logEvent.actions.userDetails')).toBeDefined();
    expect(getByText(`/users/view/${referenceIds.userId}`)).toBeDefined();
  });

  it('That it should display Item details action when it is available', () => {
    getHasItemDetails.mockReset();
    getHasItemDetails.mockReturnValueOnce(true);

    const referenceIds = { instanceId: 1, holdingId: 1, itemId: 1 };

    const { getByText } = renderCirculationLogEventActions({ referenceIds });

    expect(getByText('ui-circulation-log.logEvent.actions.itemDetails')).toBeDefined();
    expect(getByText(
      `/inventory/view/${referenceIds.instanceId}/${referenceIds.holdingId}/${referenceIds.itemId}`,
    )).toBeDefined();
  });

  it('That it should display Request details action when it is available', () => {
    getHasRequestDetails.mockReset();
    getHasRequestDetails.mockReturnValueOnce(true);

    const referenceIds = { requestId: 1 };

    const { getByText } = renderCirculationLogEventActions({ referenceIds });

    expect(getByText('ui-circulation-log.logEvent.actions.requestDetails')).toBeDefined();
    expect(getByText(`/requests/view/${referenceIds.requestId}`)).toBeDefined();
  });

  it('That it should display Notice policy details action when it is available', () => {
    getHasNoticePolicyDetails.mockReset();
    getHasNoticePolicyDetails.mockReturnValueOnce(true);

    const referenceIds = { noticePolicyId: 1 };

    const { getByText } = renderCirculationLogEventActions({ referenceIds });

    expect(getByText('ui-circulation-log.logEvent.actions.noticePolicyDetails')).toBeDefined();
    expect(getByText(`/settings/circulation/notice-policies/${referenceIds.noticePolicyId}`)).toBeDefined();
  });

  it('That it should display Template details action when it is available', () => {
    getHasTemplateDetails.mockReset();
    getHasTemplateDetails.mockReturnValueOnce(true);

    const referenceIds = { templateId: 1 };

    const { getByText } = renderCirculationLogEventActions({ referenceIds });

    expect(getByText('ui-circulation-log.logEvent.actions.templateDetails')).toBeDefined();
    expect(getByText(`/settings/circulation/patron-notices/${referenceIds.templateId}`)).toBeDefined();
  });
});
