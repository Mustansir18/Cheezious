
'use client';

import Image from 'next/image';
import * as React from 'react';
import { useSettings } from '@/context/SettingsContext';

export function CheeziousLogo(props: { className?: string }) {
  const { settings } = useSettings();
  const { logoUrl } = settings;

  return (
    <div className={props.className} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Image
        src={logoUrl}
        alt="Company Logo"
        fill
        style={{ objectFit: 'contain' }}
        unoptimized
      />
    </div>
  );
}
