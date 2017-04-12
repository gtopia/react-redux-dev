// Libraries
import React from 'react';
import Router, { Route, IndexRoute, IndexRedirect, Redirect } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

// Components
import DemoPage from '../containers/demo';

const appRoutes = () => (
  <Router history={createBrowserHistory()}>
    <Route path="/">
      <IndexRedirect to="/main"/>
      <IndexRoute component={DemoPage}/>
      <Route path="main" component={DemoPage} />
      <Redirect from="*" to="/"/>
    </Route>
  </Router>
);

export default appRoutes;
