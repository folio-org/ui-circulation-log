import React from 'react';
import { render } from '@testing-library/react';
import user from '@testing-library/user-event';

import '@folio/stripes-acq-components/test/jest/__mock__';

import {
  useCirculationLogExport,
} from './useCirculationLogExport';
import { CirculationLogListActions } from './CirculationLogListActions';

jest.mock('./useCirculationLogExport', () => {
  return {
    useCirculationLogExport: jest.fn(),
  };
});

const renderCirculationLogListActions = ({
  onToggle = jest.fn(),
  logEventsCount = 0,
} = {}) => render(<CirculationLogListActions onToggle={onToggle} logEventsCount={logEventsCount} />);

describe('CirculationLogListActions', () => {
  beforeEach(() => {
    useCirculationLogExport.mockReturnValue({
      requestExport: jest.fn(),
    });
  });

  it('should request export when Export action is pressed', () => {
    const requestExport = jest.fn();

    useCirculationLogExport.mockReturnValue({ requestExport });

    const { getByTestId } = renderCirculationLogListActions({ logEventsCount: 10 });

    user.click(getByTestId('export-results'));

    expect(requestExport).toHaveBeenCalled();
  });

  it('should not request export when there are no results', () => {
    const requestExport = jest.fn();

    useCirculationLogExport.mockReturnValue({ requestExport });

    const { getByTestId } = renderCirculationLogListActions({ logEventsCount: 0 });

    user.click(getByTestId('export-results'));

    expect(requestExport).not.toHaveBeenCalled();
  });
});
