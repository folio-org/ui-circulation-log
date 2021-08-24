import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';

import { Pluggable } from '@folio/stripes/core';
import { Button } from '@folio/stripes/components';
import { useSetRefOnFocus } from '@folio/stripes/smart-components';

import { useT } from '../../../hooks';
import { Field } from './Field';

export const TextFilters = ({ activeFilters, applyFilters, disabled = false, focusRef }) => {
  const t = useT();

  // On `disable` we're disabling only the Submit button, and the possibility to submit the form.
  // <input> fields remain enabled.
  // Disabling <input> fields inside TextFields leads to them not getting onBlur event (or any other events) in Chrome.
  // This is not handled by TextField properly - its internal state remains "focused" after the focus is gone
  const handleFormSubmit = (...args) => (disabled ? undefined : applyFilters(...args));

  const setRefOnFocus = useSetRefOnFocus(focusRef);
  const userBarcodeRef = useRef();

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
            inputRef={element => {
              setRefOnFocus(element);
              userBarcodeRef.current = element;
            }}
            autoFocus
            marginBottom0
          />
          <Pluggable
            type="find-user"
            aria-haspopup="true"
            searchLabel={t`patronLookup`}
            searchButtonStyle="link"
            selectUser={user => form.change('userBarcode', user.barcode)}
            afterClose={() => userBarcodeRef.current?.focus()}
            marginTop0
          />

          <Field
            name="itemBarcode"
            label={t`logEvent.item`}
            inputRef={setRefOnFocus}
          />

          <Field
            name="description"
            label={t`logEvent.description`}
            inputRef={setRefOnFocus}
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
};
