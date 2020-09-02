import React from 'react';
import { FormattedMessage } from 'react-intl';

export const buildCheckboxFilterOptions = optionsMap => {
  return Object.values(optionsMap)
    .map(optionValue => ({
      label: <FormattedMessage id={`ui-circulation-log.logEvent.action.${optionValue}`} />,
      value: optionValue,
    }));
};
