import React from 'react';
import { useField } from 'react-final-form';

import { TextField } from '@folio/stripes/components';

export const Field = ({ name, ...rest }) => {
  // We want empty fields submitted too, hence `parse: v => v`
  // see https://final-form.org/docs/react-final-form/types/FieldProps#parse
  const { input } = useField(name, { parse: v => v });

  return <TextField {...input} {...rest} type="search" />;
};

Field.propTypes = TextField.propTypes;
