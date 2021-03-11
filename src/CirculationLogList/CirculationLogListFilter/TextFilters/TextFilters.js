import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';

import { Button } from '@folio/stripes/components';

import { useT } from '../../../hooks';
import { Field } from './Field';

export const TextFilters = ({ activeFilters, applyFilters, disabled, onFocus, focusRef }) => {
  const t = useT();

  const [refs] = useState({
    userBarcode: useRef(),
    itemBarcode: useRef(),
    description: useRef(),
  });

  useEffect(() => {
    focusRef.current = refs.userBarcode.current;
  }, [focusRef, refs.userBarcode]);

  const handleFocus = name => event => {
    focusRef.current = refs[name].current;

    return onFocus?.(event);
  };

  const initialValues = {
    userBarcode: activeFilters?.userBarcode?.[0] ?? '',
    itemBarcode: activeFilters?.itemBarcode?.[0] ?? '',
    description: activeFilters?.description?.[0] ?? '',
  };

  return (
    <Form
      onSubmit={applyFilters}
      initialValues={initialValues}
    >
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Field
            name="userBarcode"
            label={t`logEvent.user`}
            disabled={disabled}
            inputRef={refs.userBarcode}
            onFocus={handleFocus('userBarcode')}
          />

          <Field
            name="itemBarcode"
            label={t`logEvent.item`}
            disabled={disabled}
            inputRef={refs.itemBarcode}
            onFocus={handleFocus('itemBarcode')}
          />

          <Field
            name="description"
            label={t`logEvent.description`}
            disabled={disabled}
            inputRef={refs.description}
            onFocus={handleFocus('description')}
          />

          <Button
            disabled={disabled}
            type="submit"
            marginBottom0
          >
            {t`filter.apply`}
          </Button>
        </form>
      )}
    </Form>
  );
};

TextFilters.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  focusRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onFocus: PropTypes.func,
};

TextFilters.defaultProps = {
  disabled: false,
};
