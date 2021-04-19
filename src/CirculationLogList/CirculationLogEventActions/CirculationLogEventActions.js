import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  useStripes,
} from '@folio/stripes/core';
import {
  Button,
  Dropdown,
  DropdownMenu,
  Icon,
} from '@folio/stripes/components';

import {
  getHasLoanDetails,
  getHasUserDetails,
  getHasFeeDetails,
  getHasRequestDetails,
  getHasNoticePolicyDetails,
  getHasTemplateDetails,
} from './utils';

export const CirculationLogEventActions = ({ objectType, items, referenceIds }) => {
  const intl = useIntl();
  const stripes = useStripes();
  const { feeFineId, userId, requestId, noticePolicyId, templateId } = referenceIds;
  const { loanId } = items[0] || {};

  const hasLoanDetails =
    getHasLoanDetails(objectType, userId, items) && stripes.hasPerm('ui-users.loans.view');
  const hasUserDetails =
    getHasUserDetails(objectType, userId) && stripes.hasPerm('ui-users.view');
  const hasFeeDetails =
    getHasFeeDetails(objectType, feeFineId) && stripes.hasPerm('ui-users.feesfines.actions.all');
  const hasRequestDetails =
    getHasRequestDetails(objectType, requestId) && stripes.hasPerm('ui-users.requests.all');
  const hasNoticePolicyDetails =
    getHasNoticePolicyDetails(objectType, noticePolicyId)
    && stripes.hasPerm('ui-circulation.settings.notice-policies');
  const hasTemplateDetails =
    getHasTemplateDetails(objectType, templateId)
    && stripes.hasPerm('ui-circulation.settings.notice-templates');

  const renderTrigger = useCallback(({ triggerRef, onToggle, ariaProps, keyHandler }) => (
    <Button
      ref={triggerRef}
      onClick={onToggle}
      onKeyDown={keyHandler}
      marginBottom0
      {...ariaProps}
      aria-label={intl.formatMessage({ id: 'ui-circulation-log.logEvent.actions' })}
    >
      <Icon icon="ellipsis" />
    </Button>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), []);

  const renderMenu = useCallback(({ open, onToggle }) => (
    <DropdownMenu
      role="menu"
      open={open}
      onToggle={onToggle}
    >
      {
        hasFeeDetails && (
          <Button
            buttonStyle="dropdownItem"
            role="menuitem"
            to={`/users/${userId}/accounts/view/${feeFineId}`}
          >
            <FormattedMessage id="ui-circulation-log.logEvent.actions.feeDetails" />
          </Button>
        )
      }

      {
        hasLoanDetails && (
          <Button
            buttonStyle="dropdownItem"
            role="menuitem"
            to={`/users/${userId}/loans/view/${loanId}`}
          >
            <FormattedMessage id="ui-circulation-log.logEvent.actions.loanDetails" />
          </Button>
        )
      }

      {
        hasUserDetails && (
          <Button
            buttonStyle="dropdownItem"
            role="menuitem"
            to={`/users/view/${userId}`}
          >
            <FormattedMessage id="ui-circulation-log.logEvent.actions.userDetails" />
          </Button>
        )
      }

      {
        hasRequestDetails && (
          <Button
            buttonStyle="dropdownItem"
            role="menuitem"
            to={`/requests/view/${requestId}`}
          >
            <FormattedMessage id="ui-circulation-log.logEvent.actions.requestDetails" />
          </Button>
        )
      }

      {
        hasNoticePolicyDetails && (
          <Button
            buttonStyle="dropdownItem"
            role="menuitem"
            to={`/settings/circulation/notice-policies/${noticePolicyId}`}
          >
            <FormattedMessage id="ui-circulation-log.logEvent.actions.noticePolicyDetails" />
          </Button>
        )
      }

      {
        hasTemplateDetails && (
          <Button
            buttonStyle="dropdownItem"
            role="menuitem"
            to={`/settings/circulation/patron-notices/${templateId}`}
          >
            <FormattedMessage id="ui-circulation-log.logEvent.actions.templateDetails" />
          </Button>
        )
      }
    </DropdownMenu>
  ), [
    hasRequestDetails, hasLoanDetails, hasFeeDetails, hasUserDetails,
    hasNoticePolicyDetails, hasTemplateDetails, feeFineId, requestId,
    userId, loanId, noticePolicyId, templateId,
  ]);

  if (
    !(
      hasLoanDetails
      || hasUserDetails
      || hasFeeDetails
      || hasRequestDetails
      || hasNoticePolicyDetails
      || hasTemplateDetails
    )
  ) {
    return null;
  }

  return (
    <Dropdown
      renderTrigger={renderTrigger}
      renderMenu={renderMenu}
    />
  );
};

CirculationLogEventActions.propTypes = {
  objectType: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object),
  referenceIds: PropTypes.object,
};

CirculationLogEventActions.defaultProps = {
  items: [],
  referenceIds: {},
};
