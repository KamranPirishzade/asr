import React from 'react';

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary';
  scale?: 'normal' | 'small';
}

export default function Loading({ variant, scale }: LoadingProps) {
  return (
    <div role="status" className="flex items-center justify-center">
      <div className="border-secondary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
