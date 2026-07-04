import React, { useRef, useEffect } from 'react';
import { INPUT_FIELD } from '../../styles/tokens';

interface LongTextProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export default function LongText(props: LongTextProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    resize();
  }, [props.value, props.defaultValue]);

  return (
    <textarea
      ref={textareaRef}
      className={INPUT_FIELD + " resize-none overflow-hidden"}
      onInput={resize}
      {...props}
    />
  );
}
