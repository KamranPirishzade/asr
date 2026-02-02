'use client';

import React, { Ref } from 'react';
import { useDesign } from '../layout/DesignProvider';
import { getThemeClasses } from '@/lib/design/theme';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'primary' | 'secondary';
  scale?: 'normal' | 'small';
  ref: Ref<HTMLInputElement>;
}

export default function Input({
  variant = 'primary',
  className,
  scale = 'normal',
  ref,
  ...props
}: InputProps) {
  const { keywords } = useDesign();
  const theme = getThemeClasses(keywords);

  const baseStyles =
    'outline-none ring-0 focus:ring-1 ring-secondary transition-all duration-300';
  const themeStyles = `${theme.input.padding} ${theme.input.radius}  ${theme.input.border}`;

  const variantStyles =
    variant === 'primary'
      ? 'bg-white text-black'
      : 'bg-gray-200 text-gray-800 hover:bg-gray-300';

  return (
    <input
      ref={ref}
      className={`${baseStyles} ${themeStyles} ${variantStyles} ${className} ${scale === 'small' ? 'px-2! py-1!' : ''}`}
      {...props}
    />
  );
}
