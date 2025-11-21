import React from 'react';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { FormattedTime } from './FormattedTime';

const renderComponent = (props = {}) => (render(
  <FormattedTime
    {...props}
  />,
));

describe('FolioFormattedTime', () => {
  it('should display NoValue component', () => {
    renderComponent();
    expect(screen.getByText('-')).toBeDefined();
  });

  it('should display passed datetime', () => {
    renderComponent({ dateString: '2021-03-04T12:39:30.446+00:00' });
    expect(screen.getByText('2021-03-04')).toBeDefined();
  });
});
