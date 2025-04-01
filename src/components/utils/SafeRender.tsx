
import React from 'react';

interface SafeRenderProps {
  children: React.ReactNode;
}

/**
 * Safe JSX wrapper for potentially undefined/null children
 * Prevents rendering errors when children might be undefined
 */
export function SafeRender({ children }: SafeRenderProps): JSX.Element | null {
  return children ? <>{children}</> : null;
}

export default SafeRender;
