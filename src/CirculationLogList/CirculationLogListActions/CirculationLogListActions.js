import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Icon,
  MenuSection,
} from '@folio/stripes/components';
import { useShowCallout } from '@folio/stripes-acq-components';

import { useStripes } from '@folio/stripes/core';
import { useCirculationLogExport } from './useCirculationLogExport';

export const CirculationLogListActions = ({ logEventsCount, onToggle }) => {
  const { formatMessage } = useIntl();
  const showCallout = useShowCallout();
  const stripes = useStripes();

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

  const isExportDisabled = !logEventsCount || isLoading || !stripes.hasPerm('ui-circulation-log.log-event.all');

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
        disabled={isExportDisabled}
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
