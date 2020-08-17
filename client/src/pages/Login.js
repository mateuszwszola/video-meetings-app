import React from 'react';
import { useAuth } from 'context/authContext';

function Login(props) {
  const { user, login, logout } = useAuth();

  console.log({ user });

  return (
    <div className="sm:mt-40">
      {user ? (
        <>
          <div>
            {user.photoURL && (
              <img className="rounded-full w-32" src={user.photoURL} alt={``} />
            )}
          </div>
          {user.displayName && <h3>{user.displayName}</h3>}
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={login}>Login With Github</button>
      )}
    </div>
  );
}

export default Login;
