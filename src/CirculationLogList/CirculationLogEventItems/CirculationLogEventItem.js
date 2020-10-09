import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
  useStripes,
} from '@folio/stripes/core';

export const CirculationLogEventItem = ({ item }) => {
  const stripes = useStripes();

  const { holdingId, instanceId, itemBarcode, itemId } = item;
  const hasDetails = Boolean(itemId) && stripes.hasPerm('ui-inventory.item.edit');

  if (hasDetails) {
    return (
      <div>
        <Link to={`/inventory/view/${instanceId}/${holdingId}/${itemId}`}>
          {itemBarcode}
        </Link>
      </div>
    );
  }

  return <div>{itemBarcode}</div>;
};

CirculationLogEventItem.propTypes = {
  item: PropTypes.object.isRequired,
};
