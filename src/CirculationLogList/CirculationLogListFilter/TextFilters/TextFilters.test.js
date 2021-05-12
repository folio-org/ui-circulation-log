import React from 'react';
import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { byRole } from 'testing-library-selector';

import { Pluggable } from '@folio/stripes/core';

import { TextFilters } from './TextFilters';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  Pluggable: jest.fn(() => 'plugin'),
}));

describe('"Find user" plugin', () => {
  const TYPE = 'find-user';
  const fields = {
    user: byRole('textbox', { name: /user/ }),
    description: byRole('textbox', { name: /description/ }),
  };

  it('is invoked with `selectUser` and `afterClose` callbacks in props', () => {
    render(<TextFilters activeFilters={{}} applyFilters={() => {}} />);

    const expectedProps = expect.objectContaining({
      type: TYPE,
      selectUser: expect.any(Function),
      afterClose: expect.any(Function),
    });
    const expectedContext = expect.anything();

    expect(Pluggable).toBeCalledWith(expectedProps, expectedContext);
  });

  it('can use `selectUser` callback to set the "User barcode" field value', () => {
    let callback = () => {};

    Pluggable.mockImplementation(({ type, selectUser }) => {
      if (type === TYPE) callback = selectUser;

      return 'plugin';
    });

    render(<TextFilters activeFilters={{}} applyFilters={() => {}} />);

    const userField = fields.user.get();

    expect(userField).toHaveValue('');

    act(() => callback({ barcode: 'test barcode' }));

    expect(userField).toHaveValue('test barcode');
  });

  it('can use `afterClose` callback to set focus to the "User barcode" field', () => {
    let callback = () => {};

    Pluggable.mockImplementation(({ type, afterClose }) => {
      if (type === TYPE) callback = afterClose;

      return 'plugin';
    });

    render(<TextFilters activeFilters={{}} applyFilters={() => {}} />);

    const userField = fields.user.get();

    // Focusing out of userField
    userEvent.click(fields.description.get());
    expect(userField).not.toHaveFocus();

    act(callback);

    expect(userField).toHaveFocus();
  });
});
