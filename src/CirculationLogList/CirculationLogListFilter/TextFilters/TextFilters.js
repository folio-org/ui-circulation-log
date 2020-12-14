import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';

import { Button } from '@folio/stripes/components';

import { useT } from '../../../hooks';
import { Field } from './Field';

export const TextFilters = ({ activeFilters, applyFilters, disabled }) => {
  const t = useT();

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
            autoFocus
          />

          <Field
            name="itemBarcode"
            label={t`logEvent.item`}
            disabled={disabled}
          />

          <Field
            name="description"
            label={t`logEvent.description`}
            disabled={disabled}
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
};

TextFilters.defaultProps = {
  disabled: false,
};
