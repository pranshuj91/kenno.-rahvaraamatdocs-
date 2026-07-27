import React from 'react';

// Pass-through root — no auth gate.
export default function Root({children}) {
  return <>{children}</>;
}
