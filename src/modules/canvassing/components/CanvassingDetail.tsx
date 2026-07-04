import React from 'react';
import { CanvassingPin } from '../types';
import CanvasForm from './CanvasForm';

interface CanvassingDetailProps {
  pin: CanvassingPin;
  onClose: () => void;
  onEdit?: () => void;
}

export default function CanvassingDetail({ pin, onClose, onEdit }: CanvassingDetailProps) {
  return (
    <CanvasForm 
      pin={pin}
      mode="view"
      onClose={onClose}
      onSave={() => {}}
      onEdit={onEdit}
    />
  );
}
