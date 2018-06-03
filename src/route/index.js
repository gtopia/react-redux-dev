import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import AppPage from '../containers/app';
import MainPage from '../containers/main';
import NotFoundPage from '../containers/notFound';

let checkParams = ({match}) => {
    if (match.params.pageName) {
        return <Redirect to="/404" />;
    }
};

const appRoutes = () => (
    <Router>
        <AppPage>
            <Switch>
                <Route exact path="/react-webpack-boilerplate/dist/" component={MainPage}/>
                <Route path="/ht:topicId(\d+)/:pageName?" render={checkParams} />
                <Route path="*" component={NotFoundPage} />
            </Switch>
        </AppPage>
    </Router>
);

export default appRoutes;
