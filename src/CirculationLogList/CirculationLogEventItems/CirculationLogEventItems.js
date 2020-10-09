import React, {
  useState,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { CirculationLogEventItem } from './CirculationLogEventItem';

import styles from './CirculationLogEventItems.css';

export const CirculationLogEventItems = ({ items }) => {
  const [isFolded, setIsFolded] = useState(true);

  const toggleFold = useCallback(() => setIsFolded(prevIsFolded => !prevIsFolded), []);

  if (!items?.length) {
    return null;
  }

  const foldToggle = items.length > 1 && (
    <div>
      <button
        type="button"
        onClick={toggleFold}
        className={styles.circulationLogEventItemsFoldToggle}
      >
        <FormattedMessage
          id={`ui-circulation-log.logEvent.item.${isFolded ? 'showMore' : 'showLess'}`}
        />
      </button>
    </div>
  );

  if (isFolded) {
    return (
      <div>
        <CirculationLogEventItem item={items[0]} />
        {foldToggle}
      </div>
    );
  }

  return (
    <div>
      {
        items.map(item => <CirculationLogEventItem key={item.itemBarcode} item={item} />)
      }
      {foldToggle}
    </div>
  );
};

CirculationLogEventItems.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
};
