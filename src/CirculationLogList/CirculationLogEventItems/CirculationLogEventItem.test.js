import React from 'react';

import { render } from '@folio/jest-config-stripes/testing-library/react';

import {
  useStripes,
} from '@folio/stripes/core';

import { CirculationLogEventItem } from './CirculationLogEventItem';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: jest.fn(({ children, to }) => (
    <>
      <span>{children}</span>
      <span>{to}</span>
    </>
  )),
}));

const renderCirculationLogEventItem = ({ item } = {}) => (render(
  <CirculationLogEventItem
    item={item}
  />,
));

describe('Given Circulation Log Event Item', () => {
  let stripes;

  const item = { itemBarcode: '1', itemId: 1, instanceId: 1, holdingId: 1 };
  const itemUrl = `/inventory/view/${item.instanceId}/${item.holdingId}/${item.itemId}`;

  beforeEach(() => {
    stripes = useStripes();

    stripes.hasPerm.mockReset();
  });

  it('Then it should display link when it item has ids and there is permission', () => {
    stripes.hasPerm.mockReturnValue(true);

    const { getByText } = renderCirculationLogEventItem({ item });

    expect(getByText(itemUrl)).toBeDefined();
    expect(getByText(item.itemBarcode)).toBeDefined();
  });

  it('Then it should not display link when it item has ids and no permission', () => {
    stripes.hasPerm.mockReturnValue(false);

    const { getByText, queryByText } = renderCirculationLogEventItem({ item });

    expect(queryByText(itemUrl)).toBeNull();
    expect(getByText(item.itemBarcode)).toBeDefined();
  });

  it('Then it should not display link when it item has no ids and there is permission', () => {
    stripes.hasPerm.mockReturnValue(true);

    const { getByText, queryByText } =
      renderCirculationLogEventItem({ item: { itemBarcode: item.itemBarcode } });

    expect(queryByText(itemUrl)).toBeNull();
    expect(getByText(item.itemBarcode)).toBeDefined();
  });
});
