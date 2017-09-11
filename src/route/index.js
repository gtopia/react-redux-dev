/**
 * Author: zhiyou
 * Date: 2017/05/08
 * Description: 路由配置。
 */
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import AppPage from '../containers/app';
import MainPage from '../containers/main';
import NotFoundPage from '../containers/notFound';
import TopicPage from '../containers/topicPage';

let checkParams = ({match}) => {
    if (match.params.pageName && match.params.pageName!='comments') {
        return <Redirect to="/404" />;
    }
    else {
        return <TopicPage />;
    }
};

const appRoutes = () => (
    <Router>
        <AppPage>
            <Switch>
                <Route exact path="/" component={MainPage}/>
                <Route path="/ht:topicId(\d+)/:pageName?" render={checkParams} />
                <Route path="*" component={NotFoundPage} />
            </Switch>
        </AppPage>
    </Router>
);

export default appRoutes;
