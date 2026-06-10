import React, {useEffect, useState} from 'react';
import LoginGate, {isAuthenticated} from '@site/src/components/LoginGate';

export default function Root({children}) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setChecked(true);
  }, []);

  if (!checked) {
    return null;
  }

  if (!authenticated) {
    return <LoginGate onSuccess={() => setAuthenticated(true)} />;
  }

  return <>{children}</>;
}
