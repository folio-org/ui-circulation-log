import React from 'react';
import {
  render,
  fireEvent,
} from '@folio/jest-config-stripes/testing-library/react';

import '@folio/stripes-acq-components/test/jest/__mock__';

import { CirculationLogEventItems } from './CirculationLogEventItems';

const getItemBarcode = () => Math.random().toString();

const renderCirculationLogEventItems = (items) => (render(
  <CirculationLogEventItems items={items} />,
));

describe('Given Circulation Log Event Items', () => {
  it('Then it should not display anything if items are not defined', () => {
    const { queryByText } = renderCirculationLogEventItems();

    expect(queryByText(getItemBarcode())).toBeNull();
  });

  it('Then it should display item barcode without fold toogle when only 1 item is passed', () => {
    const items = [{ itemBarcode: getItemBarcode() }];
    const { queryByText, getByText } = renderCirculationLogEventItems(items);

    expect(getByText(items[0].itemBarcode)).toBeDefined();
    expect(queryByText('ui-circulation-log.logEvent.item.showMore')).toBeNull();
  });

  it('Then it should display item barcode with fold toogle when several items are passed', () => {
    const items = [{ itemBarcode: getItemBarcode() }, { itemBarcode: getItemBarcode() }];
    const { queryByText, getByText } = renderCirculationLogEventItems(items);

    expect(getByText(items[0].itemBarcode)).toBeDefined();
    expect(queryByText(items[1].itemBarcode)).toBeNull();
    expect(queryByText('ui-circulation-log.logEvent.item.showMore')).not.toBeNull();
  });

  it('Then it should display all item barcodes when several items are passed and toggle is pressed', () => {
    const items = [{ itemBarcode: getItemBarcode() }, { itemBarcode: getItemBarcode() }];
    const { queryByText, getByText } = renderCirculationLogEventItems(items);

    fireEvent.click(queryByText('ui-circulation-log.logEvent.item.showMore'));

    expect(getByText(items[0].itemBarcode)).toBeDefined();
    expect(getByText(items[1].itemBarcode)).toBeDefined();
    expect(queryByText('ui-circulation-log.logEvent.item.showLess')).not.toBeNull();
  });
});
