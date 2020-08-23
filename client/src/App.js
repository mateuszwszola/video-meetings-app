import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Homepage from 'pages/Homepage';
import HowItWorks from 'pages/HowItWorks';
import About from 'pages/About';
import Meeting from 'pages/Meeting';
import NotFound from 'pages/NotFound';
import Login from 'pages/Login';
import Dashboard from 'pages/Dashboard';
import ProtectedRoute from 'components/ProtectedRoute';
import Layout from 'components/Layout';
import Loading from 'components/Loading';

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/">
            <Homepage />
          </Route>
          <Route path="/how-it-works">
            <HowItWorks />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <ProtectedRoute path="/dashboard">
            <Dashboard />
          </ProtectedRoute>
          <Route path="/:roomName">
            <Meeting />
          </Route>
          <NotFound />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
