import React from 'react';
import { useAuth } from 'context/authContext';
import { Redirect } from 'react-router-dom';
import githubIcon from 'icons/github.svg';

function Login(props) {
  const { login, user } = useAuth();
  const [redirect, setRedirect] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setRedirect(true);
    }
  }, [user]);

  if (redirect) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="">
      <button
        onClick={login}
        className="mx-auto w-56 px-4 py-2 border border-gray-400 rounded flex items-center justify-between"
      >
        <img className="w-6 h-6" src={githubIcon} alt="github login icon" />
        <span className="text-gray-700 uppercase text-sm font-medium">
          Log in with Github
        </span>
      </button>
    </div>
  );
}

export default Login;
