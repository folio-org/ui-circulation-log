import React from 'react';
import { act, render } from '@testing-library/react';
import { byRole } from 'testing-library-selector';

import { Pluggable } from '@folio/stripes/core';

import { TextFilters } from './TextFilters';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  Pluggable: jest.fn(() => 'plugin'),
}));

describe('"Find user" plugin', () => {
  const TYPE = 'find-user';

  it('is invoked with `selectUser` callback in props', () => {
    render(<TextFilters activeFilters={{}} applyFilters={() => {}} />);

    const expectedProps = expect.objectContaining({
      type: TYPE,
      selectUser: expect.any(Function),
    });
    const expectedContext = expect.anything();

    expect(Pluggable).toBeCalledWith(expectedProps, expectedContext);
  });

  it('can use `selectUser` callback to set the "User barcode" field value', () => {
    const field = byRole('textbox', { name: /user/ });
    const user = { barcode: 'test barcode' };
    let callback = () => {};

    Pluggable.mockImplementation(({ type, selectUser }) => {
      if (type === TYPE) callback = selectUser;

      return 'plugin';
    });

    render(<TextFilters activeFilters={{}} applyFilters={() => {}} />);

    expect(field.get()).toHaveValue('');

    act(() => callback(user));

    expect(field.get()).toHaveValue('test barcode');
  });
});
