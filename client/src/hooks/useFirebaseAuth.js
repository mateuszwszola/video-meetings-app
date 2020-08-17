import { useState, useEffect } from 'react';
import firebase from '../firebase';

function useFirebaseAuth() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
      setStatus('loaded');
    });
  }, []);

  const login = () => {
    setStatus('loading');
    const provider = new firebase.auth.GithubAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((res) => {
        setUser(res.user);
        setStatus('loaded');
        setError(null);
      })
      .catch((err) => {
        setError(err);
        setStatus('error');
      });
  };

  const logout = () => {
    firebase
      .auth()
      .signOut()
      .catch((err) => {
        setStatus('error');
        setError(err);
      });
  };

  return { user, login, logout, status, error };
}

export default useFirebaseAuth;
