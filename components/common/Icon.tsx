
import React from 'react';

interface IconProps {
  name: string;
  className?: string;
}

const ICONS: { [key: string]: React.ReactNode } = {
    calendar: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    location: <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />,
    back: <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />,
    link: <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />,
    sparkles: <path strokeLinecap="round" strokeLinejoin="round" d="M9.69 3.69L12 1.38l2.31 2.31M12 22.62l-2.31-2.31L7.38 20.31M3.69 9.69L1.38 12l2.31 2.31M20.31 14.62l2.31-2.31L20.31 9.69" />,
    spinner: <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />,
    edit: <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
    close: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
    delete: <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    search: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
};

export const Icon: React.FC<IconProps> = ({ name, className = 'w-5 h-5' }) => {
  const iconPath = ICONS[name];
  if (!iconPath) return null;

  const isSpinner = name === 'spinner';

  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill={isSpinner ? 'currentColor' : 'none'}
      viewBox="0 0 24 24"
      strokeWidth={isSpinner ? undefined : 2}
      stroke="currentColor"
      aria-hidden="true"
    >
      {iconPath}
    </svg>
  );
};