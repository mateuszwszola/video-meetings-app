import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function Login() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setRedirect(true);
    } else {
      setRedirect(false);
    }
  }, [isAuthenticated]);

  if (redirect) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="">
      <button
        onClick={() => loginWithRedirect()}
        className="mx-auto w-56 px-4 py-2 border border-gray-400 rounded flex items-center justify-between"
      >
        <span className="text-gray-700 uppercase text-sm font-medium">
          Log In
        </span>
      </button>
    </div>
  );
}

export default Login;
