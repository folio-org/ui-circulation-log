import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Icon,
  MenuSection,
} from '@folio/stripes/components';
import { useShowCallout } from '@folio/stripes-acq-components';

import { useCirculationLogExport } from './useCirculationLogExport';

export const CirculationLogListActions = ({ logEventsCount, onToggle }) => {
  const { formatMessage } = useIntl();
  const showCallout = useShowCallout();

  const { isLoading, requestExport } = useCirculationLogExport({
    onSuccess: () => {
      showCallout({
        message: formatMessage({ id: 'ui-circulation-log.logEvents.actions.export.success' }),
      });
    },
    onError: () => {
      return showCallout({
        message: formatMessage({ id: 'ui-circulation-log.logEvents.actions.export.error' }),
        type: 'error',
      });
    },
  });

  return (
    <MenuSection id="circulation-log-list-actions">
      <Button
        data-testid="export-results"
        buttonStyle="dropdownItem"
        aria-label={formatMessage({ id: 'ui-circulation-log.logEvents.actions.export' })}
        onClick={() => {
          onToggle();
          requestExport();
        }}
        disabled={!logEventsCount || isLoading}
      >
        <Icon size="small" icon="download">
          {formatMessage({ id: 'ui-circulation-log.logEvents.actions.export' })}
        </Icon>
      </Button>
    </MenuSection>
  );
};

CirculationLogListActions.propTypes = {
  logEventsCount: PropTypes.number.isRequired,
  onToggle: PropTypes.func.isRequired,
};
