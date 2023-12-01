import React from 'react';
import PropTypes from 'prop-types';

import {
  useStripes,
} from '@folio/stripes/core';
import {
  TextLink,
} from '@folio/stripes/components';

import { isDCBItem } from '../utils';

export const CirculationLogEventItem = ({ item }) => {
  const stripes = useStripes();

  const { holdingId, instanceId, itemBarcode, itemId } = item;
  const hasDetails = Boolean(itemId) && stripes.hasPerm('ui-inventory.item.edit');
  const isVirtualItem = isDCBItem(item);

  if (hasDetails && !isVirtualItem) {
    return (
      <div>
        <TextLink to={`/inventory/view/${instanceId}/${holdingId}/${itemId}`}>
          {itemBarcode}
        </TextLink>
      </div>
    );
  }

  return <div>{itemBarcode}</div>;
};

CirculationLogEventItem.propTypes = {
  item: PropTypes.object.isRequired,
};
