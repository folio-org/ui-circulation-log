import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import '@folio/stripes-acq-components/test/jest/__mock__';

import {
  LOG_EVENT_OBJECTS,
} from '../constants';
import { CirculationLogEventActions } from './CirculationLogEventActions';

const mockHasPerm = jest.fn();

jest.mock('@folio/stripes/core', () => {
  return {
    ...jest.requireActual('@folio/stripes/core'),
    useStripes: () => ({ hasPerm: mockHasPerm }),
  };
});

const renderCirculationLogEventActions = ({ objectType, items, referenceIds } = {}) => {
  render(
    <CirculationLogEventActions
      items={items}
      referenceIds={referenceIds}
      objectType={objectType}
    />,
    { wrapper: MemoryRouter },
  );

  const button = screen.queryByRole('button', { name: /actions/ });

  if (button) button.click();
};

describe('Event Actions', () => {
  beforeEach(() => {
    mockHasPerm.mockReset().mockReturnValue(true);
  });

  it('does not render the menu when no actions available', () => {
    renderCirculationLogEventActions();

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  describe('Loan', () => {
    const props = {
      objectType: LOG_EVENT_OBJECTS.LOAN,
      items: [{ loanId: 'loanId' }],
      referenceIds: { userId: 'userId' },
    };
    const url = `/users/${props.referenceIds.userId}/loans/view/${props.items[0].loanId}`;

    it('is shown when available', () => {
      renderCirculationLogEventActions(props);

      const menuItem = screen.getByRole('menuitem', { name: /loanDetails/ });

      expect(menuItem).toBeVisible();
      expect(menuItem).toHaveAttribute('href', url);
    });

    it('is not shown for log entry with multiple items', () => {
      renderCirculationLogEventActions({
        ...props,
        items: [{ loanId: 0 }, { loanId: 1 }],
      });

      expect(screen.queryByRole('menuitem', { name: /loanDetails/ })).not.toBeInTheDocument();
    });

    it('is not shown without permission', () => {
      mockHasPerm.mockReturnValue(false);

      renderCirculationLogEventActions(props);

      expect(screen.queryByRole('menuitem', { name: /loanDetails/ })).not.toBeInTheDocument();
    });

    it('is not shown without user ID', () => {
      mockHasPerm.mockReturnValue(false);

      renderCirculationLogEventActions({
        ...props,
        referenceIds: { userId: undefined },
      });

      expect(screen.queryByRole('menuitem', { name: /loanDetails/ })).not.toBeInTheDocument();
    });

    it('is not shown without loan ID', () => {
      mockHasPerm.mockReturnValue(false);

      renderCirculationLogEventActions({
        ...props,
        items: [{ loanId: undefined }],
      });

      expect(screen.queryByRole('menuitem', { name: /loanDetails/ })).not.toBeInTheDocument();
    });
  });

  describe('Fee', () => {
    const props = {
      objectType: LOG_EVENT_OBJECTS.FEE,
      referenceIds: { userId: 'userId', feeFineId: 'feeFineId' },
    };
    const url = `/users/${props.referenceIds.userId}/accounts/view/${props.referenceIds.feeFineId}`;

    it('is shown when available', () => {
      renderCirculationLogEventActions(props);

      const menuItem = screen.getByRole('menuitem', { name: /feeDetails/ });

      expect(menuItem).toBeVisible();
      expect(menuItem).toHaveAttribute('href', url);
    });

    it('is not shown without permission', () => {
      mockHasPerm.mockReturnValue(false);

      renderCirculationLogEventActions(props);

      expect(screen.queryByRole('menuitem', { name: /feeDetails/ })).not.toBeInTheDocument();
    });
  });

  describe('User', () => {
    const props = {
      objectType: LOG_EVENT_OBJECTS.LOAN,
      referenceIds: { userId: 'userId' },
    };
    const url = `/users/view/${props.referenceIds.userId}`;

    it('is shown when available', () => {
      renderCirculationLogEventActions(props);

      const menuItem = screen.getByRole('menuitem', { name: /userDetails/ });

      expect(menuItem).toBeVisible();
      expect(menuItem).toHaveAttribute('href', url);
    });

    it('is not shown without permission', () => {
      mockHasPerm.mockReturnValue(false);

      renderCirculationLogEventActions(props);

      expect(screen.queryByRole('menuitem', { name: /userDetails/ })).not.toBeInTheDocument();
    });
  });

  describe('Request', () => {
    const props = {
      objectType: LOG_EVENT_OBJECTS.REQUEST,
      referenceIds: { requestId: 'requestId' },
    };
    const url = `/requests/view/${props.referenceIds.requestId}`;

    it('is shown when available', () => {
      renderCirculationLogEventActions(props);

      const menuItem = screen.getByRole('menuitem', { name: /requestDetails/ });

      expect(menuItem).toBeVisible();
      expect(menuItem).toHaveAttribute('href', url);
    });

    it('is not shown without permission', () => {
      mockHasPerm.mockReturnValue(false);

      renderCirculationLogEventActions(props);

      expect(screen.queryByRole('menuitem', { name: /requestDetails/ })).not.toBeInTheDocument();
    });
  });

  describe('Notice policy', () => {
    const props = {
      objectType: LOG_EVENT_OBJECTS.NOTICE,
      referenceIds: { noticePolicyId: 'noticePolicyId' },
    };
    const url = `/settings/circulation/notice-policies/${props.referenceIds.noticePolicyId}`;

    it('is shown when available', () => {
      renderCirculationLogEventActions(props);

      const menuItem = screen.getByRole('menuitem', { name: /noticePolicyDetails/ });

      expect(menuItem).toBeVisible();
      expect(menuItem).toHaveAttribute('href', url);
    });

    it('is not shown without permission', () => {
      mockHasPerm.mockReturnValue(false);

      renderCirculationLogEventActions(props);

      expect(screen.queryByRole('menuitem', { name: /noticePolicyDetails/ })).not.toBeInTheDocument();
    });
  });

  describe('Template', () => {
    const props = {
      objectType: LOG_EVENT_OBJECTS.NOTICE,
      referenceIds: { templateId: 'templateId' },
    };
    const url = `/settings/circulation/patron-notices/${props.referenceIds.templateId}`;

    it('is shown when available', () => {
      renderCirculationLogEventActions(props);

      const menuItem = screen.getByRole('menuitem', { name: /templateDetails/ });

      expect(menuItem).toBeVisible();
      expect(menuItem).toHaveAttribute('href', url);
    });

    it('is not shown without permission', () => {
      mockHasPerm.mockReturnValue(false);

      renderCirculationLogEventActions(props);

      expect(screen.queryByRole('menuitem', { name: /templateDetails/ })).not.toBeInTheDocument();
    });
  });
});
