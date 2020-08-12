import React, { createContext, useContext } from 'react';

const SocketContext = createContext();

function SocketProvider(props) {
  const value = {};
  return <SocketContext.Provider value={value} {...props} />;
}

function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error(`useSocket must be used within a SocketProvider`);
  }
  return context;
}

export { SocketProvider, useSocket };
