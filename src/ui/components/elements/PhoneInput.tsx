import React, { useState } from 'react';
import { INPUT_FIELD } from '../../styles/tokens';

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onPhoneChange?: (value: string) => void;
}

export default function PhoneInput({ onPhoneChange, value, defaultValue, ...props }: PhoneInputProps) {
  const [internalValue, setInternalValue] = useState(value || defaultValue || '');

  const formatPhone = (val: string) => {
    const cleaned = val.replace(/\D/g, '');
    const match = cleaned.match(/.{1,3}/g);
    return match ? match.join(' ') : '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setInternalValue(formatted);
    if (onPhoneChange) {
      onPhoneChange(formatted.replace(/\s/g, ''));
    }
  };

  return (
    <input
      type="tel"
      className={INPUT_FIELD}
      value={value !== undefined ? formatPhone(value as string) : internalValue}
      onChange={handleChange}
      {...props}
    />
  );
}
