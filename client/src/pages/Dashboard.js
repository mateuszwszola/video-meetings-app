import React from 'react';
import { useAuth } from 'context/authContext';
import logoutIcon from 'icons/log-out.svg';
import { Link } from 'react-router-dom';

function Dashboard(props) {
  const { logout, user } = useAuth();

  return (
    <div className="">
      <div className="w-full flex justify-end py-4 px-2">
        <button
          className="w-32 px-2 py-1 border border-gray-400 rounded flex items-center justify-between outline-none focus:shadow-outline"
          onClick={logout}
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
        {user.photoURL && (
          <img
            className="w-32 h-32 rounded-full"
            src={user.photoURL}
            alt="user"
          />
        )}
        <h3 className="text-lg font-semibold mt-2">
          {user.displayName || 'User'}
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
