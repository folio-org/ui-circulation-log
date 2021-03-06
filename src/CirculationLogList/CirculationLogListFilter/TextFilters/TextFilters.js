import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';

import { Pluggable } from '@folio/stripes/core';
import { Button } from '@folio/stripes/components';

import { useT } from '../../../hooks';
import { Field } from './Field';

export const TextFilters = ({ activeFilters, applyFilters, disabled = false, onFocus, focusRef }) => {
  const t = useT();

  // On `disable` we're disabling only the Submit button, and the possibility to submit the form.
  // <input> fields remain enabled.
  // Disabling <input> fields inside TextFields leads to them not getting onBlur event (or any other events) in Chrome.
  // This is not handled by TextField properly - its internal state remains "focused" after the focus is gone
  const handleFormSubmit = (...args) => (disabled ? undefined : applyFilters(...args));

  const [refs] = useState({
    userBarcode: useRef(),
    itemBarcode: useRef(),
    description: useRef(),
  });

  const [focusedFieldName, setFocusedFieldName] = useState('');

  // We update the `focusRef` not here, but after the render - in the effect (below)
  // for the fields refs to be ready, pointing to the <input> elements
  const handleFocus = name => event => {
    setFocusedFieldName(name);

    return onFocus?.(event);
  };

  useEffect(
    () => {
      if (focusedFieldName && typeof focusRef === 'object') focusRef.current = refs[focusedFieldName].current;
    },
    [focusedFieldName, focusRef, refs],
  );

  const initialValues = {
    userBarcode: activeFilters?.userBarcode?.[0] ?? '',
    itemBarcode: activeFilters?.itemBarcode?.[0] ?? '',
    description: activeFilters?.description?.[0] ?? '',
  };

  return (
    <Form
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
    >
      {({ handleSubmit, form }) => (
        <form onSubmit={handleSubmit}>
          <Field
            name="userBarcode"
            label={t`logEvent.user`}
            inputRef={refs.userBarcode}
            onFocus={handleFocus('userBarcode')}
            autoFocus
            marginBottom0
          />
          <Pluggable
            type="find-user"
            aria-haspopup="true"
            searchLabel={t`patronLookup`}
            searchButtonStyle="link"
            selectUser={user => form.change('userBarcode', user.barcode)}
            afterClose={() => refs.userBarcode.current.focus()}
            marginTop0
          />

          <Field
            name="itemBarcode"
            label={t`logEvent.item`}
            inputRef={refs.itemBarcode}
            onFocus={handleFocus('itemBarcode')}
          />

          <Field
            name="description"
            label={t`logEvent.description`}
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
