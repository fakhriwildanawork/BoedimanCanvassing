import React from 'react';
import { INPUT_FIELD } from '../../styles/tokens';

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function NumberInput(props: NumberInputProps) {
  return (
    <input
      type="number"
      className={INPUT_FIELD}
      {...props}
    />
  );
}
