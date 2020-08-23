import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import logoutIcon from 'icons/log-out.svg';
import useApi from 'hooks/useApi';

function Dashboard() {
  const { user, logout } = useAuth0();
  const { loading, error, data } = useApi('authorized');

  console.log({ data, error, loading });

  return (
    <div className="">
      <div className="w-full flex justify-end py-4 px-2">
        <button
          className="w-32 px-2 py-1 border border-gray-400 rounded flex items-center justify-between outline-none focus:shadow-outline"
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          <img
            className="w-6 h-6 text-gray-400 fill-current"
            src={logoutIcon}
            alt=""
          />
          <span className="text-gray-700">Log out</span>
        </button>
      </div>
      <div className="w-full flex flex-col items-center justify-center py-4">
        {user.picture && (
          <img
            className="w-32 h-32 rounded-full"
            src={user.picture}
            alt="user"
          />
        )}
        <h3 className="text-lg font-semibold mt-2">
          {user.nickname || 'User'}
        </h3>
      </div>
      <div>
        <p>Available rooms</p>
        <ul>
          <li>
            <Link to="/">room-1</Link>
          </li>
          <li>
            <Link to="/">room-2</Link>
          </li>
          <li>
            <Link to="/">room-3</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
