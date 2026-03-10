import React from 'react';

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary';
  scale?: 'normal' | 'small';
}

export default function Loading({
  variant = 'primary',
  scale = 'normal',
}: LoadingProps) {
  const themeStyle =
    variant === 'primary' ? 'border-secondary' : 'border-blue-600';
  const baseStyle = 'animate-spin rounded-full border-4 border-t-transparent';
  const size = scale === 'normal' ? 'h-12 w-12' : 'h-8 w-8';
  return (
    <div role="status" className="flex items-center justify-center">
      <div className={`${themeStyle} ${baseStyle} ${size}`}></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
