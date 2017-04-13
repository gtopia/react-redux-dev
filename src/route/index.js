// Libraries
import React from 'react';
import Router, { Route, IndexRoute, Redirect } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

// Components
import DemoPage from '../containers/demo';

const appRoutes = () => (
  <Router history={createBrowserHistory()}>
    <Route path="/">
      <IndexRoute component={DemoPage}/>
      <Redirect from="*" to="/"/>
    </Route>
  </Router>
);

export default appRoutes;
