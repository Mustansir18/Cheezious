
'use client';

import Image from 'next/image';
import * as React from 'react';

const LOGO_URL = 'https://cheezious.com/images/logo.png';

export function CheeziousLogo(props: { className?: string }) {
  return (
    <div className={props.className} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Image
        src={LOGO_URL}
        alt="Cheezious Logo"
        fill
        style={{ objectFit: 'contain' }}
        unoptimized
      />
    </div>
  );
}
